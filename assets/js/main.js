/**
 * Soham Patil - Portfolio Main JavaScript
 * Handles Theme toggling (Day/Night mode), Typewriter effect, Developer CLI terminal,
 * Architecture modal, and interactive UX.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypewriter();
  initNavigation();
  initTerminal();
  initModals();
  initContactForm();
  initClipboardButtons();

  // Initialize Lucide icons if available (with fallback safety)
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      window.lucide.createIcons();
    } catch (e) {
      console.warn('Lucide icon initialization note:', e);
    }
  }
});

/* ==========================================================================
   1. THEME SWITCHER (Day Mode / Night Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('theme-preference');

  // If user stored 'light', remove 'dark' class. Default is dark mode.
  if (storedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }

  updateThemeIcons();

  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme-preference', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme-preference', 'dark');
      }
      updateThemeIcons();
    });
  });
}

function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  const sunIcons = document.querySelectorAll('.theme-sun-icon');
  const moonIcons = document.querySelectorAll('.theme-moon-icon');

  // Sun icon is visible in Day mode (clicking switches to Dark)
  // Moon icon is visible in Dark mode (clicking switches to Light)
  sunIcons.forEach(icon => {
    icon.classList.toggle('hidden', isDark);
  });
  moonIcons.forEach(icon => {
    icon.classList.toggle('hidden', !isDark);
  });
}

/* ==========================================================================
   2. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const roles = [
    'Full-Stack Java Engineer',
    'Spring Boot & Microservices Builder',
    'Creator of GenBank Banking Platform',
    '100+ Days LeetCode Consistency Achiever',
    'B.E. Computer Engineering @ SPPU (8.23 CGPA)'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 75;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 350; // Pause before typing next string
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. NAVIGATION & SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Scroll spy to highlight active link
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-indigo-600', 'dark:text-indigo-400', 'font-semibold');
          } else {
            link.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'font-semibold');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE TERMINAL (Easter Egg & Dev CLI)
   ========================================================================== */
