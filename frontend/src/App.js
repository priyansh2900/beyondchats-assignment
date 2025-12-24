import React, { useEffect, useState } from 'react';
import './App.css';

const API_BASE = 'http://127.0.0.1:8000';

function App() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(`${API_BASE}/api/articles`);
        const data = await res.json();
        setArticles(data);
        setSelected(data[data.length - 1] || null); // latest article by default
      } catch (err) {
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) return <div className="app"><p>Loading...</p></div>;
  if (error) return <div className="app"><p>{error}</p></div>;

  return (
    <div className="app">
      <header className="app-header">
        <h1>BeyondChats Articles</h1>
        <p>Original and AI-enhanced versions from your Laravel API</p>
      </header>

      <div className="layout">
        {/* Left: list */}
        <div className="list">
          {articles.map((a) => (
            <button
              key={a.id}
              className={
                'list-item ' +
                (selected && selected.id === a.id ? 'active ' : '') +
                (a.title.includes('AI Enhanced') ? 'enhanced' : 'original')
              }
              onClick={() => setSelected(a)}
            >
              <div className="list-title">{a.title}</div>
              <div className="list-meta">
                <span>id: {a.id}</span>
                <span>{a.slug}</span>
                {a.title.includes('AI Enhanced') && <span className="badge">AI</span>}
              </div>
            </button>
          ))}
        </div>

        {/* Right: detail */}
        <div className="detail">
          {selected ? (
            <>
              <h2>{selected.title}</h2>
              <p className="detail-slug">{selected.slug}</p>
              <p className="detail-source">
                Source:&nbsp;
                <a href={selected.source_url} target="_blank" rel="noreferrer">
                  {selected.source_url}
                </a>
              </p>
              <pre className="detail-content">
                {selected.content}
              </pre>
            </>
          ) : (
            <p>Select an article from the left.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
