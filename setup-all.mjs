import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import net from 'net';

const rootDir = process.cwd();

// Detect system language from CLI argument or environment variables
let lang = 'en';
const langArg = process.argv.find(arg => arg.startsWith('--lang='));
if (langArg) {
  lang = langArg.split('=')[1].toLowerCase();
} else if (process.env.LANG) {
  const envLang = process.env.LANG.split('_')[0].split('.')[0].toLowerCase();
  if (['en', 'de', 'fr', 'it'].includes(envLang)) {
    lang = envLang;
  }
}

const locales = {
  en: {
    start: '🚀 Starting NALA-CV-tUNer-career-ops Safe-Haven Auto-Setup Installer...\n',
    npmInstall: '📦 Installing npm dependencies...',
    npmSuccess: '✅ Dependencies installed successfully.\n',
    npmError: '❌ Failed to install npm dependencies:',
    provision: '📁 Provisioning Onboarding Template Files with Mock Values...',
    createdCv: '➕ Created mock cv.md',
    createdProfile: '➕ Created mock config/profile.yml',
    createdMode: '➕ Created mock modes/_profile.md',
    createdPortals: '➕ Created portals.yml',
    createdTracker: '➕ Created data/applications.md',
    filesChecked: '✅ Onboarding files checked.\n',
    scan: '🔍 Scanning local services and active ports...',
    detected: '📡 Detected running service:',
    activeOn: 'active on',
    generatedEnv: '📝 Generated configuration .env file.',
    hook: '🛡️ Registering Git Pre-commit Privacy Hook...',
    hookSuccess: '✅ Git pre-commit hook installed and marked executable.',
    hookError: '⚠️ Could not make hook executable automatically. Please run: chmod +x .git/hooks/pre-commit',
    gitError: '⚠️ No .git directory found. Skipping pre-commit hook registration.',
    success: '\n🎉 Auto-Setup completed successfully! Run "npm start" to start NALA Career-Ops Desktop.'
  },
  de: {
    start: '🚀 Starte NALA-CV-tUNer-career-ops Safe-Haven Installationsassistent...\n',
    npmInstall: '📦 Installiere npm-Abhängigkeiten...',
    npmSuccess: '✅ Abhängigkeiten erfolgreich installiert.\n',
    npmError: '❌ Installation der npm-Abhängigkeiten fehlgeschlagen:',
    provision: '📁 Erstelle Onboarding-Vorlagen mit sicheren Mock-Werten...',
    createdCv: '➕ Mock-Lebenslauf erstellt (cv.md)',
    createdProfile: '➕ Mock-Profil erstellt (config/profile.yml)',
    createdMode: '➕ Mock-Modus erstellt (modes/_profile.md)',
    createdPortals: '➕ Portale erstellt (portals.yml)',
    createdTracker: '➕ Bewerbungs-Tracker erstellt (data/applications.md)',
    filesChecked: '✅ Vorlagendateien überprüft.\n',
    scan: '🔍 Scanne lokale Dienste und aktive Ports...',
    detected: '📡 Dienst erkannt:',
    activeOn: 'aktiv auf',
    generatedEnv: '📝 Konfigurationsdatei .env generiert.',
    hook: '🛡️ Registriere Git Pre-commit Privacy Hook...',
    hookSuccess: '✅ Git Pre-Commit Hook installiert und als ausführbar markiert.',
    hookError: '⚠️ Hook konnte nicht automatisch ausführbar gemacht werden. Bitte ausführen: chmod +x .git/hooks/pre-commit',
    gitError: '⚠️ Kein .git Verzeichnis gefunden. Git Pre-Commit Hook übersprungen.',
    success: '\n🎉 Auto-Setup erfolgreich abgeschlossen! Führen Sie "npm start" aus, um NALA Career-Ops Desktop zu starten.'
  },
  fr: {
    start: '🚀 Démarrage de l\'assistant d\'installation NALA-CV-tUNer-career-ops Safe-Haven...\n',
    npmInstall: '📦 Installation des dépendances npm...',
    npmSuccess: '✅ Dépendances installées avec succès.\n',
    npmError: '❌ Échec de l\'installation des dépendances npm :',
    provision: '📁 Création des modèles d\'intégration avec des valeurs fictives sécurisées...',
    createdCv: '➕ CV fictif créé (cv.md)',
    createdProfile: '➕ Profil fictif créé (config/profile.yml)',
    createdMode: '➕ Mode fictif créé (modes/_profile.md)',
    createdPortals: '➕ Fichier portals.yml créé',
    createdTracker: '➕ Suivi des candidatures créé (data/applications.md)',
    filesChecked: '✅ Fichiers d\'intégration vérifiés.\n',
    scan: '🔍 Analyse des services locaux et des ports actifs...',
    detected: '📡 Service détecté :',
    activeOn: 'actif sur',
    generatedEnv: '📝 Fichier de configuration .env généré.',
    hook: '🛡️ Enregistrement du hook de confidentialité Git pre-commit...',
    hookSuccess: '✅ Hook Git pre-commit installé et marqué comme exécutable.',
    hookError: '⚠️ Impossible de rendre le hook exécutable automatiquement. Veuillez exécuter : chmod +x .git/hooks/pre-commit',
    gitError: '⚠️ Aucun répertoire .git trouvé. Enregistrement du hook pre-commit ignoré.',
    success: '\n🎉 Configuration automatique terminée avec succès ! Exécutez "npm start" pour lancer NALA Career-Ops Desktop.'
  },
  it: {
    start: '🚀 Avvio dell\'assistente di installazione Safe-Haven per NALA-CV-tUNer-career-ops...\n',
    npmInstall: '📦 Installazione delle dipendenze npm...',
    npmSuccess: '✅ Dipendenze installate con successo.\n',
    npmError: '❌ Installazione delle dipendenze npm fallita:',
    provision: '📁 Generazione dei modelli di onboarding con valori fittizi sicuri...',
    createdCv: '➕ CV fittizio creato (cv.md)',
    createdProfile: '➕ Profilo fittizio creato (config/profile.yml)',
    createdMode: '➕ Modalità fittizia creata (modes/_profile.md)',
    createdPortals: '➕ Fichier portals.yml creato',
    createdTracker: '➕ Tracker delle candidature creato (data/applications.md)',
    filesChecked: '✅ File di onboarding verificati.\n',
    scan: '🔍 Scansione dei servizi locali e delle porte attive...',
    detected: '📡 Servizio rilevato:',
    activeOn: 'attivo su',
    generatedEnv: '📝 File di configurazione .env generato.',
    hook: '🛡️ Registrazione del hook Git pre-commit per la privacy...',
    hookSuccess: '✅ Hook Git pre-commit installato e contrassegnato come eseguibile.',
    hookError: '⚠️ Impossibile rendere il hook eseguibile automaticamente. Si prega di eseguire: chmod +x .git/hooks/pre-commit',
    gitError: '⚠️ Nessuna cartella .git trovata. Registrazione del hook pre-commit ignorata.',
    success: '\n🎉 Configurazione automatica completata con successo! Esegui "npm start" per avviare NALA Career-Ops Desktop.'
  }
};

