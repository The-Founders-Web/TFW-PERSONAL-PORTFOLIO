// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initTheme();
  initScrollProgress();
  initAnimations();
});

// 1. PAGE LOADER PROGRESS
function initLoader() {
  const loader = document.querySelector('.loader');
  const progressBar = document.querySelector('.loader-progress');
  
  if (!loader || !progressBar) return;
  
  let progress = 0;
  const timer = setInterval(() => {
    // Generate organic progress steps
    progress += Math.floor(Math.random() * 12) + 4;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      
      // Animate loader fade out
      setTimeout(() => {
        loader.classList.add('loaded');
        document.body.style.overflowY = 'auto'; // Re-enable scroll
        
        // Trigger initial page entrance animations
        triggerEntranceAnimations();
      }, 400);
    }
    
    progressBar.style.width = progress + '%';
  }, 60);
}

// Entrance Animations for Hero
function triggerEntranceAnimations() {
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline();
    
    tl.fromTo('.logo-text', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    );
    
    tl.fromTo('.logo-sub', 
      { opacity: 0, letterSpacing: '0.1em' },
      { opacity: 1, letterSpacing: '0.3em', duration: 1, ease: 'power3.out' },
      '-=0.6'
    );
    
    tl.fromTo('.navigation-links li', 
      { y: 15, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
      '-=0.8'
    );
    

    tl.fromTo('.hero-main-title', 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' },
      '-=0.8'
    );
    
    tl.fromTo('.hero-image-wrapper', 
      { clipPath: 'inset(100% 0% 0% 0%)' }, 
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut' },
      '-=1.2'
    );
    
    tl.fromTo('.hero-description, .hero-cta-group', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' },
      '-=0.8'
    );
  }
}

// 2. CUSTOM CURSOR
function initCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');
  
  if (!cursor || !cursorDot) return;
  
  // Hide native cursor for desktop
  if (window.innerWidth > 1024) {
    document.body.style.cursor = 'none';
    
    document.addEventListener('mousemove', (e) => {
      // Smooth movement via GSAP
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: 'power3.out'
      });
      
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: 'power3.out'
      });
    });
    
    // Add hover states on interactive links
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .interactive, .theme-toggle-btn, .hobby-card');
    
    interactiveElements.forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
      });
      elem.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
      });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.display = 'none';
      cursorDot.style.display = 'none';
    });
    
    document.addEventListener('mouseenter', () => {
      cursor.style.display = 'block';
      cursorDot.style.display = 'block';
    });
  } else {
    // Hide custom cursor elements on mobile devices
    cursor.style.display = 'none';
    cursorDot.style.display = 'none';
  }
}

// 3. THEME TOGGLER (Light/Dark mode)
function initTheme() {
  const toggleBtn = document.querySelector('.theme-toggle-btn');
  if (!toggleBtn) return;
  
  // Get saved theme or system default
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleBtn.textContent = 'LIGHT MODE';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    toggleBtn.textContent = 'DARK MODE';
  }
  
  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = 'light';
    
    if (currentTheme === 'light') {
      newTheme = 'dark';
      toggleBtn.textContent = 'LIGHT MODE';
    } else {
      toggleBtn.textContent = 'DARK MODE';
    }
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    
    // Add a momentary flash animation on background to make theme switch premium
    gsap.fromTo('body', 
      { opacity: 0.8 }, 
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
  });
}

// 4. SCROLL PROGRESS
function initScrollProgress() {
  const scrollBar = document.querySelector('.scroll-progress-bar');
  if (!scrollBar) return;
  
  window.addEventListener('scroll', () => {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / documentHeight) * 100;
    scrollBar.style.width = progress + '%';
  });
}

// 5. GSAP SCROLL TRIGGERS & REVEALS
function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger CDNs failed to load. Falling back to default styles.');
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Parallax Scroll for Hero Image
  gsap.fromTo('.hero-image', 
    { y: '-10%' },
    {
      y: '10%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-image-wrapper',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );
  
  // General section titles reveal animation
  const sections = document.querySelectorAll('section');
  sections.forEach(sec => {
    const secNum = sec.querySelector('.section-number');
    const secTitle = sec.querySelector('.section-title');
    const secTag = sec.querySelector('.section-tagline');
    
    if (secTitle) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
      
      if (secNum) {
        tl.fromTo(secNum, 
          { opacity: 0, x: -20 }, 
          { opacity: 0.5, x: 0, duration: 0.8, ease: 'power2.out' }
        );
      }
      
      tl.fromTo(secTitle, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      );
      
      if (secTag) {
        tl.fromTo(secTag, 
          { opacity: 0, letterSpacing: '0.1em' }, 
          { opacity: 1, letterSpacing: '0.25em', duration: 0.8, ease: 'power2.out' },
          '-=0.4'
        );
      }
    }
  });

  // Reveal timeline cards in Education section
  gsap.fromTo('.education-card', 
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.education-layout',
        start: 'top 75%'
      }
    }
  );

  // Reveal hobby grid cards
  gsap.fromTo('.hobby-card', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.hobbies-grid',
        start: 'top 80%'
      }
    }
  );

  // Animate achievement list elements
  gsap.fromTo('.achievement-row', 
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.9,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.achievements-featured',
        start: 'top 80%'
      }
    }
  );

  // Animate Contact section layout
  gsap.fromTo('.contact-editorial > *', 
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-layout',
        start: 'top 80%'
      }
    }
  );
  
  gsap.fromTo('.contact-info-card', 
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-details-panel',
        start: 'top 85%'
      }
    }
  );
}


