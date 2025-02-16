---
title: "Optimizing Markdown Images With Astro"
description: "I dug into this because it had been on my mind for a while, and I wanted to get something working before I uploaded Japan trip photos. A..."
tags: ["programming", "javascript"]
published: 1739417795
mastodon: "https://social.treehouse.systems/@PolyWolf/113994484677281168"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3lhzr3xqt6s2r"
---

A previous version of this post contained some factual errors. I'm re-publishing this under a new URL so that it will update in your RSS reader. Updates are noted where applicable.

---

I dug into this because it had been on my mind for a while, and I wanted to get something working before I uploaded Japan trip photos. A couple nights later, I have learned a bit about how Astro & Remark/Rehype & Vite work, and a lot about how what I'm trying to do is futile.

From my understanding, this is how Astro optimizes [local images in Markdown files](https://docs.astro.build/en/guides/images/#images-in-markdown-files):
1. [remark-collect-images.ts](https://github.com/withastro/astro/blob/8d4e566f5420c8a5406e1e40e8bae1c1f87cbe37/packages/markdown/remark/src/remark-collect-images.ts), a Markdown AST transformation step, finds all the image paths that look like `![]()` and not `<img src="" />`, so we only optimize the Markdown images. It records this information into context that's passed to the next step.
2. [rehype-images.ts](https://github.com/withastro/astro/blob/8d4e566f5420c8a5406e1e40e8bae1c1f87cbe37/packages/markdown/remark/src/rehype-images.ts), an HTML AST transform step, turns all those images that look like `<img src="./local.png" />`[^1] and turns them into something that looks like `<img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;./local.png&#x22;,&#x22;index&#x22;:0}" />`. It does this because it's easier to look for, and safer to parse later compared to raw HTML.
3. [vite-plugin-markdown/images.ts](https://github.com/withastro/astro/blob/8d4e566f5420c8a5406e1e40e8bae1c1f87cbe37/packages/astro/src/vite-plugin-markdown/images.ts) takes the list of local image URLs (generated as part of transforming the Markdown into HTML in the above steps), and the HTML with these `__ASTRO_IMAGE_` things in them, and generates a full-on Astro component, Javascript source & everything, to be rendered later.

Phew, that's a lot!! Hope you're still following along :)

So, the procedure I described works perfectly fine for standalone `.md` pages. The problem comes when trying to apply this same transformation to markdown files rendered as part of a [content collection](https://docs.astro.build/en/reference/modules/astro-content/), which is what my blog files are stored as. Instead of being rendered as part of the "main" Astro flow, content collection entries are rendered separately, as part of a loader, like [content/loaders/glob.ts](https://github.com/withastro/astro/blob/8d4e566f5420c8a5406e1e40e8bae1c1f87cbe37/packages/astro/src/content/loaders/glob.ts#L183). For Markdown, this calls into [vite-plugin-markdown/content-entry-type.ts](https://github.com/withastro/astro/blob/8d4e566f5420c8a5406e1e40e8bae1c1f87cbe37/packages/astro/src/vite-plugin-markdown/content-entry-type.ts), which does no such image replacement, because content entries aren't in the correct stage of the build.

~~And I don't think we _can_ get to the correct stage here! The whole reason this code does the `__ASTRO_IMAGE_` rigamarole is so it can call the image transformation function at the correct time. With content collections, all the rendering happens "too early", so the images can't be transformed.~~ UPDATE 2025-02-15: This is incorrect. The replacement happens in [content/runtime.ts](https://github.com/withastro/astro/blob/3842ce5ec9471d358042b3d9ef697cf06c7a91f6/packages/astro/src/content/runtime.ts#L401-L447), during the actual rendering, which makes sense. I wasn't seeing this before because (a) im bad at looking and (b) it's gated on Astro detecting images in the body, which it does not currently do for remote images.

Alternatively, I _could_ use [MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/), which is like Markdown but compiles to Javascript instead of HTML, which _does_ always have the image transformation step, thanks to [rehype-image-to-component.ts](https://github.com/withastro/astro/blob/8d4e566f5420c8a5406e1e40e8bae1c1f87cbe37/packages/integrations/mdx/src/rehype-images-to-component.ts). However, I do not like MDX's weird character restrictions (c'mon, no `<`, really??), so I will not use it >:(

At this point, I'm seriously considering moving away from Astro's built-in image optimization service to my own... For now though, I'm giving up 😔

UPDATE 2025-02-13: I have just discovered that [Markdoc](https://docs.astro.build/en/guides/integrations-guide/markdoc/#custom-image-components) does exactly what I want it to: provide the ability to use a custom component to override what `![]()` means, without limiting Markdown syntax. This is very very good news! Here's hoping those files will still have reasonable build times. Also I should probably make it so my Post composer re-uses the Markdoc config...

UPDATE 2024-02-14: Markdoc also doesn't work for my needs because it doesn't have footnote support :((((( I make heavy use of footnotes in my text and I do not want to change how I write those. The whole _point_ of Markdown is to make it so you don't look like you're formatting your text with tags, and Markdoc ignores that and immediately goes back to demanding you use tags for nonstandard features. It seems I am better served by the remark/rehype ecosystem for my parsing needs, so I will continue to do that.

UPDATE 2024-02-15: I did it! I fixed Astro!! The above information was a tad incorrect, what I wanted to do was possible with a bit of elbow grease, so I put in the work and opened a couple PRs: [#13254](https://github.com/withastro/astro/pull/13254) & [#13256](https://github.com/withastro/astro/pull/13256). I also have the necessary patches for [astro](https://github.com/p0lyw0lf/website/blob/d7a866fef2356fb194527fc7cf48c8f20e616cc6/patches/astro.patch) and [@astrojs/markdown-remark](https://github.com/p0lyw0lf/website/blob/d7a866fef2356fb194527fc7cf48c8f20e616cc6/patches/%40astrojs__markdown-remark.patch) in my website directly, so I don't have to wait for them to be upstreamed. 

[^1]: I believe this is a minor bug: if you have both `![](./local.png)` _and_ `<img src="./local.png" />`, I think the latter image will be transformed when it shouldn't be. At least, that's if I'm reading the code right, which I may well not be :P