const msg = locales[lang] || locales.en;

console.log(msg.start);

// 1. Run npm install
try {
  console.log(msg.npmInstall);
  execSync('npm install', { stdio: 'inherit', cwd: rootDir });
  console.log(msg.npmSuccess);
} catch (error) {
  console.error(msg.npmError, error.message);
  process.exit(1);
}

// 2. Onboarding Files Provisioning (Safe Mock Details)
console.log(msg.provision);

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
  console.log(msg.createdCv);
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
  console.log(msg.createdProfile);
}

const modeProfileTemplate = path.join(rootDir, 'modes', '_profile.template.md');
const modeProfile = path.join(rootDir, 'modes', '_profile.md');
if (!fs.existsSync(modeProfile) && fs.existsSync(modeProfileTemplate)) {
  fs.copyFileSync(modeProfileTemplate, modeProfile);
  console.log(msg.createdMode);
}

const portalsExamplePath = path.join(rootDir, 'templates', 'portals.example.yml');
const portalsPath = path.join(rootDir, 'portals.yml');
if (!fs.existsSync(portalsPath) && fs.existsSync(portalsExamplePath)) {
  fs.copyFileSync(portalsExamplePath, portalsPath);
  console.log(msg.createdPortals);
}

const appsTrackerPath = path.join(rootDir, 'data', 'applications.md');
if (!fs.existsSync(appsTrackerPath)) {
  const defaultTracker = `# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
`;
  fs.mkdirSync(path.dirname(appsTrackerPath), { recursive: true });
  fs.writeFileSync(appsTrackerPath, defaultTracker, 'utf8');
  console.log(msg.createdTracker);
}
console.log(msg.filesChecked);

// 3. Auto-Detect Services and Ports
console.log(msg.scan);

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
        console.log(`${msg.detected} ${name} ${msg.activeOn} ${host}:${port}`);
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
  console.log(msg.generatedEnv);
}

await runPortScan();

// 4. Git Hook Installation (Privacy Gate)
console.log(msg.hook);
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
    console.log(msg.hookSuccess);
  } catch (err) {
    console.log(msg.hookError);
  }
} else {
  console.log(msg.gitError);
}

console.log(msg.success);
