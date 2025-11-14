/**
 * Video handler for homepage animation
 * Loads and plays MP4 videos based on theme (light/dark mode)
 * Video plays once and stops on the last frame
 */
(function() {
  'use strict';

  // Constants
  const HOME_VIDEO_SELECTOR = '.home-img';
  const THEME_STORAGE_KEY = 'theme';
  const THEME_ATTRIBUTE = 'a';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';
  const THEME_WAVE = 'wave';
  const VIDEO_BASE_PATH = '/assets/images/homepage/';
  const VIDEO_LIGHT = 'me-light.mp4';
  const VIDEO_DARK = 'me-dark.mp4';
  const VIDEO_WAVE = 'me-wave.mp4';

  /**
   * Get the current theme from body attribute or localStorage or return default
   * @returns {string} Current theme ('light', 'dark', or 'wave')
   */
  function getCurrentTheme() {
    // Check body attribute first (most reliable)
    if (document.body && document.body.getAttribute(THEME_ATTRIBUTE)) {
      const theme = document.body.getAttribute(THEME_ATTRIBUTE);
      if (theme === THEME_DARK || theme === THEME_WAVE || theme === THEME_LIGHT) {
        return theme;
      }
    }
    
    // Fallback to localStorage
    try {
      const theme = localStorage.getItem(THEME_STORAGE_KEY);
      if (theme === THEME_DARK || theme === THEME_WAVE || theme === THEME_LIGHT) {
        return theme;
      }
    } catch (e) {
      // localStorage may be unavailable (e.g., private browsing)
    }
    
    return THEME_LIGHT;
  }

  /**
   * Get video path based on theme
   * @param {string} theme - Theme ('light', 'dark', or 'wave')
   * @returns {string} Path to video file
   */
  function getVideoPath(theme) {
    let videoFile;
    if (theme === THEME_DARK) {
      videoFile = VIDEO_DARK;
    } else if (theme === THEME_WAVE) {
      videoFile = VIDEO_WAVE;
    } else {
      videoFile = VIDEO_LIGHT;
    }
    return VIDEO_BASE_PATH + videoFile;
  }

  /**
   * Preload a video for smooth theme switching
   * @param {string} videoPath - Path to video file
   */
  function preloadVideo(videoPath) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = videoPath;
    document.head.appendChild(link);
  }

  /**
   * Set video source and play
   * @param {HTMLVideoElement} videoElement - The video element
   * @param {string} theme - Theme to use ('light' or 'dark')
   */
  function setVideoSource(videoElement, theme) {
    const videoPath = getVideoPath(theme);
    
    // Only change source if it's different
    if (videoElement.src !== window.location.origin + videoPath) {
      videoElement.src = videoPath;
    }

    // Preload alternate videos for smooth switching
    const themes = [THEME_LIGHT, THEME_DARK, THEME_WAVE];
    themes.forEach(altTheme => {
      if (altTheme !== theme) {
        const alternatePath = getVideoPath(altTheme);
        preloadVideo(alternatePath);
      }
    });

    // Play the video once
    videoElement.play().catch((error) => {
      // Silently handle autoplay restrictions
      console.warn('Video autoplay prevented:', error);
    });
  }

  /**
   * Initialize video handler functionality
   */
  function initVideoHandler() {
    const videoElement = document.querySelector(HOME_VIDEO_SELECTOR);
    
    if (!videoElement) {
      // Video element not found (not on homepage)
      return;
    }

    // Ensure video has no controls
    videoElement.controls = false;
    videoElement.setAttribute('aria-label', 'Animated image of Devin');

    /**
     * Handle video ended event - stop on last frame
     */
    function handleVideoEnded() {
      // Video has ended, it will stay on the last frame
      // No action needed as video naturally stops on last frame
    }

    /**
     * Load and play video based on current theme
     */
    function loadVideo() {
      const currentTheme = getCurrentTheme();
      setVideoSource(videoElement, currentTheme);
    }

    /**
     * Handle theme change event
     * @param {CustomEvent} event - Theme change event
     */
    function handleThemeChange(event) {
      const newTheme = event.detail?.theme || getCurrentTheme();
      setVideoSource(videoElement, newTheme);
    }

    // Set up event listeners
    videoElement.addEventListener('ended', handleVideoEnded);

    // Listen for theme changes
    window.addEventListener('themeChanged', handleThemeChange);

    // Wait for video element to be ready, then load video
    if (videoElement.readyState >= 2) {
      // Video element is ready
      loadVideo();
    } else {
      // Wait for video element to be ready
      videoElement.addEventListener('loadedmetadata', function onLoadedMetadata() {
        videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
        loadVideo();
      }, { once: true });
    }

    // Also try loading immediately (in case readyState check doesn't work)
    loadVideo();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoHandler);
  } else {
    initVideoHandler();
  }
})();

