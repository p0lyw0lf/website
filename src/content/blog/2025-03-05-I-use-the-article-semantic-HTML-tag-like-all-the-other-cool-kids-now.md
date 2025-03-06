---
title: "I use the `\u003carticle\u003e` semantic HTML tag like all the other cool kids now"
description: "FreshRSS has a feature where, if an RSS feed doesn\u0027t have full-text articles, it can fetch the page that\u0027s linked and extract the page\u0027s..."
tags: ["rss"]
published: 1741233965
mastodon: "https://social.treehouse.systems/@PolyWolf/114113509152949207"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3ljomjzybus2v"
---

FreshRSS has a feature where, if an RSS feed doesn't have full-text articles, it can fetch the page that's linked and extract the page's HTML content from a CSS selector.

So! I naturally put of doing this for all my feeds for a long time, just clicking thru to the source page, which is fine, that's how the author intended for the piece to be viewed right, doesn't even happen that often, I can totally ignore the repeated reminders of how I procrastinate doing small things that meaningfully improve my QoL[^1].

However! Tonight I was so bored I figured I might as well just configure all those FreshRSS CSS selectors, and power thru I did. The process led me to discover the vast majority of blogs have their main content surrounded in `<article>`. And here I was, using `<div class="post">` like an absolute fool... This has been remedied. My procrastination of that Rust blog post I keep meaning to finish has not. Good night.

[^1]: A thin layer of dust that coats most of my room, a close-to-full laundry basket, 400+ undone WaniKani lessons... at least i cooked dinner tonight instead of doing a third "girl dinner" in a row !