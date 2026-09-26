/**
 * SHOAIB HASSAN // PORTFOLIO SCRIPTS
 * Student & Cybersecurity Learner Portfolio:
 * - Particle Network Canvas
 * - Audio Feedback Synthesizer (Web Audio API)
 * - Dynamic Typewriter (Learner & Student Roles)
 * - Interactive Terminal Command Shell
 * - Project & Brand Dossiers with Savor of Baltistan Facebook Link
 * - Direct LinkedIn Photo Picker / Uploader with Local Storage Persistence
 * - Theme Switcher
 * - 3D Card Tilt Physics
 * - Verified Contact & Email Utility (shoaib.hassan520562@gmail.com)
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. AUDIO FEEDBACK SYNTHESIZER (Web Audio API)
     ========================================================================== */
  let audioCtx = null;
  let soundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq = 800, type = 'sine', duration = 0.08, gainVal = 0.04) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playSoftBlip() {
    playTone(850, 'sine', 0.05, 0.03);
  }

  function playTerminalKey() {
    playTone(550 + Math.random() * 250, 'triangle', 0.04, 0.015);
  }

  function playSuccessTone() {
    if (!soundEnabled || !audioCtx) return;
    playTone(520, 'sine', 0.08, 0.03);
    setTimeout(() => playTone(680, 'sine', 0.1, 0.03), 90);
    setTimeout(() => playTone(880, 'sine', 0.14, 0.04), 180);
  }

  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const soundLabel = soundToggle ? soundToggle.querySelector('.sound-label') : null;

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundToggle.classList.add('active');
        if (soundIcon) soundIcon.textContent = '🔊';
        if (soundLabel) soundLabel.textContent = 'SOUND ON';
        showToast('Sound feedback enabled');
        playSuccessTone();
      } else {
        soundToggle.classList.remove('active');
        if (soundIcon) soundIcon.textContent = '🔇';
        if (soundLabel) soundLabel.textContent = 'SOUND OFF';
        showToast('Sound muted');
      }
    });
  }

  /* ==========================================================================
     2. INTERACTIVE CANVAS (Particle Network)
     ========================================================================== */
  const canvas = document.getElementById('cyberCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 19000), 70);

    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    });

    function getThemeRgb() {
      const theme = document.body.getAttribute('data-theme') || 'cyan';
      if (theme === 'emerald') return '16, 185, 129';
      if (theme === 'violet') return '168, 85, 247';
      return '56, 189, 248'; // cyan default
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.size = Math.random() * 2 + 1;
        this.baseSize = this.size;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= Math.cos(angle) * force * 2;
            this.y -= Math.sin(angle) * force * 2;
            this.size = this.baseSize * 1.5;
          } else {
            this.size = this.baseSize;
          }
        }
      }

      draw() {
        const rgb = getThemeRgb();
        ctx.fillStyle = `rgba(${rgb}, 0.5)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    createParticles();

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);
      const rgb = getThemeRgb();

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.14;
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  /* ==========================================================================
     3. TYPEWRITER EFFECT (LEARNER / STUDENT THEME)
     ========================================================================== */
  const typewriterElem = document.getElementById('typewriterText');
  if (typewriterElem) {
    const roles = [
      'BSCS Undergraduate',
      'Cybersecurity Learner (Beginner)',
      'Learning Bug Bounty',
      'Founder @ Savor of Baltistan',
      'Content Creator',
      'SEO & Social Media Learner',
      'Web Security Basics'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 75;
    const deleteSpeed = 38;
    const holdTime = 2200;

    function handleTyping() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElem.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElem.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(handleTyping, holdTime);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(handleTyping, 400);
      } else {
        const nextSpeed = isDeleting ? deleteSpeed : typeSpeed;
        setTimeout(handleTyping, nextSpeed);
      }
    }
    setTimeout(handleTyping, 600);
  }

  /* ==========================================================================
     4. 3D CARD TILT EFFECT (Hero Visual)
     ========================================================================== */
  const tiltCard = document.getElementById('cyberCardTilt');
  if (tiltCard && window.innerWidth > 900) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  /* ==========================================================================
     5. LINKEDIN PROFILE PHOTO UPLOADER & LOCAL STORAGE PERSISTENCE
     ========================================================================== */
  const heroAvatarImg = document.getElementById('heroAvatarImg');
  const avatarUploadInput = document.getElementById('avatarUploadInput');
  const btnResetAvatar = document.getElementById('btnResetAvatar');
  const avatarDropZone = document.getElementById('avatarDropZone');

  function applyProfilePhoto(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgData = event.target.result;
      if (heroAvatarImg) {
        heroAvatarImg.src = imgData;
      }
      try {
        localStorage.setItem('shoaib-custom-avatar', imgData);
      } catch (err) {}
      playSuccessTone();
      showToast('LinkedIn Profile Picture Applied Successfully!');
    };
    reader.readAsDataURL(file);
  }

  // Check if user previously uploaded their LinkedIn photo
  try {
    const savedCustomAvatar = localStorage.getItem('shoaib-custom-avatar');
    if (savedCustomAvatar && heroAvatarImg) {
      heroAvatarImg.src = savedCustomAvatar;
    }
  } catch (e) {}

  if (avatarUploadInput) {
    avatarUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) applyProfilePhoto(file);
    });
  }

  // Drag and drop onto avatar frame
  if (avatarDropZone) {
    ['dragenter', 'dragover'].forEach((eventName) => {
      avatarDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        avatarDropZone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      avatarDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        avatarDropZone.classList.remove('drag-over');
      });
    });

    avatarDropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        applyProfilePhoto(dt.files[0]);
      }
    });
  }

  // Paste image directly from clipboard (Ctrl+V)
  window.addEventListener('paste', (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (clipboardData && clipboardData.items) {
      for (let i = 0; i < clipboardData.items.length; i++) {
        const item = clipboardData.items[i];
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            applyProfilePhoto(file);
            break;
          }
        }
      }
    }
  });

  if (btnResetAvatar && heroAvatarImg) {
    btnResetAvatar.addEventListener('click', () => {
      heroAvatarImg.src = 'assets/avatar.jpg';
      try {
        localStorage.removeItem('shoaib-custom-avatar');
      } catch (e) {}
      playSoftBlip();
      showToast('Avatar reset to default illustration');
    });
  }

  /* ==========================================================================
     5B. AVATAR SHAPE SELECTOR (Circle, Squircle, Hexagon, Natural)
     ========================================================================== */
  const shapeButtons = document.querySelectorAll('.shape-btn');
  const validShapes = ['circle', 'squircle', 'hexagon', 'natural'];

  function applyAvatarShape(shapeName, save = true) {
    if (!avatarDropZone || !validShapes.includes(shapeName)) return;

    validShapes.forEach((s) => avatarDropZone.classList.remove(`shape-${s}`));
    avatarDropZone.classList.add(`shape-${shapeName}`);

    shapeButtons.forEach((btn) => {
      if (btn.getAttribute('data-shape') === shapeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (save) {
      try {
        localStorage.setItem('shoaib-avatar-shape', shapeName);
      } catch (e) {}
    }
  }

  // Load saved avatar shape or default to circle
  try {
    const savedShape = localStorage.getItem('shoaib-avatar-shape') || 'circle';
    applyAvatarShape(savedShape, false);
  } catch (e) {
    applyAvatarShape('circle', false);
  }

  shapeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const shape = btn.getAttribute('data-shape');
      applyAvatarShape(shape, true);
      playSoftBlip();
      showToast(`Avatar Shape: ${shape.toUpperCase()}`);
    });
  });

  /* ==========================================================================
     6. THEME SWITCHER
     ========================================================================== */
  const themeDots = document.querySelectorAll('.theme-dot');
  themeDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const selectedColor = dot.getAttribute('data-color');
      document.body.setAttribute('data-theme', selectedColor);

      themeDots.forEach((d) => d.classList.remove('active'));
      dot.classList.add('active');

      playSoftBlip();
      showToast(`Theme: ${selectedColor.toUpperCase()}`);
      try {
        localStorage.setItem('shoaib-portfolio-theme', selectedColor);
      } catch (e) {}
    });
  });

  try {
    const savedTheme = localStorage.getItem('shoaib-portfolio-theme');
    if (savedTheme) {
      document.body.setAttribute('data-theme', savedTheme);
      themeDots.forEach((dot) => {
        if (dot.getAttribute('data-color') === savedTheme) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  } catch (e) {}

  /* ==========================================================================
     7. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentId = '';
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 140;
      const secHeight = sec.offsetHeight;
      if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     8. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
    playSoftBlip();
  }

  function closeMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener('click', closeMobileDrawer);
    }

    if (drawerOverlay) {
      drawerOverlay.addEventListener('click', closeMobileDrawer);
    }

    drawerLinks.forEach((link) => {
      link.addEventListener('click', closeMobileDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      }
    });
  }

  /* ==========================================================================
     9. PROJECT FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      playSoftBlip();

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     10. PROJECT & BRAND DOSSIER MODALS
     ========================================================================== */
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContentArea = document.getElementById('modalContentArea');
  const modalHudTitle = document.getElementById('modalHudTitle');

  const projectDossiers = {
    shilajeet: {
      title: 'Savor of Baltistan — Pure Himalayan Shilajit',
      category: 'BRAND VENTURE & HEALTH INITIATIVE',
      image: 'assets/shilajeet.jpg',
      tags: ['Savor of Baltistan', 'Pure Himalayan Shilajit', 'Natural Superfood', 'Facebook Page', 'Instagram', 'Content Creation'],
      overview: 'Founded by Shoaib Hassan, Savor of Baltistan is a natural wellness initiative bringing authentic Pure Himalayan Shilajit (Salajeet) directly from the alpine mountains of Gilgit-Baltistan to health enthusiasts. The brand is built through hands-on learning in e-commerce, content creation, and social media engagement.',
      keyFeatures: [
        'Direct Mountain Harvesting: Sourced from high-altitude cliffs in Gilgit-Baltistan.',
        '100% Pure Natural Resin: Traditional gold-grade Shilajit packed with natural fulvic acid and trace minerals.',
        'Facebook & Social Media Presence: Active updates and customer community on Facebook (https://www.facebook.com/savorofbaltistan/) and Instagram.',
        'Content Creation: Creating educational posts about authenticity testing, purity verification, and natural wellness.'
      ],
      codeSnippet: `/* Savor of Baltistan — Brand Details */
{
  "brand": "Savor of Baltistan",
  "product": "Pure Himalayan Shilajit",
  "origin": "Gilgit-Baltistan, Pakistan",
  "facebook": "https://www.facebook.com/savorofbaltistan/",
  "instagram": "@shoaibhassan_10",
  "founder": "Shoaib Hassan"
}`,
      actionText: 'VISIT ON FACEBOOK',
      actionUrl: 'https://www.facebook.com/savorofbaltistan/'
    },
    sniffer: {
      title: 'Basic Network Sniffer (Python Practice)',
      category: 'HANDS-ON LEARNING PROJECT',
      image: 'assets/sniffer.jpg',
      tags: ['Python Practice', 'Raw Sockets', 'Network Basics', 'CodeAlpha Task'],
      overview: 'A beginner learning project created during the CodeAlpha internship to understand how computer networks transmit data packets at a low level. Written in Python using raw sockets to capture and display IPv4, TCP, and UDP header information.',
      keyFeatures: [
        'Learning socket programming: Connecting directly to network interfaces to intercept incoming packet streams.',
        'Header parsing: Practicing binary unpacking of Ethernet frames and IP packet structures.',
        'Protocol identification: Distinguishing TCP, UDP, and ICMP packets for learning purposes.',
        'Basic hex output: Displaying raw payload bytes in terminal for inspection.'
      ],
      codeSnippet: `# Beginner Python socket exploration
import socket
import struct

# Create raw socket (Linux environment practice)
s = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_TCP)

