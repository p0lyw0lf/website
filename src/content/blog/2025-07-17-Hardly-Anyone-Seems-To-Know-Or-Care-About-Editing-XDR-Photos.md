---
title: "Hardly Anyone Seems To Know Or Care About Editing XDR Photos"
description: "In classic PolyWolf fashion, instead of finishing any of the N projects I have going on currently, I decided to take some photos yesterda..."
tags: ["photography"]
published: 1752802406
---

In classic PolyWolf fashion, instead of finishing any of the N projects I have going on currently, I decided to take some photos yesterday & post them to my blog. Quick, easy, in-n-out, 15min editing tops, just gotta redact some license plates, be a good citizen 'n all, how hard could it be? :)

![orange diamond sign has been modified to say "Dork zone ahead", photo taken at a dutch angle of an urban car-lined street](<https://static.wolfgirl.dev/polywolf/blog/01981ad4-f782-7991-9b01-4e6dfc3f4bd9/IMG_9976.jpeg> "it's me, thats my zone")

uh. so. some explanations are in order. **XDR**  a.k.a. UltraHDR if u live in Google land instead of Apple land, is a feature by which displays will adjust their brightness beyond the system whitepoint when displaying compatible photos/videos. this can lead to some pretty striking effects; check out <https://gregbenzphotography.com/hdr/> on your (somewhat recent) phone to see what I mean.

Honestly, I wish I had found Greg's website _much_ sooner; it'd a godsend for exactly the information I was looking for (tysm greg ilyyyy <3). Before finding his website, all i came across was this [lonely StackExchange post](https://apple.stackexchange.com/questions/456892/how-to-produce-edit-and-view-hdr-photographs-format-on-xdr-displays-properly) w/ no responses & this [random forum post](https://discuss.pixls.us/t/manual-creation-of-ultrahdr-images/45004) where they discuss manually creating gain maps to apply with command-line tools, which is a bit much even for me.

Before _that_, I tried out every image editing app I had available to see which one could preserve my image's XDR-ness when edited:
* iOS's default editor[^default-editor]
* MacOS's default editor
* GIMP
* Krita
* Clip Studio Paint
* Procreate 
* Affinity Photo
* Adobe Fresco
* hell, even Adobe Lightroom for iOS since that's free somehow

Unfortunately, according to Greg, the only ones that could have possibly worked are GIMP, Affinity Photo, & Adobe Lightroom. And of those, only Adobe Lightroom has support for gain maps[^gain-maps], which my photo used. And! Out of all the apps I tried, Lightroom was the only one without a paintbrush tool :(((( no license plate redaction for me i guess...

So! What's done is done, and I have resigned myself to the fate of a normal Display P3 gamut image for this one, so sad i know. And listen, I already knew that my blog's image preprocessing likely would've wiped out the XDR-ness anyways, so all this effort wouldn't have affected the viewing experience at all, but it's about the principle of the thing y'know? a girl's gotta have principles

anyways hope i can upload the rest of those photos tomorrow. peace y'all ✌️

[^default-editor]: Yeah I have no idea how this one failed either. I guess they just don't expect people who markup their images to care that it's not super bright anymore, or even notice since the images ur marking up usually aren't XDR anyways?? very strange.
[^gain-maps]: There are two main ways to make your images super bright: gain maps and 32-bit. gain maps are when you store an extra image in the metadata alongside your images saying how much brighter each overall pixel should be, and 32-bit is when you just use a bunch of extra data to encode exactly how much bright each individual RGB channel should be across an enhanced brightness range. phone photos will often use gain maps because they're smaller in size and give visually comparable outputs, while things like camera raws will be in 32-bit RGB for maximum losslessness when processing in ur editing software.