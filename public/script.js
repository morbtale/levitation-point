// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});


// ===== Swiper Carousel for Testimonials =====
const testmonialSwiper = new Swiper('.testimonials-swiper', {
  loop: true,
  slidesPerView: 2,
  spaceBetween: 30,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 1,
      spaceBetween: 40,
    }
  }
});

// ===== Advanced Cursor Glow + Cursor-Driven Background =====
const cursorGlow = document.querySelector(".cursor-glow");
const root = document.documentElement;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let bgX = window.innerWidth / 2;
let bgY = window.innerHeight / 2;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const setPointerTargets = (x, y) => {
  mouseX = x;
  mouseY = y;
  cursorGlow.style.opacity = "0.6";
};

document.addEventListener("mousemove", (e) => {
  setPointerTargets(e.clientX, e.clientY);
});

document.addEventListener(
  "touchmove",
  (e) => {
    const touch = e.touches[0];
    if (touch) setPointerTargets(touch.clientX, touch.clientY);
  },
  { passive: true },
);

document.addEventListener("mouseleave", () => {
  cursorGlow.style.opacity = "0";
});

window.addEventListener("resize", () => {
  if (prefersReducedMotion) return;
  const halfW = window.innerWidth / 2;
  const halfH = window.innerHeight / 2;
  mouseX = halfW;
  mouseY = halfH;
});

function animateCursorBackground() {
  const cursorEase = prefersReducedMotion ? 1 : 0.064;
  const bgEase = prefersReducedMotion ? 1 : 0.045;

  cursorX += (mouseX - cursorX) * cursorEase;
  cursorY += (mouseY - cursorY) * cursorEase;
  bgX += (mouseX - bgX) * bgEase;
  bgY += (mouseY - bgY) * bgEase;

  cursorGlow.style.left = `${cursorX}px`;
  cursorGlow.style.top = `${cursorY}px`;

  root.style.setProperty("--cursor-x", `${cursorX}px`);
  root.style.setProperty("--cursor-y", `${cursorY}px`);
  root.style.setProperty("--cursor-x-soft", `${bgX}px`);
  root.style.setProperty("--cursor-y-soft", `${bgY}px`);

  requestAnimationFrame(animateCursorBackground);
}
animateCursorBackground();

// ===== About Snow (Cursor Reactive) =====
const aboutSection = document.querySelector("#about");
const aboutSnowLayer = document.querySelector(".about-snow");
const snowParticles = [];

if (aboutSection && aboutSnowLayer) {
  const totalSnow = prefersReducedMotion ? 8 : 24;

  for (let i = 0; i < totalSnow; i++) {
    const flake = document.createElement("span");
    flake.className = "snow-particle";

    const p = {
      el: flake,
      x: Math.random(),
      y: Math.random(),
      size: 2 + Math.random() * 4,
      speedY: 0.00025 + Math.random() * 0.0007,
      drift: (Math.random() - 0.5) * 0.0012,
      sway: Math.random() * Math.PI * 2,
      alpha: 0.15 + Math.random() * 0.55,
    };

    flake.style.setProperty("--size", `${p.size}px`);
    flake.style.setProperty("--alpha", p.alpha.toFixed(2));
    aboutSnowLayer.appendChild(flake);
    snowParticles.push(p);
  }

  const aboutCursor = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    inside: false,
  };

  aboutSection.addEventListener("mousemove", (e) => {
    const rect = aboutSection.getBoundingClientRect();
    aboutCursor.x = e.clientX - rect.left;
    aboutCursor.y = e.clientY - rect.top;
    aboutCursor.inside = true;
  });

  aboutSection.addEventListener("mouseleave", () => {
    aboutCursor.inside = false;
  });

  const animateSnow = () => {
    const rect = aboutSection.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);

    snowParticles.forEach((p, i) => {
      p.y += p.speedY;
      p.x += p.drift + Math.sin(performance.now() * 0.0012 + p.sway) * 0.00035;

      if (p.y > 1.05) {
        p.y = -0.05;
        p.x = Math.random();
      }
      if (p.x > 1.05) p.x = -0.05;
      if (p.x < -0.05) p.x = 1.05;

      let cursorOffsetX = 0;
      let cursorOffsetY = 0;
      if (aboutCursor.inside) {
        const cx = aboutCursor.x / width - 0.5;
        const cy = aboutCursor.y / height - 0.5;
        cursorOffsetX = cx * 26 * (0.4 + (i % 8) / 10);
        cursorOffsetY = cy * 12 * (0.4 + (i % 6) / 10);
      }

      const xPx = p.x * width + cursorOffsetX;
      const yPx = p.y * height + cursorOffsetY;
      // Use transform for GPU acceleration
      p.el.style.transform = `translate(${xPx}px, ${yPx}px)`;
    });

    requestAnimationFrame(animateSnow);
  };

  animateSnow();
}

// ===== Glass Card Shine Effect Enhancement =====
const shineCards = document.querySelectorAll(".shine-hover");

