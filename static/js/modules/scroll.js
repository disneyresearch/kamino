/**
 * Scroll Module
 * Handles scroll animations using Intersection Observer API
 */

export function initScrollAnimations() {
  // Setup Intersection Observer for fade-in animations
  setupFadeInObserver();

  // Setup smooth scroll for anchor links
  setupSmoothScroll();
}

/**
 * Fade-in animation on scroll using Intersection Observer
 */
function setupFadeInObserver() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters viewport
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optionally unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections that should fade in
  const fadeElements = document.querySelectorAll('.fade-in-section');
  fadeElements.forEach(element => {
    observer.observe(element);
  });

  // Also observe specific elements with data attribute
  const animatedElements = document.querySelectorAll('[data-animate]');
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Smooth scroll for anchor links
 */
function setupSmoothScroll() {
  // Handle all anchor links that start with #
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip if it's just '#' (empty anchor)
      if (href === '#') {
        return;
      }

      e.preventDefault();

      const targetId = href.substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        // Smooth scroll to target
        const headerOffset = 80; // Account for sticky header
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });
}

/**
 * Optional: Add parallax effect to specific elements
 */
export function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(element => {
      const speed = element.dataset.parallax || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}
