---
layout: home
---
<div class="home-layout">
  <div class="home-left">
    <h1>Hi, I'm Devin.</h1>
    <img src="{{ '/assets/images/homepage/me.webp' | relative_url }}" alt="Animated image of Devin" class="home-img">
  </div>

  <div class="home-right">
    <p>I'm no longer active on most social media platforms. I've set up this simple site as a way for friends and family to see what I'm up to and get in touch.</p>

    <p>Please see the <a href="{{ '/about/' | relative_url }}">About</a> page for more information and contact details.</p>

    <h2>Recent posts</h2>
    <ul class="post-list">
    {% for post in site.posts limit:5 %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span> — {{ post.date | date: "%b %d, %Y" }}</span>
        {% if post.description %}<div class="desc">{{ post.description }}</div>{% endif %}
      </li>
    {% endfor %}
    </ul>
    <p><a href="{{ '/blog/' | relative_url }}">View more →</a></p>

    {% include theme_toggle.html %}
  </div>
</div>