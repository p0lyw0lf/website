---
title: Widevine L3 DRM claimed broken
direct_link: https://twitter.com/david3141593/status/1080606827384131590
---

i need to be reminded to finally get around to doing this

> Soooo, after a few evenings of work, I've 100% broken Widevine L3 DRM. Their Whitebox AES-128 implementation is vulnerable to the well-studied DFA attack, which can be used to recover the original key. Then you can decrypt the MPEG-CENC streams with plain old ffmpeg...

The legal version is boring and much longer https://www.da.vidbuchanan.co.uk/blog/netflix-on-asahi.html
