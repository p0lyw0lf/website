---
title: "You\u0027ll Never Guess How I Fixed My Networking Problem"
description: "For reference, here\u0027s my previous network topology:\r \r Verizon -(fiber)-\u003e fiber-to-ethernet box -(ethernet)-\u003e router -(coax)-\u003e wifi exten..."
tags: ["networking"]
published: 1729800312
---

For reference, here's my previous network topology:

Verizon -(fiber)-> fiber-to-ethernet box -(ethernet)-> router -(coax)-> wifi extender -(ethernet)-> switch -(ethernet)-> my computer

Yeah, it's pretty cursed, I know. <details><summary>Here's the rationale for anyone interested:</summary>

<p>The fiber comes in thru a network closet, so the fiber-to-ethernet box has to be there. However, the router can't fit in the closet, so it has to go in a room somewhere. Bedrooms are straight out, so this means we have to use the single wall ethernet jack in the living room to get internet to the router.</p>
<p>But then! Now we have no way of getting internet back out to the other ethernet jacks, because putting a switch before the router causes the fiber-to-internet box to get confused as to which one is the router. So, we used the coax port conveniently placed right next to the ethernet port to run a signal thru the walls to the bedroom with the weakest wifi, and then an ethernet port on the wifi extender can connect to the ethernet jack on that wall, and then a simple switch in the network closet can share ethernet with all the other rooms.</p>
<p>Got all that? Good.</p>
</details>

For a while, I would have sporadic 30s drops in internet connection, but only while plugged into ethernet; wifi was much more stable (tho, congested due to the existence of other apartments, esp uploads).

Now just think about this for a second. What in this chain could _possibly_ exhibit such behavior? The most likely suspects, Verizon, fiber-to-ethernet, & the router are all ruled out by the fact that wifi always works. And everything else seems like it falls into the category of "either it works 100% of the time or 0% of the time"[^3].

The next most likely suspect was my dinky ethernet-to-usb adapter I was using. But more experimentation revealed these drops happened across multiple adapters (2), across multiple machines (Windows & Mac laptops), with and without USB hubs, etc. I was stumped, and resolved to be just another WiFi Warrior.

Then, I offhandedly mentioned to my roommate I never used ethernet, and when quizzed as to why, **they too** said they noticed sporadic 30s drops. Both of us hadn't realized we were running into the exact same problem and assumed it was just something with our own hardware, not the common chain! Deciding to get to the bottom of this once and for all, we figured -(coax)-> wifi extender was the weakest link in the chain[^1], and removed it to create a new topology:

Verizon -(fiber)-> fiber-to-ethernet box -(ethernet)-> router -(ethernet)-> switch in my room -(ethernet)-> switch in network closet -(ethernet)-> roommate's computer

The router has to stay in the living room, so running a cable from it to my room has to go under the door, which is pretty silly[^2]. One cable then goes to the ethernet jack in my room (which leads to the closet), and another goes to my computer. There are many hops in this diagram, but it all seems to work flawlessly! Who knew that a wifi extender couldn't be trusted to act as a coax-to-ethernet converter :)

[^3]: well i mean, _maybe_ the switches, but like, really? i can't see how those fail for that long outside of like mac address spoofing attacks, which isn't happening on our LAN full of trusted devices.

[^1]: we both have basic networking experience and saw no reason to distrust any of the ethernet cables or switches we provided. So eliminating unknown variables made sense.

[^2]: ![ethernet cable running under a door onto my desk into a switch, with two more cables running off the desk](https://static.wolfgirl.dev/polywolf/blog/0192bf3c-a00d-7119-a205-26fd235172a9/IMG_7699.jpeg)
