---
layout: home
description: Devin Bell - WKU graduate living in Bowling Green, Kentucky. Originally from Louisville. Personal blog and updates for friends and family.
---
<div class="home-layout">
  <div class="home-left">
    <p>I'm no longer active on most social media platforms. I've set up this simple site as a way for friends and family to see what I'm up to and get in touch.</p>

    <p>Please see the <a href="{{ '/about/' | relative_url }}">About</a> page for more information and contact details.</p>

    <h2>Recent posts</h2>
    <ul class="post-list">
    {% for post in site.posts limit:3 %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span> — {{ post.date | date: "%b %d, %Y" }}</span>
        {% if post.description %}<div class="desc">{{ post.description }}</div>{% endif %}
      </li>
    {% endfor %}
    </ul>
    <p><a href="{{ '/blog/' | relative_url }}">View more →</a></p>

    <h2>Go To Disney With Us</h2>
    <ul id="yt-video-list" class="post-list"></ul>
    <p><a href="https://www.youtube.com/@bellsindisney" target="_blank" rel="noopener noreferrer">View more →</a></p>
    <noscript>
      <p>Enable JavaScript to see our latest YouTube videos.</p>
    </noscript>

    <script src="{{ '/assets/js/youtube_feed.js' | relative_url }}" defer></script>

    {% include theme_toggle.html %}
  </div>
  <div class="home-right">
    <video class="home-img" muted playsinline alt="Animated image of Devin"></video>
  </div>
</div>

<script src="{{ '/assets/js/video_handler.js' | relative_url }}" defer></script>