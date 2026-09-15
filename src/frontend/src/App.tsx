import React, { useState } from 'react';
import './index.css';

// Mock data structure matching our backend output
interface GhostDependency {
  file: string;
  line: number;
  message: string;
  code: number;
}

function App() {
  const [dirPath, setDirPath] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<GhostDependency[] | null>(null);
  const [summary, setSummary] = useState('');

  const handleScan = () => {
    if (!dirPath) return;
    
    setIsScanning(true);
    setResults(null);
    setSummary('');

    // Simulated API call to our backend MCP server
    // In a real execution, this would hit our local Node.js endpoint
    setTimeout(() => {
      // Mocking the result of parsing a messy project
      const mockGhosts = [
        { file: 'src/utils/dateFormatter.js', line: 12, message: "'formatDate' is declared but its value is never read.", code: 6133 },
        { file: 'src/components/Header.tsx', line: 4, message: "'axios' is declared but its value is never read.", code: 6133 },
        { file: 'src/services/auth.ts', line: 45, message: "'legacyLoginAuth' is declared but its value is never read.", code: 6133 },
        { file: 'src/config/flags.json', line: 2, message: "'enableOldUI' is declared but its value is never read.", code: 6133 },
      ];
      
      setResults(mockGhosts);
      setSummary(`Scanned 42 files. Found ${mockGhosts.length} ghost dependencies.`);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="container">
      <header>
        <h1>GhostBusters</h1>
        <p className="subtitle">AI Code Bloat Janitor & Dependency Liquidator</p>
      </header>

      <div className="search-section">
        <input 
          type="text" 
          className="dir-input" 
          placeholder="Enter absolute directory path (e.g., C:/projects/my-app)"
          value={dirPath}
          onChange={(e) => setDirPath(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
        />
        <button 
          className="primary-btn" 
          onClick={handleScan}
          disabled={isScanning || !dirPath}
        >
          {isScanning ? <div className="loader"></div> : 'Scan Repository'}
        </button>
      </div>

      {results && (
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Scan Results</h3>
            <span className={`status-badge ${results.length === 0 ? 'success' : ''}`}>
              {results.length === 0 ? 'Clean Codebase' : `${results.length} Issues Found`}
            </span>
          </div>
          
          {results.length > 0 ? (
            <ul className="ghost-list">
              {results.map((ghost, idx) => (
                <li key={idx} className="ghost-item">
                  <span className="ghost-file">{ghost.file}:{ghost.line}</span>
                  <span className="ghost-message">{ghost.message}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No ghost dependencies found! Your code is pristine.</p>
            </div>
          )}
          
          {summary && (
            <div className="card-header" style={{ borderBottom: 'none', borderTop: '1px solid var(--border-light)', backgroundColor: '#fff', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {summary}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
