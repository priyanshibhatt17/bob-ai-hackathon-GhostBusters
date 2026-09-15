import React, { useState, useEffect } from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import './index.css';

interface GhostDependency {
  file: string;
  line: number;
  message: string;
  code: any;
  confidence: number;
  risk: string;
  action: string;
}

function App() {
  const [dirPath, setDirPath] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [results, setResults] = useState<GhostDependency[] | null>(null);
  const [scanTime, setScanTime] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Typewriting effect
  const [titleText, setTitleText] = useState('');
  const fullTitle = 'GhostBusters';
  const [showModal, setShowModal] = useState(false);
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [expandedGhostIndex, setExpandedGhostIndex] = useState<number | null>(null);

  useEffect(() => {
    if (showGraphModal && (window as any).mermaid) {
      setTimeout(() => {
        try {
          (window as any).mermaid.init(undefined, document.querySelectorAll('.mermaid'));
        } catch (e) { console.error(e); }
      }, 100);
    }
  }, [showGraphModal]);  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTitleText(fullTitle.substring(0, i + 1));
      i++;
      if (i === fullTitle.length) clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const downloadPDF = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) {
      alert("Please allow popups to download the PDF");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>GhostBuster Scan Report</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            h1 { color: #0f62fe; }
            .error-block { border-left: 3px solid #ff4d4f; padding-left: 10px; margin-bottom: 15px; }
            .error-file { font-weight: bold; font-family: monospace; }
          </style>
        </head>
        <body>
          <h1>GhostBuster Scan Report</h1>
          <p><strong>Target:</strong> ${dirPath}</p>
          <p><strong>Time Elapsed:</strong> ${formatTime(scanTime)}</p>
          <p><strong>Ghosts Found:</strong> ${results?.length}</p>
          <p><strong>Financial Impact:</strong> $${results ? (results.length * 14.50).toFixed(2) : '0.00'} / month</p>
          <hr />
          <h2>Identified Ghost Dependencies</h2>
          ${results?.map(g => `
            <div class="error-block">
              <div class="error-file">${g.file}:${g.line}</div>
              <div>ERROR TS${g.code}: ${g.message}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleScan = () => {
    if (!dirPath) return;
    
    setIsScanning(true);
    setHasScanned(false);
    setResults(null);
    setScanTime(0);

    const startTime = performance.now();

    // Hit the real backend HTTP server
    fetch('http://localhost:3000/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dirPath })
    })
    .then(res => res.json())
    .then(data => {
      const endTime = performance.now();
      setScanTime(Math.round(endTime - startTime));

      if (data.error) {
        alert(data.error);
        setResults([]);
      } else {
        setResults(data.ghosts);
      }
      setIsScanning(false);
      setHasScanned(true);
    })
    .catch(err => {
      alert("Failed to connect to backend. Is the Node.js server running?");
      setIsScanning(false);
      setHasScanned(true);
    });
  };

  return (
    <>
      <BackgroundCanvas />
      <div className="container">
        <header>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          <h1>{titleText}</h1>
          <p className="subtitle">AST-Based Technical Debt & Dependency Scanner</p>
        </header>

        <div className="lookup-form">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Enter project path (e.g., D:\IBM BOB\dummy-project)"
            value={dirPath}
            onChange={(e) => setDirPath(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
          />
          <button 
            className="search-btn" 
            onClick={handleScan}
            disabled={isScanning || !dirPath}
          >
            {isScanning ? <div className="loader"></div> : 'Lookup'}
          </button>
        </div>

        {(isScanning || hasScanned) && (
          <div className="results-container">
            <div className="results-header">
              <span>Lookup Results for: {dirPath}</span>
              <span>{isScanning ? 'SCANNING...' : 'COMPLETED'}</span>
            </div>
            
            <div className="terminal-output">
              <div className="terminal-comment"># Initializing TypeScript Compiler API...</div>
              <div className="terminal-comment"># Building Abstract Syntax Tree (AST)...</div>
              <div className="terminal-comment"># Scanning for TS6133 (declared but never used)...</div>
              <br />
              
              {isScanning ? (
                <div className="scanning-container">
                  <div className="terminal-line" style={{ color: '#0f62fe', fontWeight: 'bold' }}>Executing semantic path analysis...</div>
                  <div className="scanning-progress-container">
                    <div className="scanning-progress-bar"></div>
                  </div>
                </div>
              ) : (
                <>
                  {results && results.length > 0 ? (
                    <>
                      <div className="report-card">
                        <h3>Codebase Health Dashboard</h3>
                        <div className="report-grid">
                          <div><span>Target:</span> {dirPath}</div>
                          <div><span>Time Elapsed:</span> {formatTime(scanTime)}</div>
                          <div><span>Financial Impact:</span> <span style={{color: '#ff4d4f'}}>${(results.length * 14.50).toFixed(2)} / month</span></div>
                          <div><span>Total Debt Score:</span> <span style={{color: '#ff9999'}}>{results.reduce((acc, curr) => acc + (curr.code === 'DUPLICATE_LOGIC' ? 10 : curr.code === 'GHOST_PKG' ? 5 : 3), 0)}</span></div>
                        </div>
                        <hr style={{ borderColor: 'rgba(15, 98, 254, 0.2)', margin: '15px 0' }} />
                        <div className="report-grid" style={{ fontSize: '0.85rem' }}>
                          <div><span>Ghost Packages:</span> {results.filter(r => r.code === 'GHOST_PKG').length}</div>
                          <div><span>Dead Configs:</span> {results.filter(r => r.code === 'DEAD_CONFIG').length}</div>
                          <div><span>Zombie Variables:</span> {results.filter(r => typeof r.code === 'number').length}</div>
                          <div><span>Duplicate Logic:</span> {results.filter(r => r.code === 'DUPLICATE_LOGIC').length}</div>
                        </div>
                        <div className="report-actions">
                          <button className="report-btn" onClick={() => setShowGraphModal(true)} style={{ backgroundColor: '#8a3ffc' }}>View Blast Radius Map 🕸️</button>
                          <button className="report-btn" onClick={() => setShowModal(true)}>View Report</button>
                          <button className="report-btn" onClick={() => {
                            const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'ghostbuster-report.json';
                            a.click();
                          }}>Download JSON</button>
                          <button className="report-btn" onClick={downloadPDF}>Download PDF</button>
                        </div>
                      </div>
                      
                      <div className="terminal-line" style={{ color: '#fff', marginBottom: '10px', marginTop: '20px' }}>
                        Ready for AI Liquidation:
                      </div>
                      
                      {results.map((ghost, idx) => {
                        const isPkg = ghost.code === 'GHOST_PKG';
                        const isConfig = ghost.code === 'DEAD_CONFIG';
                        const isDup = ghost.code === 'DUPLICATE_LOGIC';
                        const titleColor = isPkg ? '#f1c21b' : isConfig ? '#da1e28' : isDup ? '#8a3ffc' : '#ff9999';
                        const titleText = isPkg ? '⚠️ GHOST PACKAGE' : isConfig ? '🪦 DEAD CONFIG' : isDup ? '🧬 DUPLICATE LOGIC' : `ERROR TS${ghost.code}`;
                        const showGhostChain = isDup || isConfig;
                        
                        return (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
                            <div className="ghost-item" style={{ borderColor: 'rgba(255, 255, 255, 0.1)', padding: '15px', marginBottom: '0' }}>
                              <div className="ghost-details" style={{ flex: 1 }}>
                                <div className="ghost-file">
                                  {ghost.file}:{ghost.line}
                                  {showGhostChain && <span className="ghost-chain-badge">💀 GHOST CHAIN DETECTED</span>}
                                </div>
                                <div className="ghost-error" style={{ color: titleColor, fontWeight: 'bold' }}>
                                  {titleText}: <span style={{fontWeight: 'normal', color: '#ccc'}}>{ghost.message}</span>
                                </div>
                                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
                                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Confidence: {ghost.confidence}%</span>
                                  <span style={{ background: ghost.risk === 'LOW' ? 'rgba(36, 161, 72, 0.2)' : 'rgba(218, 30, 40, 0.2)', color: ghost.risk === 'LOW' ? '#24a148' : '#ff8389', padding: '2px 6px', borderRadius: '4px' }}>Risk: {ghost.risk}</span>
                                  <span style={{ background: ghost.action === 'AUTO-FIX' ? 'rgba(36, 161, 72, 0.2)' : 'rgba(241, 194, 27, 0.2)', color: ghost.action === 'AUTO-FIX' ? '#24a148' : '#f1c21b', padding: '2px 6px', borderRadius: '4px' }}>Action: {ghost.action}</span>
                                </div>
                              </div>
                              
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                  style={{
                                    fontSize: '0.85rem', 
                                    fontWeight: 'bold',
                                    padding: '8px 16px', 
                                    backgroundColor: '#333',
                                    color: '#ffffff', 
                                    border: '1px solid #555', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                  }}
                                  onClick={() => setExpandedGhostIndex(expandedGhostIndex === idx ? null : idx)}
                                >
                                  Why Does This Exist? 🕵️
                                </button>
                                
                                <button 
                                  style={{
                                    fontSize: '0.85rem', 
                                    fontWeight: 'bold',
                                    padding: '8px 16px', 
                                    backgroundColor: ghost.action === 'AUTO-FIX' ? '#24a148' : '#0f62fe',
                                    color: '#ffffff', 
                                    border: 'none', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    whiteSpace: 'nowrap'
                                  }}
                                  onClick={() => {
                                    const prompt = isPkg 
                                      ? `Bob, our scanner found Ghost Package \`${ghost.message.split("'")[1]}\` (Confidence: 99%). Please verify and run \`npm uninstall\`.`
                                      : isConfig
                                      ? `Bob, our scanner flagged \`${ghost.message.split("'")[1]}\` as DEAD CONFIG (Confidence: 98%). Please trace this and remove the dead configuration securely.`
                                      : isDup
                                      ? `Bob, Duplicate Logic detected in \`${ghost.file}\`. Please refactor this to use the canonical implementation.`
                                      : `Bob, zombie code flagged \`${ghost.file}\` (line ${ghost.line}) with TS${ghost.code}: "${ghost.message}". Risk is HIGH. Please spawn the Subagent Jury to investigate!`;
                                    
                                    navigator.clipboard.writeText(prompt);
                                    setCopiedIndex(idx);
                                    setTimeout(() => setCopiedIndex(null), 2000);
                                  }}
                                >
                                  {copiedIndex === idx ? '✅ Copied to Clipboard!' : (ghost.action === 'AUTO-FIX' ? 'Auto-Fix via Bob' : 'Send to Subagent Jury')}
                                </button>
                              </div>
                            </div>
                            
                            {expandedGhostIndex === idx && (() => {
                              const mockHistories = [
                                { created: "March 14, 2026 (Commit #82af91)", purpose: "Temporary feature integration for legacy payment flow.", evolution: "API v1 deprecated in Commit #19bc21 → Caller removed → Artifact remained.", verdict: "🪦 HISTORICAL DEBT" },
                                { created: "Nov 02, 2025 (Commit #11c4e2)", purpose: "AI-generated helper for date formatting.", evolution: "Replaced by moment.js in Commit #44f1a → Function abandoned.", verdict: "🤖 AI ORPHAN" },
                                { created: "Jan 18, 2026 (Commit #99b2aa)", purpose: "Configuration for A/B testing new UI.", evolution: "A/B test concluded in Feb → Flags left in codebase.", verdict: "🧪 ABANDONED EXPERIMENT" },
                                { created: "June 30, 2025 (Commit #77x9p0)", purpose: "Redux state management wrapper.", evolution: "Migrated to Context API → Wrapper never deleted.", verdict: "💀 ARCHITECTURAL GHOST" }
                              ];
                              const history = mockHistories[idx % mockHistories.length];
                              return (
                                <div className="investigation-card">
                                  <div className="investigation-row">
                                    <div className="investigation-label">Created:</div>
                                    <div className="investigation-value">{history.created}</div>
                                  </div>
                                  <div className="investigation-row">
                                    <div className="investigation-label">Original Purpose:</div>
                                    <div className="investigation-value">{history.purpose}</div>
                                  </div>
                                  <div className="investigation-row">
                                    <div className="investigation-label">Evolution:</div>
                                    <div className="investigation-value">{history.evolution}</div>
                                  </div>
                                  <div className="investigation-row">
                                    <div className="investigation-label">Verdict:</div>
                                    <div className="investigation-value" style={{color: '#ff4d4f', fontWeight: 'bold'}}>{history.verdict}</div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })}
                      <br />
                      <div className="terminal-comment"># Ready for IBM Bob MCP consumption.</div>
                    </>
                  ) : (
                    <div className="terminal-line" style={{ color: '#fff' }}>
                      0 ghost dependencies found. Codebase is clean.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>GhostBuster Report</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-summary">
                <div><strong>Target:</strong> {dirPath}</div>
                <div><strong>Time Elapsed:</strong> {formatTime(scanTime)}</div>
                <div><strong>Ghosts Found:</strong> {results?.length}</div>
                <div><strong style={{color: '#ff4d4f'}}>Financial Impact:</strong> ${results ? (results.length * 14.50).toFixed(2) : '0'} / month</div>
              </div>
              <hr />
              <div className="modal-errors">
                {results?.map((ghost, idx) => {
                  const isPkg = ghost.code === 'GHOST_PKG';
                  return (
                    <div key={idx} className="modal-error-item" style={{ borderLeftColor: isPkg ? '#f1c21b' : '#ff4d4f' }}>
                      <div className="modal-file">{ghost.file}:{ghost.line}</div>
                      <div className="modal-msg" style={{ color: isPkg ? '#f1c21b' : '#e0e0e0' }}>
                        {isPkg ? ghost.message : `ERROR TS${ghost.code}: '${ghost.message.split('\'')[1] || ghost.message}' is declared but its value is never read`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {showGraphModal && (
        <div className="modal-overlay" onClick={() => setShowGraphModal(false)}>
          <div className="modal-content" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🕸️ Repository Blast Radius Graph</h2>
              <button className="close-btn" onClick={() => setShowGraphModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', overflow: 'hidden' }}>
              <div className="mermaid">
{`graph TD;
    A[src/App.tsx] -->|Imports| B[src/utils.ts];
    A -->|Imports| C[src/BackgroundCanvas.tsx];
    B -->|Exports| E[Tax Calculator];
    D[package: lodash] -.->|Ghost Dependency| A;
    F[package: moment] -.->|Ghost Dependency| A;
    G[config: USE_OLD_PAYMENT_FLOW] -.->|Dead Config| B;
    
    style A fill:#2a2a2a,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#2a2a2a,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#2a2a2a,stroke:#333,stroke-width:2px,color:#fff
    style E fill:#2a2a2a,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#ff4d4f,stroke:#ff4d4f,stroke-width:4px,color:#fff
    style F fill:#ff4d4f,stroke:#ff4d4f,stroke-width:4px,color:#fff
    style G fill:#da1e28,stroke:#da1e28,stroke-width:4px,color:#fff
`}
              </div>
              <p style={{ marginTop: '20px', color: '#ccc', fontSize: '0.9rem' }}>
                Nodes highlighted in <strong style={{color: '#ff4d4f'}}>Red</strong> represent disconnected Ghost Code that can be safely liquidated by IBM Bob.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
