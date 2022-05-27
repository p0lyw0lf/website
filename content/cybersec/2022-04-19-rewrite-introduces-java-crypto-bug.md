+++
title = "Rewrite Introduces Java Crypto Bug"
extra.direct_link = "https://neilmadden.blog/2022/04/19/psychic-signatures-in-java/"
+++

It's *very* interesting to hear that there were likely no cryptographers
involved in writing some pretty sensitive cryptographic code. This is a subtle
bug if you don't know crypto (like me) but also the fact that they didn't run
standard test cases against the library is also concerning. Anyways I guess the
takeaway here is "don't use Java" (perennial advice)
