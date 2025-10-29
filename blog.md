---
layout: page
title: Blog
permalink: /blog/
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

