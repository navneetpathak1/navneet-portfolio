// Typewriter effect for hero section
class Typewriter {
  constructor(element, texts, options = {}) {
    this.element = element;
    this.texts = texts;
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.typingSpeed = options.typingSpeed || 100;
    this.deletingSpeed = options.deletingSpeed || 50;
    this.pauseTime = options.pauseTime || 2000;
    this.start();
  }

  type() {
    const currentText = this.texts[this.currentTextIndex];
    
    if (this.isDeleting) {
      // Delete character
      this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      // Type character
      this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }

    let speed = this.typingSpeed;
    if (this.isDeleting) {
      speed = this.deletingSpeed;
    }

    if (!this.isDeleting && this.currentCharIndex === currentText.length) {
      // Pause at end of typing
      speed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      // Move to next text
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
      speed = 500; // Pause before starting next text
    }

    setTimeout(() => this.type(), speed);
  }

  start() {
    this.type();
  }
}

// Initialize typewriter effect
const typewriterElement = document.getElementById('typewriter');
const roles = [
  'Full Stack Web Developer',
  'Backend Developer', 
  'Frontend Developer',
  'Competitive Programmer'
];

if (typewriterElement) {
  new Typewriter(typewriterElement, roles, {
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseTime: 2000
  });
}

// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.innerHTML = theme === 'dark' ? '🌙' : '☀️';
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
};
const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Mobile navigation handling
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navToggle.checked && !e.target.closest('.nav')) {
    navToggle.checked = false;
  }
});

// Close mobile menu when pressing Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navToggle.checked) {
    navToggle.checked = false;
  }
});

// Smooth scroll for nav links with mobile menu handling
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (navToggle.checked) {
        navToggle.checked = false;
      }
      
      // Smooth scroll to section
      const targetSection = document.querySelector(href);
      if (targetSection) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Scroll reveal animation with performance optimization
const revealOnScroll = () => {
  const trigger = window.innerHeight * 0.85;
  const reveals = document.querySelectorAll('.reveal');
  
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) {
      el.classList.add('active');
    }
  });
};

// Add .reveal class to sections and initialize scroll reveal
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.section').forEach(el => el.classList.add('reveal'));
  revealOnScroll();
});

// Throttled scroll event for better performance
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      revealOnScroll();
      ticking = false;
    });
    ticking = true;
  }
});

// Fetch latest GitHub repos for Projects section
async function fetchGitHubRepos() {
  const username = 'navneetpathak1';
  const projectsList = document.getElementById('projects-list');
  
  if (!projectsList) return;
  
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    const repos = await res.json();
    
    projectsList.innerHTML = '';
    repos.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'project-card reveal';
      card.innerHTML = `
        <div class="project-title">${repo.name}</div>
        <div class="project-desc">${repo.description ? repo.description : 'No description provided.'}</div>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn-outline" aria-label="View ${repo.name} on GitHub">GitHub</a>
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="btn-outline" aria-label="Live demo for ${repo.name}">Live Demo</a>` : ''}
        </div>
      `;
      projectsList.appendChild(card);
    });
    
    // Trigger reveal animation for new cards
    setTimeout(revealOnScroll, 100);
  } catch (err) {
    projectsList.innerHTML = '<p>Unable to load projects at this time.</p>';
  }
}

// Initialize GitHub repos fetch
fetchGitHubRepos();

// Resume download button (replace '#' with actual resume link if available)
const resumeBtn = document.getElementById('resume-btn');
if (resumeBtn) {
  resumeBtn.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      alert('Resume download will be available soon!');
    }
  });
}

// Handle window resize for responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Recalculate any dynamic measurements if needed
    revealOnScroll();
  }, 250);
}); 