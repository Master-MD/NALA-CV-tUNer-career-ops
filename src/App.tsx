import React, { useState, useEffect } from 'react';
import { HardwareScanner, ServiceStatus } from './services/hardwareScanner';
import { SetupWizard } from './components/SetupWizard';
import { ModelManager } from './components/ModelManager';
import { InboxZone } from './components/InboxZone';
import { CvTuner } from './components/CvTuner';
import { PhotoTuner } from './components/PhotoTuner';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'urgency-red'>('dark');
  const [lowDistraction, setLowDistraction] = useState<boolean>(true);
  const [showWizard, setShowWizard] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('tuner');
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    ollamaRunning: false,
    comfyUiRunning: false,
    qdrantRunning: false,
    mcpRunning: false,
    ollamaPort: 11434
  });

  // Check services on startup
  useEffect(() => {
    async function checkSystem() {
      const status = await HardwareScanner.scanServices();
      setServiceStatus(status);
      
      // If Ollama is running, bypass wizard onboarding
      if (status.ollamaRunning) {
        setShowWizard(false);
      }
      setHasScanned(true);
    }
    checkSystem();
  }, []);

  // Monitor application deadlines for dynamic alert theme
  useEffect(() => {
    // Simulated check: if any upcoming job deadlines exist within 48 hours, switch accent to warning red
    const checkDeadlines = () => {
      const simulatedUrgency = false; // Set to true to test red theme dynamically
      if (simulatedUrgency) {
        setTheme('urgency-red');
      }
    };
    checkDeadlines();
  }, []);

  const handleWizardComplete = () => {
    setShowWizard(false);
  };

  return (
    <div className={`app-container theme-${theme} ${lowDistraction ? 'low-distraction' : ''}`}>
      
      {/* 1. Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="flex items-center gap-2 mb-8" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <span className="pulse-badge"></span>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px' }}>NALA CV-Tuner</h2>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className={`btn ${activeTab === 'tuner' ? '' : 'btn-secondary'}`}
              style={{ width: '100%', textAlign: 'left', display: 'block' }}
              onClick={() => setActiveTab('tuner')}
            >
              🎯 Workspace / Tuner
            </button>
            <button 
              className={`btn ${activeTab === 'inbox' ? '' : 'btn-secondary'}`}
              style={{ width: '100%', textAlign: 'left', display: 'block' }}
              onClick={() => setActiveTab('inbox')}
            >
              📥 Paperless Inbox
            </button>
            <button 
              className={`btn ${activeTab === 'photo' ? '' : 'btn-secondary'}`}
              style={{ width: '100%', textAlign: 'left', display: 'block' }}
              onClick={() => setActiveTab('photo')}
            >
              🖼️ Photo Assistant
            </button>
            <button 
              className={`btn ${activeTab === 'models' ? '' : 'btn-secondary'}`}
              style={{ width: '100%', textAlign: 'left', display: 'block' }}
              onClick={() => setActiveTab('models')}
            >
              🤖 LLM Model Manager
            </button>
          </nav>
        </div>

        {/* System & Theme Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* ADHD Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ADHD Focus Mode</label>
            <input 
              type="checkbox" 
              checked={lowDistraction} 
              onChange={(e) => setLowDistraction(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>

          {/* Theme Toggles */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button 
              className={`btn btn-secondary`} 
              style={{ flex: 1, padding: '4px', fontSize: '11px' }}
              onClick={() => setTheme('light')}
            >
              ☀️ Light
            </button>
            <button 
              className={`btn btn-secondary`} 
              style={{ flex: 1, padding: '4px', fontSize: '11px' }}
              onClick={() => setTheme('dark')}
            >
              🌙 Dark
            </button>
            <button 
              className={`btn btn-secondary`} 
              style={{ flex: 1, padding: '4px', fontSize: '11px', color: 'var(--warning-red)', borderColor: 'var(--warning-red)' }}
              onClick={() => setTheme('urgency-red')}
            >
              🚨 Alert
            </button>
          </div>

          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
            NALA OS Cluster v1.8.1
          </div>
        </div>
      </aside>

      {/* 2. Main Area */}
      <main className="workspace">
        
        {/* Setup Wizard Overlay */}
        {showWizard && hasScanned && (
          <SetupWizard onComplete={handleWizardComplete} />
        )}

        {/* Standard Workspace Tabs */}
        {!showWizard && (
          <>
            {activeTab === 'tuner' && (
              <CvTuner serviceStatus={serviceStatus} />
            )}
            
            {activeTab === 'inbox' && (
              <div className="glass-card">
                <h2 style={{ marginBottom: '16px' }}>Inbox & Documents</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Drag and drop files to categorize and save them to the local MemPalace database.
                </p>
                <InboxZone />
              </div>
            )}
            
            {activeTab === 'photo' && (
              <PhotoTuner />
            )}
            
            {activeTab === 'models' && (
              <ModelManager serviceStatus={serviceStatus} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
