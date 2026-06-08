import React, { useState } from 'react';

export function PhotoTuner() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [comfyHost, setComfyHost] = useState<string>('http://localhost:8188');
  const [styleTemplate, setStyleTemplate] = useState<string>('tech-founder');
  const [bgRemoval, setBgRemoval] = useState<boolean>(true);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate ComfyUI generation pipeline
    setTimeout(() => {
      setIsGenerating(false);
      // Dummy success notification
      alert('Professional photo generated! Replaced background and applied "tech-founder" lighting.');
    }, 2500);
  };

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: '16px' }}>🖼️ AI Profile Photo Tuner</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
        Optimize your portrait using ComfyUI workflows for a polished, professional profile image.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Left Side: Upload & Preview */}
        <div>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--bg-input)', position: 'relative' }}>
            {photo ? (
              <img src={photo} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>👤</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No photo loaded</span>
              </div>
            )}
            
            {isGenerating && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span className="pulse-badge" style={{ width: '20px', height: '20px', marginBottom: '12px' }}></span>
                <span style={{ fontSize: '13px', color: 'white' }}>Running ComfyUI workflow...</span>
              </div>
            )}
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              id="upload-portrait"
              style={{ display: 'none' }}
            />
            <label htmlFor="upload-portrait" className="btn btn-secondary" style={{ display: 'inline-block', cursor: 'pointer', textAlign: 'center', width: '100%' }}>
              📷 Upload Selfie / Portrait
            </label>
          </div>
        </div>

        {/* Right Side: ComfyUI Configuration */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>ComfyUI API Host</label>
              <input 
                type="text" 
                value={comfyHost} 
                onChange={(e) => setComfyHost(e.target.value)} 
              />
            </div>
            
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Style Template</label>
              <select 
                value={styleTemplate} 
                onChange={(e) => setStyleTemplate(e.target.value)}
              >
                <option value="tech-founder">Tech Founder (Dynamic light, warm colors)</option>
                <option value="corporate-navy">Corporate Navy (Clean background, cool light)</option>
                <option value="minimalist-gray">Studio Gray (Soft shadow, black suit)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                checked={bgRemoval} 
                onChange={(e) => setBgRemoval(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
                id="bg-removal"
              />
              <label htmlFor="bg-removal" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Remove and replace background
              </label>
            </div>
          </div>

          <button className="btn" onClick={handleGenerate} disabled={isGenerating || !photo} style={{ width: '100%' }}>
            ✨ Run Optimization
          </button>
        </div>

      </div>
    </div>
  );
}
