// Fetch and render YouTube RSS feed entries as linked titles
(function () {
  const LIST_ELEMENT_ID = 'yt-video-list';
  const FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCz4_b11cchORwaXPPflRGDg';
  const MAX_ITEMS = 5;

  function getText(el) {
    return el ? (el.textContent || '').trim() : '';
  }

  function parseFeed(xmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    // Handle parsererror
    if (doc.querySelector('parsererror')) {
      throw new Error('Failed to parse RSS XML');
    }
    const entries = Array.from(doc.getElementsByTagName('entry'));
    return entries.slice(0, MAX_ITEMS).map((entry) => {
      const title = getText(entry.getElementsByTagName('title')[0]);
      const linkEl = entry.getElementsByTagName('link')[0];
      const href = linkEl ? linkEl.getAttribute('href') : '';
      return { title, href };
    });
  }

  function renderItems(items) {
    const list = document.getElementById(LIST_ELEMENT_ID);
    if (!list) return;
    if (!items.length) {
      const li = document.createElement('li');
      li.textContent = 'No videos found.';
      list.appendChild(li);
      return;
    }
    for (const item of items) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.rel = 'noopener noreferrer';
      a.target = '_blank';
      a.textContent = item.title || 'View video';
      li.appendChild(a);

      list.appendChild(li);
    }
  }

  async function fetchWithFallback(url) {
    // Try direct fetch first (works if CORS is allowed)
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.text();
    } catch (err) {
      // Fallback via public CORS proxy
      const proxied = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
      const res2 = await fetch(proxied);
      if (!res2.ok) throw new Error('HTTP ' + res2.status);
      return await res2.text();
    }
  }

  async function init() {
    const list = document.getElementById(LIST_ELEMENT_ID);
    if (!list) return;
    try {
      const xmlText = await fetchWithFallback(FEED_URL);
      const items = parseFeed(xmlText);
      renderItems(items);
    } catch (e) {
      const li = document.createElement('li');
      li.textContent = 'Unable to load videos at this time.';
      list.appendChild(li);
      // Optionally log to console for debugging
      // console.error(e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


