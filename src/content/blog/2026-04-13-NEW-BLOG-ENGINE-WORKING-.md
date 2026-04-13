---
title: "NEW BLOG ENGINE WORKING!!"
description: "Finally!!! It\u0027s been a while since I started thinking about this, but I finally have things in a state where I can build my entire site u..."
tags: ["blag"]
published: 1776087156
---

Finally!!! It's been a while since I [started thinking about this](https://wolfgirl.dev/blog/2026-02-23-so-ive-been-thinking-about-static-site-generators/), but I finally have things in a state where I can build my entire site using it. In fact, you're looking at its output right now :3[^rss] The best part? **Rebuilds for a single blog post changing content are 100ms baby** lesgooooooo[^improvements].

Other types of rebuilds that change logic affecting all pages range from 200ms to 1sec, which is totally fine in my book. Overall I'm very pleased with the speed, which is good, considering that's literally the reason I started this whole project in the first place.

In the process of getting things this fast, I had to think a lot about algorithms & data structures, which also forced me to learn a lot of new things. I have a few [draft posts](https://rc.wolfgirl.dev/drafts/) about that in the works, which, now that I've properly finished the coding, I will have no excuse but to work on instead. Keep an eye out for those I guess ¯\\\_(ツ)\_/¯

[^rss]: You may have already noticed if you're using RSS; the feed went out briefly and has come back as an Atom feed instead.
[^improvements]: And that's before some other improvements I have in mind, like "don't spawn an absurd amount of Boa contexts" and "use a file watcher instead of hashing every input file every time".