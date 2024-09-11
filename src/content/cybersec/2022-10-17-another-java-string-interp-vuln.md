---
title: Another Java String Interpolation Bug
direct_link: https://nvd.nist.gov/vuln/detail/CVE-2022-42889
---

Java "Don't Run Template Formatting For User Strings Espectially When That Template Formatting Can Make Arbitrary Network Calls" Challenge: Impossible

From [@GossiTheDog](https://twitter.com/GossiTheDog)'s thread on this:

> https://twitter.com/gossithedog/status/1582041938638667784
>
> Potential Log4shell situation - Apache Commons Text supports functions that allow code execution, in potentially user supplied text strings.
>
> One to keep an eye on. CVE-2022-42889 allocated and under review.
>
> Version 1.5-1.9, released between 2018-2022

> https://twitter.com/GossiTheDog/status/1582015230925996035
>
> This one is going to need smarter minds than me to look at it. There are open source projects which use the function.. Doesn't mean vuln tho, obvs.

> > https://twitter.com/1ZRR4H/status/1582040744713256961
> >
> > Similar to CVE-2022-33980 🤔
> >
> > ${script:js:java.lang.Runtime.getRuntime().exec("ping -c1 10.10.10.10")}
> > https://twitter.com/GossiTheDog/status/1582041938638667784
>
> yep it's essentially a replay of this issue but in a different part of Apache Commons
