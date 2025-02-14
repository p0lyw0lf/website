---
title: "More Automatic Crossposting!"
description: "I crossposted my [last blog post](https://wolfgirl.dev/blog/2024-10-17-work-on-my-toy-compiler-is-progressing-smoothly/) to my [Mastodon]..."
tags: ["programming"]
published: 1729307782
---

I crossposted my [last blog post](https://wolfgirl.dev/blog/2024-10-17-work-on-my-toy-compiler-is-progressing-smoothly/) to my [Mastodon](https://social.treehouse.systems/@PolyWolf) and [Bluesky](https://bsky.app/profile/wolf.girl.technology) accounts, because I have no idea how much traffic my RSS feed is getting, and seeing funny numbers go up in response to people acknowledging my post feels good. I then realized, "hey wait a minute, I have [this whole framework](https://github.com/p0lyw0lf/crossposter) for publishing to multiple platforms, which I'm using for this blog, and already have a Mastodon backend, so why don't I just hook that up too?" And then I hooked it up and all was well :)

...except, that isn't the entire story. I did not have a Bluesky backend before tonight, and adding one turned out to be a bit trickier than I intended.

### The Easy Part

Authentication was a lot simpler than Mastodon; Bluesky just uses password login. I'm fortunate there's a Python client for [atproto](https://pypi.org/project/atproto/), and my secrets system can handle sensitive data like passwords just fine, so hooking it in was no issue.

### The Unexpectedly Hard Part

Bluesky has pretty minimal rich text formatting: just links, hash-tags, & at-mentions. All I really wanted was links, and thought I could just drop in a URL into the post body & Bluesky clients would automatically make it clickable, just like Mastodon clients seem to do. Nope! Turns out, atproto has some sort of out-of-band (i.e. not contained in the text itself) data called "facets" for this purpose. Meaning I somehow had to construct a [`TextBuilder`](https://atproto.blue/en/latest/atproto_client/utils/text_builder.html#atproto_client.utils.text_builder.TextBuilder) object with the link to my post formatted the way I desired.

If I were willing to hardcode things, this might have been easy. Unfortunately, I don't accept such half-measures. The rest of my backends work by running Jinja2 over a text file and then pushing that elsewhere, why shouldn't I be able to do the same with Bluesky? So I figured out a way. What my slowly-becoming-more-sleep-addled-by-the-second brain came up with was to use the [mistletoe](https://github.com/miyuchina/mistletoe) markdown parsing library to traverse a markdown AST into a `TextBuilder`, like so:

```python
from atproto import client_utils
import mistletoe
from mistletoe.base_renderer import BaseRenderer

class BlueskyRenderer(BaseRenderer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.builder = client_utils.TextBuilder()
        self.has_paragraph = False

    def render_inner(self, token):
        for token in token.children:
            self.render(token)
        return self.builder

    def render_raw_text(self, token):
        return self.builder.text(token.content)

    def render_line_break(self, token):
        return self.builder.text("\n")

    def render_paragraph(self, token):
        if self.has_paragraph:
            self.builder.text("\n\n")
        self.has_paragraph = True
        return self.render_inner(token)

    def render_link(self, token):
        return self.builder.link(token.title, token.target)

    def render_auto_link(self, token):
        return self.builder.link(token.target, token.target)

def render_post(post: str) -> client_utils.TextBuilder:
    return mistletoe.markdown(post, BlueskyRenderer)
```

This is a bit janky, since the `render_*` functions are supposed to return a `str`, not a `TextBuilder`, but Python is dynamically typed so it all works out! Hopefully you've seen this for yourself, having been directed from one of the platforms I've crossposted this to :)

[Write Your Own Tools](https://wolfgirl.dev/blog/2024-09-28-write-your-own-tools/) philosophy strikes again!!
