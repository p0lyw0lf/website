---
layout: ../../templates/cybersec_page.astro
title: More OpenSSL Memory Corruption
direct_link: https://twitter.com/cstanley/status/1541507298404827137
---

From [@cstanley](https://twitter.com/cstanley):

> OpenSSL version 3.0.4, released on June 21th 2022, is susceptible to remote memory corruption which can be triggered trivially by an attacker. BoringSSL, LibreSSL and the OpenSSL 1.1.1 branch are not affected.
>
> [https://guidovranken.com/2022/06/27/notes-on-openssl-remote-memory-corruption/](https://guidovranken.com/2022/06/27/notes-on-openssl-remote-memory-corruption/)

Which is a quote tweet of the [original report](https://twitter.com/GuidoVranken/status/1539687342939820032) by [@GuidoVranken](https://twitter.com/GuidoVranken):

> The fix for this introduced a (probably remote?) memory corruption bug in the latest OpenSSL release.
>
> [https://github.com/openssl/openssl/issues/18625](https://github.com/openssl/openssl/issues/18625)

Which is yet another quote tweet of the [original original report](https://twitter.com/GuidoVranken/status/1532486198081507329) by the same guy:

> x64 modular exponentiation bug in OpenSSL and BoringSSL introduced in 2013
>
> [https://boringssl-review.googlesource.com/c/boringssl/+/52825](https://boringssl-review.googlesource.com/c/boringssl/+/52825)

So yeah this is an old bug. And also wow cryptography is already so hard, let alone using C correctly, ~~time to switch to a memory-safe language already geez~~ "oh but GC-ed languages can't do Crypto because timing attacks and real-time and blah blah" ok first of all they can still allocate scratch buffers and second of all I AM SHILLING FOR [RUST](https://rust-lang.org)