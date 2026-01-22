// Update date and time
function updateDateTime() {
    const now = new Date();
    
    // Format date: "Mon Jun 22"
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', dateOptions);
    
    // Format time: "9:04 AM"
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const timeStr = now.toLocaleTimeString('en-US', timeOptions);
    
    const dateEl = document.getElementById('date');
    const timeEl = document.getElementById('time');
    
    if (dateEl) dateEl.textContent = dateStr;
    if (timeEl) timeEl.textContent = timeStr;
}

// Initialize date/time and update every minute
updateDateTime();
setInterval(updateDateTime, 60000);

// ASCII Rose Art from Image - Cursor responsive
const asciiCanvas = document.getElementById('asciiCanvas');
const asciiRose = document.getElementById('asciiRose');
const imageCanvas = document.getElementById('imageCanvas');

if (asciiCanvas && asciiRose && imageCanvas) {
    const ctx = imageCanvas.getContext('2d');
    const img = new Image();

    // ASCII characters from darkest to brightest
    const asciiChars = ' .:-=+*#%@';

    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    let imageData = null;

    // Configuration
    const asciiWidth = 140;
    const asciiHeight = 95;
    const padding = 10; // Padding around image for wave overflow
    const imageWidth = asciiWidth - (padding * 2);
    const imageHeight = asciiHeight - (padding * 2);

    // Show placeholder immediately on load
    let placeholder = '';
    for (let y = 0; y < asciiHeight; y++) {
        for (let x = 0; x < asciiWidth; x++) {
            placeholder += ' ';
        }
        placeholder += '\n';
    }
    asciiCanvas.textContent = placeholder;

    // Start animation immediately (will show subtle animation even before image loads)
    animate();

    // Load image
    img.src = 'rizzyrose.png';

    img.onload = () => {
        // Set canvas size (full size with padding)
        imageCanvas.width = asciiWidth;
        imageCanvas.height = asciiHeight;

        // Clear canvas (transparent/black padding area)
        ctx.clearRect(0, 0, asciiWidth, asciiHeight);

        // Draw image centered with padding offset
        ctx.drawImage(img, padding, padding, imageWidth, imageHeight);

        // Get image data
        imageData = ctx.getImageData(0, 0, asciiWidth, asciiHeight);
    };

    // Track mouse position
    asciiRose.addEventListener('mousemove', (e) => {
        const rect = asciiRose.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * asciiWidth;
        mouseY = ((e.clientY - rect.top) / rect.height) * asciiHeight;
        isHovering = true;
    });

    asciiRose.addEventListener('mouseleave', () => {
        isHovering = false;
    });

    function getPixelBrightness(x, y) {
        if (!imageData || x < 0 || x >= asciiWidth || y < 0 || y >= asciiHeight) {
            return 0;
        }

        const index = (Math.floor(y) * asciiWidth + Math.floor(x)) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        const a = imageData.data[index + 3];

        // Calculate brightness (0-255) considering alpha
        return ((r + g + b) / 3) * (a / 255);
    }

    function animate() {
        if (!imageData) {
            requestAnimationFrame(animate);
            return;
        }

        let output = '';
        const time = Date.now() * 0.001;

        for (let y = 0; y < asciiHeight; y++) {
            for (let x = 0; x < asciiWidth; x++) {
                let brightness = getPixelBrightness(x, y);

                // Apply cursor effect
                if (isHovering) {
                    const dx = x - mouseX;
                    const dy = y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Create wave effect
                    const wave = Math.sin(distance * 0.3 - time * 3) * 0.5 + 0.5;
                    const intensity = Math.max(0, 1 - distance / 15);

                    // Modify brightness based on distance
                    brightness = brightness + (wave * intensity * 100);
                }

                // Add subtle animation
                brightness += Math.sin(x * 0.1 + y * 0.1 + time) * 10;

                // Clamp brightness
                brightness = Math.max(0, Math.min(255, brightness));

                // Map brightness to ASCII character
                const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
                output += asciiChars[charIndex];
            }
            output += '\n';
        }

        asciiCanvas.textContent = output;
        requestAnimationFrame(animate);
    }
}

