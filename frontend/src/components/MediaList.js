import React from 'react';
import './MediaList.css';

const MediaList = ({ mediaFiles, onMediaSelect, selectedMedia }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type === 'video') return '🎥';
    if (type === 'audio') return '🎵';
    return '📁';
  };

  if (mediaFiles.length === 0) {
    return (
      <div className="media-list-empty">
        <p>No media files found.</p>
        <p className="hint">Add media files to the backend/media-files folder</p>
      </div>
    );
  }

  return (
    <div className="media-list-container">
      <h2>Media Library ({mediaFiles.length} files)</h2>
      <div className="media-list">
        {mediaFiles.map((media) => (
          <div
            key={media.id}
            className={`media-item ${selectedMedia?.id === media.id ? 'selected' : ''}`}
            onClick={() => onMediaSelect(media)}
          >
            <div className="media-icon">{getFileIcon(media.type)}</div>
            <div className="media-info">
              <div className="media-name" title={media.name}>
                {media.name}
              </div>
              <div className="media-details">
                <span className="media-type">{media.type}</span>
                <span className="media-size">{formatFileSize(media.size)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaList;
