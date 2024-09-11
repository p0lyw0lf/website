---
title: Do Intel Chips Have A Data Dependence For Adding Numbers?
direct_link: https://chaos.social/@gsuberland/109751988733831279
---

So [an Openwall post](https://www.openwall.com/lists/oss-security/2023/01/25/3)
made the extrordinary claim that Intel and AMD chips do not have data
independence for instructions commonly used in cryptography, and certain
libraries should set a bit in order to ensure they do.

This is partially true: the vendors don't _guarantee_ data independence when
the bit is not set for those instructions, but there have been no observed
cases so far of data dependence.

So in conclusion, the bit should probably be set just in case, but the world is
not in fact on fire, phew.
