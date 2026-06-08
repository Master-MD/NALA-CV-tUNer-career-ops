import React, { useState } from 'react';

export function InboxZone() {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [droppedFiles, setDroppedFiles] = useState<Array<{ name: string; size: string; tag: string; status: string }>>([
    { name: 'Lebenslauf_Jane_Doe_2026.pdf', size: '245 KB', tag: 'CV', status: 'Parsed' },
    { name: 'Arbeitszeugnis_MockTech.docx', size: '1.2 MB', tag: 'Reference', status: 'Parsed' }
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const newFiles = files.map(file => {
        // Simple classification based on name
        let tag = 'Other';
        const name = file.name.toLowerCase();
        if (name.includes('cv') || name.includes('resume') || name.includes('lebenslauf')) {
          tag = 'CV';
        } else if (name.includes('zeugnis') || name.includes('certificate') || name.includes('referenz')) {
          tag = 'Reference';
        } else if (name.includes('diploma') || name.includes('diplom') || name.includes('degree')) {
          tag = 'Diploma';
        } else if (name.includes('job') || name.includes('jd') || name.includes('stelle')) {
          tag = 'Job Posting';
        }

        const sizeStr = file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;

        return {
          name: file.name,
          size: sizeStr,
          tag,
          status: 'Parsing...'
        };
      });

      setDroppedFiles([...newFiles, ...droppedFiles]);

      // Simulate parsing completion after 1.5s
      newFiles.forEach((file, index) => {
        setTimeout(() => {
          setDroppedFiles(prev => {
            const updated = [...prev];
            const itemIdx = updated.findIndex(f => f.name === file.name);
            if (itemIdx !== -1) {
              updated[itemIdx] = { ...updated[itemIdx], status: 'Parsed' };
            }
            return updated;
          });
        }, 1500 + index * 500);
      });
    }
  };

  return (
    <div>
      {/* Drag and Drop Zone */}
      <div 
        className={`drop-zone ${isDragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{ minHeight: '180px', marginBottom: '24px' }}
      >
        <span style={{ fontSize: '32px', marginBottom: '12px' }}>📥</span>
        <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Drag & Drop your documents here</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Supports PDF, DOCX, TXT, HTML, RTF, and EML (processed securely via local Docling engine)
        </p>
      </div>

      {/* Files List */}
      <div>
        <h3 style={{ fontSize: '15px', marginBottom: '12px', color: 'var(--text-secondary)' }}>Parsed Documents ({droppedFiles.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {droppedFiles.map((file, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span 
                  style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    background: file.tag === 'CV' ? 'rgba(16, 185, 129, 0.15)' : file.tag === 'Reference' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                    color: file.tag === 'CV' ? 'var(--accent-color)' : file.tag === 'Reference' ? '#3b82f6' : 'var(--text-secondary)'
                  }}
                >
                  {file.tag}
                </span>
                <span style={{ fontWeight: '500' }}>{file.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>({file.size})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span 
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: file.status === 'Parsed' ? 'var(--accent-color)' : '#f59e0b' 
                  }}
                >
                  {file.status === 'Parsed' ? '✅ Loaded' : '🧠 Analyzing...'}
                </span>
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
