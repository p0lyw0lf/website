---
title: "I Am Almost (But Not Quite) Ready To Switch To NixOS"
description: "Feels like 9000 years, but really it\u0027s only been 4 months give or take. The reason it\u0027s taken this long is partly my own fault, and partl..."
tags: ["devops", "nix"]
published: 1754450869
mastodon: "https://social.treehouse.systems/@PolyWolf/114979693958130233"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3lvpbrbrbys2j"
---

Feels like 9000 years, but really it's only been 4 months give or take. The reason it's taken this long is partly my own fault, and partly the fault of Nix itself.

You see, I like to [write my own tools](https://wolfgirl.dev/blog/2024-09-28-write-your-own-tools/). What that ends up meaning is, in addition to running some "standard" services like a FreshRSS server & a Bluesky PDS on my cloud box, I also run some very non-standard stuff like <https://girl.technology/>, [my post composer](https://wolfgirl.dev/blog/2024-11-08-what-if-anyone-could-use-my-post-composer-/), & a small suite of home-grown discord bots. The "standard" services are all nicely packaged thanks to the hard work of many volunteers, but for my own stuff, I _have_ to write my own NixOS modules if i want to run them on NixOS.

Fortunately, writing custom NixOS modules isn't too challenging once you get a proper setup going[^getting-a-proper-setup]. Unfortunately for present me, past me did not really know about Nix when designing some tools, making assumptions like "of course we will be able to write to the directory my Python code lives in" & "of course `$PATH` will always be populated with all the programs we could possibly want". <https://girl.technology/>, being a Rust project where I tried to follow as many best practices as possible (including packaging in a flake!), was thankfully spared most of this, but my post composer & discord bots... first i took a month to polish up a blog post detailing [exactly how i was packaging my Python code](https://wolfgirl.dev/blog/2025-05-15-packaging-multiple-dependent-python-modules-using-hatch-nix/), just to make sure i understood everything that was going on, _then_ i had to [become a nixpkgs maintainer](https://wolfgirl.dev/blog/2025-06-07-i-m-a-nixpkgs-maintainer-now/) because some Python code upstream was broken (another month or so), and only this month did i realize "wait a minute i haven't actually fixed any of the bugs in my own code yet". so i did that. and hoo momma there were lots

No particular standouts really, just the standard "ah one more `substititeInPlace`/`wrapProgram`/dependency for `patchShebangsAuto`", plus figuring out how to detangle "everything goes into `.`" into "everything goes into`$DATA_DIR`"[^on-standard-stuff].  That and converting a hand-written nginx config to a NixOS nginx module definition is worthy of exactly the time I allotted it (couple hours on a weekend), and yet, uh, just never got around to it 'til now ig 🙃

Finnicky & annoying & _feels_ bad b/c I already have a perfectly cromulent Ubuntu 24.04 LTS server hosting all my stuff already, and it's been happily chugging along with no complaints. Just a few problems:

1. Every time the server reboots I have to ssh in and start a `tmux` session because all my services run as systemd user services that only run when my user has a session, not on boot.
2. Dist upgrades are liable to break all the Python virtual environments I have set up all over the place b/c those have links back to the main Python install.

Now, was it worth spending all this time just to sand off these few rough edges? Probably not! The one weekend I spent porting Python packages was likely more time than I would spend in the next 2 years managing my current setup. However, while I like to tell myself it's about "opportunities to make my cloud box do things it never even could before", it's really more about the principle of the matter :P

So! Lessons learned when designing my hacky pile of Python + shell scripts to be more compatible with Nix next time:
* No need to shell out to `subprocess.run` when something in `os.shutil` can do the trick
* If you do `subprocess.run` a shell script, invoke it directly so `patchShebangsAuto` can do its thing instead of an extra manual `substituteInPlace` step
* Do NOT just dump state into the current directory, put it somewhere configurable please :)

---

Now!! I've finally finished porting all my services to NixOS, even testing them in a VM to make sure (thanks, `nixos build-vm`!). So why is the article title "Almost Ready To Switch" & not "Have Successfully Switched"? Well... my target is an Oracle Always Free box, so it is `aarch64-linux`, and my laptop is `x86_64-linux`, and [`nixos-rebuild` really doesn't like that situation](https://github.com/NixOS/nixpkgs/issues/177873)[^nixos-rebuild]. There is a workaround where you use the `--fast` flag (to disable re-exec of Nix as `aarch64-linux` on your `x86_64-linux` host[^reexec-bug]) & a remote `--build-host`, unfortunately negating many of the effects of having a powerful builder locally. Still nice to have all your sources in one place ig.

It really is a rabbit hole with this Nix thing. "Ah yes just a little more effort and surely _then_ i will have the perfect setup" is a trap that I am currently falling into, and one that I have seen many more experienced Nix users fall into too. Glad it's just a hobby project, at least I'm having fun :)

[^getting-a-proper-setup]: I once had a link to a pretty good tutorial I followed to get this all set up, but I have since lost it... all that remains is what's in my [infrastructure](https://github.com/p0lyw0lf/infrastructure/tree/main/nixos) repo + the knowledge in my head that I should probably get into a blogpost some day. TL;DR nixos-infect + plain 'ol nixos-rebuild[^nixos-rebuild] have been a lot more reliable for me than things like nixos-anywhere or nixops. Then again there are bazillion similar blogs on this subject all with conflicting advice and I wasn't able to find the one I wanted by searching, so this would just be publishing into the void lol.
[^on-standard-stuff]: The other thing is, it was my first time packaging a poorly-written piece of code for Nix, so many of these problems were brand-new for me. Now that I am aware of these problems it is a lot easier to fix but yeah v frustrating the first time around :(
[^nixos-rebuild]: Ok so actually maybe nixos-rebuild isn't all that great...
[^reexec-bug]: Fun fact I think the checks for this are broken on the current nixos-unstable and it just goes ahead and tried to re-exec anyway, to disastrous effect. I put up a repository with reproduction steps [here](https://github.com/p0lyw0lf/nixos-rebuild-bug-repro), may try to report an issue later.