// Status Button Toggle
const statusBtn = document.getElementById('statusBtn');
if (statusBtn) {
    let isWorking = true;
    const isTouchDevice = window.matchMedia('(hover: none)').matches;

    statusBtn.addEventListener('click', (e) => {
        // Don't toggle if clicking on action buttons
        if (e.target.closest('.action-btn')) return;

        // On touch devices, only toggle action buttons visibility (don't change status text)
        if (isTouchDevice) {
            statusBtn.classList.toggle('actions-visible');
            return; // Don't change status on mobile - just toggle buttons
        }

        // Desktop behavior - change status text
        isWorking = !isWorking;
        const statusText = statusBtn.querySelector('.status-text');
        const statusDot = statusBtn.querySelector('.status-dot');

        if (isWorking) {
            statusText.textContent = 'free for pitchdeck design';
            statusDot.style.backgroundColor = '#4ade80';
            statusDot.style.boxShadow = '0 0 10px rgba(74, 222, 128, 0.8), 0 0 20px rgba(74, 222, 128, 0.4)';
        } else {
            statusText.textContent = 'available';
            statusDot.style.backgroundColor = '#4ade80';
            statusDot.style.boxShadow = '0 0 10px rgba(74, 222, 128, 0.8), 0 0 20px rgba(74, 222, 128, 0.4)';
        }
    });

    // Close action buttons when clicking outside (touch devices)
    if (isTouchDevice) {
        document.addEventListener('click', (e) => {
            if (!statusBtn.contains(e.target)) {
                statusBtn.classList.remove('actions-visible');
            }
        });
    }
}

// Add click animation to action buttons
const actionButtons = document.querySelectorAll('.action-btn');
actionButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent toggling status button when clicking action buttons
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .action-btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// iPod Nano Player
const ipodAudio = document.getElementById('ipodAudio');
const ipodScreen = document.getElementById('ipodScreen');
const songTitle = document.getElementById('songTitle');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const selectBtn = document.getElementById('selectBtn');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');

// Playlist - Add MP3 tracks here
const playlist = [
    { title: "Time Is The Enemy", src: "content/music/Time Is The Enemy.mp3" },
    { title: "Sand People", src: "content/music/Jon Kennedy - Sand people [YPGEsM3cJhk].mp3" },
    { title: "Better Things", src: "content/music/Massive Attack - Better Things (Extended Mix with Tracey Thorn & Mad Professor).mp3" },
    { title: "Dönence", src: "content/music/Barış Manço - Dönence (1982 - TRT).mp3" },
    { title: "Get Down On It", src: "content/music/Kool & The Gang - Get Down On It.mp3" },
    { title: "Dance Naked Under Palmtrees", src: "content/music/Dance Naked Under Palmtrees.mp3" },
    { title: "Diamente", src: "content/music/Diamente from YouTube.mp3" },
    { title: "Calling Aventura King", src: "content/music/Kid Loco - Calling Aventura King.mp3" }
];

let currentTrack = 0;
let isPlaying = false;

function loadTrack(index) {
    if (playlist.length === 0) {
        songTitle.textContent = 'No Track';
        return false;
    }

    currentTrack = ((index % playlist.length) + playlist.length) % playlist.length;
    const track = playlist[currentTrack];
    ipodAudio.src = track.src;
    songTitle.textContent = track.title;
    return true;
}

function togglePlay() {
    if (playlist.length === 0) {
        songTitle.textContent = 'Add MP3s';
        return;
    }

    if (isPlaying) {
        ipodAudio.pause();
        ipodScreen.classList.remove('active');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        isPlaying = false;
    } else {
        ipodAudio.play().catch(() => {
            songTitle.textContent = 'Error';
        });
        ipodScreen.classList.add('active');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        isPlaying = true;
    }
}

function prevTrack() {
    if (playlist.length === 0) return;
    loadTrack(currentTrack - 1);
    if (isPlaying) ipodAudio.play();
}

function nextTrack() {
    if (playlist.length === 0) return;
    loadTrack(currentTrack + 1);
    if (isPlaying) ipodAudio.play();
}

// Button handlers
if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
if (selectBtn) selectBtn.addEventListener('click', togglePlay);
if (prevBtn) prevBtn.addEventListener('click', prevTrack);
if (nextBtn) nextBtn.addEventListener('click', nextTrack);

