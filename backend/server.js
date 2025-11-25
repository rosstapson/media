const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { verifyToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Configure your media folder path here
const MEDIA_FOLDER = path.join(__dirname, 'media-files');

// Ensure media folder exists
const ensureMediaFolder = async () => {
  try {
    await fs.access(MEDIA_FOLDER);
  } catch {
    await fs.mkdir(MEDIA_FOLDER, { recursive: true });
    console.log(`Created media folder at: ${MEDIA_FOLDER}`);
  }
};

// Auth routes
app.use('/api/auth', authRoutes);

// Get list of media files (protected route)
app.get('/api/media', verifyToken, async (req, res) => {
  try {
    const files = await fs.readdir(MEDIA_FOLDER);
    
    // Filter for common media file extensions
    const mediaExtensions = ['.mp4', '.mp3', '.webm', '.ogg', '.wav', '.m4a', '.avi', '.mov', '.mkv'];
    const mediaFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return mediaExtensions.includes(ext);
    });

    // Get file details
    const filesWithDetails = await Promise.all(
      mediaFiles.map(async (filename) => {
        const filePath = path.join(MEDIA_FOLDER, filename);
        const stats = await fs.stat(filePath);
        const ext = path.extname(filename).toLowerCase();
        
        // Determine media type
        const videoExtensions = ['.mp4', '.webm', '.avi', '.mov', '.mkv'];
        const audioExtensions = ['.mp3', '.ogg', '.wav', '.m4a'];
        
        let type = 'unknown';
        if (videoExtensions.includes(ext)) type = 'video';
        else if (audioExtensions.includes(ext)) type = 'audio';

        return {
          id: filename,
          name: filename,
          type: type,
          size: stats.size,
          modified: stats.mtime
        };
      })
    );

    res.json(filesWithDetails);
  } catch (error) {
    console.error('Error reading media files:', error);
    res.status(500).json({ error: 'Failed to read media files' });
  }
});

// Stream media file (protected route)
app.get('/api/media/:filename', verifyToken, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(MEDIA_FOLDER, filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }

    const stat = await fs.stat(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range requests for streaming
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;

      const file = require('fs').createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': getContentType(filename),
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Send entire file
      const head = {
        'Content-Length': fileSize,
        'Content-Type': getContentType(filename),
      };

      res.writeHead(200, head);
      require('fs').createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error('Error streaming media file:', error);
    res.status(500).json({ error: 'Failed to stream media file' });
  }
});

// Helper function to get content type
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const contentTypes = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.mkv': 'video/x-matroska',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.m4a': 'audio/mp4',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

// Start server
const startServer = async () => {
  await ensureMediaFolder();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Media folder: ${MEDIA_FOLDER}`);
  });
};

startServer();
