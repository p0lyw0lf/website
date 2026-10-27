---
title: "Blog Engine Revamped"
description: "There have been some updates to my blog engine, so i better write about them"
tags: ["blag"]
published: 1793129615
mastodon: "https://social.treehouse.systems/@PolyWolf/117514544184399914"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3myuy5phyr22k"
---

Whoa! A whole month no posts!! I made a lot of lazy media review drafts, but never got around to finishing any, might dump them all at once sometime later.

Anyways! The blog! Another reason I have not been blogging is because I've instead been spending time tinkering with my blog engine, naturally :3

The biggest change has been to how images are processed, which has been a whole ordeal that I will recount in excruciating detail:

## The Absolute State Of Rust Image Processing

I originally chose [`zune_image`](https://github.com/etemesi254/zune-image) for my image processing because I saw it supported JPEGXL and basically every other sort of operation I wanted, with just some "minor" things like [auto-orient based on exif data](git.sr.ht/~polywolf/driver/tree/b4a188eff5ab2847aafc0e3b88ced4327c2fe08c/item/packages/driver-query-ssg/src/zune/auto_orient.rs) missing. Turns out I was wrong, and both it & the older `image` crate are actually missing some pretty major things.

### 1) Zune Only Supports Bilinear Resizing

[`zune_imageprocs::resize`](https://docs.rs/zune-imageprocs/latest/zune_imageprocs/resize/index.html):

> Currently only implements a simple bilinear resizer, future plans are to have more complicated resizers implemented.

This is despite having a [`ResizeMethod`](https://docs.rs/zune-imageprocs/latest/zune_imageprocs/resize/enum.ResizeMethod.html) struct with a bunch of other resize filters. I guess those are just aspirational?? very strange

This was the reason all the images in my [gallery page](/art/) looked strange. I think the new resizer (more on that later) makes them look a lot more reasonable despite their 256x256 size.

### 2) `zune` and `image` only support lossless WebP encoding

[`zune_image` just shells out to `image_webp`](https://docs.rs/zune-image/0.5.0/src/zune_image/codecs/webp.rs.html#86), and [`image_webp`](https://docs.rs/image/latest/image/codecs/webp/struct.WebPEncoder.html) says:

> Right now only **lossless** encoding is supported.
> 
> If you need **lossy** encoding, you’ll have to use `libwebp`. Example code for encoding a [`DynamicImage`](https://docs.rs/image/latest/image/enum.DynamicImage.html "enum image::DynamicImage") with `libwebp` via the [`webp`](https://docs.rs/webp/latest/webp/) crate can be found [here](https://github.com/jaredforth/webp/blob/main/examples/convert.rs).

I was using `zune_image`'s support, which was why my images had a much larger filesize than they should have. All the reductions I was getting were purely from resizing + a slightly more efficient coding method than PNG.

### 3) `zune` only supports lossless JXL encoding

[`zune_jpegxl`](https://docs.rs/zune-jpegxl/0.5.2/zune_jpegxl/):

> Support for encoding jpeg xl images in pure rust
> 
> This currently features a small POC encoder for JPEG-XL format based on the POC over at the libjxl crate
> 
> It supports the following features
> 
> - lossless compression

lossy compression is absent from this list, perhaps to be expected from a "small POC encoder". So, switching to this format wouldn't have done me any better over WebP.

### 4) `image` doesn't support JXL encoding at all

[`image::ImageFormat`](https://docs.rs/image/0.25.10/image/enum.ImageFormat.html) doesn't have an entry for JXL, just WebP and Avif (the only other formats seriously worth considering for web images imo). So using that crate is a no-go if I want JXL support. Extending it basically doesn't work because of this (I checked).

### 5) `zune` doesn't support AVIF, and `image` don't have a great AVIF encoder

[`image::codecs::avif::AvifEncoder`](https://docs.rs/image/0.25.10/image/codecs/avif/struct.AvifEncoder.html) uses [`ravif`](https://docs.rs/ravif/0.13.0/ravif/) which is OK, but it's no [`AOM libavif`](https://github.com/AOMediaCodec/libavif) which is what I hear touted as the example of AVIF actually contended with JXL in the size/quality tradeoff.

`zune` is a bit more extensible, but I didn't _really_ want to do that, partially since the only Rust bindings to libavif were quite old, and mostly because I wanted off zune anyways for all the other reasons.

## So where do we go from here?

At this point, I was stuck. If I wanted to have "proper" image support (lossy JXL, lossy WebP, JPEG, & PNG encode/decode), it seemed I would be stuck cobbling together various `-sys` crates myself.

So I took a different approach! Instead of doing all the image processing, Markdown conversion, HTML minification, and build system nonsense in a single binary, could I perhaps split those jobs into separate binaries? That way I could slot in another, more mature image processing pipeline than whatever Rust has natively.

Just shelling out to external binaries goes against the goal of having the my build system be absolutely 100% pure and also easy to deploy. I had previously considered doing something crazy with wasm or something crazy with eBPF, but in the end the simplicity of "just call a binary normally" was too tempting to pass up.

I've built some tooling to partially alleviate my fears:

* Nix devshell makes all the binaries I call deterministic
* `driver clean --key run_command` can manually invalidate binaries that may have changed since the last run

But overall, changing priorities from "I Am Building The Final Build System Anyone Needs" to "i am just building an ssg for myself" made this decision easier.

[`driver-query-pure`](https://git.sr.ht/~polywolf/driver/tree/c16f26eb518ff7c41c2a66a09bbf0f53844105b3/item/packages/driver-query-pure/src/lib.rs) implements this from the Rust side, just as a way to call arbitrary binaries, and [`lib/runtime/image/convertImage.js`](https://git.sr.ht/~polywolf/hypertext-more/tree/6ec5d569d486317edf8570e34872e7ee68936cbf/item/lib/runtime/image/convertImage.js) implements this on the javascript side, as a way to call [ImageMagick](https://imagemagick.org/) in a way that's similar to how I was doing image conversion before.

I've also taken this time to make a "template" repository, [hypertext-more](https://git.sr.ht/~polywolf/hypertext-more) that goes over how things work together in a bit more detail. It is very much "oomfware", polished only to the extent that I and people who want to talk with me need it to be, but I think I've done a pretty good job making something so I am happy to share it.

## TL;DR

My [gallery](/art/) isn't completely ugly now, go check it out!!!!