if (ipodAudio) {
    ipodAudio.addEventListener('ended', () => {
        if (playlist.length > 1) {
            loadTrack(currentTrack + 1);
            ipodAudio.play();
        } else {
            ipodScreen.classList.remove('active');
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            isPlaying = false;
        }
    });
}

// Set default volume to 25%
if (ipodAudio) ipodAudio.volume = 0.25;

// Load first track
loadTrack(0);

// Notification card click handler
const notificationCard = document.querySelector('.notification-card');
if (notificationCard) {
    notificationCard.addEventListener('click', function(e) {
        window.open('https://x.com/rizzytoday', '_blank', 'noopener,noreferrer');
    });
}

// Notification toggle for touch devices
const notificationBtn = document.getElementById('notificationBtn');
const notificationOverlay = document.getElementById('notificationOverlay');
if (notificationBtn && notificationCard) {
    const isTouchDeviceForNotif = window.matchMedia('(hover: none)').matches;
    if (isTouchDeviceForNotif) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationCard.classList.toggle('active');
            if (notificationOverlay) {
                notificationOverlay.classList.toggle('active');
            }
        });

        // Close notification when clicking overlay
        if (notificationOverlay) {
            notificationOverlay.addEventListener('click', () => {
                notificationCard.classList.remove('active');
                notificationOverlay.classList.remove('active');
            });
        }

        document.addEventListener('click', (e) => {
            if (!notificationBtn.contains(e.target) && !notificationCard.contains(e.target)) {
                notificationCard.classList.remove('active');
                if (notificationOverlay) {
                    notificationOverlay.classList.remove('active');
                }
            }
        });
    }
}

// Cards Toggle Button
const cardsToggleBtn = document.getElementById('cardsToggleBtn');
const cardsStack = document.getElementById('cardsStack');
const aboutToggleBtnForCards = document.getElementById('aboutToggleBtn');
const testimonialsToggleBtnForCards = document.getElementById('testimonialsToggleBtn');

// Create instruction tooltip
const cardsInstructionTooltip = document.createElement('div');
cardsInstructionTooltip.className = 'cards-instruction-tooltip';
cardsInstructionTooltip.textContent = 'click to shift cards';
document.body.appendChild(cardsInstructionTooltip);

if (cardsToggleBtn && cardsStack) {
    cardsToggleBtn.addEventListener('click', function() {
        const wasActive = cardsStack.classList.contains('active');
        cardsStack.classList.toggle('active');
        cardsToggleBtn.classList.toggle('active');

        // Hide/show About and Testimonials buttons when Works cards are toggled
        if (cardsStack.classList.contains('active')) {
            if (aboutToggleBtnForCards) aboutToggleBtnForCards.classList.add('hidden');
            if (testimonialsToggleBtnForCards) testimonialsToggleBtnForCards.classList.add('hidden');
        } else {
            if (aboutToggleBtnForCards) aboutToggleBtnForCards.classList.remove('hidden');
            if (testimonialsToggleBtnForCards) testimonialsToggleBtnForCards.classList.remove('hidden');
        }

        // Show tooltip every time cards open
        if (!wasActive && cardsStack.classList.contains('active')) {
            // Position tooltip ABOVE cards, right-aligned
            setTimeout(() => {
                const stackRect = cardsStack.getBoundingClientRect();
                const tooltipWidth = cardsInstructionTooltip.offsetWidth || 120;
                // Position above cards, right edge aligned with cards right edge
                cardsInstructionTooltip.style.left = (stackRect.right - tooltipWidth) + 'px';
                cardsInstructionTooltip.style.top = (stackRect.top - 25) + 'px';
                cardsInstructionTooltip.style.transform = 'none';
                cardsInstructionTooltip.classList.add('visible');
            }, 100);

            // Hide after 3 seconds
            setTimeout(() => {
                cardsInstructionTooltip.classList.remove('visible');
            }, 3000);
        } else {
            cardsInstructionTooltip.classList.remove('visible');
        }
    });

    // Close cards when clicking outside
    document.addEventListener('click', function(e) {
        if (!cardsStack.contains(e.target) && !cardsToggleBtn.contains(e.target)) {
            const wasActive = cardsStack.classList.contains('active');
            cardsStack.classList.remove('active');
            cardsToggleBtn.classList.remove('active');
            cardsInstructionTooltip.classList.remove('visible');
            // Only show buttons if cards were actually open and closing
            if (wasActive) {
                if (aboutToggleBtnForCards) aboutToggleBtnForCards.classList.remove('hidden');
                if (testimonialsToggleBtnForCards) testimonialsToggleBtnForCards.classList.remove('hidden');
            }
        }
    });
}