function initTerminal() {
  const openTerminalBtns = document.querySelectorAll('.open-terminal-btn');
  const closeTerminalBtn = document.getElementById('close-terminal-btn');
  const terminalModal = document.getElementById('terminal-modal');
  const terminalInput = document.getElementById('terminal-command-input');
  const terminalOutput = document.getElementById('terminal-output');

  if (!terminalModal || !terminalInput || !terminalOutput) return;

  openTerminalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      terminalModal.classList.add('active');
      terminalInput.focus();
    });
  });

  if (closeTerminalBtn) {
    closeTerminalBtn.addEventListener('click', () => {
      terminalModal.classList.remove('active');
    });
  }

  // Close modal when clicking outside
  terminalModal.addEventListener('click', (e) => {
    if (e.target === terminalModal) {
      terminalModal.classList.remove('active');
    }
  });

  // Handle command submissions
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';
      executeCommand(command);
    }
  });

  function executeCommand(cmd) {
    // Print input line
    const inputLine = document.createElement('div');
    inputLine.className = 'flex items-center space-x-2 text-zinc-400 mt-2 mb-1';
    inputLine.innerHTML = `<span class="text-emerald-400 font-bold">soham@terminal:~$</span> <span class="text-white">${escapeHtml(cmd)}</span>`;
    terminalOutput.appendChild(inputLine);

    const response = document.createElement('div');
    response.className = 'text-zinc-300 pl-4 mb-3 leading-relaxed';

    switch (cmd) {
      case 'help':
        response.innerHTML = `
          <div class="space-y-1 text-sm">
            <p class="text-indigo-400 font-bold">Available Commands:</p>
            <p><span class="text-yellow-400 w-24 inline-block font-mono">about</span> - Brief summary of Soham Patil</p>
            <p><span class="text-yellow-400 w-24 inline-block font-mono">projects</span> - View GenBank banking platform & architecture</p>
            <p><span class="text-yellow-400 w-24 inline-block font-mono">skills</span> - Display technical competency taxonomy</p>
            <p><span class="text-yellow-400 w-24 inline-block font-mono">leetcode</span> - Fetch LeetCode problem solving & badge metrics</p>
            <p><span class="text-yellow-400 w-24 inline-block font-mono">hackerrank</span> - View HackerRank stars & achievements</p>
            <p><span class="text-yellow-400 w-24 inline-block font-mono">education</span> - Academic background & CGPA</p>
            <p><span class="text-yellow-400 w-24 inline-block font-mono">resume</span> - Download official PDF resume</p>
            <p><span class="text-yellow-400 w-24 inline-block font-mono">contact</span> - Contact channels (Email, Phone, LinkedIn)</p>
            <p><span class="text-yellow-400 w-24 inline-block font-mono">sudo hire</span> - The easiest decision you'll make today 🚀</p>
            <p><span class="text-yellow-400 w-24 inline-block font-mono">clear</span> - Clear terminal window</p>
            <p><span class="text-yellow-400 w-24 inline-block font-mono">exit</span> - Close terminal</p>
          </div>
        `;
        break;

      case 'about':
        response.innerHTML = `
          <p class="text-sm">
            <span class="text-indigo-400 font-semibold">Soham Patil</span> is a final-year Computer Engineering student at Dr. D. Y. Patil College of Engineering & Innovation (SPPU), Pune. Strongest in Core Java, Spring Boot, and Data Structures & Algorithms, he specializes in building robust, production-grade backends with high concurrency guarantees and clean architecture.
          </p>
        `;
        break;

      case 'projects':
        response.innerHTML = `
          <div class="space-y-2 text-sm">
            <div>
              <p class="text-emerald-400 font-bold">⚡ GenBank: Core Banking & NetBanking Platform</p>
              <p class="text-zinc-400">Stack: Java 21, Spring Boot 4, MySQL, Python FastAPI, Spring Security, JUnit 5, Mockito</p>
              <p class="text-zinc-400">Highlights: Double-entry bookkeeping, Optimistic locking (@Version), Decoupled OTP microservice, RBAC security, 23+ unit test suites.</p>
              <a href="https://github.com/patilsoham189-cpu/GenBank" target="_blank" class="text-indigo-400 underline hover:text-indigo-300">github.com/patilsoham189-cpu/GenBank</a>
            </div>
          </div>
        `;
        break;

      case 'skills':
        response.innerHTML = `
          <pre class="text-xs text-indigo-300 font-mono">
├── Languages: Java 21 (OOP, Streams, Concurrency), Python, JavaScript, SQL, HTML5, CSS3
├── Backend: Spring Boot, Spring Security, JPA/Hibernate, RESTful APIs, Python FastAPI
├── Databases: MySQL (Complex Indexing, Normalization, ACID Transactions, Optimistic Locking)
├── Testing & Tools: JUnit 5, Mockito, Git, GitHub, Maven, Postman
└── CS Fundamentals: Data Structures & Algorithms, Object-Oriented Design, DBMS
          </pre>
        `;
        break;

      case 'leetcode':
        response.innerHTML = `
          <div class="text-sm space-y-1">
            <p><span class="text-amber-400 font-bold">Handle:</span> @Soham416 (Rank: 2,638,551)</p>
            <p><span class="text-emerald-400 font-bold">Problems Solved:</span> 55+ (Easy: 46 | Medium: 8 | Hard: 1)</p>
            <p><span class="text-indigo-400 font-bold">Consistency:</span> 81-Day Maximum Streak | 118 Active Days | 174 Submissions</p>
            <p><span class="text-amber-300 font-bold">Badges Awarded:</span> 100 Days Badge 2026, 50 Days Badge 2026</p>
            <a href="https://leetcode.com/u/Soham416/" target="_blank" class="text-indigo-400 underline">leetcode.com/u/Soham416/</a>
          </div>
        `;
        break;

      case 'hackerrank':
        response.innerHTML = `
          <div class="text-sm space-y-1">
            <p><span class="text-amber-400 font-bold">Handle:</span> @patilsoham189</p>
            <p><span class="text-emerald-400 font-bold">Badges:</span> ⭐⭐⭐ Java 3-Star Badge | ⭐ Python 1-Star Badge</p>
            <a href="https://hackerrank.com/profile/patilsoham189" target="_blank" class="text-indigo-400 underline">hackerrank.com/profile/patilsoham189</a>
          </div>
        `;
        break;

      case 'education':
        response.innerHTML = `
          <div class="text-sm space-y-1">
            <p class="text-indigo-400 font-bold">🎓 Dr. D. Y. Patil College of Engineering & Innovation (SPPU), Pune</p>
            <p>Bachelor of Engineering (B.E.) in Computer Engineering (2023 – 2027)</p>
            <p><span class="text-emerald-400 font-semibold">Current CGPA:</span> 8.23 / 10.0</p>
            <p class="text-zinc-400">12th Grade (HSC): 78.00% (Completed 2023) | 10th Grade (SSC): 94.80% (Completed 2021)</p>
          </div>
        `;
        break;

      case 'resume':
        response.innerHTML = `<p class="text-emerald-400">Opening resume in a new tab...</p>`;
        window.open('assets/docs/Soham_Patil_Resume.pdf', '_blank');
        break;

      case 'contact':
        response.innerHTML = `
          <div class="text-sm space-y-1">
            <p>📧 Email: <a href="mailto:patilsoham189@gmail.com" class="text-indigo-400 underline">patilsoham189@gmail.com</a></p>
            <p>📞 Phone: +91 7823060566</p>
            <p>🌐 LinkedIn: <a href="https://linkedin.com/in/soham-patil-cs" target="_blank" class="text-indigo-400 underline">linkedin.com/in/soham-patil-cs</a></p>
            <p>💻 GitHub: <a href="https://github.com/patilsoham189-cpu" target="_blank" class="text-indigo-400 underline">github.com/patilsoham189-cpu</a></p>
            <p>📍 Location: Pune, Maharashtra, India (Open to Remote / Relocation)</p>
          </div>
        `;
        break;

      case 'sudo hire':
      case 'sudo hire-soham':
        response.innerHTML = `
          <div class="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-sm space-y-2">
            <p class="text-emerald-300 font-bold text-base">🎉 ACCESS GRANTED: Offer Letter Initialized!</p>
            <p class="text-emerald-200">You've unlocked an enthusiastic, proactive Java Full-Stack Engineer with proven algorithmic discipline, 100+ days continuous problem-solving streak, and real Spring Boot banking architecture experience.</p>
            <p class="text-white">Let's connect immediately:</p>
            <div class="flex items-center space-x-3 pt-1">
              <a href="mailto:patilsoham189@gmail.com?subject=Interview%20Invitation%20for%20Soham%20Patil" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold">Email Soham Now</a>
              <a href="tel:+917823060566" class="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs">+91 7823060566</a>
            </div>
          </div>
        `;
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        return;

      case 'exit':
      case 'close':
      case 'quit':
        terminalModal.classList.remove('active');
        return;

      case '':
        break;

      default:
        response.innerHTML = `<p class="text-rose-400 text-sm">Command not recognized: "${escapeHtml(cmd)}". Type <span class="text-yellow-400 font-mono font-bold">help</span> to list available commands.</p>`;
        break;
    }

    terminalOutput.appendChild(response);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
}