while True:
    packet = s.recvfrom(65565)
    packet_data = packet[0]
    # Parse basic IP header (first 20 bytes)
    ip_header = packet_data[0:20]
    iph = struct.unpack('!BBHHHBBH4s4s', ip_header)
    print("Source IP:", socket.inet_ntoa(iph[8]))`,
      actionText: 'VIEW CODE ON GITHUB',
      actionUrl: 'https://github.com/shoaibhassan10/Basic-Network-Sniffer-Code-Python'
    },
    mobile: {
      title: 'Mobile Application Security Assessment',
      category: 'INTRODUCTORY AUDIT TASK',
      image: 'assets/mobile-sec.jpg',
      tags: ['OWASP Mobile Top 10', 'Android Basics', 'Learning Checklist', 'CodeAlpha'],
      overview: 'An introductory assessment completed as part of internship learning, reviewing common vulnerabilities in Android applications according to the OWASP Mobile Top 10 guidelines.',
      keyFeatures: [
        'Reviewing AndroidManifest.xml: Checking for improperly exported components and debugging flags.',
        'Insecure data storage basics: Learning how apps store sensitive tokens in local preferences or storage.',
        'Network traffic observation: Practicing proxy configuration with Burp Suite to monitor HTTP/HTTPS requests.',
        'Documenting recommendations: Summarizing basic security best practices for developers.'
      ],
      codeSnippet: `<!-- Learning checklist example: checking exported activity -->
