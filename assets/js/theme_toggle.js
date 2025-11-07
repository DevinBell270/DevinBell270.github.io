/**
 * Theme toggle functionality for light/dark mode switching
 * Uses localStorage to persist user preference and applies theme via body attribute
 * Compatible with no-style-please theme which uses body[a="dark"] for dark mode
 */
(function() {
  'use strict';

  // Constants
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';
  const THEME_STORAGE_KEY = 'theme';
  const THEME_ATTRIBUTE = 'a';
  const LIGHT_BUTTON_ID = 'theme-light';
  const DARK_BUTTON_ID = 'theme-dark';

  /**
   * Get the current theme from localStorage or return default
   * @returns {string} Current theme ('light' or 'dark')
   */
  function getCurrentTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || THEME_LIGHT;
    } catch (e) {
      // localStorage may be unavailable (e.g., private browsing)
      return THEME_LIGHT;
    }
  }

  /**
   * Apply theme to the document body
   * @param {string} theme - Theme to apply ('light' or 'dark')
   */
  function applyTheme(theme) {
    if (document.body) {
      document.body.setAttribute(THEME_ATTRIBUTE, theme);
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

  /**
   * Save theme preference to localStorage
   * @param {string} theme - Theme to save ('light' or 'dark')
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
   * @param {string} theme - Active theme ('light' or 'dark')
   */
  function updateActiveTheme(theme) {
    const lightEl = document.getElementById(LIGHT_BUTTON_ID);
    const darkEl = document.getElementById(DARK_BUTTON_ID);
    
    if (!lightEl || !darkEl) {
      return;
    }
    
    lightEl.classList.remove('active');
    darkEl.classList.remove('active');
    
    if (theme === THEME_LIGHT) {
      lightEl.classList.add('active');
    } else {
      darkEl.classList.add('active');
    }
  }

  /**
   * Handle theme button click
   * @param {string} theme - Theme to switch to ('light' or 'dark')
   * @param {Event} e - Click event
   */
  function handleThemeClick(theme, e) {
    e.preventDefault();
    applyTheme(theme);
    saveTheme(theme);
    updateActiveTheme(theme);
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
    
    // Attach event listeners
    if (lightButton) {
      lightButton.addEventListener('click', (e) => handleThemeClick(THEME_LIGHT, e));
    }
    
    if (darkButton) {
      darkButton.addEventListener('click', (e) => handleThemeClick(THEME_DARK, e));
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle);
  } else {
    initToggle();
  }
})();

