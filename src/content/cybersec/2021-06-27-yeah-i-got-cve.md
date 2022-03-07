---
title: \"Yeah I got a CVE :sunglasses:\"
direct_link: https://github.com/pypa/virtualenv/issues/1207
---

This is, quite possibly, the dumbest CVE ever assigned.

Verbatim, the actual bug:

```
root@kali:~#pip install virtualenv
root@kali:~#virtualenv test_env
root@kali:~#cd test_env/
root@kali:~/test_env#source ./bin/activate
(test_env) root@kali:~/test_env#`
`2、Sandbox escape
(test_env) root@kali:~/test_env#python $(bash >&2)
root@kali:~#
(test_env) root@kali:~/test_env#python $(rbash >&2)
root@kali:~#` ``
```

Clearly, this is not a bug. `virtualenv` never claimed any sandboxing capabilities, especially for **_the bash prompt on the machine that you can already run commands in_**.

Somehow, this got a CVE assigned to it. wth
