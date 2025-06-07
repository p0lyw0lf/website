---
title: "I\u0027m A Nixpkgs Maintainer Now"
description: "ok so here\u0027s the story: before i was writing [\"Packaging Multiple Dependent Python Modules Using Hatch \u0026 Nix\"](https://wolfgirl.dev/blog/..."
tags: ["nix"]
published: 1749337749
mastodon: "https://social.treehouse.systems/@PolyWolf/114644600167099861"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3lr2hsbahf22p"
---

ok so here's the story: before i was writing ["Packaging Multiple Dependent Python Modules Using Hatch & Nix"](https://wolfgirl.dev/blog/2025-05-15-packaging-multiple-dependent-python-modules-using-hatch-nix/), i was trying to package my website's ["backend"](https://github.com/p0lyw0lf/crossposter). unfortunately, i hit a stumbling block more stumble-y than i ever could have anticipated: one of the key Python dependencies I relied on (the [Sanic](https://sanic.dev/en/) webserver) was unmaintained in nixpkgs, crashing w/ a `ModuleNotFoundError` 🙀

fortunately, i know nix{pkgs} now, so i was capable of [resolving the problem](https://github.com/NixOS/nixpkgs/pull/409605). tho i might as well [update Sanic while i was at it](https://github.com/NixOS/nixpkgs/pull/409599). and [add myself as maintainer for the things I touched](https://github.com/NixOS/nixpkgs/pull/410499). and [add that sanic-ext package i need for my backend too](https://github.com/NixOS/nixpkgs/pull/410691). oh wait yeah that third one right.

## What Does Being A Maintainer Mean??

All it means is, I will automatically get pinged if someone opens a PR to make changes to these packages in the future :) Doesn't mean I have commit privileges yet! Tho, staring down the never-ending deluge of PRs that crash against nixpkgs daily, I'm not sure I want to really? It's a lot of power, but also a lot of responsibility (<img src="https://static.wolfgirl.dev/polywolf/blog/01974c83-e2a2-7bb3-acae-aeb9b4cea33e/Mvc2-spiderman.png" alt="spiderman" title="spiderman" style="display: inline; width: 32px; height: 27.5px; vertical-align: bottom;" />). Participating in the process for what happens if your PR drops off the first couple pages (you apologetically post in a Matrix room and a maintainer very graciously merges it) has been humbling, really reinforces that this is a community effort to make this thing run as smoothly as it does. Now that I've taken a closer look at the gears, I am more awe-struck than ever; there is _such_ a massive amount of labor put into this project, for free, in people spare time, because they believe in it, just like I did. Something special, I think :)

As for why I waited until my last PR was merged (which took about 2 weeks), instead of when my maintainership status was official (2 weeks ago, just 3 minutes from PR to merge, surely some sort of record) to make this post? Well, ya know, girls be silly sometimes :P