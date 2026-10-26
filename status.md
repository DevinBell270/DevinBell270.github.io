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
  {% include status_item.html %}
{% endfor %}
</ul>
{% endif %}

{% include theme_toggle.html %}
