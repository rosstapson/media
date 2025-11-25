import React, { useRef, useEffect } from 'react';
import './MediaPlayer.css';

const MediaPlayer = ({ media, apiUrl, token, onClose }) => {
  const playerRef = useRef(null);
  // Include token in URL for authenticated media streaming
  const mediaUrl = `${apiUrl}/api/media/${encodeURIComponent(media.name)}${token ? `?token=${token}` : ''}`;

  useEffect(() => {
    // Reset player when media changes
    if (playerRef.current) {
      playerRef.current.load();
    }
  }, [media]);

  return (
    <div className="media-player-overlay" onClick={onClose}>
      <div className="media-player-container" onClick={(e) => e.stopPropagation()}>
        <div className="media-player-header">
          <h3>{media.name}</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="media-player-content">
          {media.type === 'video' ? (
            <video
              ref={playerRef}
              controls
              autoPlay
              className="media-player"
              src={mediaUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : media.type === 'audio' ? (
            <div className="audio-player-wrapper">
              <div className="audio-info">
                <div className="audio-icon">🎵</div>
                <div className="audio-title">{media.name}</div>
              </div>
              <audio
                ref={playerRef}
                controls
                autoPlay
                className="media-player audio-player"
                src={mediaUrl}
              >
                Your browser does not support the audio tag.
              </audio>
            </div>
          ) : (
            <div className="unsupported-media">
              <p>Unsupported media type</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