// Project Cards Stack - Click top card to send to back
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('click', function(e) {
        // Only respond to clicks on the top card (data-index="0")
        if (this.getAttribute('data-index') !== '0') return;

        e.stopPropagation(); // Prevent closing the stack

        // Hide tooltip if visible
        cardsInstructionTooltip.classList.remove('visible');

        const allCards = Array.from(projectCards);
        const totalCards = allCards.length;

        // Move each card: decrement index (card at 0 goes to back)
        allCards.forEach(c => {
            const currentIndex = parseInt(c.getAttribute('data-index'));
            // Decrement index, wrap around so 0 becomes (totalCards - 1)
            const newIndex = (currentIndex - 1 + totalCards) % totalCards;
            c.setAttribute('data-index', newIndex);
        });
    });
});


// Play videos when cards stack becomes visible
if (cardsToggleBtn && cardsStack) {
    const cardVideos = cardsStack.querySelectorAll('video');

    const observer = new MutationObserver(() => {
        if (cardsStack.classList.contains('active')) {
            cardVideos.forEach(video => {
                video.play().catch(() => {});
            });
        }
    });

    observer.observe(cardsStack, { attributes: true, attributeFilter: ['class'] });
}

// Action Button Tooltips (desktop only)
const actionTooltip = document.getElementById('actionTooltip');
const actionBtns = document.querySelectorAll('.action-btn[data-tooltip]');

if (actionTooltip && actionBtns.length > 0) {
    actionBtns.forEach(btn => {
        // Desktop: show on hover
        btn.addEventListener('mouseenter', () => {
            const text = btn.getAttribute('data-tooltip');
            const rect = btn.getBoundingClientRect();
            actionTooltip.textContent = text;
            actionTooltip.style.left = (rect.left + rect.width / 2) + 'px';
            actionTooltip.style.top = (rect.top - 50) + 'px';
            actionTooltip.style.transform = 'translateX(-50%)';
            actionTooltip.classList.add('visible');
        });

        btn.addEventListener('mouseleave', () => {
            actionTooltip.classList.remove('visible');
        });

    });
}

// Click Wave Effect
document.addEventListener('click', (e) => {
    const wave = document.createElement('div');
    wave.className = 'click-wave';
    wave.style.left = e.clientX + 'px';
    wave.style.top = e.clientY + 'px';
    document.body.appendChild(wave);

    setTimeout(() => {
        wave.remove();
    }, 600);
});

// ===== GUESTBOOK =====
// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAnQKWdREyUYXZKlVweg5HBZx0-vcMZs0g",
    authDomain: "rizztoday.firebaseapp.com",
    projectId: "rizztoday",
    storageBucket: "rizztoday.firebasestorage.app",
    messagingSenderId: "806144736906",
    appId: "1:806144736906:web:5074b4e0bc78e39a7cb773"
};

// Initialize Firebase (only if config is set)
let db = null;
if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
}

// Guestbook elements
const guestbookBtn = document.getElementById('guestbookBtn');
const guestbookInputPanel = document.getElementById('guestbookInputPanel');
const guestbookShoutoutsPanel = document.getElementById('guestbookShoutoutsPanel');
const guestbookOverlay = document.getElementById('guestbookOverlay');
const guestNameInput = document.getElementById('guestName');
const guestMessageInput = document.getElementById('guestMessage');
const guestSubmitBtn = document.getElementById('guestSubmit');
const charCountEl = document.getElementById('charCount');
const messagesContainer = document.getElementById('guestbookMessages');
const guestbookBadge = document.getElementById('guestbookBadge');

