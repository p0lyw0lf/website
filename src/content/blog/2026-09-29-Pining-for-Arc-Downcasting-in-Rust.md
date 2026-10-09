---
title: "Pining for Arc Downcasting in Rust"
description: "In the course of writing my build driver, I came across a bit of an unusual problem, for which I made a bit of an usual solution. I think..."
tags: ["programming", "rust"]
published: 1790695917
mastodon: "https://social.treehouse.systems/@PolyWolf/117355048785641127"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3mwo5llv3xk2d"
---

In the course of writing my [build driver](https://git.sr.ht/~polywolf/driver), I came across a bit of an unusual problem, for which I made a bit of an usual solution. I think the solution is interesting and would like to talk about it, but to understand anything we must first understand the problem at hand.

## Consider The Case Of The Humble Concurrent Cache

Suppose we have some expensive function we'd like to put a cache in front of. Furthermore, suppose we'd like to access this cache from multiple threads. A simple example follows ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=cf4e4af4e40d6895d16d12779f395fa0)):

```rust
enum JSON {
    F64(f64),
    String(String),
    Vec(Vec<JSON>),
    Object(HashMap<String, JSON>),
}

struct Proxy {
    client: HTTPClient,
    cache: RWLock<HashMap<String, JSON>>,
}

impl Proxy {
    fn get(&self, key: &str) -> JSON {
        // 1.
        {
            let cache = self.cache.read().unwrap();
            if let Some(value) = cache.get(key) {
                return value.clone();
            }
        }

        // 2.
        let value = self.client.get(key);
        {
            let mut cache = self.cache.write().unwrap();
            cache.insert(key.to_string(), value.clone());
        }
        value
    }
}
```

This code has an "early exit" path (1) where it returns a value from the cache if it's present, and a "late exit" path (2) where it calls the expensive function, then inserts the resulting value into the cache.

Please ignore the many, many obvious problems with this implementation[^problems]. Instead, let's focus on the one problem that bothers me the most: there's fair bit of `.clone()` action going on here!

