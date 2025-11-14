/**
 * Wave theme Japanese translations for headings
 * Translates headings to Japanese when wave mode is active
 */
(function() {
  'use strict';

  const THEME_WAVE = 'wave';
  const ORIGINAL_TEXT_ATTR = 'data-original-text';
  const TRANSLATED_ATTR = 'data-translated';

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

  /**
   * Translate text to Japanese using translation map or transliteration
   * @param {string} text - Text to translate
   * @returns {string} Japanese translation
   */
  function translateToJapanese(text) {
    // Check if we have a direct translation (exact match)
    if (translations[text]) {
      return translations[text];
    }
    
    // Try case-insensitive match
    const lowerText = text.toLowerCase();
    for (const [key, value] of Object.entries(translations)) {
      if (key.toLowerCase() === lowerText) {
        return value;
      }
    }
    
    // For post titles and other content, use katakana transliteration
    // This gives the vaporwave aesthetic even if not perfectly translated
    // Common vaporwave terms in katakana/hiragana
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
    
    // Simple word-by-word translation attempt
    const words = text.toLowerCase().split(/\s+/);
    const translatedWords = words.map(word => {
      // Remove punctuation for matching
      const cleanWord = word.replace(/[.,!?]/g, '');
      if (vaporwaveTerms[cleanWord]) {
        return vaporwaveTerms[cleanWord];
      }
      // If no translation, transliterate to katakana-style (keep as-is for vaporwave aesthetic)
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
    
    // Fallback: add vaporwave-style katakana prefix for aesthetic
    return 'ヴァーチャル・' + text;
  }

  /**
   * Store original text and translate heading to Japanese
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
    const japaneseText = translateToJapanese(originalText);
    
    heading.textContent = japaneseText;
    heading.setAttribute(TRANSLATED_ATTR, 'true');
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

