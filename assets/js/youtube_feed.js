/**
 * Fetch and render YouTube RSS feed entries as linked titles
 * Uses RSS2JSON API with fallback to CORS proxies and direct XML parsing
 */
(function () {
  'use strict';

  // Constants
  const LIST_ELEMENT_ID = 'yt-video-list';
  const FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCz4_b11cchORwaXPPflRGDg';
  const MAX_ITEMS = 3;
  const CACHE_KEY = 'yt-feed-cache';
  const CACHE_TTL = 3600000; // 1 hour in milliseconds
  const RSS2JSON_API_URL = 'https://api.rss2json.com/v1/api.json';
  const PROXY_SERVICES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
  ];
  const ERROR_MESSAGES = {
    NO_VIDEOS: 'No videos found.',
    UNABLE_TO_LOAD: 'Unable to load videos at this time.',
    HTTP_ERROR: 'HTTP error',
    RSS2JSON_ERROR: 'RSS2JSON API error',
    INVALID_FORMAT: 'Invalid response format'
  };

  /**
   * Get cached feed data from localStorage
   * @returns {Array|null} Cached items array or null if cache expired/missing
   */
  function getCachedData() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      if (age > CACHE_TTL) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  /**
   * Save feed data to localStorage cache
   * @param {Array} data - Array of video items to cache
   */
  function setCachedData(data) {
    try {
      const cacheEntry = {
        data: data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
    } catch (e) {
      // Silently fail if localStorage is unavailable
    }
  }

  /**
   * Render video items to the DOM
   * @param {Array} items - Array of video items with title and link properties
   */
  function renderItems(items) {
    const list = document.getElementById(LIST_ELEMENT_ID);
    if (!list) return;
    
    list.innerHTML = '';
    
    if (!items.length) {
      const li = document.createElement('li');
      li.textContent = ERROR_MESSAGES.NO_VIDEOS;
      list.appendChild(li);
      return;
    }
    
    for (const item of items) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.link;
      a.rel = 'noopener noreferrer';
      a.target = '_blank';
      a.textContent = item.title || 'View video';
      li.appendChild(a);
      list.appendChild(li);
    }
  }

  /**
   * Parse YouTube RSS feed XML and extract video entries
   * @param {string} xmlText - Raw XML text from YouTube feed
   * @returns {Array} Array of video items with title and link
   */
  function parseYouTubeFeed(xmlText) {
    if (!xmlText || !xmlText.includes('<feed')) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    
    if (doc.querySelector('parsererror')) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }
    
    const entries = Array.from(doc.getElementsByTagName('entry'));
    return entries.slice(0, MAX_ITEMS).map((entry) => {
      const titleEl = entry.getElementsByTagName('title')[0];
      const linkEl = entry.getElementsByTagName('link')[0];
      return {
        title: titleEl ? (titleEl.textContent || '').trim() : '',
        link: linkEl ? linkEl.getAttribute('href') : ''
      };
    });
  }

  /**
   * Attempt to fetch feed using CORS proxy services
   * @returns {Promise<Array>} Array of video items
   * @throws {Error} If all proxies fail
   */
  async function fetchFeedWithProxies() {
    for (const proxy of PROXY_SERVICES) {
      try {
        const proxiedUrl = `${proxy}${encodeURIComponent(FEED_URL)}`;
        const res = await fetch(proxiedUrl);
        
        if (!res.ok) continue;
        
        const xmlText = await res.text();
        return parseYouTubeFeed(xmlText);
      } catch (proxyErr) {
        // Try next proxy
        continue;
      }
    }
    
    throw new Error(ERROR_MESSAGES.UNABLE_TO_LOAD);
  }

  /**
   * Fetch YouTube feed using RSS2JSON API with proxy fallback
   * @returns {Promise<Array>} Array of video items with title and link
   * @throws {Error} If all fetch methods fail
   */
  async function fetchFeed() {
    // Try RSS2JSON API first
    const rss2jsonUrl = `${RSS2JSON_API_URL}?rss_url=${encodeURIComponent(FEED_URL)}`;
    
    try {
      const res = await fetch(rss2jsonUrl);
      if (!res.ok) {
        throw new Error(`${ERROR_MESSAGES.HTTP_ERROR} ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || ERROR_MESSAGES.RSS2JSON_ERROR);
      }
      
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
      }
      
      return data.items.slice(0, MAX_ITEMS).map((item) => ({
        title: item.title || '',
        link: item.link || ''
      }));
    } catch (err) {
      // Fallback to proxy services
      return fetchFeedWithProxies();
    }
  }

  /**
   * Initialize YouTube feed functionality
   */
  async function init() {
    const list = document.getElementById(LIST_ELEMENT_ID);
    if (!list) return;

    // Try to load from cache first
    const cachedItems = getCachedData();
    if (cachedItems) {
      renderItems(cachedItems);
    }

    // Fetch fresh data
    try {
      const items = await fetchFeed();
      setCachedData(items);
      renderItems(items);
    } catch (e) {
      // Only show error if we don't have cached data
      if (!cachedItems) {
        const li = document.createElement('li');
        li.textContent = ERROR_MESSAGES.UNABLE_TO_LOAD;
        list.appendChild(li);
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
