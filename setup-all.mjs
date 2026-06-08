import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import net from 'net';

const rootDir = process.cwd();

console.log('🚀 Starting NALA-CV-tUNer-career-ops Safe-Haven Auto-Setup Installer...\n');

// 1. Run npm install
try {
  console.log('📦 Installing npm dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Dependencies installed successfully.\n');
} catch (error) {
  console.error('❌ Failed to install npm dependencies:', error.message);
  process.exit(1);
}

// 2. Onboarding Files Provisioning (Safe Mock Details)
console.log('📁 Provisioning Onboarding Template Files with Mock Values...');

const cvPath = path.join(rootDir, 'cv.md');
if (!fs.existsSync(cvPath)) {
  const dummyCv = `# Jane Doe
Senior Software Engineer | AI Enthusiast
jane.doe@example.com | +41 79 123 45 67 | Zurich, Switzerland | linkedin.com/in/janedoe

## Professional Summary
Passionate and experienced backend developer with a focus on AI pipelines, LLM routing, and high-performance services.

## Experience
### Lead Engineer at MockTech AG (2024 - Present)
- Designed and built a modular local AI agent platform processing 10k requests daily.
- Integrated local Ollama configurations to run low-footprint Gemma models.

### Software Engineer at DevCorp (2021 - 2024)
- Developed RESTful APIs using Node.js, Go, and Python.
`;
  fs.writeFileSync(cvPath, dummyCv, 'utf8');
  console.log('➕ Created mock cv.md');
}

const profileExamplePath = path.join(rootDir, 'config', 'profile.example.yml');
const profilePath = path.join(rootDir, 'config', 'profile.yml');
if (!fs.existsSync(profilePath) && fs.existsSync(profileExamplePath)) {
  let content = fs.readFileSync(profileExamplePath, 'utf8');
  // Replace placeholder details with safe mock values
  content = content
    .replace(/name: .*/g, 'name: "Jane Doe"')
    .replace(/email: .*/g, 'email: "jane.doe@example.com"')
    .replace(/phone: .*/g, 'phone: "+41791234567"')
    .replace(/location: .*/g, 'location: "Zurich, Switzerland"')
    .replace(/github: .*/g, 'github: "https://github.com/mock-janedoe"');
  fs.writeFileSync(profilePath, content, 'utf8');
  console.log('➕ Created mock config/profile.yml');
}

const modeProfileTemplate = path.join(rootDir, 'modes', '_profile.template.md');
const modeProfile = path.join(rootDir, 'modes', '_profile.md');
if (!fs.existsSync(modeProfile) && fs.existsSync(modeProfileTemplate)) {
  fs.copyFileSync(modeProfileTemplate, modeProfile);
  console.log('➕ Created mock modes/_profile.md');
}

const portalsExamplePath = path.join(rootDir, 'templates', 'portals.example.yml');
const portalsPath = path.join(rootDir, 'portals.yml');
if (!fs.existsSync(portalsPath) && fs.existsSync(portalsExamplePath)) {
  fs.copyFileSync(portalsExamplePath, portalsPath);
  console.log('➕ Created portals.yml');
}

const appsTrackerPath = path.join(rootDir, 'data', 'applications.md');
if (!fs.existsSync(appsTrackerPath)) {
  const defaultTracker = `# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
`;
  fs.mkdirSync(path.dirname(appsTrackerPath), { recursive: true });
  fs.writeFileSync(appsTrackerPath, defaultTracker, 'utf8');
  console.log('➕ Created data/applications.md');
}
console.log('✅ Onboarding files checked.\n');

// 3. Auto-Detect Services and Ports
console.log('🔍 Scanning local services and active ports...');

function checkPort(port, host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const onError = () => {
      socket.destroy();
      resolve(false);
    };
    socket.setTimeout(500);
    socket.once('error', onError);
    socket.once('timeout', onError);
    socket.connect(port, host, () => {
      socket.end();
      resolve(true);
    });
  });
}

async function runPortScan() {
  const hosts = ['127.0.0.1', '192.168.1.41']; // Local and Nala-Brain
  const ports = {
    11434: 'Ollama (GPU0)',
    11435: 'Ollama (GPU1)',
    7860: 'ComfyUI / WebUI',
    8188: 'ComfyUI / Alternate',
    6333: 'Qdrant (MemPalace)',
    3000: 'NALA MCP Server / WebServer'
  };

  let ollamaHost = '127.0.0.1:11434';
  let mcpHost = 'http://localhost:3000';
  let comfyUiHost = '';

  for (const host of hosts) {
    for (const [port, name] of Object.entries(ports)) {
      const active = await checkPort(parseInt(port), host);
      if (active) {
        console.log(`📡 Detected running service: ${name} active on ${host}:${port}`);
        if (port === '11434') ollamaHost = `${host}:11434`;
        if (port === '3000') mcpHost = `http://${host}:3000`;
        if (port === '7860' || port === '8188') comfyUiHost = `http://${host}:${port}`;
      }
    }
  }

  // Generate .env file
  const envContent = `OLLAMA_HOST=http://${ollamaHost}
PORT=5173
NALA_MCP_URL=${mcpHost}
COMFYUI_HOST=${comfyUiHost}
`;
  fs.writeFileSync(path.join(rootDir, '.env'), envContent, 'utf8');
  console.log('\n📝 Generated configuration .env file.');
}

await runPortScan();

// 4. Git Hook Installation (Privacy Gate)
console.log('\n🛡️ Registering Git Pre-commit Privacy Hook...');
const gitHooksDir = path.join(rootDir, '.git', 'hooks');

if (fs.existsSync(path.join(rootDir, '.git'))) {
  if (!fs.existsSync(gitHooksDir)) {
    fs.mkdirSync(gitHooksDir, { recursive: true });
  }

  const preCommitScript = `#!/bin/sh
# NALA Git Gate pre-commit hook script
node scripts/privacy-check.mjs
`;

  const hookDest = path.join(gitHooksDir, 'pre-commit');
  fs.writeFileSync(hookDest, preCommitScript, 'utf8');
  
  // Make the hook executable (Unix systems)
  try {
    fs.chmodSync(hookDest, '755');
    console.log('✅ Git pre-commit hook installed and marked executable.');
  } catch (err) {
    console.log('⚠️ Could not make hook executable automatically. Please run: chmod +x .git/hooks/pre-commit');
  }
} else {
  console.log('⚠️ No .git directory found. Skipping pre-commit hook registration.');
}

console.log('\n🎉 Auto-Setup completed successfully! Run npm run dev to start NALA Career-Ops Desktop.');
