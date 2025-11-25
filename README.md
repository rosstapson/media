# Media Player App

A full-stack media player application with a Node.js/Express backend and React frontend. The app allows you to browse and play audio and video files from a local folder.

## Features

- 🎥 **Video playback** - Supports MP4, WebM, AVI, MOV, MKV formats
- 🎵 **Audio playback** - Supports MP3, OGG, WAV, M4A formats
- 📱 **Responsive design** - Works on desktop and mobile devices
- 🎬 **Media streaming** - Range request support for efficient streaming
- 📋 **File information** - Displays file size and type
- ✨ **Modern UI** - Clean, intuitive interface

## Project Structure

```
media/
├── backend/          # Node.js/Express server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── media-files/  # Folder for your media files (created automatically)
│
└── frontend/         # React application
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── MediaList.js      # Media file list component
    │   │   ├── MediaList.css
    │   │   ├── MediaPlayer.js    # Media player component
    │   │   └── MediaPlayer.css
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

### 1. Install Backend Dependencies

```powershell
cd backend
npm install
```

### 2. Install Frontend Dependencies

```powershell
cd ..\frontend
npm install
```

## Configuration

### Backend Configuration

By default, the backend will create a `media-files` folder in the `backend` directory. You can customize the media folder path by editing `backend/server.js`:

```javascript
// Line 10 in server.js
const MEDIA_FOLDER = path.join(__dirname, 'media-files');
```

Change this to point to your desired media folder location.

### Adding Media Files

1. Navigate to `backend/media-files/` (or your custom folder)
2. Add your video and audio files
3. Supported formats:
   - **Video**: `.mp4`, `.webm`, `.avi`, `.mov`, `.mkv`
   - **Audio**: `.mp3`, `.ogg`, `.wav`, `.m4a`

## Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```
The backend server will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```
The frontend will run on `http://localhost:3000` and automatically open in your browser.

### Option 2: Development Mode with Auto-Reload

**Backend (with nodemon):**
```powershell
cd backend
npm run dev
```

**Frontend:**
```powershell
cd frontend
npm start
```

## Usage

1. Start both the backend and frontend servers
2. Open your browser to `http://localhost:3000`
3. You'll see a list of all media files from your media folder
4. Click on any file to play it
5. The media player will open in an overlay
6. Click the X button or outside the player to close it

## API Endpoints

### GET /api/media
Returns a list of all media files with metadata.

**Response:**
```json
[
  {
    "id": "video.mp4",
    "name": "video.mp4",
    "type": "video",
    "size": 12345678,
    "modified": "2025-11-25T00:00:00.000Z"
  }
]
```

### GET /api/media/:filename
Streams the requested media file. Supports range requests for efficient streaming.

## Troubleshooting

### No media files showing up
- Ensure your media files are in the correct folder (`backend/media-files/`)
- Check that the file extensions are supported
- Verify the backend server is running and accessible

### CORS errors
- Make sure both servers are running
- The backend is configured to allow CORS from any origin

### Video/Audio won't play
- Check that your browser supports the media format
- Ensure the file isn't corrupted
- Check browser console for errors

## Development

### Backend
- Built with Express.js
- Uses Node.js `fs` module for file operations
- Implements streaming with range request support

### Frontend
- Built with React
- Uses React Hooks (useState, useEffect, useRef)
- Responsive CSS Grid layout
- HTML5 video and audio elements

## Building for Production

### Frontend Build
```powershell
cd frontend
npm run build
```

This creates an optimized production build in the `frontend/build` folder.

To serve the production build, you can modify the backend to serve static files:

```javascript
// Add to backend/server.js
app.use(express.static(path.join(__dirname, '../frontend/build')));
```

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!
