---
title: "EchoLeak: Prompt Injection -\u003e Data Exfiltration"
repost_link: "https://www.aim.security/lp/aim-labs-echoleak-blogpost"
---

Fun chain! Step 2/3 (bad markdown sanitization) is easily mitigated, but I bet the main exfil vector (official MS sharepoint proxy) is not so easily done, probably for legacy reason. And hoo boy that infiltration, Prompt Injection. Feels almost like the early days of getting root via stack overflow. But unlike memory safety (where now we have known tools/techniques which can stop it dead which are not used solely for legacy/perf reasons), it remains to be seen if there's anything which can stop PI. Good to see there are at least defenses in place now (XPIC), arms race getting started at least.