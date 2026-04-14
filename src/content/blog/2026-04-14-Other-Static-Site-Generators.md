---
title: "Other Static Site Generators"
description: "This sat in draft for way too long whoops To celebrate a \"working site\" milestone in my driver SSG project, I decided to take a look back..."
tags: ["reviews"]
published: 1776179767
mastodon: "https://social.treehouse.systems/@PolyWolf/116403718143174248"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3mjhoej3ras2r"
---

~~This sat in draft for way too long whoops~~

To celebrate a "working site" milestone in my [driver](https://github.com/p0lyw0lf/driver) SSG project, I decided to take a look back at my [Static Site Generators post](https://wolfgirl.dev/blog/2026-02-23-so-ive-been-thinking-about-static-site-generators/). It got a lot of traffic at the time!! Thank you again to everyone who read & commented on it, y'all made my week <3

As one might have expected, talking about SSGs online had a "360 noscope nerdsnipe headshot" effect, so across multiple platforms I have amassed a grand collection of Static Site Generators, based on peoples' mentions/recommendations, to gaze upon at our leisure. Sure it's not as grand a collection as [Awesome Static Generators](https://myles.github.io/awesome-static-generators/) ("all 148 of them!") or [Jamstack](https://jamstack.org/generators/) ("all 377 of them!") or [staticsitegenerators.net](https://staticsitegenerators.net/) ("all 484 of them!"), but I think it's impressive nonetheless.

To avoid bias, I shall order them alphabetically, and give reviews to all:

+ [11ty](https://www.11ty.dev/): Embroiled in controversy over their acquisition by [Font Awesome](https://blog.fontawesome.com/eleventy-joins-font-awesome/) & their recent rename to "Build Awesome", but beloved by a strong community. One of the classic Javascript SSGs.
+ [bai](https://github.com/aslilac/bai) by [Kayla](https://mckayla.blog/): Seems like a custom templating program, written in Rust, which can be used as part of an SSG? neat
+ [Bilo](https://metacpan.org/pod/Blio) by [domm](https://domm.plix.at/): Perl! Poking around the codebase it's honestly pretty readable. Very much a "tool-for-one-person" deal tho
+ [blogserver](https://github.com/bertmuthalaly/blogserver) by [Bert](www.somethingdoneright.net/about): Instead of _just_ producing files, this then loads produced files as part of a Go binary, and serves directly from loaded memory that way. Looks like it uses a Make-like system called [redo](https://redo.readthedocs.io/en/latest/) to efficiently produce changes, TIL about that looks cool.
+ [flora](https://code.kat5.dev/nick/flora) by [Nick](https://codeandcake.dev/): What a cute Ruby DSL! Be careful not to mix it up with [flower](https://flower.jyn.dev/) by Jynn, that one uses a Clojure DSL instead.
+ [her.esy.fun](https://git.esy.fun/yogsototh/her.esy.fun) by [Yann](https://her.esy.fun/about-me.html): Makefile + org-mode, a classic pairing
+ [ikiwiki](https://ikiwiki.info/) by [Joey](https://joeyh.name/): Is a wiki a blog? I guess it sort of is, considering [icefox's blog](https://wiki.alopex.li/) is a wiki. Anyways I like the name, it is a bit of complex Perl however
+ [luasmith](https://github.com/jaredkrinke/luasmith) by [Jared](https://log.schemescape.com/): I was thinking about using a Lua DSL for my project, but didn't because I like Javascript more. Pretty cool to see just how much can be done with just Lua, and also how many libraries there are for it!
+ [mk12/blog](https://github.com/mk12/blog) by [mk12](https://mitchellkember.com/): Zig, designed for speed, includes a custom Markdown & MathML parser?? pretty awesome honestly
+ [md2blog](https://jaredkrinke.github.io/md2blog/) by Jared (same person as before): Deno binary, "zero config" opinionated setup, another classic type of personal project. This came before luasmith.
+ [Nanoc](https://nanoc.app/) by [Denis](https://denisdefreyne.com/): Ruby! Tho this one uses more standard HTML templates. Seems like good docs too.
+ [nextgen](https://github.com/winks/nextgen) by [Florian](https://f5n.org/about/): Purpose-built generator where most all the logic is written in Rust, again highly-opinionated to site layout/features. If Javascript SSGs are classic then Rust SSGs are modern :3
+ [riki](https://riki.liw.fi/) by [Lars](https://liw.fi/): An attempt at re-writing ikiwiki in Rust. I like Rust more than Perl so I want this to succeed...!!
+ [susam.net](https://github.com/susam/susam.net) by [Susam](https://susam.net/about.html): Common Lisp!! Specifically, Steel Bank. Seems like this author has re-written their static site generation multiple times, where this is the latest. I tried to read it but it sure is Lisp yep.
+ [tumblelog](https://github.com/john-bokma/tumblelog) by [John](https://johnbokma.com/): Both Python & Perl versions of the same program, kept in feature parity?? They say it hasn't been done before now. Interesting concept to use Markdown files as the basis for templating instead of HTML; I guess makes sense given technically it's a subset, and given the intended use of the program (microblogging).
+ [YOcaml](https://yocaml.github.io/tutorial/): It's always nice to see OCaml being used for real code <3 Seems like a pretty extensive tutorial too!
+ [Zensical](https://zensical.org/): An offshoot project created as part of the whole [MkDocs fiasco](https://fpgmaas.com/blog/collapse-of-mkdocs/). Was plugged to me in a comment on Mastodon, seems very corporate somehow.
+ [Zine](https://zine-ssg.io/) by [Loris](https://kristoff.it/): It's all Zig!! The configuration, frontmatter, & templates all being Zig-inspired is a neat touch :3

I had a lot of fun cataloging these small corners of the internet. Really makes me aware of just how many other people are out there, also doing cool stuff. Hope this was as inspiring for you as it was for me!