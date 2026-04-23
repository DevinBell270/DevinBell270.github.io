---
layout: home
description: Devin Bell - WKU graduate living in Bowling Green, Kentucky. Originally from Louisville. Personal blog and updates for friends and family.
---
<div class="home-layout">
  <div class="home-left">
    <p>I'm no longer active on most social media platforms. I've set up this simple site as a way for friends and family to see what I'm up to and get in touch.</p>

    <p>Please see the <a href="{{ '/about/' | relative_url }}">About</a> page for more information and contact details.</p>
    <p>GitHub: <a href="https://github.com/DevinBell270">DevinBell270</a></p>

    <h2>Recent statuses</h2>
    {% assign recent_statuses = site.statuses | sort: 'date' | reverse %}
    {% if recent_statuses.size == 0 %}
      <p>No status updates yet.</p>
    {% else %}
    <ul class="status-feed">
    {% for status in recent_statuses limit:5 %}
      <li class="status-feed__item">
        <time class="status-feed__time" datetime="{{ status.date | date_to_xmlschema }}">
          {{ status.date | date: "%b %d, %Y · %l:%M %p" | strip }}
        </time>
        <div class="status-feed__body">
          {{ status.content | markdownify }}
        </div>
      </li>
    {% endfor %}
    </ul>
    <p><a href="{{ '/status/' | relative_url }}">View all statuses →</a></p>
    {% endif %}

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

    <h2>Our Disney & family adventures on Youtube</h2>
    <ul id="yt-video-list" class="post-list"></ul>
    <p><a href="https://www.youtube.com/@bellsindisney" target="_blank" rel="noopener noreferrer">View more →</a></p>
    <noscript>
      <p>Enable JavaScript to see our latest YouTube videos.</p>
    </noscript>

    <script src="{{ '/assets/js/youtube_feed.js' | relative_url }}" defer></script>

    {% include theme_toggle.html %}
  </div>
  <div class="home-right">
    <video class="home-img" 
           src="{{ '/assets/images/homepage/me-light.mp4' | relative_url }}"
           poster="{{ '/assets/images/homepage/me-1x.webp' | relative_url }}"
           fetchpriority="high"
           preload="auto"
           muted 
           playsinline 
           aria-describedby="home-video-description">
      <track
        kind="captions"
        srclang="en"
        src="{{ '/assets/captions/homepage-animation.vtt' | relative_url }}"
        label="Homepage video captions">
      Your browser does not support the homepage video.
    </video>
    <p class="sr-only" id="home-video-description">Animated portrait of Devin Bell. No audio.</p>
    <section class="home-info-box" aria-labelledby="home-info-box-title">
      <h2 class="home-info-box__header" id="home-info-box-title">Information</h2>

      <div class="home-info-box__grid">
        <h3 class="home-info-box__section">Account Info</h3>
        <div class="home-info-box__label">Name:</div>
        <div class="home-info-box__value home-info-box__value--link">Devin Bell</div>
        <div class="home-info-box__label">Member Since:</div>
        <div class="home-info-box__value home-info-box__value--link">Feb 14, 2025</div>

        <h3 class="home-info-box__section">Basic Info</h3>
        <div class="home-info-box__label">Birthday:</div>
        <div class="home-info-box__value home-info-box__value--link">04/17/1987</div>
        <div class="home-info-box__label">Sex:</div>
        <div class="home-info-box__value home-info-box__value--link">Male</div>
        <div class="home-info-box__label">Home Town:</div>
        <div class="home-info-box__value home-info-box__value--link">Louisville, Ky</div>
        <div class="home-info-box__label">High School:</div>
        <div class="home-info-box__value home-info-box__value--link">Fern Creek High School</div>

        <h3 class="home-info-box__section">Personal Info</h3>
        <div class="home-info-box__label">Relationship Status:</div>
        <div class="home-info-box__value home-info-box__value--link">Married to Lacey Bell</div>
        <div class="home-info-box__label">Interest:</div>
        <div class="home-info-box__value home-info-box__value--link">Fishing, Disney, Weight Lifting, Vibe Coding</div>
      </div>
    </section>
  </div>
</div>

<script src="{{ '/assets/js/video_handler.js' | relative_url }}" defer></script>