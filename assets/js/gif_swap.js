/**
 * GIF to static image swap functionality
 * Detects when the homepage GIF completes one animation loop and replaces it with a static image
 */
(function() {
  'use strict';

  // Constants
  const HOME_IMG_SELECTOR = '.home-img';
  const DEFAULT_GIF_DURATION = 11000; // GIF duration in ms (11 seconds)

  /**
   * Get static image path from GIF path
   * @param {string} gifPath - Path to the GIF image
   * @returns {string} Path to the static image
   */
  function getStaticImagePath(gifPath) {
    // Replace .gif with .webp
    return gifPath.replace(/\.gif$/i, '.webp');
  }

  /**
   * Preload the static image
   * @param {string} staticImagePath - Path to the static image
   * @returns {Promise<HTMLImageElement>} Promise that resolves with the preloaded image
   */
  function preloadStaticImage(staticImagePath) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = staticImagePath;
    });
  }

  /**
   * Detect GIF loop using a timer-based approach
   * This is simpler and more reliable than canvas-based detection
   * @param {HTMLImageElement} imgElement - The image element containing the GIF
   * @param {Function} onLoopDetected - Callback when loop is detected
   */
  function detectGifLoop(imgElement, onLoopDetected) {
    let timeoutId = null;

    // Use timer-based approach - wait for estimated GIF duration
    // This is more reliable and doesn't interfere with GIF playback
    const duration = DEFAULT_GIF_DURATION;
    timeoutId = setTimeout(() => {
      onLoopDetected();
    }, duration);

    // Return cleanup function
    return function cleanup() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  }

  /**
   * Swap GIF to static image
   * @param {HTMLImageElement} imgElement - The image element to swap
   * @param {string} staticImagePath - Path to static image
   */
  function swapToStaticImage(imgElement, staticImagePath) {
    if (imgElement && imgElement.src !== staticImagePath) {
      imgElement.src = staticImagePath;
    }
  }

  /**
   * Initialize GIF swap functionality
   */
  function initGifSwap() {
    const imgElement = document.querySelector(HOME_IMG_SELECTOR);
    
    if (!imgElement) {
      // Image element not found (not on homepage)
      return;
    }

    // Get the current image source (handle both src and currentSrc)
    const currentSrc = imgElement.currentSrc || imgElement.src;
    
    // Check if image is already the static image
    if (currentSrc.includes('.webp')) {
      return;
    }

    // Derive static image path from GIF path
    const staticImagePath = getStaticImagePath(currentSrc);

    // Preload static image
    preloadStaticImage(staticImagePath).catch(() => {
      // Silently fail if preload fails
    });

    let cleanup = null;

    /**
     * Handle when GIF loop is detected
     */
    function handleLoopDetected() {
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
      swapToStaticImage(imgElement, staticImagePath);
    }

    /**
     * Wait for image to load before starting detection
     */
    function startDetection() {
      // Wait for image to be fully loaded before starting timer
      function waitForImageReady() {
        if (imgElement.complete && imgElement.naturalWidth > 0 && imgElement.naturalHeight > 0) {
          // Image is loaded, start the detection timer
          // Wait a brief moment to ensure GIF has started playing
          setTimeout(() => {
            cleanup = detectGifLoop(imgElement, handleLoopDetected);
          }, 100);
        } else {
          // Image not ready yet, check again soon
          setTimeout(waitForImageReady, 50);
        }
      }

      // Check if image is already loaded
      if (imgElement.complete && imgElement.naturalWidth > 0 && imgElement.naturalHeight > 0) {
        waitForImageReady();
      } else {
        // Wait for image to load
        imgElement.addEventListener('load', function onLoad() {
          imgElement.removeEventListener('load', onLoad);
          waitForImageReady();
        }, { once: true });
        
        // Also add error handler
        imgElement.addEventListener('error', function onError() {
          // Silently handle error
        }, { once: true });
      }
    }

    startDetection();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGifSwap);
  } else {
    initGifSwap();
  }
})();