shineCards.forEach((card) => {
  card.addEventListener("mouseenter", function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.style.setProperty("--mouse-x", `${x}px`);
    this.style.setProperty("--mouse-y", `${y}px`);
  });
});

// ===== Navbar Scroll Effect =====
const nav = document.querySelector(".nav");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    nav.style.background = "rgba(10, 10, 15, 0.95)";
    nav.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
  } else {
    nav.style.background = "rgba(10, 10, 15, 0.8)";
    nav.style.boxShadow = "none";
  }

  lastScroll = currentScroll;
});

// ===== Sidebar Scroll Visibility =====
let lastScrollY = 0;

if (sidebar) {
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;

    // Hide sidebar when scrolling down past 200px
    if (currentScrollY > 70 && isScrollingDown) {
      sidebar.classList.add('sidebar-hidden');
    } 
    // Show sidebar when scrolling up
    else if (currentScrollY < lastScrollY) {
      sidebar.classList.remove('sidebar-hidden');
    }
    // Show sidebar near top
    else if (currentScrollY <= 200) {
      sidebar.classList.remove('sidebar-hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

// ===== Intersection Observer for Scroll Animations =====
const observerOptions = {
  threshold: 0.12,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all sections and cards
document
  .querySelectorAll(".section, .bento-card, .skill-card, .work-card")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
    observer.observe(el);
  });

// ===== Enhanced Glassmorphism on Scroll =====
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const cards = document.querySelectorAll(".glass-card");

  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      const scrollProgress =
        (window.innerHeight - rect.top) / window.innerHeight;
      const blur = 52 + scrollProgress * 10;
      card.style.backdropFilter = `blur(${blur}px)`;
    }
  });
});

// ===== Particle Effect on Hero (Optional Enhancement) =====
const hero = document.querySelector(".hero");
const particleCount = 30;

for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(76, 154, 255, 0.5);
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: float ${5 + Math.random() * 10}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
    `;
  hero.appendChild(particle);
}

// Add particle animation CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        50% {
            transform: translateY(-100px) translateX(${Math.random() * 100 - 50}px);
        }
    }
`;
document.head.appendChild(style);

// ===== Skill Bar Animation on Scroll =====
const skillBars = document.querySelectorAll(".skill-bar");
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fillBar 1.5s ease-out forwards";
      }
    });
  },
  { threshold: 0.2 },
);

skillBars.forEach((bar) => {
  bar.style.width = "0";
  skillObserver.observe(bar);
});

// ===== Active Navigation Highlighting =====
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

// ===== Enhanced Shine Effect with Mouse Position =====
document.querySelectorAll(".shine-hover").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--shine-x", `${x}%`);
    card.style.setProperty("--shine-y", `${y}%`);
  });
});

// ===== Preload Animation =====
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// ===== Performance Optimization: Debounce Scroll Events =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll handlers
const navbar = document.getElementById("navbar");
const logoContainer = document.getElementById("logo-container");
let scrollDirection = "up";

window.addEventListener(
  "scroll",
  debounce(() => {
    const scrollY = window.scrollY;
    
    // Determine scroll direction
    if (scrollY > lastScrollY) {
      scrollDirection = "down";
    } else {
      scrollDirection = "up";
    }

    if (logoContainer) {
      // Logo follows navbar animation - hide/show together
      if (scrollY > 150) {
        // Hide logo with navbar
        logoContainer.style.opacity = "0";
        logoContainer.style.visibility = "hidden";
        logoContainer.style.transform = "translateX(-50%) translateY(-100%)";
        logoContainer.style.pointerEvents = "none";
      } else {
        // Show logo with navbar
        logoContainer.style.opacity = "1";
        logoContainer.style.visibility = "visible";
        logoContainer.style.transform = "translateX(-50%) translateY(0)";
        logoContainer.style.pointerEvents = "auto";
      }
    }

    // Navbar disappear on scroll down
    if (scrollY > 150) {
      // Hide navbar and elements
      navbar.style.opacity = "0";
      navbar.style.visibility = "hidden";
      navbar.style.transform = "translateY(-100%)";
    } else {
      // Show navbar
      navbar.style.opacity = "1";
      navbar.style.visibility = "visible";
      navbar.style.transform = "translateY(0)";
    }

    // Sidebar hide/show based on scroll direction with smooth transitions
    if (scrollY > 200) {
      if (scrollDirection === "down") {
        sidebar.style.opacity = "0";
        sidebar.style.transform = "translateX(-130%)";
        sidebar.style.pointerEvents = "none";
      } else {
        sidebar.style.opacity = "1";
        sidebar.style.transform = "translateX(0)";
        sidebar.style.pointerEvents = "auto";
      }
    } else {
      // Always show sidebar at top
      sidebar.style.opacity = "1";
      sidebar.style.transform = "translateX(0)";
      sidebar.style.pointerEvents = "auto";
    }

    lastScrollY = scrollY;
  }, 50),
);

console.log("🚀 Portfolio loaded successfully!");
console.log(
  "✨ Features: Glassmorphism, Smooth Scroll, Cursor Glow, Bento Grid",
);


