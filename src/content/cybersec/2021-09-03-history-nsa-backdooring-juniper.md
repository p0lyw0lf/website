---
title: History of NSA Installing Backdoors on Juniper Routers
repost_link: https://twitter.com/matthew_d_green/status/1433470109742518273
---

[@matthew_d_green](https://twitter.com/matthew_d_green):

> The story here, for those who may have forgotten 2015 (it was a long time ago!) is that the NSA inserted a backdoor into a major encryption standard and then leaned on manufacturers to install it.

> The backdoor was in a pseudorandom number generator called Dual EC. It wasn’t terribly subtle but it was _deniable_. You could say to yourself "well, that could be horribly exploitable but nobody would do that." Lots of serious people said that, in fact. But they did.

> Not only did the NSA insert this backdoor into encryption standards, but they allegedly paid and pressured firms to implement it in their products. This includes major US security firms like RSA Security and Juniper. (That we know of!)

> In 2013, compelling evidence confirming the existence of this backdoor leaked out in the Snowden documents. We didn’t know quite how widely it had been implemented yet, but even then it was shocking.

> It would be such a terribly embarrassing story if it ended there. But it gets even worse.

> One of the products that the US Intel agencies allegedly convinced to use the backdoor was Juniper, whose NetScreen line of firewalls are widely deployed globally and in the US government. We didn’t know about this because the company hid it in their certification documents.

> Even if we’d known about this, I’m sure "serious" folks would have vociferously argued that it’s no big deal because only the NSA could possibly exploit this vulnerability (it used a special secret only they could know), so (from a very US-centric PoV) why be a big downer?

> But the field is called computer security; not computer optimism. We think about worst case outcomes because if we don’t do that, our opponents absolutely will.

> In fact, they already had. What nobody had considered was that _even if the backdoor required a special secret key_ only the NSA knows, a system with such a backdoor could be easily "rekeyed."

> In practice this would simply mean hacking into a major firewall manufacturer’s poorly-secured source code repository, changing 32 bytes of data, and then waiting for the windfall when a huge number of VPN connections suddenly became easy to decrypt. And that’s what happened.

> The company was Juniper, the hack was in 2012. It is alleged (in this new reporting) to have been a Chinese group called APT 5. Untold numbers of corporate firewalls received the new backdoor, making both US and overseas systems vulnerable.

Reporting being referred to (top of thread): [https://finance.yahoo.com/news/juniper-breach-mystery-starts-clear-130016591.html](https://finance.yahoo.com/news/juniper-breach-mystery-starts-clear-130016591.html)

> The new, rekeyed backdoor remained in the NetScreen code for over _three years_, which is a shockingly long time. Eventually it was revealed around Christmas 2015.

> Fortunately we learned a lot from this. Everyone involved was fired and no longer works in the field of consumer-facing cryptography.
>
> I'm kidding! Nobody was fired, it was hushed up, and everyone involved got a big promotion or lateral transfer to lucrative jobs in industry.

> The outcome of the Juniper hack remains hushed-up today. We don't know who the target is. (My pet theory based on timelines is that it was OPM, but I'm just throwing darts.) Presumably the FBI has an idea, and it's bad enough that they're keeping it quiet.

> The lesson to current events is simple: bad things happen. Don't put backdoors in your system no matter how cryptographically clever they look, and how smart you think you are. They are vulnerabilities waiting for exploitation, and if the NSA wasn't ready for it, you aren't.

> The second lesson is that "serious" people are always inclined away from worst-case predictions. In bridge building and politics you can listen to those people. But computer security is adversarial: the conscious goal of attackers is to bring about worst-case outcomes.

> It is very hard for people to learn this lesson, by the way. We humans aren't equipped for it.

> I want to say only two more slightly "inside baseball" things about Juniper and this reporting.
>
> First, the inclusion of Dual EC into Juniper-NetScreen wasn't as simple as the NSA calling the company up and asking them to implement "a NIST standard."

> Juniper’s public certification documents don’t mention Dual EC was even used in NetScreen products. It lists another algorithm. The NetScreen Dual EC implementation is included _in addition_ to the certified one, and without documentation. That stinks like cheese.

> And of course there is a very coincidental "oops" software vulnerability in the NetScreen code that allows the raw output of Dual EC to ooze out onto the wire, bypassing their official, documented algorithm. For more see: [https://dl.acm.org/doi/pdf/10.1145/3266291](https://dl.acm.org/doi/pdf/10.1145/3266291)

> I've told this story eight million times and it never ceases to amaze me that all this really happened, and all we've done about it is try to build more encryption backdoors. It makes me very, very tired.