![Obi-Wan Kenobi walking down a hallway with the Kaminoans, observing the clones below. They tell him "200,000 units are ready, with a million more well on the way."](https://static.wolfgirl.dev/polywolf/blog/01a0e014-5545-7ddf-ab5e-60d27462a8ef/lots-of-clones.jpeg)

Technically, it's just one `.clone()` per call: one on early exit to take value out of the cache, and one on late exit to put value into the cache. But if those values are big/tree-shaped/otherwise expensive to clone, this cost can dominate, minimizing the savings conferred by a cache. In my code, I found this to be the case, so we gotta do something about it.

## Let's Get Rid Of The Clones?

Assume that, with the way we use this data, read-only access is more than enough. Shared references are read-only & cheap to `Copy`, so using those instead of `.clone()`-ing the entire value seems good. If some later part of the code really needs to take ownership, we can just `.clone()` there, saving time in the average case. So, we'd like to change the signature for `get()` to be:

```rust
impl Proxy {
    fn get<'a, 'b>(&'a self, url: &'b str) -> &'a JSON { ... }
}
```

But we can't do this!! Because our cache is behind a mutex, the only way we can get references to its contents is thru temporary handles. Those handles, while live, hold a lock on the cache, plus they only live for the body of the function, a not for all of `'a`. Even if we _could_ return one of those handles, that'd be equivalent to holding the lock outside the function, which is very bad. Locks should only be held for VERY SHORT amounts of time ~~unless ur into that sorta thing next month ;)~~

## Let's Make The Clones Cheaper

So, no references. What other types can we use? What we want is something with all the following properties:

1. It allows for read access to our data. That is, it allows us to get an `&JSON` somehow.
2. It has no lifetime parameters (`'a`, the only lifetime we have access to, is too long).
3. It is cheap to `.clone()`, even if the underlying value is _not_ cheap to `.clone()`.

These requirements hint we should probably still be looking for some sort of pointer... Among standard library types, we have the following options[^built-in]:

+ [Raw pointers](https://doc.rust-lang.org/std/primitive.pointer.html): `*const JSON`
+ [Reference-counted pointers](https://doc.rust-lang.org/std/rc/index.html): `Rc<JSON>`
+ [Atomically-reference-counted pointers](https://doc.rust-lang.org/std/sync/struct.Arc.html): `Arc<JSON>`

Like any good Rustacean, we care a lot about safety & concurrency, so `Arc` is the obvious pick here :3 Modifying the example to use it is straightforward ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=f3e3821009472761d2297690f6262e17)):

```rust
struct Proxy {
    client: HTTPClient,
    cache: RWLock<HashMap<String, Arc<JSON>>>, // new!
}

impl Proxy {
    fn get(&self, url: &str) -> Arc<JSON> { // new!
        {
            let cache = self.cache.read().unwrap();
            if let Some(value) = cache.get(url) {
                return value.clone();
            }
        }

        let value = Arc::new(self.client.get(url)); // new!
        {
            let mut cache = self.cache.write().unwrap();
            cache.insert(url.to_string(), value.clone());
        }
        value
    }
}
```

Other than the three lines with `Arc` added to them, this implementation looks the exact same as before. But now our clones are cheaper, so we're happy, yay!!

## So What's This About Downcasting?

I hope the above section convinced you having an `Arc` "owned value that acts like a reference" is both normal to want & possible to achieve. Switching gears a bit, I'd like to discuss an interesting shortcoming with them: they don't fit into Rust's type system very well.

Supposed we know for a fact that certain `JSON` values are strings, and we're only interested in the `JSON::String` variant of them. With an owned value or a shared reference, we can just pattern-match to "downcast" from a `JSON` to a `String`, or a `&JSON` to a `&String`.

```rust
impl JSON {
    fn to_str(self) -> Option<String> {
        match self {
            Self::String(s) => Some(s),
            _ => None,
        }
    }
    
    fn as_str(&self) -> Option<&String> {
        match self {
            Self::String(s) => Some(s),
            _ => None,
        }
    }
}
```

But if we have an `Arc<JSON>`, we can't get another `Arc<String>` the same way!

```rust
impl JSON {
    fn doesnt_exist(value: Arc<JSON>) -> Option<Arc<String>> {
        match value.deref() {
            Self::String(s) => Some(s), // compile error!
            _ => None,
        }
    }
}
```

This is because `value.deref()` creates a reference to `value`, whose lifetime will end as soon as the function is over, because we don't return it, only a pointer somewhere inside it. The machinery for `Arc` only works if it has access to the original pointer, not any derived pointers. So if we wanted to return an `Arc<String>`, we'd need to `.clone()` out of the `Arc<JSON>`, which is what we've been trying to avoid this whole time.

However! We don't necessarily _need_ a full `Arc<String>`! We'd be perfectly happy returning some other type, perhaps implementing `Deref<Target = String>`, so long as it still gives us those "owned value that acts like a reference" properties. If only we could extend the lifetime of `value`, perhaps by returning it alongside a reference to its contents, packaged together to implement `Deref` like we want...

## Tying The Two Together With Evil Lesbian Shibari

Our goal is some return type that looks like:

```
               ,-----------------------+---------------------.
val: owned --> | contents: *const JSON | refcnt: AtomicUsize |
               `-----------------------+---------------------'
                                     |
          /--------------------------/
          V
        ,------------------+--------------+------------+------------.
        | JSON::String tag | buf: *mut u8 | len: usize | cap: usize |
        `------------------+--------------+------------+------------'
                             ^          |
                             |          |
ptr: ref --------------------/          |
                                        V
                                      ,---+---+---+---.
                                      |'A'|'C'|'A'|'B'|
                                      `---+---+---+---'
```

That is, we want some `val` showing us how to get to the main value we care about, and then some pointer `ptr` into the memory `val` references. Then, as long as we keep those tied together, we know `ptr` will still be valid, because `val` is still alive, because we own `val`.

A first attempt at writing this reveals an immediate issue[^why-not-arc]

```rust
struct Ref<V, T> {
    val: V,
    ptr: &T, // What's the lifetime here?
}
```

We can't express `ptr` as a reference, because there's no obvious lifetime to attach it to. Without a way to spell "lifetime of the containing struct" in Rust, it looks like we're going to need a raw pointer instead. But what if.....

```rust
struct Ref<V, T: 'static> {
    val: V,
    ptr: &'static T,
}

impl<T, V: Deref<Target = T>> {
    fn new(val: V) -> Self {
        let ptr: &T = val.deref();
        Self {
            // This is the easiest way to do lifetime extension
            // SAFETY: hm?
            ptr: unsafe { std::mem::transmute(ptr) },
            val,
        }
    }
}
```

Whoa!! That's scary!!! Are they even allowed to hold hands like that...?

It's true this is exceedingly unsafe if users could extract that `ptr: &'static T` separately from the `val: V` it points into (`val`'s lifetime isn't `'static`!). But we could also just... not allow that, keeping them tied together always, providing access only via `Deref` implementation:

```rust
impl<V, T> Deref for Ref<V, T> {
    type Target = T;
    fn deref(&self) -> &T {
        self.ptr
    }
}
```

Because the _effective_ lifetime for which `ptr` can be accessed is a subset of the _actual_ lifetime for which `val` lives, I believe we've properly rules-lawyered Rust's reference aliasing rules into submission. Or have we...

![Anakin, to Padme: "I've made ptr which comes from a val." Padme, smiling: "And ptr always points into val, right?" Anakin stares bemusedly. Padme, frowning: "Right?"](https://static.wolfgirl.dev/polywolf/blog/01a0e014-5545-7ddf-ab5e-60d27462a8ef/anakin-padme-ptr-val.jpg)

Oh noes... ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=52455c2042bd9bc26f1bbbb8a239f9a4))

```rust
struct SimpleWrapper<T>(T);

impl<T> Deref for SimpleWrapper<T> {
    type Target = T;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

fn main() {
    let r = Ref::new(SimpleWrapper(x));
    // Check what's stored vs what should be returned
    let ptr = r.ptr as *const i32 as usize;
    let actual_ptr = r.val.deref() as *const i32 as usize;
    println!("ptr: {ptr:x} actual_ptr {actual_ptr:x}");
}
```

Running this, I got `ptr: 7fff85189b5c actual_ptr 7fff85189b88`. These are in fact different pointers!!! Turns out I messed up my earlier rules-lawyering: The act of moving `val` into `Ref::new()`, taking the `.deref()` on that stack frame, and then moving it back out to the parent stack frame invalidates `ptr`[^why-not-arc]. Lifetimes exist precisely to prevent bugs like this, and our extension trick was foiled. Lesson learned! Guess we'll do this the hard way...

## Ensure Address Stability With This One Simple Trick!

To fix our datastructure, we'll want a guarantee that each `.deref()` will give us the same pointer, even if move the container around. For this, we MUST NOT be able to move the `val: V` out of its location once we wrap it. Fortunately, Rust has a type exactly for this usecase!

![A busty butch lesbian in a brown overcoat, labeled "Rust", is pinning "the value (me)", dressed in a demure pleated skirt, to the wall with a "std::pin::Pin". I am blushing and holding my tail bashfully as we look into each others' eyes. Hearts, sparkles, and roses adorn the pink-tinted scene.](https://static.wolfgirl.dev/polywolf/blog/01a0e014-5545-7ddf-ab5e-60d27462a8ef/rust_kabedon.png)

ahem. anyways. Unfortunately, `Pin` is very hard to use, to the point I found a flaw in my initial implementation[^other-idea] while writing this :( Still, the docs are _really_ good, and we can pretty easily follow their example to make [a self-referential struct](https://doc.rust-lang.org/std/pin/index.html#a-self-referential-struct):

```rust
struct MustPin<V> {
    val: V,
    _pin: PhantomPinned,
}
struct PinRef<V, T> {
    val: Pin<Arc<MustPin<V>>>,
    // MUST point into [`val`].
    ptr: *const T,
}

impl<V> MustPin<V> {
    fn new(val: V) -> Pin<Arc<Self>> {
        Arc::pin(Self {
            val,
            _pin: PhantomPinned,
        })
    }
}

impl<V> PinRef<V, V> {
    fn new(val: Pin<Arc<MustPin<V>>>) -> Self {
        let ptr = &raw const val.val;
        Self { val, ptr }
    }
}
```

Comparing this to the example in the docs:

1. We use `*const T` instead of `NonNull<T>` because the latter is more like a `*mut T`, and we don't need all that power.
2. We don't need `MaybeUninit` because we solve the "knot-tying" trick in a different way: we create the pinned data first, and then store a pointer into it out-of-line. This is still fine because of pin guarantees.
3. We still need `PhantomPinned` because if we have `Pin<Arc<V>>` where `V: Unpin`, all bets are off, literally every pin guarantee goes out the window.

`Deref` is simple like before, just with a pointer instead of a reference:

```rust
impl<V, T + 'static> Deref for PinRef<V, T + 'static> {
    type Target = T;
    fn deref(&self) -> &Self::Target {
        // SAFETY: by construction and pin guarantees, the pointer is still valid.
        unsafe { &*self.ptr }
    }
}
```

Now, finally, we're all set up for the big reveal: how are we going to downcast these things?

## She Downcast On My `Pin` 'Til I `Arc`

Our rule for `ptr` is that it MUST point somewhere valid inside `val`. That's all we can assume, and that's what we have to uphold while doing our downcasts. Fortunately, we can use Rust's type-checking for "standard" downcasts to our advantage!

```rust
impl<V, T> PinRef<V, T> {
    fn project<U>(self, f: impl for<'a> FnOnce(&'a T) -> &'a U) -> PinRef<V, U> {
        let Self { val, ptr } = self;
        // SAFETY: by validity of `ptr` and `f`
        let ptr = unsafe { f(&*ptr) as *const U };
        PinRef { val, ptr }
    }
}
```

Stating this signature more in more math-y terms, for those unfamiliar with Rust's syntax:

$$
\begin{gathered}
\text{PinRef} : (\text{Type}, \text{Type}) \rightarrow \text{Type}\\
\forall\ V,T,U : \text{Type}.\\
\text{project} : \text{PinRef}(V,T) \rightarrow (\forall(a: \text{Lifetime}).\ \&'a T \rightarrow \&'aU) \rightarrow \text{PinRef}(V,U)
\end{gathered}
$$

How we should interpret this is: Because `f` _must_ work for any lifetime, we can choose the lifetime of the input and get a guarantee the output will have the same lifetime. So, we can choose "whatever the lifetime of `val` ends up being after we pass ownership", looking into the future in a way normal references cannot. Other pin guarantees like "`val` will always remain valid at that address while it's pinned" help too. (Thanks to [~T6 on lobste.rs](https://lobste.rs/c/tbg0kj) for helping clarify this!)

If I were a real type theorist, I would have pulled out some sort of commutative diagram and drawn a bunch of arrows, or perhaps even written down some inference rules, but alas, I cannot even abstract over monads... Anyways this argument works for what we originally wanted too:

```rust
impl<V, T> PinRef<V, T> {
    fn filter_project<U>(
        self,
        f: impl for<'a> FnOnce(&'a T) -> Option<&'a U>,
    ) -> Option<PinRef<V, U>> {
        let Self { val, ptr } = self;
        // SAFETY: by validity of `ptr`, `f`
        let ptr = unsafe { f(&*ptr)? as *const U };
        Some(PinRef { val, ptr })
    }
    
    fn try_project<U, E>(
        self,
        f: impl for<'a> FnOnce(&'a T) -> Result<&'a U, E>,
    ) -> Result<PinRef<V, U>, E> {
        let Self { val, ptr } = self;
        // SAFETY: by validity of `ptr`, `f`
        let ptr = unsafe { f(&*ptr)? as *const U };
        Ok(PinRef { val, ptr })
    }
}
```

You see that??? We did the thing!! To celebrate, here's a full example using the original JSON projections ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=9ba8b6f27dc48afb065a2923023fb1da)):

```rust
fn print(s: impl Deref<Target = str>) {
    println!("{}", s.deref())
}