<activity android:name=".MainActivity"
          android:exported="false"> <!-- Protected from external calls -->
</activity>`,
      actionText: 'VIEW REPOSITORY ON GITHUB',
      actionUrl: 'https://github.com/shoaibhassan10/Mobile-Application-Security-Assessment-CodeAlpha-Cyber-Security-'
    },
    phishing: {
      title: 'Phishing Awareness Training Module',
      category: 'EDUCATIONAL LEARNING PROJECT',
      image: 'assets/phishing.jpg',
      tags: ['Phishing Awareness', 'Email Security Basics', 'Digital Safety', 'CodeAlpha'],
      overview: 'An educational presentation and training outline developed to help peers and everyday users recognize deceptive emails, fake domain names, and social engineering tricks.',
      keyFeatures: [
        'Identifying fake sender addresses: Explaining how attackers impersonate legitimate domains.',
        'Inspecting suspicious links: Teaching how to hover over URLs and spot deceptive spellings.',
        'Urgency cues: Explaining how social engineering relies on artificial panic to trick users.',
        'Best practices: Promoting verification, two-factor authentication, and safe habits.'
      ],
      codeSnippet: `/* Educational safety guideline */
1. Always verify the actual email sender address, not just display name.
2. Check the destination URL carefully before clicking links.
3. When in doubt, contact the organization directly through official channels.`,
      actionText: 'VIEW ON GITHUB',
      actionUrl: 'https://github.com/shoaibhassan10/PHISHING-AWARENESS-TRAINING-'
    }
  };

  function openProjectModal(key) {
    const data = projectDossiers[key];
    if (!data) return;

    modalHudTitle.textContent = `DETAILS // [${data.category}]`;
    modalContentArea.innerHTML = `
      <div class="modal-media-banner">
        <img src="${data.image}" alt="${data.title}" loading="lazy">
      </div>
      <h3 class="modal-title">${data.title}</h3>
      <div class="modal-tags">
        ${data.tags.map((t) => `<span class="ptag">${t}</span>`).join('')}
      </div>

      <div class="modal-section-h">// OVERVIEW</div>
      <p class="modal-text">${data.overview}</p>

      <div class="modal-section-h">// KEY LEARNING POINTS</div>
      <ul class="timeline-list">
        ${data.keyFeatures.map((f) => `<li>${f}</li>`).join('')}
      </ul>

      <div class="modal-section-h">// CODE / NOTES SNAPSHOT</div>
      <pre class="modal-code-snippet"><code>${data.codeSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>

      <div class="modal-actions">
        <a href="${data.actionUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <span class="btn-scan"></span>
          <span>${data.actionText}</span>
          <span class="ext-icon">&nearr;</span>
        </a>
        <button class="btn btn-secondary" id="modalDismissBtn">CLOSE</button>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playSoftBlip();

    const dismissBtn = document.getElementById('modalDismissBtn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', closeProjectModal);
    }
  }

  function closeProjectModal() {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  }

  document.querySelectorAll('[data-project]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = trigger.getAttribute('data-project');
      openProjectModal(projKey);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  /* ==========================================================================
     11. INTERACTIVE COMMAND TERMINAL
     ========================================================================== */
  const terminalInput = document.getElementById('terminalInput');
  const terminalHistory = document.getElementById('terminalHistory');
  const terminalBody = document.getElementById('terminalBody');
  const shortcutBtns = document.querySelectorAll('.ts-btn');

  const commandHistory = [];
  let historyIndex = -1;

  const terminalCommands = {
    help: `Available Commands:
  • <span class="t-highlight">about</span>        - My story, studies, and what I am learning
  • <span class="t-highlight">brand</span>        - Details on Savor of Baltistan (Pure Himalayan Shilajit)
  • <span class="t-highlight">projects</span>     - Learning projects and repositories
  • <span class="t-highlight">skills</span>       - Tools and areas I am practicing
  • <span class="t-highlight">socials</span>      - Links to LinkedIn, Facebook, Instagram, and GitHub
  • <span class="t-highlight">contact</span>      - Email and contact coordinates
  • <span class="t-highlight">clear</span>        - Clear terminal screen`,

    about: `Shoaib Hassan is a Computer Science undergraduate (BSCS) and cybersecurity beginner based in Pakistan.
