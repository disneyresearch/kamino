/**
 * Navigation Module
 * Handles mobile navigation toggle and interactions
 */

export function initNavigation() {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');

  if (!navToggle || !navMenu) {
    console.warn('Navigation elements not found');
    return;
  }

  // Toggle menu on button click
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking a nav link
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMenu();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navToggle.contains(e.target) &&
        !navMenu.contains(e.target)) {
      toggleMenu();
    }
  });

  /**
   * Toggle navigation menu
   */
  function toggleMenu() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

    // Update ARIA attribute
    navToggle.setAttribute('aria-expanded', !isExpanded);

    // Toggle active class
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');

    // Prevent body scroll when menu is open (mobile)
    if (window.innerWidth <= 768) {
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
  }
}

/**
 * Optional: Add scroll-based header behavior
 */
export function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow when scrolled
    if (currentScroll > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Optional: Hide header when scrolling down, show when scrolling up
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      // Scrolling down
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });
}
