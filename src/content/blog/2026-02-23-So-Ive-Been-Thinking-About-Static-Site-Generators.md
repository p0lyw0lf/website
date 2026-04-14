---
title: "So I've Been Thinking About Static Site Generators"
tags: ["programming"]
description: "My current one is _fine_, but the rebuilds are a bit too long for my tastes (>10s) so I'd like to change that."
published: 1771858183
mastodon: "https://wolfgirl.dev/blog/2026-02-23-so-ive-been-thinking-about-static-site-generators/"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3mfjwtoioqk23"
---

I'm aware of 2 broad classes of SSGs: those written for the authors' personal use which are quirky in interesting ways (a [very](https://maurycyz.com/misc/new_ssg/) [common](https://gearsco.de/blog/blog-in-gleam/) [topic](https://aashvik.com/posts/shell-ssg/) [on](https://sukr.io/) lobste.rs), and ones written for a mass audience that are more mellow but flawed in some other way ([Jekyll](https://jekyllrb.com/), [Hugo](https://gohugo.io/), [Hakyll](https://jaspervdj.be/hakyll/), [Zola](https://www.getzola.org/), [Astro](https://astro.build/), & many others). I've dealt with the latter kind for as long as I've had a blog, so it's about time I took a crack at the former.

This post will go over what I want, which afaik nothing on the market satisfies, and what I plan on doing about that.

## I Have A Need... For Speed™️

My top priorities in a static site generator are:

1. I can port my current site to it without too much difficulty
2. It is very very fast, "🚀BLAZING🔥" even

But what exactly does "fast" mean? Many times have I been saddened by Static Site Generators not being fast in certain ways, so learning from my experiences I'd like it to be fast in **all possible ways** please & thank you. Notably, we don't need a [full-fledged build system](https://jade.fyi/blog/the-postmodern-build-system/) for this, so we'll cut corners wherever possible to focus on speed for the SSG niche.

## (1) I Want Fast Clean Builds

I'm not _too_ concerned about these, because I would rather satisfy the upcoming requirements around re-builds, which are the majority of one's interaction with an SSG. 'd still be nice to be under a second tho.

Testing my current site, the most expensive part seems to be the in-memory transformations for all the separate files; surprisingly, file I/O itself is not the bottleneck! Here's an [strace](https://www.man7.org/linux/man-pages/man1/strace.1.html):

```
$ strace -c node node_modules/astro/astro.js build
...
18:34:57 [build] 301 page(s) built in 12.34s
18:34:57 [build] Complete!
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ------------------
 23.41    0.091898           3     30254       472 futex
 12.57    0.049332           1     39546     14563 statx
  8.74    0.034312          25      1352           unlink
  6.76    0.026544           1     15055           read
  6.43    0.025225           0     28933     27981 readlink
  6.09    0.023891           1     12906      5956 openat
  4.63    0.018191           4      3955           write
  4.56    0.017918           2      6894           epoll_pwait
  4.19    0.016459           2      7551           close
  2.50    0.009800        2450         4           wait4
  2.31    0.009070           8      1045           io_uring_enter
  1.78    0.006971           7       953           mmap
  1.67    0.006570           6       969           munmap
  1.57    0.006181           3      1694           mprotect
  1.41    0.005520        1840         3           clone
  1.33    0.005221           0      5781      4622 access
  1.26    0.004962           4      1055           madvise
  1.24    0.004865           0      7471           getpid
  1.16    0.004536           7       609       301 rmdir
  1.14    0.004478           0      6084           setsockopt
  1.11    0.004349          13       327           brk
  1.08    0.004240           4      1029           fstat
...
```

The total reported build time is 12.34s, yet syscalls are only \*does some quick math\* 0.4s of that total! (Also, that number of syscalls seems totally unreasonable, but whatever.) My guess is having _everything_ in Javascript accumulates performance woes from all the data shuffling, and there's not a whole lot to be done except change frameworks/languages.

### => Build MUST Be In A Compiled Language

This really is the only way we can make content transformations fast enough. Fortunately, there is a wealth of non-Javascript-based Markdown-To-HTML & HTML-To-Minified-HTML programs to choose from; [comrak](https://github.com/kivikakk/comrak) & [minify-html](https://github.com/wilsonzlin/minify-html) both look pretty good.

However... just because the "expensive" steps are in compiled languages, doesn't mean the build as a whole will be fast. Maybe I was holding it wrong, but trying a [Makefile-based solution](https://github.com/p0lyw0lf/website2/blob/74799c1253ad52f4e713169c6c35248931cadc1a/Makefile) led to so many reads/process spawns that a clean build took about 5 seconds, already much too slow for my tastes. `strace` doesn't work quite as well here (besides saying "yes, waiting for subprocesses really is the blocker"), so I guess the cumulative overhead of running a bunch of processes that all touch a bunch of files (~600 of both) is just too much, somehow.

### => Build SHOULD Be A Single Process

Ideally, there's just one compiled program running the entire build start-to-finish, reading all the files into memory (my site is not very large), transforming them in-memory, and writing back exactly what's changed. This limits file I/O to the bare minimum, and we should be able to make the in-memory transforms fast too. Existing known-fast SSGs do this, so we must be on the right track!

## (2) I Want Fast Re-Builds When Content Changes

I _could_ just say "Fast Re-Builds are just Fast Clean Builds" and be done with it pack it up go home; that's what Hugo, Zola, & most homebrew SSGs do. But no, it'd be boring doing the same thing as everyone else. We need super specil\[sic\] fast. We need something with a cache, a cache _so_ robust & complete that a re-build runs _exactly_ what's needed based on what's changed, and no more. This is known in the business as an "incremental build". My modest goal is sub-300ms rebuild times, ideally sub-100ms or even sub-20ms if I can swing it.

However! Turns out doing proper incremental builds is kinda tricky. I guess is this why most frameworks avoid it :P Even if you can swing complete dependency tracking, a naïve method of "this file is dirty so I should rebuild everything that depends on it" doesn't suffice, because that can and will over-rebuild. Consider the following scenario:

+ Pages are set up such that each one has a link to the next and previous pages, if they exist.
+ Markdown files are stored with [frontmatter](https://www.markdownlang.com/advanced/frontmatter.html) specifying the title that should be used for any links pointing to them.

Then, the rebuild would go like this:

1. Markdown file changed, marked dirty
2. => Frontmatter metadata is marked dirty
3. => Collection of _all_ metadata is marked dirty
4. => Any page reading from "collection of all metadata" is marked dirty
5. All pages read from "collection of all metadata" to create next/previous links
6. => All pages are marked dirty

Notably, step (2) happens even if only the page content changes! This means _any_ change to _any_ page causes **the entire set of pages** to get re-built, negating any benefits of caching.

You can somewhat get around this by breaking step (3), precisely tracking which pages read from what metadata so a more minimal set of pages are rebuilt, but an even better approach is to also break step (2), by **only marking the frontmatter metadata as dirty if it actually changes.**

### => Build MUST Use A Real Incremental Algorithm

There are a couple approaches to this sort of fine-grained incrementality that I'm aware of:

1. The Red-Green Algorithm [as used by Rust for incremental compilation](https://salsa-rs.github.io/salsa/reference/algorithm.html#the-red-green-algorithm) & [explained really well by thunderseethe](https://thunderseethe.dev/posts/lsp-base/#red-green-algorithm)
2. Nix's derivation model, [explained pretty well by shuppy](https://shuppy.org/posts/10000251.html)
3. Jade's [postmodern build system](https://jade.fyi/blog/the-postmodern-build-system/), which also covers the first two
4. [Build Systems à la Carte](https://www.microsoft.com/en-us/research/wp-content/uploads/2018/03/build-systems.pdf), which provides a framework for all possible other approaches

I am a huge Rust-head so let's go with the first approach :3

How Red-Green deals with our example is, a step can be marked "green" (unchanged) even if it has "red" (changed) dependencies, so long as its output doesn't change on the re-run. This does the correct thing if both the metadata _hasn't_ changed (only (1) is dirty, (2) is not), as well as if it _has_ changed (1-3 are truly dirty, but many things at 4 aren't dirty because they read the unchanged parts).

<details><summary>Here's a longer trace I wrote to convince myself this works</summary>

In our example, there are a few "queries" which are individually cached[^queries]:

```
fn parse_frontmatter(f: File) -> Metadata;
fn collect_metadata(fs: Vec[File]) -> CollectedMetadata;
fn index_metadata(cm: CollectedMetadata, i: usize) -> Option[Metadata];
fn build_page(f: File, cm: CollectedMetadata, i: usize) -> ();
fn build_all_pages(fs: Vec[File]) -> ();
```

These queries form a dependency graph as follows:

```
build_all_pages() >---------------------\
       v                                |
       |                                |
       v                                |
collect_metadata()                      |
       v                                |
       |                                |
+------+--+---------+---------+         |
|         |         |         |         |
v         v         v         v         |
parse(0)  parse(1)  parse(2)  parse(3)  |
                                        |
index(0)  index(1)  index(2)  index(3)  |
^         ^         ^         ^         |
|         |         |         |         |
+--------/^\--------+--------/^         |
^\--------+--------/^\--------+         |
|         |         |         |         |
^         ^         ^         ^         |
build(0)  build(1)  build(2)  build(3)  |
^         ^         ^         ^         |
|         |         |         |         |
+---------+---------+---------+---------/
```

Or, a bit more readably:
+ `build_all_pages` depends on `collect_metadata` and all the individual `build` calls.
+ each `build` call depends on its own `index`, as well as the adjacent `index` calls.
+ each `index` call depends on "nothing", since it is pure wrt it's inputs. It still needs to be separate from the `parse` calls though, just in case file order changes during the collection step.
+ the `collect_metadata` call depends on each `parse` call.

Then, say we change the metadata for the first file. The algorithm works like[^rg-terminology]:
* `build_all_pages`: Have my dependencies changes?
	* `collect_metadata`: Have my dependencies changed?
		* `parse(0)`: Changed!
	* `collect_metadata`: Changed! Time to re-compute.
		* `parse(0)`: Already marked as changed
		* `parse(1)`: Not changed
		* `parse(2)`: Not changed
		* `parse(3)`: Not changed
* `build_all_pages`: Changed! Time to re-compute.
	* `build(0)`: Have my dependencies changed?
		* `index(0)`: Changed!
	* `build(0)`: Changed! Time to re-compute.
		* `index(0)`: Already marked as changed.
		* `index(1)`: Not changed
	* `build(1)`: Have my dependencies changed?
		* `index(0)`: Already marked as changed
	* `build(1)`: Changed! Time to re-compute
		* `index(0)`: Already marked as changed
		* `index(1)`: Already marked as not changed
		* `index(2)`: Not changed
	* `build(2)`: Have my dependencies changed?
		* `index(1)`: Already marked as not changed
		* `index(2)`: Already marked as not changed
		* `index(3)`: Not changed
	* `build(2)`: Not changed, no need to re-compute.
	* (`build(3)` is mostly the same as `build(2)`)

As expected, we only needed to re-compute `build(0)` & `build(1)`. Neat!

</details>

All of this is also why we need hermetic (deterministic) builds. Red-Green & other incremental algorithms assume that "inputs didn't change" => "outputs won't change either". In the context of a general build system running external programs, this assumption may be incorrect or the inputs very hard to specify[^hermeticity-hard]. But in the context of a Static Site Generator where you can tightly control all the build logic, I think it is a perfectly fine assumption to make[^tracing-easy].

## (3) I Want Fast Re-Builds When Logic Changes

Even among other SSGs that do have caching (which the vast majority do not, mind you), they'll assume "most the time you'll be editing content, requiring a full re-build when logic changes is totally fine." But that assumption is bad, actually. Having quick iteration times when hacking on the logic of the site is super valuable & not something I will give up. It's fine if those builds a little slower than changing mere content, but it still shouldn't require a clean build of the entire site just to change the number of posts shown on the home page.

This might be tricky, however, because the previous two requirements _reeeeeeally_ want the build to be in a compiled language. But we'll get there. Just u watch.

First, I'd like to draw a distinction between the "build driver" (program that reads/transforms/writes files) and the "logic" (specification for **what** files are read/written, and what transforms will be done).

These don't have to be the same program! In fact, many, nay, most SSGs separate these concepts. A common models is a "build driver" (Jekyll, Hugo, Zola) that finds & interprets a bunch of template files containing site-specific logic. These frameworks vary in how much logic they let you express with those templates/configuration files, but what they share in common is **the build driver stays the same for all runs**.

My one gripe with this model is, the faster the builds are, the less powerful the templates tend to be. [As jyn mentions](https://flower.jyn.dev/#why-clojure?), writing logic inside such templating languages sucks & feels bad, so it'd be much nicer if we were able to write logic in a "real" language instead.

This brings us to another form of static site generator: one that merely provides a framework of composable tools to describe how your site should be built, and then "building the site" is just running the program you've assembled. Hakyll is an archetype for this, and I'd describe "powerful" Javascript frameworks such as Next.JS or Astro as this too: they all have "real languages" to push data into templates, rather than relying solely on folder structure/config files.

Unfortunately, this increased flexibility comes with a cost. If all the tools are Javascript, we get performance woes from earlier. And the logic is written in a compiled language, you have to re-compile whenever the logic changes, and that re-compile can take a while. Here are some language options we could choose, ordered by how familiar I am with it:

| Language  | Rebuilds        | Why Not?                                     |
| :-------- | :-------------- | :------------------------------------------- |
| Rust      | Incremental     | Still too slow (2-5s)                        |
| Go        | Incremental     | I don't like it, only a bit faster than Rust |
| C/C++     | Incremental     | hahahaha no                                  |
| Haskell   | Incremental     | _Way_ too slow, even with incremental        |
| Swift     | Incremental     | Incremental is overly-conservative, too slow |
| OCaml     | Incremental     | Slow in many ways :)                         |
| Zig       | Not Incremental | Waiting for stable incremental support       |
| JVM-based | ?               | I don't know any, nor have a desire to       |

The problem is, even among languages with incremental rebuilds, they still aren't "🚀BLAZING🔥FAST" enough for what I want. It is very impressive they're able to go as fast as they are, but remember I'm targeting sub-100ms, not sub-1s. That order of magnitude matters.

So, we've eliminated "just use templates", and also "just use a compiled language". That means we're left with:

### => Logic MUST Be In A Scripting Language

This will probably result in the speed tradeoff I am most satisfied with. Probably. "Doing the incremental steps" & "transforming the files" are still best done in a compiled language, because those are a thorny bit of programming with plenty of opportunity to be slow. The remaining logic can use that incrementality and be written in a scripting language to support faster on-the-fly changes. Separating the "build driver" from the "logic" is what other fast SSGs do after all, we're just making each a bit more powerful ;) 

## My Vehicle Of Choice: [Rust Binary + Javascript Interpreter](https://github.com/p0lyw0lf/driver)

Based on everything above, I think you can see how we landed here: it's a hobby project, so I really really want to write Rust, and Javascript is a fine choice because:

1. I know it well
2. The string templates are pretty good
3. It goes Fast Enough for logic
4. I'm very scared of homemade languages/Lisp

Stuff that will go in the compiled Rust core:

+ Incremental engine
+ Markdown parser ([comrak](https://github.com/kivikakk/comrak))
+ HTML minifier ([minify-html](https://github.com/wilsonzlin/minify-html))
+ URL Fetcher[^fetching-urls]
+ Image Parser/Optimizer (TODO)
+ Javascript interpreter ([rquickjs](https://github.com/delskayn/rquickjs))

And everything else, from base template partials to tag pages to the thing that makes a random PFP show up every time you refresh the page, will go in the Javascript files. It's another post entirely for how I'll actually structure the engine/scripts, so I'll leave it here for now :)

## Related Projects

Other incremental blog engines that inspired me to write this one:

+ shuppy's cohost clone [autost](https://shuppy.org/posts/tagged/autost.html)
+ fasterthanlime's [dodeca](https://dodeca.bearcove.eu/) project
+ jyn's [flower](https://flower.jyn.dev/) project, especially their [four posts about build systems](https://jyn.dev/four-posts-about-build-systems/)

I actually wanted to use one of these, but a hard look at each concluded they too fall under "for author's personal use only" and wouldn't suffice for my purposes. Still worth checking out tho!

Anyways that's it, stay tuned for if I ever finish this, hope you enjoyed ^^

[^queries]: A "real" set of queries might not look exactly like this (we don't necessarily want to pass down `CollectedMetadata` like that) but you get the overall idea.
[^hermeticity-hard]: jyn's excellent post goes into [what exactly makes hermetic builds/tracing builds hard](https://jyn.dev/build-system-tradeoffs/#hermetic-builds), once again I highly recommend reading their series on build systems
[^tracing-easy]: My plan is, effectively, a "tracing build system with a cached action graph". To once again respond to [jyn's build system tradeoffs post](https://jyn.dev/build-system-tradeoffs/#tracing): (1) I avoid the complexities of tracing system calls because all "system calls" are just functions exposed in Javascript, (2) I avoid the downsides of serializing my action graph because my website is not web-scale, (3) I avoid the "the same file can come from many possible places" a.k.a negative dependency problem by simply not allowing negative dependencies. Reading this tradeoff post was very useful, because it allowed me to end up with quite a compact design by discarding all the things I don't care about!
[^fetching-urls]: I specifically want this to copy Astro's support for [remote images](https://docs.astro.build/en/guides/images/#remote-images), which makes things like the `<Image />` component & `inferRemoteSize` Just Work.