/* ==========================================================================
   5. MODALS (Architecture & Details Viewer)
   ========================================================================== */
function initModals() {
  const openArchModalBtns = document.querySelectorAll('.open-genbank-arch-btn');
  const archModal = document.getElementById('genbank-arch-modal');
  const closeArchModalBtn = document.getElementById('close-arch-modal-btn');

  openArchModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (archModal) archModal.classList.add('active');
    });
  });

  if (closeArchModalBtn && archModal) {
    closeArchModalBtn.addEventListener('click', () => {
      archModal.classList.remove('active');
    });
  }

  if (archModal) {
    archModal.addEventListener('click', (e) => {
      if (e.target === archModal) {
        archModal.classList.remove('active');
      }
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.modal-overlay.active');
      activeModals.forEach(m => m.classList.remove('active'));
    }
  });
}

/* ==========================================================================
   6. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value || '';
    const email = document.getElementById('contact-email')?.value || '';
    const subject = document.getElementById('contact-subject')?.value || 'Inquiry from Portfolio';
    const message = document.getElementById('contact-message')?.value || '';

    // Create mailto link for direct sending
    const bodyContent = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
    const mailtoUrl = `mailto:patilsoham189@gmail.com?subject=${encodeURIComponent(subject)}&body=${bodyContent}`;

    window.location.href = mailtoUrl;

    showToast('🚀 Opening your email client to send your message to Soham!');
    form.reset();
  });
}

/* ==========================================================================
   7. CLIPBOARD & TOAST HELPERS
   ========================================================================== */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied: ${textToCopy}`);
        }).catch(() => {
          fallbackCopyText(textToCopy);
        });
      } else {
        fallbackCopyText(textToCopy);
      }
    });
  });
}

function fallbackCopyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showToast(`Copied: ${text}`);
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}
