---
title: "Reducing 404 Errors By Being Less Lazy"
description: "I had a problem[^1]: every time I posted something to this blog, I immediately got a bunch of 404 errors. To understand why, we must firs..."
tags: ["devops"]
published: 1744517229
mastodon: "https://social.treehouse.systems/@PolyWolf/114328682778813379"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3lmo6do5ljc2j"
---

I had a problem[^1]: every time I posted something to this blog, I immediately got a bunch of 404 errors. To understand why, we must first understand how my crossposter worked:

1. Create Mastodon post
2. Create Bluesky post
3. Create commit in GitHub with the URLs of the above posts, for comment URLs
4. GitHub Actions sees the commit and kicks off a build

The problem with this is, the Mastodon and Bluesky posts were created _before_ my blog post URL went live! Social media platforms like Mastodon and Bluesky like to include URL previews, and naturally they need to fetch the URL to do this. I could sort of tolerate just a few servers and fast-clicking users getting 404s, but uh, every fediverse server that syndicates with mine _also_ fetches this URL very soon after posting, in an infamous "fedi hug of death".

The only possible fix is to make sure the post URL is live before creating the Mastodon/Bluesky posts. However, I also want to include the Mastodon/Bluesky post URLs in my final post, leading to a bit of a chicken-and-egg problem. I eventually decided it'd be fine to do 2 website rebuilds, one without the comment URLs and one with. Extending my existing publishing process, I thought I'd do this:

1. Create commit in GitHub w/ no comment URLs
2. GitHub Actions sees this commit and kicks off a build.
3. At the end of the build, GitHub Actions hits a webhook on my server, letting it know which post it should continue the process for
4. Create Mastodon post
5. Create Bluesky post
6. Create a second commit in GitHub with the new comment links, with a special commit format telling GitHub not to hit my webhook a second time

This is janky & nasty but it would probably work. I probably would have done it, too, **if only GitHub Actions wasn't such a pain to work with**. Very simple things like "parse some text out of a commit message" require shelling out to the classic `head | cut` and doing some nastiness w/ setting output variables, which, just why.

In my frustration, I had an epiphany: why am i using GitHub Actions at all?? I have a perfectly cromulent server running my crossposter already, so why not... just do the website build on there:

1. Create commit in GitHub with no comment links
2. Build & publish website, using a simple shell script that my crossposter can wait for before moving onto the next step
3. Create Mastodon post
4. Create Bluesky post
5. Create a second GitHub commit
6. Build & publish website again

lol[^2].

Comparing the [new `publish_blog.sh`](https://github.com/p0lyw0lf/crossposter/blob/a7cc890fa0ee15b67faca6534a16ec6f3996866a/scripts/publish_blog.sh)[^3] to the [old GitHub Actions workflow](https://github.com/p0lyw0lf/website/blob/2424c13e617283b928635416fe4d3cb06b26c745/.github/workflows/main.yml), it's actually insane how much incomprehensible boilerplate I've been able to get rid of. Much of it is related to saving/restoring caches, but a lot is also the YAML being very verbose. After replacing it with my own, much more comprehensible [Python](https://github.com/p0lyw0lf/crossposter/blob/a7cc890fa0ee15b67faca6534a16ec6f3996866a/poster/script.py) & [YAML](https://github.com/p0lyw0lf/crossposter/blob/a7cc890fa0ee15b67faca6534a16ec6f3996866a/shared/config/config.yaml#L23-L24) boilerplate, I understand my own system much better now. [Write Your Own Tools](https://wolfgirl.dev/blog/2024-09-28-write-your-own-tools/) strikes again!!

[^1]: I'm writing this post in past-tense because, with this post, I'm now using the new 404-less system! Was hoping it'd work first try, but it did not, and some fast clicking-users may have seen some side-effect posts as I was testing the system in prod oops
[^2]: The GitHub commits are only so there's always a backup before doing any posting, there's probably a way to do this all in 1 commit, but whatever, I've done enough with this to be lazy again :P
[^3]: Oh yeah I also switched to [`rclone sync`](https://rclone.org/s3/#configuration) instead of `aws s3 sync`, because uploading my entire blog for every post turned out to be what was driving up my AWS costs, not [turning on logs](https://wolfgirl.dev/blog/2025-03-15-i-just-need-to-optimize-my-aws-egress-patterns/), lol.
