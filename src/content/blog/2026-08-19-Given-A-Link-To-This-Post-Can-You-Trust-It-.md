---
title: "Given A Link To This Post, Can You Trust It?"
description: "A simple threat model that provides insight into how complex the internet is"
tags: ["cybersec"]
published: 1787159187
mastodon: "https://social.treehouse.systems/@PolyWolf/117123267224308054"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3mth7rkdcuc2p"
---

Let's say I give you a link to post of mine that had, say, some PGP keys. You trust me completely that this is the correct link for what I wanted to share. Later, you open the link in your web browser. What other things must you trust in order to conclude my keys made it to you unaltered?

1. The domain, wolfgirl.dev, is still owned by me & under my control.
2. [Porkbun](https://porkbun.com/), my registrar, does not interfere with the DNS of domains registered with it.
3. [Cloudflare](https://www.cloudflare.com/), Porkbun's DNS provider, does not interfere with domains it acts as a root for.
4. [AWS](https://aws.amazon.com/) S3 + Cloudfront (what the DNS entry normally points to) do not modify content that goes thru them.
5. Either:
	1. You trust your DNS provider, and the system of Let'sEncrypt DNS challenges, OR
	2. No root CA uses their signing key for my domain, except for ones I authorize.
6. Either:
	1. You trust all the hops from AWS's servers to your computer, OR
	2. Your browser properly displays when it is using HTTPS on my site
7. If you don't trust (5.1), or you don't trust (6.1):
	1. The cryptographic guarantees of HTTPS are such that no-one between AWS and your computer can modify the content of my site.
8. Your browser does not have code to change the content of my site

Let's break down the possible attacks at each step.

## 1: Domain Hijacking

A thing that happens often is, someone will let their (very important!) domain expire, and someone else will be able to take it over. By "take over", we mean to say they can control the DNS entries for the domain to say whatever they want. [Wikipedia](https://en.wikipedia.org/wiki/Domain_hijacking#Notable_cases) has some notable examples.

## 2, 3: DNS Hijacking

This is similar to domain hijacking, in that "someone has control over the DNS entries", except this someone is a DNS root (who may have been hacked themselves!) instead of someone with domain ownership.

## 4: Webhost Filtering

Webhosts are often where the TLS part of HTTPS is terminated. TLS is pretty strong, but it only gives guarantees about the content _after_ it's been encrypted, not before. So, we need to trust the webhost to accurately represent the content I've uploaded to it. AWS is fairly reputable, but back in the days of "you upload your PHP files to a webhost" this was a greater risk.

## 5: Forged Cerficate

HTTPS is a method by which your computer and AWS's servers can communicate securely. As part of the initial outreach, your computer sends "hey I'm looking for `wolfgirl.dev`, are you authorized for that?", and AWS sends back "yep, sure am, here's a signature from a Certificate Authority you trust". Once that happens, some cryptographic mathemagic happens and the servers can securely exchange data.

The most common breach in this is parties who are NOT my webhost somehow obtaining a signature from a Certificate Authority. That's unfortunately [more common than you might think](https://sslmate.com/resources/certificate_authority_failures), even to this day.

## 6: HTTP MITM

You ever been to a coffee shop, and their initial WiFi doesn't have a password, but then you go online and the webpage you want gets redirected to a separate login page? Congratulations, you're the victim of a Man-In-The-Middle attack. In this case, the "Man" is the WiFi router the shop uses. It looks at your packets intended for the external internet, thinks "no thank you", and redirects them to itself instead. The end result is, any HTTP websites you visit are modified to the one the router chooses, until you finally accede to its demands. Afterwards, it remembers your MAC address as one that completed its challenge, and lets your packets through.

This sort of thing can happen at _any_ hop between your computer and AWS's servers! They're controlled by a large mix of ISPs that, if you are using HTTP, can inspect/modify the contents of the packets they route to their heart's content. This has been a thing for _ages_, and is in fact the reason why HTTPS & other methods like HSTS were invented.

## 7: TLS Break

A very hypothetical scenario is "what if TLS itself is broken?". Some algorithms in use are susceptible to being broken by a very large quantum computer, so if someone has one of those today (or is sitting on a classical break that many people have been trying very hard to find), they can inspect/modify the contents of HTTPS traffic as if it were HTTP, which, as discussed previously, means you cannot trust it.

## 8: Malicious Programs

"Of course I trust my web browser" is something no one has ever said, especially not after hearing about [Brave browser injecting its own affiliate links into websites](https://www.cpomagazine.com/data-privacy/brave-privacy-browser-caught-automatically-adding-affiliate-links-to-cryptocurrency-urls/). Now, sure, Brave is probably the least trustworthy browser, right alongside [Arc](https://arc.net), [Dia](https://www.diabrowser.com), and OpenAI's now-canceled [Atlas browser](https://openai.com/index/introducing-chatgpt-atlas/), and mainstream ones like Firefox & Chromium are a bit better, but you can never _really_ know for certain.

## 9: (Bonus) Trusting Trust & Supply Chains

The classic [Reflections on Trusting Trust](http://users.ece.cmu.edu/~ganger/712.fall02/papers/p761-thompson.pdf) demonstrates a very real vulnerability that could be implemented today, with enough effort, to compromise any of the above layers. So really, to trust my website is to trust that the entire digital infrastructure is functioning without flaw. Which, at least for the purposes of delivering my words to your screen, it does!

---

This sure is a long-winded way of saying "i don't publish my PGP key because I've already lost them twice". If you want to reach out, just do so via Signal (polywolf.2580). I can give you that number in-person and it's a lot easier to use than GPG anyways.