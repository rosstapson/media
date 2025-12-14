import React, { useState, useEffect } from 'react';
import './App.css';
import MediaList from './components/MediaList';
import MediaPlayer from './components/MediaPlayer';
import Login from './components/Login';
import { useAuth } from './context/AuthContext';

function App() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, token, login, logout, isAuthenticated, loading: authLoading } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    if (isAuthenticated) {
      fetchMediaFiles();
    }
  }, [isAuthenticated]);

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/media`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error('Failed to fetch media files');
      }
      const data = await response.json();
      setMediaFiles(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching media files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaSelect = (media) => {
    setSelectedMedia(media);
  };

  const handleClosePlayer = () => {
    setSelectedMedia(null);
  };

  const handleLoginSuccess = (userData, userToken) => {
    login(userData, userToken);
  };

  const handleLogout = () => {
    logout();
    setMediaFiles([]);
    setSelectedMedia(null);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading">Checking authentication...</div>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>🎬 Media Player</h1>
          <div className="user-menu">
            <span className="user-name">Hello, {user?.firstName || user?.username}!</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="App-main">
        {loading && <div className="loading">Loading media files...</div>}
        
        {error && (
          <div className="error">
            <p>Error: {error}</p>
            <button onClick={fetchMediaFiles}>Retry</button>
          </div>
        )}
        
        {!loading && !error && (
          <>
            <MediaList 
              mediaFiles={mediaFiles} 
              onMediaSelect={handleMediaSelect}
              selectedMedia={selectedMedia}
            />
            
            {selectedMedia && (
              <MediaPlayer 
                media={selectedMedia} 
                apiUrl={API_URL}
                token={token}
                onClose={handleClosePlayer}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
