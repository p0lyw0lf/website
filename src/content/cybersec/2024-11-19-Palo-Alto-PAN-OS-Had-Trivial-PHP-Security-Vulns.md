---
title: "Palo Alto PAN-OS Had Trivial PHP Security Vulns"
direct_link: "https://labs.watchtowr.com/pots-and-pans-aka-an-sslvpn-palo-alto-pan-os-cve-2024-0012-and-cve-2024-9474/"
---

CVE-2024-0012:

> We simply… supply the `off` value to the `X-PAN-AUTHCHECK` HTTP request header, and the server helpfully turns off authentication?!

CVE-2024-9474:

> Somehow a user is able to pass a username containing shell metacharacters into the `AuditLog.write()` function, which then passes its value to `pexecute()`.

what silly PHP bugs to be found in year 2024 :)