// Check for new guestbook entries
async function checkNewGuestbookEntries() {
    if (!db || !guestbookBadge) return;

    try {
        const snapshot = await db.collection('guestbook')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();

        if (snapshot.empty) return;

        const latestDoc = snapshot.docs[0];
        const latestData = latestDoc.data();
        if (!latestData.timestamp) return;

        const latestTimestamp = latestData.timestamp.toMillis();
        const lastSeen = parseInt(localStorage.getItem('guestbookLastSeen') || '0');

        if (latestTimestamp > lastSeen) {
            guestbookBadge.style.display = 'block';
        } else {
            guestbookBadge.style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking new entries:', error);
    }
}

// Mark guestbook as seen
function markGuestbookAsSeen() {
    localStorage.setItem('guestbookLastSeen', Date.now().toString());
    if (guestbookBadge) {
        guestbookBadge.style.display = 'none';
    }
}

// Check for new entries on page load
checkNewGuestbookEntries();

if (guestbookBtn && guestbookInputPanel && guestbookShoutoutsPanel) {
    // Toggle panels
    guestbookBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        guestbookInputPanel.classList.toggle('active');
        guestbookShoutoutsPanel.classList.toggle('active');
        if (guestbookOverlay) guestbookOverlay.classList.toggle('active');
        if (guestbookInputPanel.classList.contains('active')) {
            loadGuestbookMessages();
            markGuestbookAsSeen();
        }
    });

    // Close on overlay click
    if (guestbookOverlay) {
        guestbookOverlay.addEventListener('click', () => {
            guestbookInputPanel.classList.remove('active');
            guestbookShoutoutsPanel.classList.remove('active');
            guestbookOverlay.classList.remove('active');
        });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!guestbookBtn.contains(e.target) &&
            !guestbookInputPanel.contains(e.target) &&
            !guestbookShoutoutsPanel.contains(e.target)) {
            guestbookInputPanel.classList.remove('active');
            guestbookShoutoutsPanel.classList.remove('active');
            if (guestbookOverlay) guestbookOverlay.classList.remove('active');
        }
    });
}

// Character count
if (guestMessageInput && charCountEl) {
    guestMessageInput.addEventListener('input', () => {
        charCountEl.textContent = guestMessageInput.value.length;
    });
}

