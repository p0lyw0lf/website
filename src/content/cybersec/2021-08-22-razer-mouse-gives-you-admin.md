---
title: Razer Mice Give You Admin
repost_link: https://twitter.com/j0nh4t/status/1429049506021138437
---

From [@j0hn4t](https://twitter.com/j0hn4t) on twitter:

> Need local admin and have physical access?
>
> - Plug a Razer mouse (or the dongle)
> - Windows Update will download and execute RazerInstaller as SYSTEM
> - Abuse elevated Explorer to open Powershell with Shift+Right click
>
> Tried contacting [@Razer](https://twitter.com/Razer), but no answers. So here's a freebie

and then a video showing how, when you plug in a Razer mouse, it pulls up a window asking you to install more software (because it's driver can do that). Of course, that window has to run as admin to actually install software. And there's links to File Explorer from in there.

Razer ended up fixing this eventually, but many other devices have been catalouged to have similar behavior, and Microsoft can't invalidate all of those drivers, so we're sort of stuck with this vuln forever :)
