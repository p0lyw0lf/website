---
title: OpenSSL "Critical" Error Was A Trivial Buffer Overflow
repost_link: https://github.com/openssl/openssl/commit/c42165b5706e42f67ef8ef4c351a9a4c5d21639a#diff-de2651c670dde92b08e86f386059436bee7f7271df21a18036e8b9d85b8070feL330-R325
---

The previous error to be labeled like this was Heartbleed. This one is very
tame by comparison. I don't know whether to be relieved or annoyed lol

However, the severity was dropped down to High once the bug was actually
released.

What makes this bug _even worse_ is that it will crash on the basic testcase
provided with the punycode spec. So this code was quite literally untested.
And still resulted in a high-severity error. yikers
