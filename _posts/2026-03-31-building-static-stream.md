---
layout: post
title: "Building Static Stream: '90s Channel Surfing for YouTube"
date: 2026-03-31
description: "Building an open-source, self-hosted web app that lets you channel surf YouTube."
---

I was working on another project today when I stumbled across an Engadget article titled "This web app lets you 'channel surf' YouTube like a '90s kid watching cable." Automatically, I thought: this is everything I've ever wanted in a YouTube app.

But then I visited the site. It turns out the owner controls all the content, and you literally have to pay to have your channel added to the rotation.

Fuck that.

So, I fired up a chat with Gemini Pro to map out a plan for a self-hosted version of the app. It took maybe 10 prompts back and forth to dial the architecture in exactly where I wanted it. Once the blueprint was solid, I spun the plan out to Cursor and GPT 5.4.

I’ve got to admit, I’m usually an OpenAI hater, but I am really liking GPT 5.4. It does an incredibly good job of checking its own work in the browser and executing long tasks. It essentially one-shotted the initial build.

The only real snag I had to handle manually was the YouTube API. The initial build called for channel IDs to pull the videos down, but YouTube largely hides those now in favor of user handles. To get it working, I had to build a quick workaround to convert the @handle into a channel ID before loading the videos. Not a big deal in the grand scheme.

I still have a lot of UI/UX work ahead of me to get it looking and feeling right, but the core concept is alive and kicking. Best of all, it's already available for anyone who wants to use it. You can grab the code on [my GitHub](https://github.com/DevinBell270/Static-Stream).

And of course, it is completely free and open source.
