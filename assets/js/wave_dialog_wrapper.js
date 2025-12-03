/**
 * Wrap images and videos in Windows 95 dialog boxes for wave mode
 */
(function() {
  'use strict';

  const THEME_WAVE = 'wave';
  const THEME_ATTRIBUTE = 'a';
  const WRAPPED_CLASS = 'wave-dialog-wrapped';
  const WRAPPER_CLASS = 'wave-dialog-wrapper';

  /**
   * Check if wave mode is active
   * @returns {boolean} True if wave mode is active
   */
  function isWaveMode() {
    const body = document.body;
    return body && body.getAttribute(THEME_ATTRIBUTE) === THEME_WAVE;
  }

  /**
   * Check if a container has any visible images or videos
   * @param {HTMLElement} container - Container element to check
   * @returns {boolean} True if container has visible media
   */
  function hasVisibleMedia(container) {
    if (!container) return false;
    
    // Check for visible dialog wrappers
    const visibleWrappers = Array.from(container.querySelectorAll(`.${WRAPPER_CLASS}`)).filter(
      wrapper => wrapper.style.display !== 'none' && wrapper.offsetParent !== null
    );
    
    // Check for unwrapped visible images/videos
    const visibleMedia = Array.from(container.querySelectorAll('img, video')).filter(
      media => {
        const wrapper = media.closest(`.${WRAPPER_CLASS}`);
        // If wrapped, check if wrapper is visible
        if (wrapper) {
          return wrapper.style.display !== 'none' && wrapper.offsetParent !== null;
        }
        // If not wrapped, check if media itself is visible
        return media.style.display !== 'none' && media.offsetParent !== null;
      }
    );
    
    return visibleWrappers.length > 0 || visibleMedia.length > 0;
  }

  /**
   * Show container if it has visible media
   * @param {HTMLElement} container - Container element to potentially show
   * @param {string} selector - Selector used to identify container type
   */
  function showContainerIfNeeded(container, selector) {
    if (!container) return;
    
    if (hasVisibleMedia(container)) {
      // Restore visibility for newspaper-images-column
      if (selector === '.newspaper-images-column') {
        container.style.visibility = '';
      } else if (container.style.display === 'none') {
        container.style.display = '';
      }
    }
  }

  /**
   * Hide empty containers
   * @param {HTMLElement} element - Element that was just hidden
   */
  function hideEmptyContainers(element) {
    // List of container selectors to check
    const containerSelectors = [
      '.newspaper-images-column',
      '.home-right',
      '.newspaper-image-wrapper'
    ];
    
    // Check each container type
    containerSelectors.forEach(selector => {
      // Find the container that contains this element
      const container = element.closest(selector);
      if (container && !hasVisibleMedia(container)) {
        // Use visibility: hidden for newspaper-images-column to preserve grid layout space
        if (selector === '.newspaper-images-column') {
          container.style.visibility = 'hidden';
        } else {
          container.style.display = 'none';
        }
      }
    });
    
    // Also check all containers of these types globally to catch edge cases
    containerSelectors.forEach(selector => {
      const containers = document.querySelectorAll(selector);
      containers.forEach(container => {
        // Check if container is currently visible
        const isVisible = selector === '.newspaper-images-column' 
          ? container.style.visibility !== 'hidden' && container.offsetParent !== null
          : container.style.display !== 'none' && container.offsetParent !== null;
        
        if (isVisible) {
          if (!hasVisibleMedia(container)) {
            // Use visibility: hidden for newspaper-images-column to preserve grid layout space
            if (selector === '.newspaper-images-column') {
              container.style.visibility = 'hidden';
            } else {
              container.style.display = 'none';
            }
          }
        }
      });
    });
  }

  /**
   * Handle close button click
   * @param {HTMLElement} wrapper - Dialog wrapper element
   */
  function handleCloseClick(wrapper) {
    // Hide the wrapper
    wrapper.style.display = 'none';
    
    // Check and hide empty containers
    hideEmptyContainers(wrapper);
  }

  /**
   * Create Windows 95 dialog wrapper for an element
   * @param {HTMLElement} element - Image or video element
   * @returns {HTMLElement} Wrapper element
   */
  function createDialogWrapper(element) {
    const wrapper = document.createElement('div');
    wrapper.className = WRAPPER_CLASS;
    
    // Determine if it's a video or image
    const isVideo = element.tagName.toLowerCase() === 'video';
    const titleText = isVideo ? 'Video' : 'Image';
    
    // Create title bar
    const titleBar = document.createElement('div');
    titleBar.className = 'wave-dialog-titlebar';
    titleBar.textContent = titleText;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'wave-dialog-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.type = 'button';
    
    // Add click handler to close button
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleCloseClick(wrapper);
    });
    
    titleBar.appendChild(closeBtn);
    
    // Create content area
    const content = document.createElement('div');
    content.className = 'wave-dialog-content';
    
    wrapper.appendChild(titleBar);
    wrapper.appendChild(content);
    
    return wrapper;
  }

  /**
   * Wrap images and videos in dialog boxes
   */
  function wrapMediaElements() {
    if (!isWaveMode()) {
      return;
    }

    // Find all images and videos that aren't already wrapped
    const mediaElements = document.querySelectorAll(`img:not(.${WRAPPED_CLASS}), video:not(.${WRAPPED_CLASS})`);
    
    mediaElements.forEach(element => {
      // Skip if already wrapped or if it's inside a dialog wrapper
      if (element.closest(`.${WRAPPER_CLASS}`)) {
        return;
      }
      
      // Skip if it's a decorative icon or very small image
      if (element.width && element.width < 50 && element.height && element.height < 50) {
        return;
      }
      
      // Skip if element is hidden (e.g., preload videos)
      if (element.style.display === 'none' || element.hidden || element.getAttribute('aria-hidden') === 'true') {
        return;
      }
      
      // Mark as wrapped
      element.classList.add(WRAPPED_CLASS);
      
      // Store reference to parent and next sibling
      const parent = element.parentNode;
      const nextSibling = element.nextSibling;
      
      // Create wrapper
      const wrapper = createDialogWrapper(element);
      
      // Get the content area
      const content = wrapper.querySelector('.wave-dialog-content');
      
      // Move the original element into the content area
      content.appendChild(element);
      
      // Insert wrapper where element was
      if (nextSibling) {
        parent.insertBefore(wrapper, nextSibling);
      } else {
        parent.appendChild(wrapper);
      }
    });
    
    // After wrapping, ensure containers are visible if they have media
    const containerSelectors = ['.newspaper-images-column', '.home-right'];
    containerSelectors.forEach(selector => {
      const containers = document.querySelectorAll(selector);
      containers.forEach(container => {
        showContainerIfNeeded(container, selector);
      });
    });
  }

  /**
   * Remove dialog wrappers and restore original elements
   */
  function unwrapMediaElements() {
    const wrappers = document.querySelectorAll(`.${WRAPPER_CLASS}`);
    
    wrappers.forEach(wrapper => {
      const content = wrapper.querySelector('.wave-dialog-content');
      const mediaElement = content.querySelector('img, video');
      
      if (mediaElement) {
        // Remove wrapped class
        mediaElement.classList.remove(WRAPPED_CLASS);
        // Replace wrapper with original element
        wrapper.parentNode.replaceChild(mediaElement, wrapper);
      }
    });
    
    // Restore visibility of containers that might have been hidden
    const containerSelectors = ['.newspaper-images-column', '.home-right'];
    containerSelectors.forEach(selector => {
      const containers = document.querySelectorAll(selector);
      containers.forEach(container => {
        if (selector === '.newspaper-images-column') {
          container.style.visibility = '';
        } else {
          container.style.display = '';
        }
      });
    });
  }

  /**
   * Handle theme change
   * @param {CustomEvent} event - Theme change event
   */
  function handleThemeChange(event) {
    const theme = event.detail?.theme;
    
    if (theme === THEME_WAVE) {
      setTimeout(wrapMediaElements, 100);
    } else {
      unwrapMediaElements();
    }
  }

  /**
   * Initialize wrapper functionality
   */
  function init() {
    if (isWaveMode()) {
      setTimeout(wrapMediaElements, 100);
    }
    
    // Listen for theme changes
    window.addEventListener('themeChanged', handleThemeChange);
    
    // Watch for dynamically added images/videos
    const observer = new MutationObserver((mutations) => {
      if (isWaveMode()) {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.tagName && (node.tagName.toLowerCase() === 'img' || node.tagName.toLowerCase() === 'video')) {
                setTimeout(wrapMediaElements, 50);
              }
              // Check for images/videos within the node
              if (node.querySelectorAll) {
                const media = node.querySelectorAll('img, video');
                if (media.length > 0) {
                  setTimeout(wrapMediaElements, 50);
                }
              }
            }
          });
        });
      }
    });
    
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

