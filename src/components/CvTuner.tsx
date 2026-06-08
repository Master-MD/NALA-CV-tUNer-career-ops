import React, { useState } from 'react';
import { ServiceStatus } from '../services/hardwareScanner';

interface CvTunerProps {
  serviceStatus: ServiceStatus;
}

export function CvTuner({ serviceStatus }: CvTunerProps) {
  const [layout, setLayout] = useState<string>('split'); // 'classic' | 'split' | 'dense'
  const [activeTemplate, setActiveTemplate] = useState<string>('Tech-Dense');
  const [cvText, setCvText] = useState<string>(`# Jane Doe
Lead Software Engineer
Zurich, Switzerland

Summary: Specialized in high-performance AI agent execution and local LLM routing.
Experience:
- Lead Engineer at MockTech AG (2024 - Present)
- Software Engineer at DevCorp (2021 - 2024)
`);
  const [jobText, setJobText] = useState<string>(`Title: Senior AI Application Engineer
Company: FutureTech Labs
Location: Zurich (Hybrid)

Key Requirements:
- Deep experience running local LLMs (Ollama, LM Studio)
- Strong Node.js, TypeScript, and Go background
- Experience building AI agent swarms
`);
  const [isTuning, setIsTuning] = useState<boolean>(false);
  const [tuningReport, setTuningReport] = useState<string>('');

  const generateGenericBaseline = () => {
    setIsTuning(true);
    setTuningReport('Optimizing generic baseline CV...');
    
    setTimeout(() => {
      setCvText((prev) => prev + `\nProjects:\n- Local LLM Router (Gemma/Qwen integration)\n- Multi-Agent HR Simulation Pipeline\nSkills: Ollama, Node.js, Go, TypeScript, PyTorch, Docker\n`);
      setIsTuning(false);
      setTuningReport('Generic Baseline CV generated! All components balanced.');
    }, 1200);
  };

  const handleTune = () => {
    setIsTuning(true);
    setTuningReport('Running ATS Matcher and Multi-Agent HR debate...');
    
    setTimeout(() => {
      setTuningReport(`### HR Agent Simulation Report
- **ATS Scanner Score:** 92% Match (A-Tier)
- **Recruiter Agent Feedback:** Strengths: Strong alignment on local LLMs and TypeScript. Weaknesses: Needs more STAR impact metrics.
- **Hiring Lead Recommendation:** High probability fit. Proceed to scheduling interview.
- **Tuned Cover Letter Drafted:** Available in outputs.
`);
      setIsTuning(false);
    }, 2000);
  };

  return (
    <div>
      {/* 1. Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>🎯 Career-Ops Workspace</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Optimize your CV and analyze job descriptions side-by-side.</p>
        </div>

        {/* Layout & Template Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <select 
            value={activeTemplate} 
            onChange={(e) => setActiveTemplate(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="Tech-Dense">Tech-Dense Template</option>
            <option value="Classic">Classic Template</option>
            <option value="Minimal">Minimal Template</option>
            <option value="Modern">Modern Template</option>
          </select>
          
          <button 
            className={`btn btn-secondary ${layout === 'classic' ? 'focus-highlight' : ''}`}
            onClick={() => setLayout('classic')}
            style={{ padding: '8px 12px' }}
          >
            📋 Full
          </button>
          <button 
            className={`btn btn-secondary ${layout === 'split' ? 'focus-highlight' : ''}`}
            onClick={() => setLayout('split')}
            style={{ padding: '8px 12px' }}
          >
            ⚖️ Split
          </button>
          <button 
            className={`btn btn-secondary ${layout === 'dense' ? 'focus-highlight' : ''}`}
            onClick={() => setLayout('dense')}
            style={{ padding: '8px 12px' }}
          >
            📊 Report
          </button>
        </div>
      </div>

      {/* 2. Main Workspace Layout Grid */}
      <div className={`cv-grid cv-grid-${layout}`}>
        
        {/* Left Pane: CV Editor */}
        {(layout === 'classic' || layout === 'split' || layout === 'dense') && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px' }}>📝 Curriculm Vitae (Markdown)</h3>
              <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={generateGenericBaseline}>
                ⚡ Generic Baseline CV
              </button>
            </div>
            <textarea 
              value={cvText} 
              onChange={(e) => setCvText(e.target.value)}
              style={{ flex: 1, resize: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
            />
          </div>
        )}

        {/* Right/Middle Pane: Job Posting input */}
        {(layout === 'split' || layout === 'dense') && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '550px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>💼 Target Job Listing (Paste JD or URL)</h3>
            <textarea 
              value={jobText} 
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste job details or links here..."
              style={{ flex: 1, resize: 'none', marginBottom: '16px', fontSize: '13px' }}
            />
            <button className="btn" onClick={handleTune} disabled={isTuning} style={{ width: '100%' }}>
              {isTuning ? '🧬 Tuning CV & Simulating HR Decision...' : '🧬 Optimize CV for this Job'}
            </button>
          </div>
        )}

        {/* Third Pane (Report Details): Shown only in dense layout */}
        {layout === 'dense' && (
          <div className="glass-card" style={{ height: '550px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>📊 Analysis & HR Feedback</h3>
            {tuningReport ? (
              <div 
                style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}
              >
                {tuningReport}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', marginTop: '100px' }}>
                Run the CV optimization to trigger the HR Debate swarm feedback.
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
