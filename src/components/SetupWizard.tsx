import React, { useState } from 'react';
import { HardwareScanner, HardwareInfo } from '../services/hardwareScanner';

interface SetupWizardProps {
  onComplete: () => void;
}

export function SetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [ollamaInstalled, setOllamaInstalled] = useState<boolean>(false);

  const requestScan = async () => {
    setHasPermission(true);
    setIsScanning(true);
    
    // Scan hardware and check if Ollama is installed
    const info = await HardwareScanner.getHardwareInfo();
    const installed = HardwareScanner.checkOllamaInstalled();
    
    setHardwareInfo(info);
    setOllamaInstalled(installed);
    setIsScanning(false);
    setStep(2);
  };

  const denyScan = () => {
    setHasPermission(false);
    setStep(2); // Move to step 2 with default/manual specs
  };

  // Recommends models based on RAM sizes
  const getRecommendation = () => {
    if (!hardwareInfo) return { model: 'Gemma 2 2B / Gemma 2B', desc: 'Runs on less than 2 GB RAM (Highly optimized for low resource machines)' };
    const ram = hardwareInfo.totalRamGb;
    if (ram < 8) {
      return { model: 'gemma2:2b', desc: 'Optimized for low specs. Runs on 1GB of memory.' };
    } else if (ram >= 8 && ram < 16) {
      return { model: 'gemma2:9b', desc: 'Standard choice. Offers excellent target-fit analysis.' };
    } else if (ram >= 16 && ram < 32) {
      return { model: 'gemma:12b (Gemma 4)', desc: 'Advanced capability. Requires 16GB+ RAM.' };
    } else {
      return { model: 'qwen3:32b / gemma2:27b', desc: 'Full performance. Excellent logic reasoning and ATS evaluations.' };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="glass-card focus-highlight" style={{ maxWidth: '600px', margin: '40px auto', width: '100%' }}>
      
      {/* Step 1: Permission Modal */}
      {step === 1 && (
        <div>
          <h2 style={{ marginBottom: '16px', fontSize: '22px' }}>🔒 Setup Wizard & Privacy Scan</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
            Before launching NALA Career-Ops, we would like to scan your system specifications (CPU, RAM, free disk space, and open ports) to configure local LLM parameters automatically and ensure zero port conflicts.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" onClick={requestScan}>
              Agree & Scan System
            </button>
            <button className="btn btn-secondary" onClick={denyScan}>
              Skip, Manual Setup
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Hardware Profile Summary & Ollama Check */}
      {step === 2 && (
        <div>
          <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>💻 Hardware & Service Check</h2>
          
          {hasPermission && hardwareInfo ? (
            <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '14px' }}>
              <div style={{ marginBottom: '8px' }}>🖥️ <strong>Platform:</strong> {hardwareInfo.platform}</div>
              <div style={{ marginBottom: '8px' }}>🧠 <strong>CPU:</strong> {hardwareInfo.cpuModel} ({hardwareInfo.cpuCores} cores)</div>
              <div style={{ marginBottom: '8px' }}>💾 <strong>RAM:</strong> {hardwareInfo.totalRamGb} GB</div>
              <div>💾 <strong>Free Disk Space:</strong> {hardwareInfo.freeDiskGb} GB</div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
              Auto-scan skipped. Defaulting configuration.
            </p>
          )}

          <div className="glass-card" style={{ padding: '16px', marginBottom: '24px', borderColor: ollamaInstalled ? 'var(--accent-color)' : 'var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>⚙️ Ollama Status</h3>
            {ollamaInstalled ? (
              <p style={{ color: 'var(--accent-color)', fontSize: '14px' }}>
                ✅ Ollama detected in your system paths. We will link directly to this instance.
              </p>
            ) : (
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
                  ❌ Ollama is not detected on this computer.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href="https://ollama.com/download" target="_blank" rel="noreferrer" className="btn" style={{ textDecoration: 'none', fontSize: '13px', padding: '8px 16px' }}>
                    📥 Download Ollama
                  </a>
                  <button className="btn btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }} onClick={() => setOllamaInstalled(true)}>
                    I Installed It
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>💡 Model Recommendation</h3>
            <p style={{ fontSize: '14px' }}>
              Based on the memory configuration, we recommend installing:
            </p>
            <div style={{ margin: '12px 0', padding: '12px', background: 'var(--accent-glow)', borderLeft: '4px solid var(--accent-color)', borderRadius: '4px' }}>
              <strong>{recommendation.model}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {recommendation.desc}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" onClick={() => setStep(3)}>
              Continue Setup
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Hugging Face API key Setup */}
      {step === 3 && (
        <div>
          <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>🤗 Hugging Face Setup</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px', lineHeight: '1.5' }}>
            Some advanced models (like the Gemma family) are gated on Hugging Face. Paste your Hugging Face API Key below to pull models directly to your Ollama manager.
          </p>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Hugging Face User Access Token</label>
            <input 
              type="password" 
              placeholder="hf_..." 
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" onClick={onComplete}>
              Complete Onboarding
            </button>
            <button className="btn btn-secondary" onClick={onComplete}>
              Skip Token Setup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
