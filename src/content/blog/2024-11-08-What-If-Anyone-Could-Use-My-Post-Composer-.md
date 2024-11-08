---
title: "What If Anyone* Could Use My Post Composer?"
description: "A somewhat-common complaint I see on bsky/fedi is \"gah, these darn character limits, if only i had somewhere to jot down longer posts, i..."
tags: ["programming"]
published: 1731090148
---

A somewhat-common complaint I see on bsky/fedi is "gah, these darn character limits, if only i had somewhere to jot down longer posts, i would be incentivized to post to my blog most often. alas, i have to open a text editor on my computer and fumble around with `git`, which is simply too much work."

Which, like, fair! I actually had this exact same issue. And then, in the spirit of [Write Your Own Tools](https://wolfgirl.dev/blog/2024-09-28-write-your-own-tools/), I wrote my own post composer, as pictured here:

![](https://static.wolfgirl.dev/polywolf/blog/01930c42-0ba7-7ff1-a6f4-8a540781bd7d/IMG_0208.jpeg)

I've continued to add features since I first started using it too: drafts (with auto-save!), uploading attachments, and previews were all not part of the initial conception. But, because I Wrote My Own Tool, every time I felt it was lacking something, I could just add it.

Now that's great n all, but back to the original point: I started thinking, since I have this really neat tool that works well for my usecase, might other people find it suitable for their usecases too? How would I go about "productionizing" it? So here I am, brainstorming & writing down some proposed restrictions that would make it possible for me to do so in a fairly short timeframe:

1. Users will log in with GitHub[^1]
2. Users will select a repository + branch + path they want to "post" to, and will have the ability to customize the filename and content according to templates (instructions/examples included)
3. Users will NOT have the ability to automatically upload attachments, like I do
4. Users will NOT have the ability to automatically make announcements on bksy/fedi, like I do

These restrictions assume a workflow of "uses GitHub Actions to automatically update a website whenever a commit is added"[^2], which I'm assuming is at least somewhat possible for the majority of people who would be interested in this tool (doesn't really help if you don't have automatic deploys set up already).

And now I reveal the true reason for this post: to gauge interest before I embark on changing my janky code to be slightly less janky for others to use. If you're reading this, and would be interested in using this tool, please leave a comment/contact me with something that includes the phrase "i'm interested in using your post composer". If the above restrictions preclude you from using this, please also let me know somehow. And as always, thanks for reading <3

[^1]: This is the part I see the most people getting hung up on, b/c who's gonna trust a random person they've never met with "ability to act on your behalf on private repos" oauth permissions?? i sure wouldn't
[^2]: More security-conscious people may object to this as well, given GitHub's historically lax security regarding exposing repository secrets to workflows. They have been getting better tho!