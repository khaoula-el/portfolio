// CURSOR PERSONNALISÉ (avec détection de préférences d'accessibilité)
let cursor, cursorFollower;
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

// Vérifier si l'utilisateur préfère les animations réduites
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  cursor = document.createElement('div');
  cursorFollower = document.createElement('div');
  cursor.classList.add('cursor');
  cursorFollower.classList.add('cursor-follower');
  document.body.appendChild(cursor);
  document.body.appendChild(cursorFollower);
  document.body.classList.add('custom-cursor');

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX - 10 + 'px';
    cursor.style.top = mouseY - 10 + 'px';
  });

  // Animation du follower du curseur
  function animateCursor() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursorFollower.style.left = followerX - 20 + 'px';
    cursorFollower.style.top = followerY - 20 + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// Effets de hover sur les éléments interactifs (seulement si curseur personnalisé activé)
if (!prefersReducedMotion && cursor) {
  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(1.5)';
      cursorFollower.style.transform = 'scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursorFollower.style.transform = 'scale(1)';
    });
  });
}

// SCROLL REVEAL ANIMATION AVANCÉE (avec respect des préférences d'accessibilité)
const sections = document.querySelectorAll('section');
const cards = document.querySelectorAll('.card');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      if (prefersReducedMotion) {
        // Animation immédiate pour les utilisateurs qui préfèrent les animations réduites
        entry.target.classList.add('visible');
      } else {
        // Animation avec délai pour les autres utilisateurs
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
      }
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Animation des cartes avec délai (avec respect des préférences d'accessibilité)
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      if (prefersReducedMotion) {
        // Animation immédiate pour les utilisateurs qui préfèrent les animations réduites
        entry.target.style.animation = `fadeInScale 0.1s ease-out forwards`;
      } else {
        // Animation avec délai pour les autres utilisateurs
        setTimeout(() => {
          entry.target.style.animation = `fadeInScale 0.6s ease-out forwards`;
        }, index * 150);
      }
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => cardObserver.observe(card));

// SMOOTH SCROLL AVEC OFFSET
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = target.offsetTop - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

// EFFET DE TYPING POUR LE TITRE
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Appliquer l'effet de typing au titre principal
window.addEventListener('load', () => {
  const title = document.querySelector('.hero h1');
  const originalText = title.textContent;
  typeWriter(title, originalText, 80);
});

// PARALLAX EFFECT
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('header::before');
  
  parallaxElements.forEach(element => {
    const speed = 0.5;
    element.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// NAVIGATION ACTIVE
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// PARTICULES FLOTTANTES (seulement si animations activées)
function createParticles() {
  if (prefersReducedMotion) return; // Pas de particules si animations réduites
  
  const particleContainer = document.createElement('div');
  particleContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  `;
  document.body.appendChild(particleContainer);
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      animation: float ${3 + Math.random() * 4}s infinite ease-in-out;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 2}s;
    `;
    particleContainer.appendChild(particle);
  }
}

// Charger les particules après le chargement de la page
window.addEventListener('load', createParticles);

// PERFORMANCE: Lazy loading des images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

console.log("🚀 Portfolio moderne chargé avec succès !");

// FONCTIONS POUR LES MODALS DE PROJETS
function showProjectDetails(projectId) {
  const modal = document.getElementById(`modal-${projectId}`);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Empêcher le scroll de la page
  }
}

function closeProjectModal(projectId) {
  const modal = document.getElementById(`modal-${projectId}`);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Réactiver le scroll de la page
  }
}

// Fermer la modal en cliquant à l'extérieur
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('project-modal')) {
    e.target.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// Fermer la modal avec la touche Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.project-modal.active');
    modals.forEach(modal => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }
});
