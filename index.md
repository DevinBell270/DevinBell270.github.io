Hi, I'm Devin.

Welcome to my personal page.

I'm no longer active on most social media platforms. I've set up this simple site as a way for friends, family, and colleagues to see what I'm up to and get in touch.

Please see the [About]({{ '/about/' | relative_url }}) page for more information and contact details.

## Recent posts

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