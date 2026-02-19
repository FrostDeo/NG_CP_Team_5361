// Vlogs Page JavaScript
class VlogsManager {
    constructor() {
        this.vlogs = TRAVEL_VLOGS;
        this.filteredVlogs = [...this.vlogs];
        this.currentFilter = 'all';
        this.currentSort = 'latest';
        this.currentVideo = null;
        this.init();
    }

    init() {
        this.renderVlogs();
        this.setupEventListeners();
        this.updateStats();
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.setSort(e.target.value);
            });
        }

        // Search functionality
        const searchInput = document.getElementById('vlogSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchVlogs(e.target.value);
            });
        }

        // Video modal
        const modal = document.getElementById('videoModal');
        const closeBtn = modal?.querySelector('.close-modal');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeVideoModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeVideoModal();
            });
        }

        // Upload modal
        const uploadBtn = document.getElementById('uploadBtn');
        const uploadModal = document.getElementById('uploadModal');
        const closeUploadBtn = uploadModal?.querySelector('.close-modal');

        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.openUploadModal());
        }

        if (closeUploadBtn) {
            closeUploadBtn.addEventListener('click', () => this.closeUploadModal());
        }

        if (uploadModal) {
            uploadModal.addEventListener('click', (e) => {
                if (e.target === uploadModal) this.closeUploadModal();
            });
        }

        // Upload form
        const uploadForm = document.getElementById('uploadForm');
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => this.handleUpload(e));
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeVideoModal();
                this.closeUploadModal();
            }
        });
    }

    renderVlogs() {
        const container = document.getElementById('vlogsContainer');
        if (!container) return;

        container.innerHTML = this.filteredVlogs.map(vlog => this.createVlogCard(vlog)).join('');

        // Add click listeners to video cards
        container.querySelectorAll('.vlog-card').forEach(card => {
            card.addEventListener('click', () => {
                const vlogId = card.dataset.vlogId;
                this.openVideoModal(vlogId);
            });
        });
    }

    createVlogCard(vlog) {
        const authorTypeClass = vlog.author.type === 'local' ? 'local-badge' : 'traveler-badge';
        const authorTypeText = vlog.author.type === 'local' ? 'Local Guide' : 'Traveler';

        return `
            <div class="vlog-card" data-vlog-id="${vlog.id}">
                <div class="vlog-thumbnail">
                    <img src="${vlog.thumbnail}" alt="${vlog.title}" loading="lazy">
                    <div class="vlog-duration">${vlog.duration}</div>
                    <div class="vlog-play-overlay">
                        <i class="ri-play-circle-fill"></i>
                    </div>
                    ${vlog.featured ? '<div class="featured-badge"><i class="ri-star-fill"></i> Featured</div>' : ''}
                </div>
                <div class="vlog-content">
                    <div class="vlog-author">
                        <img src="${vlog.author.avatar}" alt="${vlog.author.name}" class="author-avatar">
                        <div class="author-info">
                            <span class="author-name">${vlog.author.name}</span>
                            <span class="author-location">${vlog.author.location}</span>
                        </div>
                        <span class="author-type ${authorTypeClass}">${authorTypeText}</span>
                    </div>
                    <h3 class="vlog-title">${vlog.title}</h3>
                    <p class="vlog-description">${vlog.description}</p>
                    <div class="vlog-meta">
                        <span class="vlog-views"><i class="ri-eye-line"></i> ${this.formatNumber(vlog.views)}</span>
                        <span class="vlog-likes"><i class="ri-heart-line"></i> ${this.formatNumber(vlog.likes)}</span>
                        <span class="vlog-date">${this.formatDate(vlog.uploadDate)}</span>
                    </div>
                    <div class="vlog-tags">
                        ${vlog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    setFilter(filter) {
        this.currentFilter = filter;

        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        // Apply filter
        if (filter === 'all') {
            this.filteredVlogs = [...this.vlogs];
        } else if (filter === 'featured') {
            this.filteredVlogs = this.vlogs.filter(vlog => vlog.featured);
        } else if (filter === 'local') {
            this.filteredVlogs = this.vlogs.filter(vlog => vlog.author.type === 'local');
        } else {
            this.filteredVlogs = this.vlogs.filter(vlog => vlog.type === filter);
        }

        this.applySort();
        this.renderVlogs();
        this.updateStats();
    }

    setSort(sortType) {
        this.currentSort = sortType;
        this.applySort();
        this.renderVlogs();
    }

    applySort() {
        this.filteredVlogs.sort((a, b) => {
            switch (this.currentSort) {
                case 'latest':
                    return new Date(b.uploadDate) - new Date(a.uploadDate);
                case 'popular':
                    return b.views - a.views;
                case 'liked':
                    return b.likes - a.likes;
                case 'oldest':
                    return new Date(a.uploadDate) - new Date(b.uploadDate);
                default:
                    return 0;
            }
        });
    }

    searchVlogs(query) {
        if (!query.trim()) {
            this.filteredVlogs = [...this.vlogs];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredVlogs = this.vlogs.filter(vlog =>
                vlog.title.toLowerCase().includes(searchTerm) ||
                vlog.description.toLowerCase().includes(searchTerm) ||
                vlog.author.name.toLowerCase().includes(searchTerm) ||
                vlog.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                vlog.destination.toLowerCase().includes(searchTerm)
            );
        }

        this.applySort();
        this.renderVlogs();
        this.updateStats();
    }

    openVideoModal(vlogId) {
        const vlog = this.vlogs.find(v => v.id === vlogId);
        if (!vlog) return;

        this.currentVideo = vlog;
        const modal = document.getElementById('videoModal');
        const videoFrame = document.getElementById('videoFrame');
        const videoTitle = document.getElementById('modalVideoTitle');
        const videoAuthor = document.getElementById('modalVideoAuthor');
        const videoStats = document.getElementById('modalVideoStats');
        const videoDescription = document.getElementById('modalVideoDescription');
        const videoTags = document.getElementById('modalVideoTags');

        if (modal && videoFrame && videoTitle && videoAuthor && videoStats && videoDescription && videoTags) {
            videoFrame.src = vlog.videoUrl;
            videoTitle.textContent = vlog.title;
            videoAuthor.innerHTML = `
                <img src="${vlog.author.avatar}" alt="${vlog.author.name}" class="modal-author-avatar">
                <div>
                    <span class="modal-author-name">${vlog.author.name}</span>
                    <span class="modal-author-location">${vlog.author.location}</span>
                </div>
            `;
            videoStats.innerHTML = `
                <span><i class="ri-eye-line"></i> ${this.formatNumber(vlog.views)} views</span>
                <span><i class="ri-heart-line"></i> ${this.formatNumber(vlog.likes)} likes</span>
                <span><i class="ri-calendar-line"></i> ${this.formatDate(vlog.uploadDate)}</span>
            `;
            videoDescription.textContent = vlog.description;
            videoTags.innerHTML = vlog.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('');

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Increment view count (in real app, this would be server-side)
            vlog.views++;
            this.updateStats();
        }
    }

    closeVideoModal() {
        const modal = document.getElementById('videoModal');
        const videoFrame = document.getElementById('videoFrame');

        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        if (videoFrame) {
            videoFrame.src = '';
        }

        this.currentVideo = null;
    }

    openUploadModal() {
        const modal = document.getElementById('uploadModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeUploadModal() {
        const modal = document.getElementById('uploadModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    handleUpload(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const newVlog = {
            id: `vlog_${Date.now()}`,
            title: formData.get('title'),
            description: formData.get('description'),
            destination: formData.get('destination'),
            type: formData.get('type'),
            author: {
                name: currentUser ? currentUser.name : 'Anonymous User',
                avatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
                type: 'traveler',
                location: currentUser ? currentUser.location : 'Unknown'
            },
            thumbnail: 'https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', // Placeholder
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
            duration: '00:00',
            views: 0,
            likes: 0,
            uploadDate: new Date().toISOString().split('T')[0],
            tags: formData.get('tags').split(',').map(tag => tag.trim()),
            featured: false
        };

        // Add to vlogs array (in real app, this would be sent to server)
        this.vlogs.unshift(newVlog);
        this.filteredVlogs = [...this.vlogs];
        this.applySort();
        this.renderVlogs();
        this.updateStats();

        // Show success message
        this.showNotification('Video uploaded successfully!', 'success');

        // Close modal and reset form
        this.closeUploadModal();
        e.target.reset();
    }

    updateStats() {
        const totalVlogs = document.getElementById('totalVlogs');
        const totalViews = document.getElementById('totalViews');
        const totalLikes = document.getElementById('totalLikes');

        if (totalVlogs) totalVlogs.textContent = this.filteredVlogs.length;
        if (totalViews) totalViews.textContent = this.formatNumber(this.filteredVlogs.reduce((sum, vlog) => sum + vlog.views, 0));
        if (totalLikes) totalLikes.textContent = this.formatNumber(this.filteredVlogs.reduce((sum, vlog) => sum + vlog.likes, 0));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="ri-${type === 'success' ? 'check' : 'information'}-line"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
        return `${Math.ceil(diffDays / 365)} years ago`;
    }
}

// Initialize vlogs manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('vlogsContainer')) {
        window.vlogsManager = new VlogsManager();
    }
});