function updateLocalTime() {
    const now = new Date();

    // Format: Selasa, 17 Februari 2026 03:55:12
    const formatted = now.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

    // Update desktop time (with LOCAL text)
    const desktopTime = document.getElementById("local-time");
    if (desktopTime) {
      desktopTime.textContent = formatted;
    }

    // Update mobile time (without LOCAL text)
    const mobileTime = document.getElementById("local-time-mobile");
    if (mobileTime) {
      mobileTime.textContent = formatted;
    }
  }

  // Jalankan langsung + update tiap detik
  updateLocalTime();
  setInterval(updateLocalTime, 1000);

// ===== Social Media =====
// Morbtale's Social Media Links
// var morbtaleSocialLinks = {
//   instagram: "https://instagram.com/morbtale",
//   discord: "https://discord.com/users/551099210607493140",
//   x: "https://x.com/morbtale",
// };  

var instagram = "https://instagram.com/morbtale";
var discord = "https://discord.com/users/551099210607493140";
var x = "https://x.com/morbtale";

function setSocialMediaLinks() {
  // Update all Instagram links
  document.querySelectorAll('#instagram-morbtale').forEach(link => {
    link.setAttribute('href', instagram);
    link.textContent = 'instagram';
  });

  // Update all Discord links
  document.querySelectorAll('#discord-morbtale').forEach(link => {
    link.setAttribute('href', discord);
    link.textContent = 'discord';
  });

  // Update all X links
  document.querySelectorAll('#x-morbtale').forEach(link => {
    link.setAttribute('href', x);
    link.textContent = 'X';
  });
}

// Set links when DOM is ready
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', setSocialMediaLinks);
} else {
  setSocialMediaLinks();
}



// ===== Autotype Effect for Hero Section =====
function initAutoTypeEffect() {
  const textElement = document.getElementById('typing-effect');
  
  if (!textElement) return;
  
  const words = ['Experience', 'Identity', 'Strategy', 'Mastery', 'Proficiency'];
  const typingSpeed = 80; // milliseconds per character
  const deletingSpeed = 50; // milliseconds per character when deleting
  const delayBetweenWords = 2000; // delay before starting to delete
  const delayBeforeStart = 300; // delay before first word types
  
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Delete character
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      
      if (charIndex === 0) {
        textElement.classList.add('empty');
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
      } else {
        setTimeout(type, deletingSpeed);
      }
    } else {
      // Type character
      textElement.classList.remove('empty');
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, delayBetweenWords);
      } else {
        setTimeout(type, typingSpeed);
      }
    }
  }
  
  // Start typing after delay
  setTimeout(type, delayBeforeStart);
}

// Initialize autotype effect when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAutoTypeEffect);
} else {
  initAutoTypeEffect();
}

// ===== Glide Carousel for Featured Projects =====
function initGlideCarousel() {
  const glideElement = document.querySelector('.glide');
  
  if (!glideElement) return;
  
  const glide = new Glide('.glide', {
    type: 'carousel',
    startAt: 0,
    perView: 3,
    focusAt: 'center',
    gap: 2,
    autoplay: 2000000,
    hoverpause: true,
    dragThreshold: 120,
    animationDuration: 250,
    breakpoints: {
      1024: {
        perView: 2,
        gap: 2,
        dragThreshold: 120,
        animationDuration: 250,
      },
      768: {
        perView: 2,
        gap: 2,
        dragThreshold: 120,
        animationDuration: 250,
      },
    },
  });
  
  glide.mount();
}



// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlideCarousel);
} else {
  initGlideCarousel();
}


// ===== Video & Iframe Lazy Loading with Intersection Observer =====
function initLazyMediaLoading() {
  const lazyVideos = document.querySelectorAll('.lazy-video');
  const lazyIframes = document.querySelectorAll('.lazy-iframe');
  
  // Create Intersection Observer for videos
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const src = video.getAttribute('data-src');
        
        if (src && !video.src) {
          video.src = src;
          video.autoplay = true;
          video.play().catch(error => {
            console.warn('Video autoplay failed:', error);
          });
        }
        
        videoObserver.unobserve(video);
      }
    });
  }, {
    rootMargin: '50px', // Start loading 50px before entering viewport
    threshold: 0.01 // Trigger when 1% of the element is visible
  });
  
  // Create Intersection Observer for iframes
  const iframeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        const src = iframe.getAttribute('data-src');
        
        if (src && !iframe.src) {
          iframe.src = src;
        }
        
        iframeObserver.unobserve(iframe);
      }
    });
  }, {
    rootMargin: '50px', // Start loading 50px before entering viewport
    threshold: 0.01 // Trigger when 1% of the element is visible
  });
  
  // Observe all lazy videos
  lazyVideos.forEach(video => {
    videoObserver.observe(video);
  });
  
  // Observe all lazy iframes
  lazyIframes.forEach(iframe => {
    iframeObserver.observe(iframe);
  });
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyMediaLoading);
} else {
  initLazyMediaLoading();
}
