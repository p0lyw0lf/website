---
title: Javascript For Crypto? Goes As Well As You'd Expect
repost_link: https://securitylab.github.com/advisories/GHSL-2021-1012-keypair/
---

Basically there was a whole heck of a bunch of type confusion that led to extremely weak keys.

The highlight of this, originally quoted from [https://twitter.com/julianor/status/1447691543394066436](https://twitter.com/julianor/status/1447691543394066436) (emphasis mine):

> The impact is that each byte in the RNG seed has a **97% chance** of being 0 due to incorrect conversion. When it is not, the bytes are 0 through 9.

Absolutely insane, thank you javascript, everything really is strings of BCD
