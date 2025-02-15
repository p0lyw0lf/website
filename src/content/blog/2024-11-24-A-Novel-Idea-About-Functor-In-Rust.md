---
title: A Novel Idea About `Functor` In Rust?
description: "I may have accidentally come up with a paper-worthy idea while just playing around with my silly compiler project"
tags: ["programming", "pwcc", "rust-lang"]
published: 1732487056
---

So. In [my last post](https://wolfgirl.dev/blog/2024-11-13-swift-almost-does-a-really-cool-thing-i-want/) about this compiler project, I wrote out the following trait definition, explaining that it's what I was using to do type-safe AST transformations:

```rust
trait Functor<Inner> {
    type Input;
    type Output;
    type Mapped;
    fn fmap(self, f: &mut impl FnMut(Self::Input) -> Self::Output) -> Self::Mapped;
}
```

I called it a "specialized Functor" because I didn't quite understand what exactly a Functor was, but I knew that, at the very least, what I had was a little different.

Upon reading this, Alice of [welltypedwit.ch](https://welltypedwit.ch/), who actually knows what she's talking about when it comes to functional programming, [pointed me towards](https://bsky.app/profile/welltypedwit.ch/post/3latirgqtjk2h) a Haskell package called [uniplate](https://hackage.haskell.org/package/uniplate-1.6.13), noting that what I was doing sounded like its [`transformBi`](https://hackage.haskell.org/package/uniplate-1.6.13/docs/Data-Generics-Uniplate-Operations.html#v:transformBi) operation.

To fully understand what she meant by this, let's break down the type signature:

## `transformBi`

In Haskell:

```haskell
transformBi :: Biplate from to => (to -> to) -> from -> from
```

What is this saying? Even if you understand Haskell, it can sometimes still be tricky to get what certain operations _mean_. In this case, I think about it like:

> Given a type `From`, which is a container type like the root of an AST, and a type `To`, which is like an inner node of an AST, transform `From` by applying an operation each time we encounter a node of type `To` in the tree.

Indeed, that is very similar to what I was trying to do previously! So why did I call my trait `Functor`, when this description almost exactly matches? Well mostly out of ignorance, yes, but also, when I later looked up the equivalent Rust crate [`uniplate`](https://docs.rs/uniplate/latest/uniplate/trait.Biplate.html), its type signature looked something more like[^1]:

```rust
trait Biplate<To> {
    fn transform_bi(self, op: fn(To) -> To) -> Self;
}
```

Quite different from what I ended up with! Note that this is _homogenous_ in the types it maps over; it transforms ASTs to be ones of the same type, whereas I was interested in transforming ASTs to have _different types_, because the type of the AST can enforce specific invariants. So that's why I was, and still am, interested in something like `fmap` instead:

## `fmap`

In [Haskell](https://hackage.haskell.org/package/base-4.20.0.1/docs/Data-Functor.html):

```haskell
fmap :: Functor f => (a -> b) -> f a -> f b
```

I think about this like:

> Given a container type `F` over homogenous elements `A`, you can transform each `A` into a `B` in order to get a new container `F` over homogenous elements `B`.

And _that's_ why I thought I wanted a `Functor`! Initially, I had only parameterized my AST on how it represented locations in memory. I had one type (`A`) for `HardwareRegister | StackAddress | PseudoRegister`, and another (`B`) for just `HardwareRegister | StackAddress`, in order to guarantee I could never emit assembly code that contained pseudo-registers. A regalloc[^2] pass would get rid of all the pseudo-registers, and I would run that pass with a specially-crafted `fmap` call.

I was inspired by how the Rust crate [`fmap`](https://docs.rs/fmap/latest/fmap/trait.Functor.html) translated the Haskell signature[^3]:

```rust
trait Functor<B> {
    type Inner;  // a.k.a. A
    type Mapped; // a.k.a. F<B>
    fn fmap(self, op: &mut impl FnMut(Self::Inner) -> B) -> Self::Mapped;
}
```

Now you can hopefully understand how I ended up where I did! My version of `Functor` is exactly this, just with an explict associated parameter for `B` so writing generic implementations is easier[^6].

## Going beyond?

While playing around with this `Functor` trait, I realized something interesting. Unlike Haskell's `Functor` typeclass, where `f` is necessarily a type with a generic parameter, and `fmap` necessarily transforms that generic parameter, Rust's `Functor` is a lot more like `Biplate`, in that you can specialize the transform to only be over certain inner elements!

When I realized this, I started trying to shoehorn everything into it. I didn't have to just write one `impl<L: Location> Functor<L> for Program<L>` implementation, I could write multiple[^4]!

```rust
struct Location<L>(L); // Needs to be a newtype so we can avoid potentially conflicting implementations
impl<Input, Output> Functor<Location<Output>> for Program<Input> {
    type Input = Location<Input>;
    type Output = Location<Output>;
    type Mapped = Program<Output>;
    fn fmap(self, f: &mut impl FnMut(Self::Input) -> Self::Output) -> Self::Mapped { ... }
}
impl<I, O> Functor<Expression<O>> for Program<I> { ... }
impl<I, O> Functor<Statement<O>> for Program<I> { ... }
```

The restrictions of Rust's trait system, and needing to specify explicit `Input`/`Output`/`Mapped` types, actually makes `Functor` _more_ flexible than its Haskell counterpart! I'm using it to create a class of functions that look like:

```haskell
fmapBi :: Triplate from to => (to a -> to b) -> from a -> from b
```

and even _this_, despite being a pretty neat extension of both `Functor` and `Biplate` in Haskell, still doesn't capture the full generality of the Rust trait. Still, for my purposes, this "best of both worlds" is all I need: the ability to transform only specific inner nodes (from `Biplate`), and the ability to change the parameterization of the container type (from `Functor`).

I'd like to write a paper on this. The authors of `uniplate` [wrote one](https://ndmitchell.com/downloads/paper-uniform_boilerplate_and_list_processing-30_sep_2007.pdf) explaining their approach, as did the author of [`multiplate`](https://hackage.haskell.org/package/multiplate) (which I don't quite understand fully, TODO [read it](https://arxiv.org/pdf/1103.2841v1) i guess). I'm not 100% sure I have a novel idea on my hands, but at the very least, I think it's a new useful way of looking at things that I'll be happy to include in my toy compiler.

<hr>

In case you're wondering, "PolyWolf, why has it taken you so long to get this post out? Surely you haven't spent over two weeks just thinking?", yes I have been thinking about this for a while, but mostly in the context of writing a proper Rust `proc_macro` that creates these implementations for me, just given the AST definition. It's unfortunately much much more involved than writing a `macro_rules!`[^5], especially trying to handle all the edge-cases properly. I don't know why I waited to publish this blog post until I finished writing this new macro; I didn't even need to explain anything about it in this post lol. Leaving that for a future blog post, maybe once I publish the crate perhaps !

As always, you can check out the code at [github:p0lyw0lf/pwcc](https://github.com/p0lyw0lf/pwcc); it _sort of_ has documentation right now, if u squint

[^1]: The real thing's actually worse in my opinion: `fn transform_bi(&self, op: Arc<dyn Fn(To) -> To>) -> Self`. You have to deal with the overhead of `Arc`, `dyn`, _and_ `Clone`-ing your entire AST?? No thanks. This is actually one of the biggest motivators I have for wanting to write a paper about this, to show these operations can be done in-place, zero-copy (given a sufficiently smart compiler, I hope).

[^2]: (fake (deragatory)), I haven't gotten that far in the book yet, so all pseudo-registers just get assigned to unique stack addresses :)

[^3]: Again, this signature is a massive simplification. The real one cares about lifetimes, thread safety, etc. etc. all good stuff a proper Rust library needs to care about

[^4]: Given appropriate macro/specialization support, which is what the previous post was about :P

[^5]: I will curse dtolnay forever for making `syn`/`quote` the only way to do this, but maybe I'm just more frustated by how hard the logic is in general...

[^6]: I'm reading this again and I'm actually not too convinced by that argument anymore. Maybe it was so I could write things like `TryFunctor` (returns a `Result`) or `AsyncFunctor` (returns an `impl Future`) without having to change the trait at all? That seems bad tho, and I should probably just write separate traits lol
