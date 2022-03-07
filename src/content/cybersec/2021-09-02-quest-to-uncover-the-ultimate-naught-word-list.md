---
title: Quest to Uncover The Ultimate Naughty Word List
direct_link: https://twitter.com/moyix/status/1433254293352730628
---

[@moyix](https://twitter.com/moyix):

> While I wait for the GPU to churn through 2\*26^11 possibilities, a brief recap of how we got here. It started when I noticed this bit of code in the [@GitHubCopilot](https://twitter.com/githubcopilot) Visual Studio Code extension that detects naughty words in either the prompt or the suggestions.

> Because the words are hashed, we have to guess what words might be in the list, compute the hash of each, and then check to see if it's in the list (just like cracking password hashes).

> This managed to decode about 75% of the list right off the bat, and turned up some weird entries, like "israel" and "communist" [https://twitter.com/moyix/status/1431068919834480645](https://twitter.com/moyix/status/1431068919834480645)

> I also figured out what it's using the list for: it will suppress autocomplete suggestions if the suggestion contains a slur. So it has trouble completing a list of Near East countries, for example: [https://twitter.com/moyix/status/1431100461357096967](https://twitter.com/moyix/status/1431100461357096967)

> Microsoft makes all previous versions of extensions available as well, so you can also see how the list has changed over time: [https://twitter.com/moyix/status/1431987161763561475](https://twitter.com/moyix/status/1431987161763561475)

> I tried ever-larger wordlists from increasingly dubious sources (a dump of 4chan's /pol/ archive proved particularly fruitful) and managed to get 95% of the list decoded. But the last 5% is _hard_ [https://twitter.com/moyix/status/1432089610734157829](https://twitter.com/moyix/status/1432089610734157829)

> So it was time to apply absurd amounts of computer science to the problem. After porting the hash algorithm from Javascript to C, I started off by using symbolic execution (a fork of [@kleesymex](https://twitter.com/kleesymex) that supports floating point) to generate solutions [https://twitter.com/moyix/status/1432422559706910720](https://twitter.com/moyix/status/1432422559706910720)

> After fighting a bit with the Z3 constraint solver, I was able to ask it for multiple possibilities for each hash: [https://twitter.com/moyix/status/1432475304526819334](https://twitter.com/moyix/status/1432475304526819334)

> This line of attack got much faster with the help of [@RolfRolles](https://twitter.com/rolfrolles)'s Z3 skills and an observation from [@saleemrash1d](https://twitter.com/saleemrash1d) (independently noticed by [@ESultanik](https://twitter.com/esultanik)) that the hash function could be converted to pure integer math [https://twitter.com/moyix/status/1432724559145353219](https://twitter.com/moyix/status/1432724559145353219)

> One of the best finds from the Z3 approach was the discovery that "q rsqrt" had beed added to the bad word list to prevent Copilot from spitting out a piece of the Quake III source code [https://twitter.com/moyix/status/1432085687365513225](https://twitter.com/moyix/status/1432085687365513225)

> I also started doing some amateur cryptanalysis of the hash function. My crypto skills aren't great but I managed to get one word out of this by discovering that you can use already-decoded words to tell you things about undecoded ones [https://twitter.com/moyix/status/1432687143915241473](https://twitter.com/moyix/status/1432687143915241473)

> I also decided to take the analogy to password cracking seriously and wrote a plugin for John the Ripper, a popular password cracking tool. This uncovered quite a few more words. [https://twitter.com/moyix/status/1432695300024586240](https://twitter.com/moyix/status/1432695300024586240)

> At this point we only had 5 or so hashes left. And with the help of Z3, we could generate tens of thousands of possible candidates for each hash—but looking through all of them to tell which one was most likely was infeasible.

> Time for some machine learning. Large language models like GPT-2 are not only good at _generating_ text, they can be used to evaluate how plausible some text is according to the model. [https://twitter.com/moyix/status/1432760135705939971](https://twitter.com/moyix/status/1432760135705939971)

> If you ever find yourself in a situation where you need to evaluate whether a word or sentence in plausible in English according to GPT-2, lm-scorer does the job nicely [https://github.com/simonepri/lm-scorer](https://github.com/simonepri/lm-scorer)

> I also felt, around this time, like I was hitting the limit of Z3's performance. I wanted to generate _every_ 11-character alphabetic possibility for a hash, but after running for a day Z3 only came up with ~100,000 — and it can't easily be parallelized.

> You know what's great at doing a ton of simple things in parallel? A GPU. So I ported the hash function to CUDA to run it on an RTX 3090. This let me check about 1.5 trillion candidates per second and check 26^11 possibilities in ~40 minutes. [https://gist.github.com/moyix/f78e0b0d5724a1bf02e1a035e8bec136](https://gist.github.com/moyix/f78e0b0d5724a1bf02e1a035e8bec136)

> And that brings us up to the present. The GPU cracker worked perfectly, and found one of the four remaining words – and GPT-2 correctly ranked it as the most likely candidate [https://twitter.com/moyix/status/1433220663662239744](https://twitter.com/moyix/status/1433220663662239744)

> I was also able to take advantage of another observation about the hash function to realize that the plural form of this word was one of the other remaining hashes. So this leaves us with just two words (out of 1,170) undeciphered [https://twitter.com/moyix/status/1432816855060729860](https://twitter.com/moyix/status/1432816855060729860)

> Oops, I realized I didn't link to the decoded list. It can be found here; I have rot13 encoded it to guard against accidental viewing, but you can decode it with something like [https://rot13.com](https://rot13.com) [https://moyix.net/~moyix/copilot_slurs_rot13.txt](https://moyix.net/~moyix/copilot_slurs_rot13.txt)
