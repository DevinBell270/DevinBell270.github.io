---
layout: page
title: Blog
permalink: /blog/
description: Blog posts by Devin Bell - WKU graduate in Bowling Green, Kentucky. Personal updates and stories.
---

{% include breadcrumbs.html %}

# All posts

<ul class="post-list">
{% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span> — {{ post.date | date: "%b %d, %Y" }}</span>
    {% if post.description %}<div class="desc">{{ post.description }}</div>{% endif %}
  </li>
{% endfor %}
</ul>

{% include theme_toggle.html %}

