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

// Draggable Folder with Reset and Open Animation
const folder = document.getElementById('folder');
if (folder) {
    const folderIcon = folder.querySelector('.folder-icon');
    let isDragging = false;
    let startX, startY, initialX, initialY;
    const originalLeft = '40%';
    const originalTop = '35%';
    let resetTimeout;

    // Folder open/close animation handled by CSS

    folder.addEventListener('mousedown', (e) => {
        if (e.target.closest('.popup-icon')) return; // Don't drag when clicking icons

        isDragging = true;
        folder.style.cursor = 'grabbing';

        const rect = folder.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialX = rect.left;
        initialY = rect.top;

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        folder.style.left = `${initialX + deltaX}px`;
        folder.style.top = `${initialY + deltaY}px`;
        folder.style.transform = 'translate(0, 0)';

        // Clear existing timeout
        if (resetTimeout) clearTimeout(resetTimeout);

        // Set timeout to reset position after 2 seconds of no movement
        resetTimeout = setTimeout(() => {
            folder.style.transition = 'all 0.5s ease';
            folder.style.left = originalLeft;
            folder.style.top = originalTop;
            folder.style.transform = 'translate(-50%, -50%)';

            setTimeout(() => {
                folder.style.transition = '';
            }, 500);
        }, 2000);
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            folder.style.cursor = 'grab';
        }
    });
}

// Removed dead code - no .emoji elements exist in the HTML

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

// Mini Piano - Web Audio API
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// Note frequencies
const noteFrequencies = {
    'C4': 261.63,
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'B4': 493.88
};

function playNote(frequency) {
    // Resume audio context if suspended (browser requirement)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Piano-like sound (sine wave with slight harmonics)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Add click handlers to piano keys
const pianoKeys = document.querySelectorAll('.white-key, .black-key');
pianoKeys.forEach(key => {
    key.addEventListener('mousedown', function() {
        const note = this.getAttribute('data-note');
        const frequency = noteFrequencies[note];
        if (frequency) {
            playNote(frequency);
            this.classList.add('active');
        }
    });

    key.addEventListener('mouseup', function() {
        this.classList.remove('active');
    });

    key.addEventListener('mouseleave', function() {
        this.classList.remove('active');
    });
});

// Notification card click handler
const notificationCard = document.querySelector('.notification-card');
if (notificationCard) {
    notificationCard.addEventListener('click', function(e) {
        window.open('https://x.com/rizzytoday', '_blank', 'noopener,noreferrer');
    });
}