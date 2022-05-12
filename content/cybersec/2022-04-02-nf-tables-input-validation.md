+++
title = "Neat Bugs in `nf_tables` Input Validation"
extra.direct_link = "https://blog.dbouman.nl/2022/04/02/How-The-Tables-Have-Turned-CVE-2022-1015-1016/"
+++

Another very good writeup about how to exploit the Linux kernel, this time from a logic validation bug.

My Own Summary 2 Months After Reading This: the `nf_tables` component lets userspace code upload bytecode modules to be run, so it's gotta be very careful about making sure those modules don't have any bad behavior. An edge case slipped through the cracks, and those willy hackers pried that crack wide open.
