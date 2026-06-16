---
title: "Async Task Locals From Scratch"
description: "Some literate programming on a small crate I\u0027ve written"
tags: ["programming", "rust"]
published: 1781615380
mastodon: "https://social.treehouse.systems/@PolyWolf/116759946217556966"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3mofuobpicl23"
---

To make a long story short, let's assume we have the following constraints, ignoring where exactly these constraints come from:

> + We want to associate some data with an async task in Rust, such that, while that task is being polled, we can retrieve said data deeper in the callstack, without having to manually pass the data down thru function arguments.
> + We don't want to use the `tokio` ecosystem.

That is, we want to do what [`tokio::task_local!`](https://docs.rs/tokio/latest/tokio/macro.task_local.html) does, but don't want to use tokio. What do? Well... I couldn't find anything else that does it, so I did it myself (:

## Buckle Up It's [Apple-Pie-Baking Time](https://www.goodreads.com/quotes/32952-if-you-wish-to-make-an-apple-pie-from-scratch)

To understand what we want, we must first understand why what the standard library gives is not enough. To understand what the standard library gives, we must first understand the execution model upon which it relies. I did say "from scratch"[^other-reading], after all :P

Most operating systems organize code execution into two distinct units: **Processes** & **Threads**. Processes roughly delineate "what memory is visible", while Threads roughly delineate "what instructions are running". A single Process may contain one or more Threads, and when there are multiple Threads in a Process, computer scientists call it a "[Multithreaded Architecture](<https://en.wikipedia.org/wiki/Multithreading_(computer_architecture)>)" with "[Shared Memory Parallelism](https://en.wikipedia.org/wiki/Parallel_programming_model#Shared_memory)": there are literally multiple Threads, sharing memory in the same Process.

This Process/Thread model requires a bit of work on the programmer's side to make sure Threads don't step on each other's toes while they're running. Most normal code assumes it's the only one with access to the memory it touches, and will get very upset if some other Thread scribbles over its work while it's not looking. If Threads _don't_ touch each other's memory, or there is some mechanism by which they co-ordinate their mutual touching[^gay], that property is called "Thread-Safety".

Naturally, thread-safety is a very important property (ensuring it at compile time is a big motivator for Rust!), so we'll need to maintain it while achieving our overall goal. There are various strategies by which we can ensure thread-safety, but by far the simplest is "just use variables on the stack lol". Each Thread's stack is unique by construction[^thread-stacks], so if we create a value on the stack + pass a reference down thru arguments to anywhere that needs it, boom done ezpz.

But remember, we have a special requirement:

> [...] can retrieve said data deeper in the callstack, **without having to manually pass the data down thru arguments**.

So really, we want something that works more like a "global" variable, but without the complications that come from multiple Threads sharing a single global. Fortunately, this already exists! [**Thread-Local Storage**](https://en.wikipedia.org/wiki/Thread-local_storage), aka TLS, creates variables that are "local" in the sense they can only be accessed by a single thread, while still being "global" in the sense that any function can touch them. Different platforms can have greatly varying implementations of TLS, all we need to know is: each thread has its own place to put its global variables, no more toe-stepping yay everyone is happy. C/C++ uses the [`thread_local` keyword](https://en.cppreference.com/w/c/thread/thread_local.html) for this, while Rust uses a [`std::thread_local!` macro](https://doc.rust-lang.org/std/macro.thread_local.html).

## Are Thread-Locals Sufficient?

Turns out no! There's a bit more universe we need to conjure before we can start on our pie, specifically the difference between an Operating System Thread and a Rust Task.

With Threads, the OS automatically manages things like "what Thread is running on this CPU core?", "what Threads are available to run but aren't?", & "ok time to switch to different Thread". However, switching between Threads at the OS level is quite a slow operation[^os-slow] compared to normal code. Instead, languages will often make their own thread-like things in "userspace" (that is, without any help from the OS) to help avoid this slowdow while keeping the other benefits of concurrent code. These thread-like things are called either [Green Threads](https://en.wikipedia.org/wiki/Green_thread) or [Coroutines](https://en.wikipedia.org/wiki/Coroutine), depending on certain factors.

<details><summary>Aside on those factors</summary>

The main factor is "can it run on its own" (Green Thread, aka pre-emptive multi-tasking) or "does it need something else to drive it" (Coroutine, aka co-operative multi-tasking). Common examples of Green Threads are [Erlang](https://en.wikipedia.org/wiki/Erlang_(programming_language))'s processes & Go's [goroutines](https://go.dev/tour/concurrency/1) (yeah they really messed up the name there), while examples of Coroutines include Python's [Coroutines](https://docs.python.org/3/library/asyncio-task.html), C++'s [Coroutines](https://en.cppreference.com/w/cpp/language/coroutines.html), & Rust's [`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) & [`Iterator`](https://doc.rust-lang.org/std/iter/trait.Iterator.html) traits. Javascript's [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) objects are interesting, because at first glance they seem to be a Coroutine, what with the `async`/`await` syntax, but actually they're Green Threads because they start running all on their own, and the `await` syntax is just a fancy way of chaining callbacks together.

Anyways!! These distinctions tend to be pretty controversial, and I'm sure I'll get some helpful comments clarifying how I got some of this wrong (:

</details>

For now, I'll just group them all together under an umbrella labeled "Tasks", upsetting the largest number of people possible :)

Anyways! The important thing to notice is, **Tasks are not Threads**, so we can't _only_ use Thread-Local Storage, because:

1. We could have multiple Tasks running on the same Thread, OR
2. We could have a Task that gets run on multiple Threads at different points in its execution (for throughput reasons).

Specifically, a plan to "set a thread-local when a Task starts running, and unset it when the Task finishes running" doesn't work, because:

1. Other Tasks that start running on the same Thread might share that same thread-local, OR
2. The Task might get shuffled to another Thread between it setting a thread-local and it trying to read from the thread-local.

both of which are failure modes that will make us sad :(

So! With all that out of the way, I hope I've convinced you we really do need a special construct for an Task-Local. Now to build it...

## What's Our Strategy Cap'n?

How Rust's Tasks work is, _they only ever do work when their [`Future::poll()`](https://doc.rust-lang.org/std/future/trait.Future.html#tymethod.poll) method is called_[^coroutine-green-thread]. That, finally, leads to our key insight: in order to have a Task-Local value, we simply need to set some global value _only while `poll()` is being called_. Using a Thread-Local value as that global works because, for the duration of that single `poll()` call, _we can't change threads_. So we're free to save/restore on that single thread as we please:

<details><summary>Aside on upcoming use of <code>unsafe</code> blocks</summary>

You should ignore them. They are for dealing with [`Pin`](https://doc.rust-lang.org/std/pin/index.html) semantics that, in a real codebase, you should use the [`pin_project`](https://docs.rs/pin-project/latest/pin_project/) crate for, which handles it in a safe way. I only show code without that crate to demonstrate there's nothing magic going on, just stdlib functions.

</details>

```rust
use std::cell::RefCell;
use std::pin::Pin;
use std::task::{Context, Poll};
use std::thread::LocalKey;

/// Container type that implements [`std::future::Future`] by wrapping an existing one, as well as saving/restoring a task-local made available to it.
pub struct Scoped<F: Future, T: 'static> {
    /// Thread-Local Storage that holds the current task-local value.
    tls: &'static LocalKey<RefCell<Option<T>>>,
    /// When the future IS NOT being polled: the value we want to store is inside `curr`.
    /// When the future IS being polled: the previous value stored inside `curr`, if we are running inside another [`Scoped`].
    curr: Option<T>,
    /// The future we're wrapping.
    fut: F,
}

impl<F: Future, T: 'static> Future for Scoped<F, T> {
    type Output = F::Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        // SAFETY: `this` never moves out its value, so `self` stays pinned.
        let this = unsafe { &mut self.get_unchecked_mut() };
        // SAFETY: because `self` is still pinned, so is `fut`.
        let fut = unsafe { Pin::new_unchecked(&mut this.fut) };
        // The swap only ever moves values _stored inside_ `self`;
        // it doesn't change the location of `self` directly.
        let curr = &mut this.curr;
        let mut swap = || this.tls.with_borrow_mut(|prev| std::mem::swap(curr, prev));

        // Swap in the value from "the stack" (`this.curr`) into "global memory" (`this.tls`) while polling.
        swap();
        let out = fut.poll(cx);
        // Swap the value from "global memory" back onto "the stack" to save it for when we get polled later.
        swap();

        out
    }
}
```

I hope all that exposition helped understand _why_ we're doing what we're doing, that we didn't just pull this implementation out of thin air, why we're putting save/restore logic in `poll()` instead of in a constructor/`Drop` impl.

Now all that's left is to provide some helpers so this wrapper has a more `tokio`-like API. First, we define a helper struct to provide `scope()` & `with()` functions that are very similar to [what `tokio::task::LocalKey` has](https://docs.rs/tokio/latest/tokio/task/struct.LocalKey.html#method.scope):

```rust
pub struct ScopeBuilder<T: 'static> {
    tls: &'static LocalKey<RefCell<Option<T>>>,
}
impl<T: 'static> ScopeBuilder<T> {
    /// Create a new task wrapper builder for the given Thread-Local Storage
    pub const fn new(tls: &'static LocalKey<RefCell<Option<T>>>) -> Self {
        Self { tls }
    }

    /// Given the Thread-Local Storage provided at builder creation, construct a [`Scoped`] future that will expose the given `value`.
    pub fn scope<F: Future>(&self, value: T, fut: F) -> Scoped<F, T> {
        Scoped {
            tls: self.tls,
            curr: Some(value),
            fut,
        }
    }

    /// Read from the Thread-Local Storage, which will be `Some` if we are inside a [`Scoped`] future.
    /// Takes a callback to ensure the lifetimes work out.
    pub fn with<V>(&self, f: impl FnOnce(Option<&T>) -> V) -> V {
        self.tls.with_borrow(|value| f(value.as_ref()))
    }
}
```

Then, for completeness's sake, we also define a macro similar to [`tokio::task_local!`](https://docs.rs/tokio/latest/tokio/macro.task_local.html), which creates the Thread-Local Storage & associated `ScopeBuilder` at the same time in an ergonomic fashion:

```rust
#[macro_export]
macro_rules! task_local {
    ($(static $ident:ident : $ty:ty ;)*) => {$(
        static $ident: $crate::ScopeBuilder<$ty> = {
            std::thread_local! {
                static LOCAL: std::cell::RefCell<Option<$ty>> = const { std::cell::RefCell::new(None) };
            }
            $crate::ScopeBuilder::new(&LOCAL)
        };
    )*}
}
```

Putting it all together, usage looks something like:

```rust
task_local! {
    static SOME_GLOBAL: usize;
}

/// Prints the value currently contained in [`SOME_GLOBAL`]
fn print() {
    let v = SOME_GLOBAL.with(|v| v.map(|v| *v));
    match v {
       Some(v) => println!("{v}"),
       None => println!("None"),
    }
}

#[tokio::main]
async fn main() {
    // Define a stack of wrapped tasks, showing how the task-local is saved/restored
    print();    
    tokio::spawn(SOME_GLOBAL.scope(5138008, async {
        print();
        tokio::spawn(SOME_GLOBAL.scope(69, async {
            print();
            tokio::spawn(SOME_GLOBAL.scope(42, async {
                print();
            })).await.unwrap();
            print();
        })).await.unwrap();
        print();
    })).await.unwrap();
    print();
}
```

Note the `tokio::spawn()` calls around each `.scope()` call (to properly test what happens when there are multiple Tasks running concurrently) but NOT around each `async {}` call (to ensure the `print()` calls happen in the same Task as their surrounding `.scope()`).

Trying this out at the [Rust playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=02c3f51b299f07ac860e28dd16933c1d), we observe the following output:

```
None
5138008
69
42
69
5138008
None
```

just like we drew it up :)
## Conclusion

In this post, I've shown a complete(!!) way of writing Task-Locals in Rust, using only the stdlib, that covers the "multiple Tasks on one Thread" case (via swapping from stack to Thread-Local), as well as the "single Task on multiple Threads" case; [`std::thread::LocalKey`](https://doc.rust-lang.org/std/thread/struct.LocalKey.html) stands for "how we access the current Thread's TLS", so the resulting `Scoped` future can, in fact, be sent to other threads, where it will simply use the TLS of whatever Thread it starts running on.

The source code in this post is directly copied from [part of a larger collection of crates I'm making](https://github.com/p0lyw0lf/driver/blob/725e822d8302ecf1af290aab9582c357c56f9e2a/packages/async-task-local/src/lib.rs), and while I might eventually consider publishing it to crates.io, it's small enough to vendor in any project if you really want it.

Anyways that's all, hope you enjoyed & maybe even learned something! Until next time!!

[^other-reading]: I considered linking to Kora's [Building an AsyncIO executor for the 3DS](https://blog.cat-girl.gay/3ds-async-part-one/) instead of writing this whole intro section, since that post covers very similar ground, but hey one more explanation in the world can't hurt right?
[^gay]: ex. Mutexes, Condition Variables, Semaphores, etc. I do not apologize for my habit of phrasing things as lewdly as possible, because if u think about it, _really_ think about it, u too shall realize concurrency is yur. the exactly flavor depends per language: Rust => slow-burn, Go => toxic, C++ => doomed. i rest my case
[^thread-stacks]: The concept of a stack and "what code is being executed" is too tightly linked for it to be any other way, at least with our current languages/computer architectures.
[^os-slow]: Yeah I'm not going to get into this. The reasons are _really_ complex and I'll admit I don't understand them fully myself. Something something timer interrupts something something pipeline stalls something something [`%cr3`](https://en.wikipedia.org/wiki/Control_register#CR3)?? A "TL;DR you should be aware of this" is enough.
[^coroutine-green-thread]: Note that this definition doesn't actually depend on if the Task is a Coroutine or a Green Thread! Yes, Rust Futures are actually Coroutines, and `poll()` methods tend to be indicative of that, but a Green Thread-based system could also expose an API with similar guarantees, likely for the purpose of constructing such scoped wrappers.