// Submit message
if (guestSubmitBtn) {
    guestSubmitBtn.addEventListener('click', async () => {
        const name = guestNameInput?.value.trim();
        const message = guestMessageInput?.value.trim();

        if (!name || !message) return;
        if (!db) {
            console.log('Firebase not configured');
            return;
        }

        try {
            await db.collection('guestbook').add({
                name: name,
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            guestNameInput.value = '';
            guestMessageInput.value = '';
            charCountEl.textContent = '0';
            loadGuestbookMessages();
        } catch (error) {
            console.error('Error adding message:', error);
        }
    });
}

// Load messages
async function loadGuestbookMessages() {
    if (!messagesContainer) return;

    if (!db) {
        messagesContainer.innerHTML = '<div class="no-messages">guestbook coming soon...</div>';
        return;
    }

    try {
        const snapshot = await db.collection('guestbook')
            .orderBy('timestamp', 'desc')
            .limit(20)
            .get();

        if (snapshot.empty) {
            messagesContainer.innerHTML = '<div class="no-messages">be the first to leave a note!</div>';
            return;
        }

        messagesContainer.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const time = data.timestamp ? formatTime(data.timestamp.toDate()) : '';
            messagesContainer.innerHTML += `
                <div class="guest-message-wrapper">
                    <div class="guest-header">
                        <span class="guest-name">${escapeHtml(data.name)}</span>
                        ${time ? `<span class="guest-time">${time}</span>` : ''}
                    </div>
                    <div class="guest-message">
                        <div class="guest-text">${escapeHtml(data.message)}</div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesContainer.innerHTML = '<div class="no-messages">error loading messages</div>';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}

// ===== EMOJI REACTIONS =====
const emojiButtons = document.querySelectorAll('.emoji-btn');
const STORAGE_KEY = 'riz_emoji_reactions';

// Get user's selected reactions from localStorage (returns array)
function getUserReactions() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Save user's reactions to localStorage
function setUserReactions(reactions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reactions));
}

// Check if user has reacted with specific emoji
function hasReaction(emoji) {
    return getUserReactions().includes(emoji);
}

// Toggle a reaction (add or remove)
function toggleReaction(emoji) {
    const reactions = getUserReactions();
    const index = reactions.indexOf(emoji);
    if (index > -1) {
        reactions.splice(index, 1); // Remove
    } else {
        reactions.push(emoji); // Add
    }
    setUserReactions(reactions);
    return index === -1; // Returns true if added, false if removed
}

// Update button selected states
function updateButtonStates() {
    const reactions = getUserReactions();
    emojiButtons.forEach(btn => {
        const emoji = btn.getAttribute('data-emoji');
        if (reactions.includes(emoji)) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

// Load emoji counts from Firebase
async function loadEmojiCounts() {
    if (!db) return;

    try {
        const doc = await db.collection('reactions').doc('counts').get();
        if (doc.exists) {
            const data = doc.data();
            Object.keys(data).forEach(emoji => {
                const countEl = document.getElementById(`count-${emoji}`);
                if (countEl) {
                    countEl.textContent = Math.max(0, data[emoji] || 0);
                }
            });
        }
    } catch (error) {
        console.error('Error loading emoji counts:', error);
    }
}

// Initialize on page load
loadEmojiCounts();
updateButtonStates();

// Create floating emoji particle
function createEmojiParticle(btn, emojiChar) {
    const particle = document.createElement('span');
    particle.className = 'emoji-particle';
    particle.textContent = emojiChar;

    const rect = btn.getBoundingClientRect();
    particle.style.left = (rect.left + rect.width / 2) + 'px';
    particle.style.top = rect.top + 'px';

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1000);
}

// Handle emoji clicks
emojiButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const emoji = btn.getAttribute('data-emoji');
        const countEl = document.getElementById(`count-${emoji}`);
        const emojiChar = btn.querySelector('.emoji').textContent;
        const currentCount = parseInt(countEl.textContent) || 0;
        const wasSelected = hasReaction(emoji);

        // Add click animation
        btn.classList.add('clicked');
        setTimeout(() => btn.classList.remove('clicked'), 500);

        // Toggle the reaction
        const isNowSelected = toggleReaction(emoji);

        if (isNowSelected) {
            // Added reaction
            countEl.textContent = currentCount + 1;
            btn.classList.add('selected');
            createEmojiParticle(btn, emojiChar);

            if (db) {
                try {
                    await db.collection('reactions').doc('counts').set({
                        [emoji]: firebase.firestore.FieldValue.increment(1)
                    }, { merge: true });
                } catch (error) {
                    console.error('Error updating emoji count:', error);
                    countEl.textContent = currentCount;
                    toggleReaction(emoji); // Revert
                    btn.classList.remove('selected');
                }
            }
        } else {
            // Removed reaction
            countEl.textContent = Math.max(0, currentCount - 1);
            btn.classList.remove('selected');

            if (db) {
                try {
                    await db.collection('reactions').doc('counts').set({
                        [emoji]: firebase.firestore.FieldValue.increment(-1)
                    }, { merge: true });
                } catch (error) {
                    console.error('Error updating emoji count:', error);
                    countEl.textContent = currentCount;
                    toggleReaction(emoji); // Revert
                    btn.classList.add('selected');
                }
            }
        }
    });
});

// ===== ABOUT CARD TOGGLE =====
const aboutToggleBtn = document.getElementById('aboutToggleBtn');
const aboutCard = document.getElementById('aboutCard');

if (aboutToggleBtn && aboutCard) {
    const worksToggleBtnForAbout = document.getElementById('cardsToggleBtn');
    const testimonialsToggleBtnForAbout = document.getElementById('testimonialsToggleBtn');

    aboutToggleBtn.addEventListener('click', function() {
        aboutCard.classList.toggle('active');
        aboutToggleBtn.classList.toggle('active');

        // Hide/show Works and Testimonials buttons when About is toggled
        if (aboutCard.classList.contains('active')) {
            if (worksToggleBtnForAbout) worksToggleBtnForAbout.classList.add('hidden');
            if (testimonialsToggleBtnForAbout) testimonialsToggleBtnForAbout.classList.add('hidden');
        } else {
            if (worksToggleBtnForAbout) worksToggleBtnForAbout.classList.remove('hidden');
            if (testimonialsToggleBtnForAbout) testimonialsToggleBtnForAbout.classList.remove('hidden');
        }
    });

    // Close about card when clicking outside
    document.addEventListener('click', function(e) {
        if (!aboutCard.contains(e.target) && !aboutToggleBtn.contains(e.target)) {
            const wasActive = aboutCard.classList.contains('active');
            aboutCard.classList.remove('active');
            aboutToggleBtn.classList.remove('active');
            // Only show buttons if About was actually open and closing
            if (wasActive) {
                if (worksToggleBtnForAbout) worksToggleBtnForAbout.classList.remove('hidden');
                if (testimonialsToggleBtnForAbout) testimonialsToggleBtnForAbout.classList.remove('hidden');
            }
        }
    });
}

// ===== TESTIMONIALS =====
const testimonialsToggleBtn = document.getElementById('testimonialsToggleBtn');
const testimonialsCard = document.getElementById('testimonialsCard');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');

let currentTestimonial = 0;

function showTestimonial(index) {
    const total = testimonialSlides.length;
    currentTestimonial = ((index % total) + total) % total;

    testimonialSlides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === currentTestimonial) {
            slide.classList.add('active');
        }
    });
}

if (testimonialsToggleBtn && testimonialsCard) {
    const worksToggleBtnForTestimonials = document.getElementById('cardsToggleBtn');
    const aboutToggleBtnForTestimonials = document.getElementById('aboutToggleBtn');

    testimonialsToggleBtn.addEventListener('click', function() {
        testimonialsCard.classList.toggle('active');
        testimonialsToggleBtn.classList.toggle('active');

        // Hide/show Works and About buttons when Testimonials is toggled
        if (testimonialsCard.classList.contains('active')) {
            if (worksToggleBtnForTestimonials) worksToggleBtnForTestimonials.classList.add('hidden');
            if (aboutToggleBtnForTestimonials) aboutToggleBtnForTestimonials.classList.add('hidden');
        } else {
            if (worksToggleBtnForTestimonials) worksToggleBtnForTestimonials.classList.remove('hidden');
            if (aboutToggleBtnForTestimonials) aboutToggleBtnForTestimonials.classList.remove('hidden');
        }
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!testimonialsCard.contains(e.target) && !testimonialsToggleBtn.contains(e.target)) {
            const wasActive = testimonialsCard.classList.contains('active');
            testimonialsCard.classList.remove('active');
            testimonialsToggleBtn.classList.remove('active');
            // Only show buttons if Testimonials was actually open and closing
            if (wasActive) {
                if (worksToggleBtnForTestimonials) worksToggleBtnForTestimonials.classList.remove('hidden');
                if (aboutToggleBtnForTestimonials) aboutToggleBtnForTestimonials.classList.remove('hidden');
            }
        }
    });
}

if (testimonialPrev) {
    testimonialPrev.addEventListener('click', () => showTestimonial(currentTestimonial - 1));
}

if (testimonialNext) {
    testimonialNext.addEventListener('click', () => showTestimonial(currentTestimonial + 1));
}

// ===== PROJECT COUNTER ANIMATION =====
const projectCounter = document.getElementById('projectCounter');
const targetCount = 19;

if (projectCounter) {
    let hasCountedUp = false;

    function glitchLoop() {
        // Glitch effect: try to go to 20, fall back to 19, repeat forever
        projectCounter.textContent = '20';
        projectCounter.classList.add('glitch');

        setTimeout(() => {
            projectCounter.textContent = '19';
            projectCounter.classList.remove('glitch');

            // Wait then glitch again
            setTimeout(glitchLoop, 1500);
        }, 200);
    }

    function animateCounter() {
        if (hasCountedUp) return;
        hasCountedUp = true;

        let current = 0;
        const duration = 2800; // 2.8 seconds for slower count
        const stepTime = duration / targetCount;

        const countUp = setInterval(() => {
            current++;
            projectCounter.textContent = current;

            if (current >= targetCount) {
                clearInterval(countUp);

                // Start the infinite glitch loop after initial count
                setTimeout(glitchLoop, 300);
            }
        }, stepTime);
    }

    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounter, 500); // Small delay for effect
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(projectCounter);
}