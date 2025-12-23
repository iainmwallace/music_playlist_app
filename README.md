# 🎵 Music Playlist Generator

A beautiful, modern web application for discovering music and creating playlists that can be imported into YouTube Music. Built with vanilla HTML, CSS, and JavaScript - no frameworks required!

## ✨ Features

- **🔍 Music Discovery**: Search for artists and songs to discover new music
- **🎯 Smart Recommendations**: Get similar artists and tracks based on your favorites
- **📝 Playlist Management**: Create, edit, and manage multiple playlists
- **💾 Local Storage**: All playlists are saved locally in your browser
- **📤 Export to YouTube Music**: Export playlists as CSV files compatible with YouTube Music
- **🎨 Modern UI**: Beautiful, responsive dark theme interface
- **⚡ Fast & Lightweight**: No frameworks, pure vanilla JavaScript

## 🚀 Quick Start

### 1. Get a Last.fm API Key (Free)

The app uses the Last.fm API for music discovery. You need a free API key:

1. Go to [Last.fm API Account Creation](https://www.last.fm/api/account/create)
2. Sign in or create a Last.fm account
3. Fill in the application form:
   - **Application name**: Music Playlist Generator (or any name)
   - **Application description**: Personal music discovery app
   - **Callback URL**: Leave empty or use your GitHub Pages URL
4. Click "Submit"
5. Copy your **API Key** (you don't need the shared secret)

### 2. Configure the App

1. Open `app.js` in a text editor
2. Find line 7: `this.API_KEY = 'YOUR_LASTFM_API_KEY';`
3. Replace `YOUR_LASTFM_API_KEY` with your actual API key
4. Save the file

### 3. Run the App

#### Option A: GitHub Pages (Recommended)

1. Push this repository to GitHub
2. Go to your repository Settings > Pages
3. Under "Source", select your branch (usually `main` or `master`)
4. Click Save
5. Your app will be available at `https://yourusername.github.io/repository-name/`

#### Option B: Local Testing

1. Simply open `index.html` in your web browser
2. Or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (if you have http-server installed)
   npx http-server
   ```
3. Open `http://localhost:8000` in your browser

## 📖 How to Use

### Discovering Music

1. **Search for Artists or Songs**:
   - Click the "Artist" or "Song" tab
   - Enter an artist name or song title
   - Click "Search" or press Enter

2. **Get Recommendations**:
   - Click on an artist card to see similar artists and their top tracks
   - For songs, click "Similar" to find similar tracks

### Managing Playlists

1. **Create a Playlist**:
   - Click "+ New Playlist"
   - Enter a name and click "Create"

2. **Add Tracks**:
   - Search for music and get recommendations
   - Click "Add to Playlist" or "Add +" on any track
   - Make sure you have a playlist open first!

3. **View and Edit**:
   - Click "Open" on any playlist to view its tracks
   - Remove tracks by clicking the "Remove" button
   - Delete entire playlists with the "Delete" button

### Exporting to YouTube Music

1. **Export Your Playlist**:
   - Open the playlist you want to export
   - Click "Export to CSV"
   - Save the CSV file to your computer

2. **Import to YouTube Music**:
   - Go to [YouTube Music](https://music.youtube.com/)
   - Click on your profile picture > "Settings"
   - Scroll to "Privacy and location"
   - Look for import options or use third-party tools like:
     - [Soundiiz](https://soundiiz.com/) - supports CSV imports
     - [FreeYourMusic](https://freeyourmusic.com/)
     - [Tune My Music](https://www.tunemymusic.com/)

   **Note**: YouTube Music doesn't have direct CSV import. Use the exported CSV with the above services to transfer your playlists.

## 🎯 Tips for Best Results

- **Be Specific**: Search for exact artist or song names for better results
- **Explore Similar**: Use the recommendation features to discover new music
- **Multiple Playlists**: Create themed playlists (workout, chill, party, etc.)
- **Regular Exports**: Export your playlists regularly as backups

## 🛠️ Technical Details

### Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Vanilla JS with classes and async/await
- **Last.fm API**: Music data and recommendations
- **LocalStorage**: Client-side data persistence

### Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)
- Opera (v76+)

### Data Storage

All playlists are stored locally in your browser's LocalStorage:
- **Persistent**: Data survives page refreshes
- **Private**: Never leaves your device
- **Limited**: ~5-10MB storage limit (thousands of tracks)

## 🔒 Privacy

- **No Server**: Everything runs in your browser
- **No Tracking**: No analytics or tracking scripts
- **No Login**: No account required (except for Last.fm API key)
- **Your Data**: All playlists stay on your device

## 🐛 Troubleshooting

### "Please add your Last.fm API key" message

- Make sure you've replaced `YOUR_LASTFM_API_KEY` in `app.js` with your actual API key
- Check that you've saved the file after editing

### Search not working

- Verify your API key is correct
- Check browser console (F12) for errors
- Ensure you have an internet connection

### Playlists disappeared

- LocalStorage is domain-specific - use the same URL
- Check if browser data was cleared
- Try exporting playlists regularly as backups

## 📝 License

MIT License - feel free to use and modify for your own projects!

## 🤝 Contributing

This is a simple, self-contained project perfect for learning or extending:
- Add more music APIs (Spotify, Apple Music)
- Implement playlist sharing features
- Add audio preview functionality
- Create playlist generation algorithms

## 🌟 Credits

- Music data provided by [Last.fm API](https://www.last.fm/api)
- Built with ❤️ using vanilla web technologies

---

**Enjoy discovering new music!** 🎶
