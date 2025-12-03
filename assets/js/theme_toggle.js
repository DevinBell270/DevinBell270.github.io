/**
 * Theme toggle functionality for light/dark/wave mode switching
 * Uses localStorage to persist user preference and applies theme via body attribute
 * Compatible with no-style-please theme which uses body[a="dark"] for dark mode
 */
(function() {
  'use strict';

  // Constants
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';
  const THEME_WAVE = 'wave';
  const THEMES = [THEME_LIGHT, THEME_DARK, THEME_WAVE];
  const THEME_STORAGE_KEY = 'theme';
  const THEME_ATTRIBUTE = 'a';
  const LIGHT_BUTTON_ID = 'theme-light';
  const DARK_BUTTON_ID = 'theme-dark';
  const WAVE_BUTTON_ID = 'theme-wave';

  /**
   * Get the current theme from localStorage or return default
   * @returns {string} Current theme ('light', 'dark', or 'wave')
   */
  function getCurrentTheme() {
    try {
      const theme = localStorage.getItem(THEME_STORAGE_KEY) || THEME_LIGHT;
      // Validate theme is one of our supported themes
      return THEMES.includes(theme) ? theme : THEME_LIGHT;
    } catch (e) {
      // localStorage may be unavailable (e.g., private browsing)
      return THEME_LIGHT;
    }
  }

  /**
   * Load Noto Sans JP font only when Wave theme is activated
   * This saves ~58 KiB for users who don't use the Wave theme
   */
  function loadWaveFont() {
    // Check if font is already loaded
    if (document.getElementById('wave-font-link')) {
      return;
    }
    
    const link = document.createElement('link');
    link.id = 'wave-font-link';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap';
    link.media = 'print';
    link.onload = function() {
      this.media = 'all';
    };
    document.head.appendChild(link);
  }

  /**
   * Apply theme to the document body
   * @param {string} theme - Theme to apply ('light', 'dark', or 'wave')
   */
  function applyTheme(theme) {
    if (document.body) {
      document.body.setAttribute(THEME_ATTRIBUTE, theme);
      
      // Lazy-load Wave font only when Wave theme is activated
      if (theme === THEME_WAVE) {
        loadWaveFont();
      }
    }
  }

  // Apply theme immediately to prevent flash of wrong theme
  const currentTheme = getCurrentTheme();
  
  // Try to apply theme immediately if body exists
  if (document.body) {
    applyTheme(currentTheme);
  } else {
    // If body doesn't exist yet, wait for it
    const observer = new MutationObserver(() => {
      if (document.body) {
        applyTheme(currentTheme);
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true });
  }
  
  // Load Wave font if Wave theme is already active (e.g., on page load)
  if (currentTheme === THEME_WAVE) {
    // Use setTimeout to ensure DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadWaveFont);
    } else {
      loadWaveFont();
    }
  }

  /**
   * Save theme preference to localStorage
   * @param {string} theme - Theme to save ('light', 'dark', or 'wave')
   */
  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // Silently fail if localStorage is unavailable
      console.warn('Unable to save theme preference:', e);
    }
  }

  /**
   * Update the active state of theme toggle buttons
   * @param {string} theme - Active theme ('light', 'dark', or 'wave')
   */
  function updateActiveTheme(theme) {
    const lightEl = document.getElementById(LIGHT_BUTTON_ID);
    const darkEl = document.getElementById(DARK_BUTTON_ID);
    const waveEl = document.getElementById(WAVE_BUTTON_ID);
    
    // Remove active class from all buttons
    [lightEl, darkEl, waveEl].forEach(el => {
      if (el) el.classList.remove('active');
    });
    
    // Add active class to the current theme button
    if (theme === THEME_LIGHT && lightEl) {
      lightEl.classList.add('active');
    } else if (theme === THEME_DARK && darkEl) {
      darkEl.classList.add('active');
    } else if (theme === THEME_WAVE && waveEl) {
      waveEl.classList.add('active');
    }
  }

  /**
   * Dispatch theme changed event
   * @param {string} theme - New theme ('light', 'dark', or 'wave')
   */
  function dispatchThemeChanged(theme) {
    const event = new CustomEvent('themeChanged', {
      detail: { theme: theme }
    });
    window.dispatchEvent(event);
  }

  /**
   * Handle theme button click
   * @param {string} theme - Theme to switch to ('light', 'dark', or 'wave')
   * @param {Event} e - Click event
   */
  function handleThemeClick(theme, e) {
    e.preventDefault();
    applyTheme(theme);
    saveTheme(theme);
    updateActiveTheme(theme);
    dispatchThemeChanged(theme);
    
    // Ensure Wave font is loaded if switching to Wave theme
    if (theme === THEME_WAVE) {
      loadWaveFont();
    }
  }

  /**
   * Initialize theme toggle functionality
   */
  function initToggle() {
    // Update active state of buttons
    updateActiveTheme(currentTheme);
    
    // Cache DOM elements to avoid repeated queries
    const lightButton = document.getElementById(LIGHT_BUTTON_ID);
    const darkButton = document.getElementById(DARK_BUTTON_ID);
    const waveButton = document.getElementById(WAVE_BUTTON_ID);
    
    // Attach event listeners
    if (lightButton) {
      lightButton.addEventListener('click', (e) => handleThemeClick(THEME_LIGHT, e));
    }
    
    if (darkButton) {
      darkButton.addEventListener('click', (e) => handleThemeClick(THEME_DARK, e));
    }
    
    if (waveButton) {
      waveButton.addEventListener('click', (e) => handleThemeClick(THEME_WAVE, e));
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle);
  } else {
    initToggle();
  }
})();

