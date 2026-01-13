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
    img.src = 'rizzyrose.png';

    // ASCII characters from darkest to brightest
    const asciiChars = ' .:-=+*#%@';

    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    let imageData = null;

    // Configuration
    const asciiWidth = 120;
    const asciiHeight = 80;

    img.onload = () => {
        // Set canvas size
        imageCanvas.width = asciiWidth;
        imageCanvas.height = asciiHeight;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, asciiWidth, asciiHeight);

        // Get image data
        imageData = ctx.getImageData(0, 0, asciiWidth, asciiHeight);

        // Start animation
        animate();
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

    statusBtn.addEventListener('click', (e) => {
        // Don't toggle if clicking on action buttons
        if (e.target.closest('.action-btn')) return;

        isWorking = !isWorking;
        const statusText = statusBtn.querySelector('.status-text');
        const statusDot = statusBtn.querySelector('.status-dot');

        if (isWorking) {
            statusText.textContent = 'working rn';
            statusDot.style.backgroundColor = '#ff8c00';
            statusDot.style.boxShadow = '0 0 8px rgba(255, 140, 0, 0.6)';
        } else {
            statusText.textContent = 'available';
            statusDot.style.backgroundColor = '#4ade80';
            statusDot.style.boxShadow = '0 0 8px rgba(74, 222, 128, 0.6)';
        }
    });
}

// Add click animation to action buttons
const actionButtons = document.querySelectorAll('.action-btn');
actionButtons.forEach(button => {
    button.addEventListener('click', function(e) {
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
    { title: "Get Down On It", src: "content/music/Kool & The Gang - Get Down On It.mp3" }
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

// Cards Toggle Button
const cardsToggleBtn = document.getElementById('cardsToggleBtn');
const cardsStack = document.getElementById('cardsStack');

if (cardsToggleBtn && cardsStack) {
    cardsToggleBtn.addEventListener('click', function() {
        cardsStack.classList.toggle('active');
    });

    // Close cards when clicking outside
    document.addEventListener('click', function(e) {
        if (!cardsStack.contains(e.target) && !cardsToggleBtn.contains(e.target)) {
            cardsStack.classList.remove('active');
        }
    });
}

// Project Cards Stack - Click to cycle through cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('click', function() {
        const allCards = Array.from(projectCards);

        // Find the back card (highest index) - it will pop to front
        const backCard = allCards.find(c => parseInt(c.getAttribute('data-index')) === allCards.length - 1);

        // Add popping animation to back card
        if (backCard) {
            backCard.classList.add('popping');

            // Remove animation class after it completes
            setTimeout(() => {
                backCard.classList.remove('popping');
            }, 700);
        }

        // Cycle: each card moves to the next position
        allCards.forEach(c => {
            const currentIndex = parseInt(c.getAttribute('data-index'));
            const newIndex = (currentIndex + 1) % allCards.length;
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