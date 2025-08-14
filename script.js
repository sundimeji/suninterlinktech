// Network Information Functions
let localIPAddresses = [];

// Function to get local IP addresses
async function getLocalIPAddresses() {
    try {
        // Using WebRTC to get local IP
        const rtc = new RTCPeerConnection({ iceServers: [] });
        const offer = await rtc.createOffer();
        await rtc.setLocalDescription(offer);
        
        rtc.onicecandidate = (event) => {
            if (event.candidate) {
                const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                const match = ipRegex.exec(event.candidate.candidate);
                if (match && !localIPAddresses.includes(match[1])) {
                    localIPAddresses.push(match[1]);
                    updateLocalIPDisplay();
                }
            }
        };
        
        setTimeout(() => {
            rtc.close();
        }, 1000);
    } catch (error) {
        console.error('Error getting local IP:', error);
        document.getElementById('local-ip').textContent = 'Unable to detect local IP';
    }
}

// Function to update local IP display
function updateLocalIPDisplay() {
    const localIPElement = document.getElementById('local-ip');
    if (localIPAddresses.length > 0) {
        localIPElement.textContent = localIPAddresses.join(', ');
    } else {
        localIPElement.textContent = 'No local IP detected';
    }
}

// Function to refresh local IP
function refreshLocalIP() {
    localIPAddresses = [];
    document.getElementById('local-ip').textContent = 'Detecting...';
    getLocalIPAddresses();
}

// Function to get public IP address
async function getPublicIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        document.getElementById('public-ip').textContent = data.ip;
    } catch (error) {
        console.error('Error getting public IP:', error);
        document.getElementById('public-ip').textContent = 'Unable to detect public IP';
    }
}

// Function to refresh public IP
function refreshPublicIP() {
    document.getElementById('public-ip').textContent = 'Detecting...';
    getPublicIP();
}

// Function to check server status
async function checkServerStatus() {
    const statusElement = document.getElementById('server-status');
    statusElement.textContent = 'Checking...';
    
    try {
        // Check if the current page is accessible
        const response = await fetch(window.location.href, { method: 'HEAD' });
        if (response.ok) {
            statusElement.textContent = 'Online';
            statusElement.style.color = '#28a745';
        } else {
            statusElement.textContent = 'Offline';
            statusElement.style.color = '#dc3545';
        }
    } catch (error) {
        statusElement.textContent = 'Offline';
        statusElement.style.color = '#dc3545';
    }
}

// Function to detect connection type
function detectConnection() {
    const connectionElement = document.getElementById('connection-type');
    
    if (navigator.connection) {
        const connection = navigator.connection;
        const type = connection.effectiveType || connection.type || 'Unknown';
        const speed = connection.downlink ? `${connection.downlink} Mbps` : 'Unknown';
        connectionElement.textContent = `${type} (${speed})`;
    } else if (navigator.connection) {
        connectionElement.textContent = navigator.connection.type || 'Unknown';
    } else {
        connectionElement.textContent = 'Not supported';
    }
}

// Function to get browser and system information
function getSystemInfo() {
    // User Agent
    document.getElementById('user-agent').textContent = navigator.userAgent;
    
    // Platform
    document.getElementById('platform').textContent = navigator.platform;
    
    // Language
    document.getElementById('language').textContent = navigator.language;
    
    // Screen Resolution
    const resolution = `${screen.width} x ${screen.height}`;
    document.getElementById('screen-resolution').textContent = resolution;
}

// Function to get network interfaces (if available)
async function getNetworkInterfaces() {
    try {
        // This is a more advanced approach using WebRTC
        const rtc = new RTCPeerConnection({ iceServers: [] });
        const offer = await rtc.createOffer();
        await rtc.setLocalDescription(offer);
        
        rtc.onicecandidate = (event) => {
            if (event.candidate) {
                const candidate = event.candidate.candidate;
                if (candidate.includes('host')) {
                    const ipMatch = candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/);
                    if (ipMatch && !localIPAddresses.includes(ipMatch[0])) {
                        localIPAddresses.push(ipMatch[0]);
                        updateLocalIPDisplay();
                    }
                }
            }
        };
        
        setTimeout(() => {
            rtc.close();
        }, 2000);
    } catch (error) {
        console.error('Error getting network interfaces:', error);
    }
}

// Initialize network information when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get initial network information
    getLocalIPAddresses();
    getPublicIP();
    getSystemInfo();
    detectConnection();
    
    // Set up periodic refresh (every 30 seconds)
    setInterval(() => {
        getLocalIPAddresses();
        getPublicIP();
    }, 30000);
});

// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const subject = this.querySelectorAll('input[type="text"]')[1].value;
    const message = this.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', { name, email, subject, message });
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    this.reset();
});

// Add loading animation for network cards
function addLoadingAnimation(elementId) {
    const element = document.getElementById(elementId);
    element.style.opacity = '0.7';
    element.style.transition = 'opacity 0.3s ease';
}

function removeLoadingAnimation(elementId) {
    const element = document.getElementById(elementId);
    element.style.opacity = '1';
}

// Enhanced network detection with loading states
function enhancedRefreshLocalIP() {
    addLoadingAnimation('local-ip');
    refreshLocalIP();
    setTimeout(() => removeLoadingAnimation('local-ip'), 2000);
}

function enhancedRefreshPublicIP() {
    addLoadingAnimation('public-ip');
    refreshPublicIP();
    setTimeout(() => removeLoadingAnimation('public-ip'), 2000);
}

// Export functions for global access
window.refreshLocalIP = enhancedRefreshLocalIP;
window.refreshPublicIP = enhancedRefreshPublicIP;
window.checkServerStatus = checkServerStatus;
window.detectConnection = detectConnection; 