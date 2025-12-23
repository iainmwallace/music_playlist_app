// Music Playlist Generator App

class MusicApp {
    constructor() {
        // Last.fm API configuration (free tier, no auth needed for basic queries)
        this.API_KEY = 'YOUR_LASTFM_API_KEY'; // Users need to get their own free API key
        this.API_URL = 'https://ws.audioscrobbler.com/2.0/';

        this.searchType = 'artist';
        this.playlists = this.loadPlaylists();
        this.currentPlaylist = null;

        this.initializeEventListeners();
        this.renderPlaylists();
        this.checkAPIKey();
    }

    checkAPIKey() {
        if (this.API_KEY === 'YOUR_LASTFM_API_KEY') {
            this.showNotification('Please add your Last.fm API key in app.js. Get one free at https://www.last.fm/api/account/create', 'warning');
        }
    }

    initializeEventListeners() {
        // Search type tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.searchType = e.target.dataset.type;
                document.getElementById('searchInput').placeholder =
                    this.searchType === 'artist' ? 'Search for an artist...' : 'Search for a song...';
            });
        });

        // Search
        document.getElementById('searchBtn').addEventListener('click', () => this.search());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });

        // Playlist modal
        document.getElementById('createPlaylistBtn').addEventListener('click', () => this.showPlaylistModal());
        document.getElementById('savePlaylistBtn').addEventListener('click', () => this.createPlaylist());
        document.getElementById('cancelPlaylistBtn').addEventListener('click', () => this.hidePlaylistModal());
        document.getElementById('playlistNameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createPlaylist();
        });

        // Current playlist actions
        document.getElementById('exportPlaylistBtn').addEventListener('click', () => this.exportPlaylist());
        document.getElementById('closePlaylistBtn').addEventListener('click', () => this.closeCurrentPlaylist());
    }

    async search() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) return;

        this.showLoading();
        const resultsContainer = document.getElementById('searchResults');

        try {
            if (this.searchType === 'artist') {
                const artists = await this.searchArtists(query);
                this.displaySearchResults(artists, 'artist');
            } else {
                const tracks = await this.searchTracks(query);
                this.displaySearchResults(tracks, 'track');
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showNotification('Search failed. Please check your API key and try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async searchArtists(query) {
        const url = `${this.API_URL}?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${this.API_KEY}&format=json&limit=12`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results?.artistmatches?.artist || [];
    }

    async searchTracks(query) {
        const url = `${this.API_URL}?method=track.search&track=${encodeURIComponent(query)}&api_key=${this.API_KEY}&format=json&limit=12`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results?.trackmatches?.track || [];
    }

    displaySearchResults(results, type) {
        const container = document.getElementById('searchResults');

        if (!results || results.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No results found</p></div>';
            return;
        }

        container.innerHTML = results.map(item => {
            if (type === 'artist') {
                return `
                    <div class="result-card" onclick="app.getArtistRecommendations('${this.escapeHtml(item.name)}')">
                        <h4>${this.escapeHtml(item.name)}</h4>
                        <p>Artist</p>
                    </div>
                `;
            } else {
                return `
                    <div class="result-card">
                        <h4>${this.escapeHtml(item.name)}</h4>
                        <p>${this.escapeHtml(item.artist || 'Unknown Artist')}</p>
                        <div class="track-actions">
                            <button class="btn-primary btn-small" onclick="app.getTrackRecommendations('${this.escapeHtml(item.name)}', '${this.escapeHtml(item.artist)}')">Similar</button>
                            <button class="btn-secondary btn-small" onclick="app.addTrackToPlaylist({name: '${this.escapeHtml(item.name)}', artist: '${this.escapeHtml(item.artist)}'})">Add +</button>
                        </div>
                    </div>
                `;
            }
        }).join('');
    }

    async getArtistRecommendations(artistName) {
        this.showLoading();
        try {
            // Get similar artists
            const similarUrl = `${this.API_URL}?method=artist.getsimilar&artist=${encodeURIComponent(artistName)}&api_key=${this.API_KEY}&format=json&limit=15`;
            const response = await fetch(similarUrl);
            const data = await response.json();
            const similarArtists = data.similarartists?.artist || [];

            // Get top tracks from the artist
            const tracksUrl = `${this.API_URL}?method=artist.gettoptracks&artist=${encodeURIComponent(artistName)}&api_key=${this.API_KEY}&format=json&limit=10`;
            const tracksResponse = await fetch(tracksUrl);
            const tracksData = await tracksResponse.json();
            const topTracks = tracksData.toptracks?.track || [];

            this.displayRecommendations([...topTracks, ...similarArtists], artistName);
        } catch (error) {
            console.error('Recommendation error:', error);
            this.showNotification('Failed to get recommendations', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async getTrackRecommendations(trackName, artistName) {
        this.showLoading();
        try {
            // Get similar tracks
            const url = `${this.API_URL}?method=track.getsimilar&artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(trackName)}&api_key=${this.API_KEY}&format=json&limit=20`;
            const response = await fetch(url);
            const data = await response.json();
            const similarTracks = data.similartracks?.track || [];

            this.displayRecommendations(similarTracks, trackName);
        } catch (error) {
            console.error('Recommendation error:', error);
            this.showNotification('Failed to get recommendations', 'error');
        } finally {
            this.hideLoading();
        }
    }

    displayRecommendations(items, sourceName) {
        const container = document.getElementById('recommendations');

        if (!items || items.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No recommendations found</p></div>';
            return;
        }

        container.innerHTML = `
            <div style="margin-bottom: 15px; color: var(--text-secondary);">
                Based on: <strong style="color: var(--primary-color);">${this.escapeHtml(sourceName)}</strong>
            </div>
            ${items.map(item => {
                const isTrack = item.artist || item.name.includes(' - ');
                const trackName = item.name;
                const artistName = item.artist?.name || item.artist || 'Unknown Artist';

                return `
                    <div class="recommendation-card">
                        <h4>${this.escapeHtml(trackName)}</h4>
                        <p>${this.escapeHtml(artistName)}</p>
                        ${isTrack ? `
                            <div class="track-actions">
                                <button class="btn-primary btn-small" onclick="app.addTrackToPlaylist({name: '${this.escapeHtml(trackName)}', artist: '${this.escapeHtml(artistName)}'})">Add to Playlist</button>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        `;
    }

    showPlaylistModal() {
        document.getElementById('playlistModal').classList.add('active');
        document.getElementById('playlistNameInput').value = '';
        document.getElementById('playlistNameInput').focus();
    }

    hidePlaylistModal() {
        document.getElementById('playlistModal').classList.remove('active');
    }

    createPlaylist() {
        const name = document.getElementById('playlistNameInput').value.trim();
        if (!name) {
            this.showNotification('Please enter a playlist name', 'error');
            return;
        }

        const playlist = {
            id: Date.now().toString(),
            name: name,
            tracks: [],
            createdAt: new Date().toISOString()
        };

        this.playlists.push(playlist);
        this.savePlaylists();
        this.renderPlaylists();
        this.hidePlaylistModal();
        this.showNotification('Playlist created successfully!', 'success');
        this.openPlaylist(playlist.id);
    }

    addTrackToPlaylist(track) {
        if (!this.currentPlaylist) {
            this.showNotification('Please select or create a playlist first', 'warning');
            return;
        }

        const playlist = this.playlists.find(p => p.id === this.currentPlaylist);
        if (!playlist) return;

        // Check if track already exists
        const exists = playlist.tracks.some(t =>
            t.name.toLowerCase() === track.name.toLowerCase() &&
            t.artist.toLowerCase() === track.artist.toLowerCase()
        );

        if (exists) {
            this.showNotification('Track already in playlist', 'warning');
            return;
        }

        playlist.tracks.push({
            name: track.name,
            artist: track.artist,
            addedAt: new Date().toISOString()
        });

        this.savePlaylists();
        this.renderCurrentPlaylist();
        this.showNotification('Track added to playlist!', 'success');
    }

    openPlaylist(playlistId) {
        this.currentPlaylist = playlistId;
        const section = document.getElementById('currentPlaylistSection');
        section.style.display = 'block';
        this.renderCurrentPlaylist();
        section.scrollIntoView({ behavior: 'smooth' });
    }

    closeCurrentPlaylist() {
        this.currentPlaylist = null;
        document.getElementById('currentPlaylistSection').style.display = 'none';
    }

    renderCurrentPlaylist() {
        const playlist = this.playlists.find(p => p.id === this.currentPlaylist);
        if (!playlist) return;

        document.getElementById('currentPlaylistName').textContent = playlist.name;
        const container = document.getElementById('currentPlaylistTracks');

        if (playlist.tracks.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No tracks in this playlist yet. Search and add some music!</p></div>';
            return;
        }

        container.innerHTML = playlist.tracks.map((track, index) => `
            <div class="track-item">
                <div class="track-info">
                    <h5>${this.escapeHtml(track.name)}</h5>
                    <p>${this.escapeHtml(track.artist)}</p>
                </div>
                <button class="btn-danger btn-small" onclick="app.removeTrackFromPlaylist(${index})">Remove</button>
            </div>
        `).join('');
    }

    removeTrackFromPlaylist(index) {
        const playlist = this.playlists.find(p => p.id === this.currentPlaylist);
        if (!playlist) return;

        playlist.tracks.splice(index, 1);
        this.savePlaylists();
        this.renderCurrentPlaylist();
        this.renderPlaylists();
        this.showNotification('Track removed', 'success');
    }

    renderPlaylists() {
        const container = document.getElementById('playlistsContainer');

        if (this.playlists.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No playlists yet. Create your first one!</p></div>';
            return;
        }

        container.innerHTML = this.playlists.map(playlist => `
            <div class="playlist-item">
                <div class="playlist-info">
                    <h4>${this.escapeHtml(playlist.name)}</h4>
                    <p>${playlist.tracks.length} tracks</p>
                </div>
                <div class="playlist-actions-btns">
                    <button class="btn-primary btn-small" onclick="app.openPlaylist('${playlist.id}')">Open</button>
                    <button class="btn-danger btn-small" onclick="app.deletePlaylist('${playlist.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    deletePlaylist(playlistId) {
        if (!confirm('Are you sure you want to delete this playlist?')) return;

        this.playlists = this.playlists.filter(p => p.id !== playlistId);
        this.savePlaylists();
        this.renderPlaylists();

        if (this.currentPlaylist === playlistId) {
            this.closeCurrentPlaylist();
        }

        this.showNotification('Playlist deleted', 'success');
    }

    exportPlaylist() {
        const playlist = this.playlists.find(p => p.id === this.currentPlaylist);
        if (!playlist || playlist.tracks.length === 0) {
            this.showNotification('Playlist is empty', 'warning');
            return;
        }

        // Create CSV content compatible with YouTube Music
        // Format: Artist, Track Title
        const csvContent = [
            'Artist,Title',
            ...playlist.tracks.map(track =>
                `"${track.artist.replace(/"/g, '""')}","${track.name.replace(/"/g, '""')}"`
            )
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${playlist.name.replace(/[^a-z0-9]/gi, '_')}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Playlist exported successfully!', 'success');
    }

    savePlaylists() {
        localStorage.setItem('musicPlaylists', JSON.stringify(this.playlists));
    }

    loadPlaylists() {
        const saved = localStorage.getItem('musicPlaylists');
        return saved ? JSON.parse(saved) : [];
    }

    showLoading() {
        document.getElementById('loadingSpinner').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            z-index: 3000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MusicApp();
});
