/**
 * Video Module
 * Handles video lazy loading and enhanced controls
 */

export function initVideoControls() {
  const videos = document.querySelectorAll('video');

  videos.forEach(video => {
    // Setup lazy loading for videos
    setupLazyLoading(video);

    // Add play/pause on click for better UX
    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });
}

/**
 * Lazy load videos using Intersection Observer
 */
function setupLazyLoading(video) {
  // Check if video source needs loading
  const source = video.querySelector('source');

  // Only lazy load if we have a data-src attribute
  if (source && source.dataset.src) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadVideo(video);
          videoObserver.unobserve(video);
        }
      });
    }, {
      rootMargin: '50px' // Start loading slightly before entering viewport
    });

    videoObserver.observe(video);
  }
}

/**
 * Load video source
 */
function loadVideo(video) {
  const sources = video.querySelectorAll('source[data-src]');

  sources.forEach(source => {
    source.src = source.dataset.src;
    source.removeAttribute('data-src');
  });

  video.load();

  // Add loaded class for styling
  video.classList.add('loaded');
}

/**
 * Pause all other videos when one starts playing
 */
function pauseOtherVideos(currentVideo) {
  const allVideos = document.querySelectorAll('video');

  allVideos.forEach(video => {
    if (video !== currentVideo && !video.paused) {
      video.pause();
    }
  });
}

/**
 * Optional: Add custom video controls overlay
 */
export function addCustomControls() {
  const videos = document.querySelectorAll('video[data-custom-controls]');

  videos.forEach(video => {
    const container = video.parentElement;

    // Create play button overlay
    const playButton = document.createElement('button');
    playButton.className = 'video-play-button';
    playButton.innerHTML = '▶';
    playButton.setAttribute('aria-label', 'Play video');

    container.style.position = 'relative';
    container.appendChild(playButton);

    // Toggle play/pause
    playButton.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playButton.style.display = 'none';
      } else {
        video.pause();
        playButton.style.display = 'block';
      }
    });

    // Show button when video pauses
    video.addEventListener('pause', () => {
      playButton.style.display = 'block';
    });

    // Hide button when video plays
    video.addEventListener('play', () => {
      playButton.style.display = 'none';
    });

    // Show button when video ends
    video.addEventListener('ended', () => {
      playButton.style.display = 'block';
    });
  });
}
