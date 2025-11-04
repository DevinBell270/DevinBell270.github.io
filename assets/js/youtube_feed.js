// Fetch and render YouTube RSS feed entries as linked titles
(function () {
  const LIST_ELEMENT_ID = 'yt-video-list';
  const FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCz4_b11cchORwaXPPflRGDg';
  const MAX_ITEMS = 3;
  const CACHE_KEY = 'yt-feed-cache';
  const CACHE_TTL = 3600000;

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

  function setCachedData(data) {
    try {
      const cacheEntry = {
        data: data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
    } catch (e) {
    }
  }

  function renderItems(items) {
    const list = document.getElementById(LIST_ELEMENT_ID);
    if (!list) return;
    list.innerHTML = '';
    if (!items.length) {
      const li = document.createElement('li');
      li.textContent = 'No videos found.';
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

  async function fetchFeed() {
    const rss2jsonUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(FEED_URL);
    
    try {
      const res = await fetch(rss2jsonUrl);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'RSS2JSON API error');
      }
      
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Invalid response format');
      }
      
      return data.items.slice(0, MAX_ITEMS).map((item) => ({
        title: item.title || '',
        link: item.link || ''
      }));
    } catch (err) {
      const proxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?'
      ];
      
      for (const proxy of proxies) {
        try {
          const proxied = proxy + encodeURIComponent(FEED_URL);
          const res = await fetch(proxied);
          if (!res.ok) continue;
          
          const xmlText = await res.text();
          if (!xmlText || !xmlText.includes('<feed')) continue;
          
          const parser = new DOMParser();
          const doc = parser.parseFromString(xmlText, 'application/xml');
          if (doc.querySelector('parsererror')) continue;
          
          const entries = Array.from(doc.getElementsByTagName('entry'));
          return entries.slice(0, MAX_ITEMS).map((entry) => {
            const titleEl = entry.getElementsByTagName('title')[0];
            const linkEl = entry.getElementsByTagName('link')[0];
            return {
              title: titleEl ? (titleEl.textContent || '').trim() : '',
              link: linkEl ? linkEl.getAttribute('href') : ''
            };
          });
        } catch (proxyErr) {
          continue;
        }
      }
      
      throw err;
    }
  }

  async function init() {
    const list = document.getElementById(LIST_ELEMENT_ID);
    if (!list) return;

    const cachedItems = getCachedData();
    if (cachedItems) {
      renderItems(cachedItems);
    }

    try {
      const items = await fetchFeed();
      setCachedData(items);
      renderItems(items);
    } catch (e) {
      if (!cachedItems) {
        const li = document.createElement('li');
        li.textContent = 'Unable to load videos at this time.';
        list.appendChild(li);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

