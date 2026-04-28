---
title: "Better Clickable Images"
description: "Just a small update of a thing I'm doing to make image-heavy posts on this site nicer :)"
tags: ["blag"]
published: 1777334842
---

In preparation for releasing a new [#photography](/tags/photography/) post,
I've been messing with my blog engine to make images a bit better.
Basically, the experience of "oh I want to zoom in on an image" is a bit
busted, because (1) that only really works on mobile (desktop page zoom is
always hard), and (2) the image you'd zoom in on is intentionally heavily
compressed.

In my previous site, I solved this by writing a [rehype pass](https://github.com/p0lyw0lf/website/blob/12cb31c11d47cc7eb89fcd890266df9b59b49745/src/plugins/rehypeRemoteImages.ts)
that would wrap all to-be-converted images in `<a></a>` tags pointing to the
original image, but this got a little annoying because when you'd click on the
image, the browser would immediately attempt to download it, and then you'd
have to open an image viewer, remember to delete the image later, etc. What
_should_ happen is, if you click the image in the browser, you stay in the
browser but just transition to a view of the original image at larger scale.

In fact, that's already what I do for my [art page /art/](/art/). This uses the
[HTML `popover` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover)
& [HTML `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
to allow page interactivity without requiring a single line of Javascript!! All
we need to do now is, whenever detecting an `![]()` markdown image, replace it
with the appropriate HTML & CSS styles to get it to work. So that's what I did!

This wouldn't have been nearly as possible w/o my new blog engine btw,
because the way Astro does automatic image stuff would have required me to
make a lot of nasty hacks, but now those "hacks" are just part of the site
itself, so I can do whatever I want with it!!

Overall I am much happier w/ the image-viewing experience now, I hope ppl make
great use of it to zoom into images when I release my next set :3 (btw you
should look at my [previous set](/blog/2025-09-26-coho-photo-zine-yes-and-ism/)
again too I think it is very good still)