fn main() {
    let v = std::sync::Arc::pin(JSON::String(String::from("hello, world!")));
    let v = PinRef::new(v);
    let s = v.filter_project(JSON::as_str).unwrap();
    print(s.clone());
    print(s);
}
```

All that remains in our original example is to replace all the plain `Arc<JSON>` with `Pin<Arc<MustPin<JSON>>>` (wow what a mouthful), make a `Clone` implementation, account for `?Sized` types, etc. etc. This post is long enough as it is so I've omitted that, but if you want, you can find the full details in my [repository](https://git.sr.ht/~polywolf/driver/tree/cb9ee31e272f24311981a41f979d82f31f39f61f/item/packages/pin-downcast/src/pin_ref.rs). I might release this as a standalone crate if I feel like it, but this might still be riddled with UB I missed so maybe not (:

Also, as to be expected, this isn't nearly the first time someone has tried to do something like this. Previous work includes:
* [`yoke`](https://docs.rs/yoke/latest/yoke/), a classic crate implementing everything I want here and more. Has a fairly similar `val` + `ptr` core, depends on a third-party [`StableDeref`](https://docs.rs/stable_deref_trait/latest/stable_deref_trait/trait.StableDeref.html) trait made before `Pin` was a thing.
* [`mappable-rc`](https://docs.rs/mappable-rc/latest/mappable_rc/), a slightly more production-ready than what I've proposed. It depends on the defined stability of [`Arc::as_ptr`](https://doc.rust-lang.org/std/sync/struct.Arc.html#method.as_ptr) instead of `Pin`.
* Rust's [field projections goal](https://github.com/rust-lang/goals/issues/390), which would enable [`PinRef::project`]-style APIs for `Arc`, but maybe not the `filter_project` or `try_project` ones? Unclear, anyways likely not coming for a couple more years still.

Anyways!! Hope you learned something, thanks for reading, until next time~

[^problems]: In increasing order of badness: too much string typing, no error handling, concurrent requests can race and end up doing extra work. Probably others I'm missing too. The solution to that last one is simultaneously very interesting & very boring, [read the code yourself if you want](https://git.sr.ht/~polywolf/driver/tree/3e0e9250a6657f9e5ed977ecdd08f3550e06f68b/item/packages/driver-db/src/database.rs#L150-270).
[^built-in]: I'm only covering options from the Rust standard library for simplicity, but garbage-collected pointers from [`dumpster`](https://crates.io/crates/dumpster) or arena pointers from [`slotmap`](https://crates.io/crates/slotmap) can also be good ideas.
[^why-not-arc]: You might be thinking, "why not `struct Ref<V, T> { val: Arc<V>, ptr: &'static T}`?" and unfortunately a refutation is much more complex, and this example is more illustrative of why we need `Pin` later. Suffice to say, even though `Arc` on its own gives address stability in practice, Rust's type system doesn't enforce that it will[^other-idea].
[^other-idea]: I previously thought `struct PinRef<V, T> { val: Pin<Arc<V>>, ptr: &'static T }` was enough, but turns out that's entirely insufficient due to the presence of `Unpin`.
