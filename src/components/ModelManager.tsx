import React, { useState, useEffect } from 'react';
import { ServiceStatus } from '../services/hardwareScanner';

interface ModelManagerProps {
  serviceStatus: ServiceStatus;
}

export function ModelManager({ serviceStatus }: ModelManagerProps) {
  const [hfToken, setHfToken] = useState<string>('');
  const [targetModel, setTargetModel] = useState<string>('gemma2:2b');
  const [pullProgress, setPullProgress] = useState<number | null>(null);
  const [pullStatus, setPullStatus] = useState<string>('');
  const [installedModels, setInstalledModels] = useState<string[]>([
    'gemma2:2b', 'gemma2:9b', 'qwen3:32b'
  ]);

  // Load token on startup
  useEffect(() => {
    const savedToken = localStorage.getItem('hf_token') || '';
    setHfToken(savedToken);
  }, []);

  const saveToken = () => {
    localStorage.setItem('hf_token', hfToken);
    alert('Hugging Face Token saved locally!');
  };

  const handlePullModel = () => {
    if (!serviceStatus.ollamaRunning) {
      alert('Ollama is not running. Please start Ollama before pulling models!');
      return;
    }
    
    // Simulate streaming Ollama /api/pull progress
    setPullProgress(0);
    setPullStatus('Downloading manifest...');
    
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += Math.floor(Math.random() * 15) + 5;
      if (currentPercent >= 100) {
        currentPercent = 100;
        clearInterval(interval);
        setPullProgress(null);
        setPullStatus('Model pulled successfully!');
        if (!installedModels.includes(targetModel)) {
          setInstalledModels([...installedModels, targetModel]);
        }
      } else {
        setPullProgress(currentPercent);
        setPullStatus(`Downloading layers: ${currentPercent}%`);
      }
    }, 400);
  };

  return (
    <div>
      <div className="glass-card">
        <h2 style={{ marginBottom: '16px' }}>🤗 Hugging Face Integration</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
          Connect your Hugging Face account to download gated models directly.
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Hugging Face Token</label>
            <input 
              type="password" 
              value={hfToken} 
              onChange={(e) => setHfToken(e.target.value)} 
              placeholder="hf_..." 
            />
          </div>
          <button className="btn" onClick={saveToken}>Save Key</button>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{ marginBottom: '16px' }}>🤖 Local Model Manager</h2>
        
        {/* Ollama Pull Interface */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>📥 Pull New Model</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select 
              value={targetModel} 
              onChange={(e) => setTargetModel(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="gemma2:2b">Gemma 2 2B (Lightweight, 1.6GB)</option>
              <option value="gemma2:9b">Gemma 2 9B (Medium, 5.5GB)</option>
              <option value="gemma:12b">Gemma 4 12B (Standard, 8GB)</option>
              <option value="gemma2:27b">Gemma 2 27B (Large, 16GB)</option>
              <option value="qwen3:32b">Qwen 3 32B (Advanced Logic, 20GB)</option>
            </select>
            <button className="btn" onClick={handlePullModel} disabled={pullProgress !== null}>
              {pullProgress !== null ? 'Pulling...' : 'Pull'}
            </button>
          </div>

          {pullProgress !== null && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span>{pullStatus}</span>
                <span>{pullProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${pullProgress}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.2s ease' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Installed Models list */}
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>📦 Installed Models</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {installedModels.map((model) => (
              <div key={model} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <strong>{model}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {model.includes('32b') ? '32 Billion Parameters' : model.includes('9b') ? '9 Billion Parameters' : model.includes('2b') ? '2.6 Billion Parameters' : '12 Billion Parameters'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Configure</button>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--warning-red)', borderColor: 'var(--warning-red)' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