• Learning Journey: Actively learning bug bounty hunting, exploring web application security fundamentals, and studying ethical defense basics.
• Beginner Mindset: Not a veteran or specialist—actively learning step-by-step through coursework, hands-on tasks, and practical experimentation.
• Content Creator: Interested in digital storytelling, organic social media growth, and learning SEO.
• Founder: Creator of 'Savor of Baltistan', offering 100% Pure Himalayan Shilajit (<a href="https://www.facebook.com/savorofbaltistan/" target="_blank" style="color:var(--accent-primary);text-decoration:underline;">https://www.facebook.com/savorofbaltistan/</a>).`,

    brand: `🏔️ Savor of Baltistan — Pure Himalayan Shilajit:
• Founder: Shoaib Hassan
• Product: 100% Pure, traditional mineral resin from the mountains of Gilgit-Baltistan.
• Facebook Page: <a href="https://www.facebook.com/savorofbaltistan/" target="_blank" style="color:var(--accent-primary);text-decoration:underline;">https://www.facebook.com/savorofbaltistan/</a>
• Instagram: <a href="https://www.instagram.com/shoaibhassan_10" target="_blank" style="color:var(--accent-primary);">@shoaibhassan_10</a>
• Email: shoaib.hassan520562@gmail.com`,

    projects: `Learning Projects:
1. <span class="t-highlight">Savor of Baltistan</span> - Pure Himalayan Shilajit Brand & Facebook Page
   Facebook: <a href="https://www.facebook.com/savorofbaltistan/" target="_blank" style="color:var(--accent-primary);">https://www.facebook.com/savorofbaltistan/</a>
2. <a href="https://github.com/shoaibhassan10/Basic-Network-Sniffer-Code-Python" target="_blank" style="color:var(--accent-primary);text-decoration:underline;">Basic-Network-Sniffer-Code-Python</a>
   - A Python socket script for learning packet interception and header parsing.
3. <a href="https://github.com/shoaibhassan10/Mobile-Application-Security-Assessment-CodeAlpha-Cyber-Security-" target="_blank" style="color:var(--accent-primary);text-decoration:underline;">Mobile-Application-Security-Assessment</a>
   - An introductory vulnerability checklist guided by OWASP Mobile Top 10.
4. <a href="https://github.com/shoaibhassan10/PHISHING-AWARENESS-TRAINING-" target="_blank" style="color:var(--accent-primary);text-decoration:underline;">PHISHING-AWARENESS-TRAINING-</a>
   - Educational slides and guidance on avoiding phishing and social engineering.`,

    skills: `Learning Areas (Beginner & Exploring):
• Cybersecurity: Learning bug bounty hunting, web application security basics, phishing defense, vulnerability assessment concepts.
• Content & SEO: Content creation, social media growth (Facebook, Instagram), keyword SEO fundamentals.
• Programming: Python scripting, C++ coursework, HTML & CSS basics.
• Tools Practiced: Burp Suite, Wireshark, VS Code, Git/GitHub.`,

    socials: `Connect with Me:
• LinkedIn:  <a href="https://www.linkedin.com/in/shoaibhassan10/" target="_blank" style="color:var(--accent-primary);">https://www.linkedin.com/in/shoaibhassan10/</a>
• Facebook:  <a href="https://www.facebook.com/savorofbaltistan/" target="_blank" style="color:var(--accent-primary);">https://www.facebook.com/savorofbaltistan/</a>
• Instagram: <a href="https://www.instagram.com/shoaibhassan_10" target="_blank" style="color:var(--accent-primary);">https://www.instagram.com/shoaibhassan_10</a>
• GitHub:    <a href="https://github.com/shoaibhassan10" target="_blank" style="color:var(--accent-primary);">https://github.com/shoaibhassan10</a>`,

    contact: `Contact Coordinates:
• Email:    shoaib.hassan520562@gmail.com
• Location: Pakistan
• Open to student internships, learning collaborations, or questions about Savor of Baltistan!`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    playTerminalKey();
    commandHistory.push(rawCmd);
    historyIndex = commandHistory.length;

    const cmdRow = document.createElement('div');
    cmdRow.className = 't-cmd-line';
    cmdRow.innerHTML = `<span class="t-prompt">shoaib@student:~$</span> <span>${escapeHtml(rawCmd)}</span>`;
    terminalHistory.appendChild(cmdRow);

    if (cmd === 'clear') {
      terminalHistory.innerHTML = '';
      if (terminalInput) terminalInput.value = '';
      return;
    }

    const respDiv = document.createElement('div');
    respDiv.className = 't-response';

    if (terminalCommands[cmd]) {
      respDiv.innerHTML = terminalCommands[cmd];
    } else {
      respDiv.innerHTML = `<span style="color:#ef4444;">command not found: '${escapeHtml(cmd)}'. Type <span class="t-highlight">'help'</span> for available commands.</span>`;
    }

    terminalHistory.appendChild(respDiv);
    if (terminalInput) terminalInput.value = '';

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(terminalInput.value);
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
        }
      } else {
        playTerminalKey();
      }
    });
  }

  shortcutBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });

  /* ==========================================================================
     12. CONTACT FORM & ONE-CLICK EMAIL COPY
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const btnSubmitMessage = document.getElementById('btnSubmitMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('senderSubject').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      if (!name || !email || !subject || !message) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please fill out all required fields before sending.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please enter a valid email address.';
        return;
      }

      btnSubmitMessage.disabled = true;
      btnSubmitMessage.innerHTML = '<span>SENDING MESSAGE...</span>';

      setTimeout(() => {
        btnSubmitMessage.disabled = false;
        btnSubmitMessage.innerHTML = '<span class="btn-scan"></span><span class="btn-icon">🚀</span><span>SEND MESSAGE</span>';

        formStatus.className = 'form-status success';
        formStatus.textContent = '✅ Message sent! Shoaib will get back to you shortly.';
        showToast('Message sent successfully!');
        playSuccessTone();

        const mailtoUri = `mailto:shoaib.hassan520562@gmail.com?subject=${encodeURIComponent('[Portfolio Outreach] ' + subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
        
        contactForm.reset();

        setTimeout(() => {
          window.location.href = mailtoUri;
        }, 1200);
      }, 1200);
    });
  }

  // Copy Email Button
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const copyBtnText = document.getElementById('copyBtnText');

  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      const emailText = 'shoaib.hassan520562@gmail.com';
      navigator.clipboard.writeText(emailText).then(() => {
        if (copyBtnText) copyBtnText.textContent = 'COPIED!';
        showToast('Email address copied to clipboard');
        playSuccessTone();
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'COPY';
        }, 2500);
      }).catch(() => {
        showToast(`Contact email: ${emailText}`);
      });
    });
  }

  /* ==========================================================================
     13. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color:var(--accent-primary);">⚡</span><span>${escapeHtml(msg)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  setTimeout(() => {
    showToast('Welcome to Shoaib Hassan\'s Portfolio.');
  }, 900);
});
