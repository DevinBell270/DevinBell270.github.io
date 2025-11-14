/**
 * Wave theme Japanese translations for headings
 * Hybrid translation system: Dictionary → Cache → API → Fallback
 * Translates headings to Japanese when wave mode is active
 */
(function() {
  'use strict';

  const THEME_WAVE = 'wave';
  const ORIGINAL_TEXT_ATTR = 'data-original-text';
  const TRANSLATED_ATTR = 'data-translated';
  const CACHE_KEY = 'wave_translation_cache';
  const CACHE_MAX_SIZE = 100;
  const API_TIMEOUT = 2000; // 2 seconds

  // Translation map for common headings
  // Using katakana and common vaporwave aesthetic terms
  const translations = {
    // Common page headings
    'Recent posts': '最近の投稿',
    'Go To Disney With Us': 'ディズニーへ行こう',
    'All posts': 'すべての投稿',
    'Get in Touch': '連絡先',
    'Where to find me': '私を見つける場所',
    'About': 'について',
    'Blog': 'ブログ',
    
    // Common phrases that might appear
    'View more': 'もっと見る',
    
    // Post titles
    'Ava goes to archery nationals.': 'アヴァはアーチェリーの全国大会へ行く。',
    'I am not a woodworker.': '私は木工職人ではない。',
    'End of the year fishing report.': '年末フィッシングレポート',
  };

  // Common vaporwave terms in katakana/hiragana for fallback
  const vaporwaveTerms = {
    'archery': 'アーチェリー',
    'nationals': 'ナショナル',
    'fishing': 'フィッシング',
    'report': 'レポート',
    'year': '年',
    'end': '終わり',
    'woodworker': '木工職人',
    'disney': 'ディズニー',
    'goes': '行く',
    'to': 'へ',
    'with': 'と',
    'us': '私たち',
    'ava': 'アヴァ',
    'i': '私',
    'am': 'は',
    'not': 'ではない',
    'a': '一つの',
    'the': '',
    'of': 'の',
    'and': 'と',
  };

  /**
   * LocalStorage Cache Manager
   */
  const cacheManager = {
    /**
     * Get cache from localStorage
     * @returns {Object} Cache object mapping English → Japanese
     */
    getCache() {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : {};
      } catch (e) {
        console.warn('Failed to read translation cache:', e);
        return {};
      }
    },

    /**
     * Save cache to localStorage
     * @param {Object} cache - Cache object to save
     */
    saveCache(cache) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      } catch (e) {
        // If quota exceeded, try pruning and saving again
        if (e.name === 'QuotaExceededError') {
          const pruned = this.pruneCache(cache, CACHE_MAX_SIZE / 2);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(pruned));
          } catch (e2) {
            console.warn('Failed to save translation cache after pruning:', e2);
          }
        } else {
          console.warn('Failed to save translation cache:', e);
        }
      }
    },

    /**
     * Get translation from cache
     * @param {string} text - English text to look up
     * @returns {string|null} Japanese translation or null if not found
     */
    get(text) {
      const cache = this.getCache();
      return cache[text] || null;
    },

    /**
     * Save translation to cache
     * @param {string} text - English text
     * @param {string} translation - Japanese translation
     */
    set(text, translation) {
      const cache = this.getCache();
      cache[text] = translation;
      
      // Prune if cache is too large
      if (Object.keys(cache).length > CACHE_MAX_SIZE) {
        const pruned = this.pruneCache(cache, CACHE_MAX_SIZE);
        this.saveCache(pruned);
      } else {
        this.saveCache(cache);
      }
    },

    /**
     * Prune cache to specified size, keeping most recent entries
     * @param {Object} cache - Cache object to prune
     * @param {number} maxSize - Maximum number of entries to keep
     * @returns {Object} Pruned cache object
     */
    pruneCache(cache, maxSize) {
      const entries = Object.entries(cache);
      if (entries.length <= maxSize) {
        return cache;
      }
      
      // Keep the most recent entries (simple approach: keep last N)
      const pruned = {};
      const entriesToKeep = entries.slice(-maxSize);
      entriesToKeep.forEach(([key, value]) => {
        pruned[key] = value;
      });
      
      return pruned;
    }
  };

  /**
   * Generate fallback translation using word-by-word or prefix
   * @param {string} text - Text to translate
   * @returns {string} Fallback Japanese translation
   */
  function generateFallback(text) {
    // Try case-insensitive dictionary match first
    const lowerText = text.toLowerCase();
    for (const [key, value] of Object.entries(translations)) {
      if (key.toLowerCase() === lowerText) {
        return value;
      }
    }
    
    // Word-by-word translation attempt
    const words = text.toLowerCase().split(/\s+/);
    const translatedWords = words.map(word => {
      // Remove punctuation for matching
      const cleanWord = word.replace(/[.,!?]/g, '');
      if (vaporwaveTerms[cleanWord]) {
        return vaporwaveTerms[cleanWord];
      }
      // If no translation, keep as-is for vaporwave aesthetic
      return cleanWord;
    }).filter(w => w !== ''); // Remove empty strings
    
    // If we got some translations, return them
    const hasTranslations = translatedWords.some((w, i) => {
      const originalWord = words[i] ? words[i].replace(/[.,!?]/g, '') : '';
      return w !== originalWord && w !== '';
    });
    
    if (hasTranslations && translatedWords.length > 0) {
      return translatedWords.join(' ');
    }
    
    // Final fallback: add vaporwave-style katakana prefix for aesthetic
    return 'ヴァーチャル・' + text;
  }

  /**
   * Fetch translation from MyMemory API
   * @param {string} text - Text to translate
   * @returns {Promise<string>} Japanese translation
   */
  async function fetchTranslationFromAPI(text) {
    try {
      const encodedText = encodeURIComponent(text);
      const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|ja`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API response not OK: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }
      
      throw new Error('Invalid API response format');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Translate text to Japanese using hybrid approach
   * Dictionary → Cache → API → Fallback
   * @param {string} text - Text to translate
   * @returns {Promise<string>} Japanese translation
   */
  async function translateToJapanese(text) {
    // 1. Dictionary check (instant)
    if (translations[text]) {
      return translations[text];
    }
    
    // 2. Cache check (instant)
    const cached = cacheManager.get(text);
    if (cached) {
      return cached;
    }
    
    // 3. Generate fallback immediately (for instant display)
    const fallback = generateFallback(text);
    
    // 4. Try API with timeout
    try {
      const apiPromise = fetchTranslationFromAPI(text);
      const timeoutPromise = new Promise((resolve) => 
        setTimeout(() => resolve(fallback), API_TIMEOUT)
      );
      
      const result = await Promise.race([apiPromise, timeoutPromise]);
      
      // Only cache if it's from API (not fallback)
      if (result !== fallback) {
        cacheManager.set(text, result);
        return result;
      }
      
      return fallback;
    } catch (error) {
      // API failed, return fallback
      return fallback;
    }
  }

  /**
   * Synchronous translation for instant display (dictionary + cache only)
   * @param {string} text - Text to translate
   * @returns {string|null} Japanese translation or null if not in cache/dictionary
   */
  function translateToJapaneseSync(text) {
    // Dictionary check
    if (translations[text]) {
      return translations[text];
    }
    
    // Cache check
    const cached = cacheManager.get(text);
    if (cached) {
      return cached;
    }
    
    // Not found in dictionary or cache
    return null;
  }

  /**
   * Store original text and translate heading to Japanese
   * Uses sync translation first, then upgrades to API translation in background
   * @param {HTMLElement} heading - Heading element to translate
   */
  function translateHeading(heading) {
    // Skip if already translated
    if (heading.getAttribute(TRANSLATED_ATTR) === 'true') {
      return;
    }
    
    // Store original text if not already stored
    if (!heading.getAttribute(ORIGINAL_TEXT_ATTR)) {
      heading.setAttribute(ORIGINAL_TEXT_ATTR, heading.textContent.trim());
    }
    
    const originalText = heading.getAttribute(ORIGINAL_TEXT_ATTR);
    
    // Try synchronous translation first (dictionary + cache)
    const syncTranslation = translateToJapaneseSync(originalText);
    
    if (syncTranslation) {
      // Found in dictionary or cache, use it immediately
      heading.textContent = syncTranslation;
      heading.setAttribute(TRANSLATED_ATTR, 'true');
    } else {
      // Not in dictionary or cache, show fallback immediately
      const fallback = generateFallback(originalText);
      heading.textContent = fallback;
      heading.setAttribute(TRANSLATED_ATTR, 'true');
      
      // Upgrade to API translation in background
      translateToJapanese(originalText).then(apiTranslation => {
        // Only update if heading is still translated and text hasn't changed
        if (heading.getAttribute(TRANSLATED_ATTR) === 'true' && 
            heading.getAttribute(ORIGINAL_TEXT_ATTR) === originalText) {
          heading.textContent = apiTranslation;
        }
      }).catch(() => {
        // API failed, keep fallback (already displayed)
      });
    }
  }

  /**
   * Restore original text from stored attribute
   * @param {HTMLElement} heading - Heading element to restore
   */
  function restoreHeading(heading) {
    const originalText = heading.getAttribute(ORIGINAL_TEXT_ATTR);
    if (originalText) {
      heading.textContent = originalText;
      heading.removeAttribute(TRANSLATED_ATTR);
    }
  }

  /**
   * Translate all headings on the page
   */
  function translateAllHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(translateHeading);
  }

  /**
   * Restore all headings to original text
   */
  function restoreAllHeadings() {
    const headings = document.querySelectorAll(`[${TRANSLATED_ATTR}="true"]`);
    headings.forEach(restoreHeading);
  }

  /**
   * Handle theme change
   * @param {CustomEvent} event - Theme changed event
   */
  function handleThemeChange(event) {
    const theme = event.detail.theme;
    
    if (theme === THEME_WAVE) {
      // Small delay to ensure DOM is ready
      setTimeout(translateAllHeadings, 100);
    } else {
      restoreAllHeadings();
    }
  }

  /**
   * Initialize translations based on current theme
   */
  function initTranslations() {
    // Check current theme
    const body = document.body;
    if (body && body.getAttribute('a') === THEME_WAVE) {
      setTimeout(translateAllHeadings, 100);
    }
  }

  // Listen for theme changes
  window.addEventListener('themeChanged', handleThemeChange);

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslations);
  } else {
    initTranslations();
  }

  // Also handle dynamic content (e.g., content loaded via AJAX)
  // Watch for new headings added to the DOM
  const observer = new MutationObserver((mutations) => {
    const body = document.body;
    if (body && body.getAttribute('a') === THEME_WAVE) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Check if it's a heading
            if (node.tagName && node.tagName.match(/^H[1-6]$/)) {
              translateHeading(node);
            }
            // Check for headings within the node
            const headings = node.querySelectorAll ? node.querySelectorAll('h1, h2, h3, h4, h5, h6') : [];
            headings.forEach(translateHeading);
          }
        });
      });
    }
  });

  // Start observing when DOM is ready
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
})();
