---
layout: page
title: Status
permalink: /status/
description: Short status updates from Devin Bell.
---

{% include breadcrumbs.html %}

# Status feed

{% assign statuses = site.statuses | sort: 'date' | reverse %}

{% if statuses.size == 0 %}
<p>No status updates yet.</p>
{% else %}
<ul class="status-feed">
{% for status in statuses %}
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
{% endif %}

{% include theme_toggle.html %}
