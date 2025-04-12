---
title: Microsoft Azure Secret Agent Vulnerability
repost_link: https://twitter.com/GossiTheDog/status/1437896101756030982
---

[@GossiTheDog](https://twitter.com/GossiTheDog):

> Microsoft Azure silently install management agents on your Linux VMs, which now have RCE and LPE vulns.
>
> Microsoft don’t have an auto update mechanism, so now you need to manually upgrade the agents you didn’t know existed as you didn’t install them. [https://www.wiz.io/blog/secret-agent-exposes-azure-customers-to-unauthorized-code-execution/](https://www.wiz.io/blog/secret-agent-exposes-azure-customers-to-unauthorized-code-execution/)

And in response, [@amilluttwak](https://twitter.com/amilluttwak):

> This is even more severe. The RCE is the simplest RCE you can ever imagine. Simply remove the auth header and you are root. remotely. on all machines. Is this really 2021?

<video
controls
preload="auto"
src="https://static.wolfgirl.dev/cybersec/2021-09-14.mp4"
type="video/mp4"
width="100%"

> </video>
