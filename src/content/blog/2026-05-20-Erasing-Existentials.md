---
title: "Erasing Existentials"
description: "I got nerd-sniped hard, so I wrote a blog post about how to type-erase existential quantifiers in Rust."
tags: ["programming", "rust"]
published: 1779284612
---

Recently, I got nerd-sniped _hard_ by [a post made by](https://bsky.app/profile/welltypedwit.ch/post/3mlpwmdubds2i) [Alice (@welltypedwit.ch)](https://welltypedwit.ch/). In it, she asks:

> So, in Rust, `dyn Trait` means $\exists s. \text{Trait}(s) \land s$, and `fn f() -> impl Trait` means $f: \exists s. \text{Trait}(s) \land (() \rightarrow s)$, but what if I want an existential over something other than the `Self` parameter? Like, what if I have `Trait<B>` and I want an $\exists s, b. \text{Trait}(s, b) \land s$?

That is a lot of fancy math symbols, but I hope by the end of this you will understand both what they mean and my answer to this question!

## What Is An Existential Quantifier?

A hint can be found in the first part of her question:

> `dyn Trait` means $\exists s. \text{Trait}(s) \land s$

Let's think about what it means to have a value of type [`dyn Trait`](https://doc.rust-lang.org/reference/types/trait-object.html)[^sized]. We know there is _some_ underlying type, but we don't have a way of getting at that type. All we can do is call methods from `Trait`.

That's pretty much exactly what that formula says! "There exists ($\exists$) some type `s`, such that ($.$) `s` conforms to `Trait`, and ($\land$) you can use `s` right now". The scary math symbols are just a concise way of writing that. Math also helps us formalize the fact that, given just this $\exists$ statement, we have no way of knowing what `s` will be ahead of time, so in constructing a "proof" that the program is well-typed, we can only assume things about `s` that come from it conforming to `Trait`[^dyn].

Alice also points out another place Rust has something that looks like an existential quantifier:

> `fn f() -> impl Trait` means $f: \exists s. \text{Trait}(s) \land (() \rightarrow s)$

This "[return-position impl trait](https://doc.rust-lang.org/reference/types/impl-trait.html#r-type.impl-trait.return)" syntax is indeed another way of specifying a type such that callers of `f` only know about the fact that the return type conforms to `Trait`. Unlike with `dyn Trait`, these are fixed at compile time, but type-theoretically they're somewhat similar.

So! Now that we have a bit of understanding, let's get started on the real question:

> What if I have `Trait<B>` and I want an $\exists s,b. \text{Trait}(s, b) \land s$?

That is, is it possible to have an existentially quantified type `S` that itself has another existentially quantified type variable `B`, such that `S: Trait<B>`?
## Attempt 1: For-Exists Conversion

A classic way of dealing with _any_ existentials is something I call "for-exists conversion". Basically, it relies on the following identity:

$$
((\exists x.P(x)) \rightarrow Q) \Longleftrightarrow (\forall x.(P(x) \rightarrow Q))
$$
<details><summary>Type theory friend</summary>

My type theory friend said "this is just currying lol" and I was very confused, because the definition for currying I'm familiar with is

$$
(\langle a, b \rangle \rightarrow c) \Longleftrightarrow (a \rightarrow b \rightarrow c)
$$

That is, given a function taking a tuple, you can make it into a function returning a function, which at first glance looks nothing like the exists/forall theorem stated above.

However! If you have a "dependent sum" $\Sigma_\alpha \beta(\alpha)$ (type of second element $\beta$ depends on value of first element $\alpha$) and a "dependent product" $\Pi_\alpha \beta(\alpha)$ (function where the return type $\beta$ depends on the value of the input $\alpha$), then you get [a very similar-looking identity](https://ncatlab.org/nlab/show/existential+quantifier#in_dependent_type_theory)[^nlab]:

$$
((\Sigma_\alpha \beta(\alpha)) \rightarrow C) \Longleftrightarrow (\Pi_\alpha \beta(\alpha) \rightarrow C)
$$

You can interpret both sides either way:
+ In the "types as propositions" interpretation, $\Sigma$ is _kind of_ like $\exists$ in that, for it to be inhabited, you only need a single $\langle \alpha, \beta(\alpha) \rangle$ pair, and $\Pi$ is _kind of_ like $\forall$ in that, for it to be inhabited, you need to show how to get a $\beta(\alpha)$ for every possible $\alpha$.
+ Interpreting them as datastructures, $\Sigma$ is just a tuple, and $\Pi$ is just a function, which is exactly what our original currying looks like.

So, my type theory friend argues "you should call this 'currying' instead of making up a new name". But I don't agree with that since the connection is not obvious, so I will stick with my own name for the sake of clarity :) The more you know!

</details>

In Rust, this can be stated as:

```rust
fn f_left(x: impl P) -> Q {
    x.foobar()
}

fn f_right<X: P>(x: X) -> Q {
    x.foobar()
}
```

"But PolyWolf!" I hear you say, "You've just written the same function twice??" And that, dear reader, is exactly what's so sneaky about this identity. It _seems_ obvious, but it's actually saying something pretty profound.

`f_left` really does use an existential quantifier for its argument (all you know about `x` is that it has a type conforming to `P`), while `f_right` first quantifies over all possible types for `X`, then restricts to those that satisfy the trait `P`. In Rust, you might think the former is "just sugar for" the latter, but that doesn't change the fact these are _different mathematical statements_.

To see this more clearly, let's think about what happens when we use those argument types as return types instead:

```rust
fn g1() -> impl P { SpecificX::proof() }

fn g2<X: P>() -> X { X::proof() }
```

Here, we can more clearly see that `impl P` and `X: P` are saying different things. The former, like $\exists$, only requires you to demonstrate a `SpecificX` that satisfies the trait `P`, while the latter, like $\forall$, requires you to produce valid values for all possible `X: P`.

So! Getting back to our original problem, we want to describe a type of the form:

$$\exists s, b. \text{Trait}(s, b) \land s$$
For the rest of this post, we're going to assume that $\text{Trait(s, b)}$ is some `S: Generic<B>` (renamed to avoid confusion w/ other traits introduced later), and that we can only build new types/traits that reference it, never modifying it or the following impls:

```rust
pub trait Generic<B> {
    fn name(&self) -> &'static str;
}
impl Generic<f32> for i32 {
    fn name(&self) -> &'static str { "f32" }
}
impl Generic<f64> for i32 {
    fn name(&self) -> &'static str { "f64" }
}
```

Restricting ourselves first to functions that take in such a type, we get:

$$(\exists s, b. \text{Trait}(s, b) \land s) \rightarrow ()$$

Then, using our identity, we can rewrite it as:

$$\forall s, b. (\text{Trait}(s, b) \land s) \rightarrow ()$$

This results in the following function ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=5d4a408cb9e2b259c311f65fd8de2c6c)):

```rust
fn use_generic<B, S: Generic<B>>(s: &S) -> &'static str {
    s.name()
}
```

Easy peasy! This is a very standard way of dealing with the problem, and imo the most clean. However, [Alice was not satisfied](https://bsky.app/profile/welltypedwit.ch/post/3mlqosj7his2o):

> You couldn't e.g. put this one in a data structure (behind a `Box`) though, could you?

And that's entirely true! Due to the way we rephrased the problem in terms of $\forall$, once we return a `Box<dyn Generic<B>>`, we'd have to keep a $\forall b$ clause around on everything that uses it, which sort of defeats the purpose of having $\exists$ types in the first place ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=7889714d44805f2f7f35a7a36a4f8e85)):

```rust
fn put_in_box<B, S: Generic<B> + 'static>(s: S) -> Box<dyn Generic<B>> {
    Box::new(s)
}

fn use_box<B>(s: &Box<dyn Generic<B>>) -> &'static str {
    s.name()
}
```

This solution may be satisfactory for some usecases, but we'll have to try a bit harder to get things to only use $\exists$<span></span>.
## Attempt 2: Associated Types

My next idea was to "smuggle" the $\exists s, b.$ quantifier behind a single $\exists t.$ quantifier that Rust gives when using trait objects. A first crack at it might look something like ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=349cf08dc829d60b126b9f52b4f411ed)):

```rust
trait SingleAssociated {
    type B;
}

impl<B, S: Generic<B>> SingleAssociated for S {
    type B = B;
}
```

However, we quickly run into a problem:

```
error[E0207]: the type parameter `B` is not constrained by the impl trait, self type, or predicates
  --> src/main.rs:15:6
   |
15 | impl<B, S: Generic<B>> SingleAssociated for S {
   |      ^ unconstrained type parameter
```

The [E0207 docs](https://doc.rust-lang.org/error_codes/E0207.html) do an excellent job explaining this (you should try `rustc --explain` if you haven't already!), but the short version is, whenever we're implementing traits, Rust wants there to be _at most one_ concrete trait implementation for every concrete type. This restriction is called "coherence", because it would be "incoherent" if we could choose between multiple possible trait implementations for a single type[^specialization]. When we write `impl<B, S: Generic<B>>`, Rust considers all possible `B` and `S` that fit the criteria before moving onto the rest of the code. However, "all possible `B`" could result in more than one `SingleAssociated for S` implementations, so we are not allowed to do that.

To get around this, we'll have to put `B` in either the trait or type, to "constrain" it.  We can't put it in the `SingleAssociated` trait definition (that would make it the same as `Generic<B>`!), and we can't put it in `S` (it's already generic), so what can we possibly do? `PhantomData` :)

[`PhantomData`](https://doc.rust-lang.org/std/marker/struct.PhantomData.html) is a zero-sized type that lets us to implement the `SingleAssociated` trait for something that, at runtime, is _basically_ the same as a normal `S`, just with extra type-level information:

```rust
use std::marker::PhantomData;

impl<B, S: Generic<B>> SingleAssociated for (S, PhantomData<B>) {
    type B = B;
}

fn mk_existential<B, S: Generic<B>>(s: S) -> impl SingleAssociated {
    (s, PhantomData)
}
```

Great, mission accomplished, right? Except wait... how do we actually use it?? ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=522b821400e55e934d0e64545c6ed571))

```rust
fn use_existential(_s: &impl SingleAssociated) -> &'static str {
    todo!()
}
```

The whole point of our existential type is to carry a proof about how we can do stuff with the `Generic` trait. But on its own, the `SingleAssociated` trait doesn't let us get at anything that implements `Generic<B>`. _We_ know that it is only implemented for our special tuple type, but Rust doesn't, so we have to help it along by adding a second associated type + a function to get at it:

```rust
trait DoubleAssociated {
    type S: Generic<Self::B>;
    type B;
    fn as_ref(&self) -> &Self::S;
}

impl<S, B> DoubleAssociated for (S, PhantomData<B>)
where
    S: Generic<B>,
{
    type S = S;
    type B = B;
    fn as_ref(&self) -> &Self::S { &self.0 }
}
```

This lets us use functions from `Generic<B>`[^self-types] ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=a423fefa5b7e2d3963de3d99f6998912)):

```rust
fn mk_existential<B, S: Generic<B>>(s: S) -> impl DoubleAssociated {
    (s, PhantomData)
}

fn use_existential(s: &impl DoubleAssociated) -> &'static str {
    s.as_ref().name()
}
```

Great! If we were satisfied with using $\exists$<span></span> types as returned from functions, we could stop here.

...However, to satisfy Alice's request, we'd also like to be able to "erase" that type by putting it in a `Box<dyn Trait>`, giving it a consistent representation; otherwise, two functions that both return `impl DoubleAssociated` could actually be returning different types, and e.g. couldn't be put inside the same `Vec`. We should able to do `Box<dyn DoubleAssociated>`, so let's try that, shall we? ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=7c335ebb94ff1628ef63e1ec483f6602)):

```rust
fn mk_box<B: 'static, S: Generic<B> + 'static>(s: S) -> Box<dyn DoubleAssociated<S=S, B=B>> {
    Box::new((s, PhantomData))
}

fn use_box(s: &Box<dyn DoubleAssociated>) -> &'static str {
    DoubleAssociated::as_ref(Box::as_ref(s)).name()
}
```

Whuh oh

```
error[E0191]: the value of the associated types `S` and `B` in `DoubleAssociated` must be specified
  --> src/main.rs:44:24
   |
14 |     type S: Generic<Self::B>;
   |     ------------------------ `S` defined here
15 |     type B;
   |     ------ `B` defined here
...
44 | fn use_box(s: &Box<dyn DoubleAssociated>) -> &'static str {
   |                        ^^^^^^^^^^^^^^^^
   |
help: specify the associated types
   |
44 | fn use_box(s: &Box<dyn DoubleAssociated<S = /* Type */, B = /* Type */>>) -> &'static str {
   |                                        ++++++++++++++++++++++++++++++++
```

It wants us to use $\forall$<span></span> again... to be honest, I totally did not expect this. I thought the fact that Rust enforces "at most one concrete trait implementation per concrete type" meant associated types could be stored in the trait object vtable somehow, but my intuition was way wrong on that.

Thinking on it further, the fact that we return things type `Associated::S` means that, at runtime, different `DoubleAssociated` impls will necessarily have different vtables, because return types will have different layouts, so the trait objects with different associated types MUST be different. Rust 1 – Me 0

So, what can we take away from this? That it's impossible to fully automatically erase multiple existential bounds in Rust in the same type, because it only supports one at a time with `dyn Trait`? Unfortunately yes, that is my takeaway here :(

Still, if we're willing to put in a little bit more legwork, it is possible to manually collapse multiple existential bounds into one.
## Attempt 3: Manual Erasing

Forget trying to use functions from `Generic<B>` directly, let's instead create a trait that manually, for each function we care about, passes thru to the function from the trait:

```rust
trait Erased {
    fn name(&self) -> &'static str;
}

impl<B, S: Generic<B>> Erased for (S, PhantomData<B>) {
    fn name(&self) -> &'static str {
        self.0.name()
    }
}
```

This works!! We can even box it, hooray ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=67deae4b6f9b2145945b74b50418b89a)):

```rust
fn mk_box<B: 'static, S: Generic<B> + 'static>(s: S) -> Box<dyn Erased> {
    Box::new((s, PhantomData))
}

fn use_box(b: &Box<dyn Erased>) -> &'static str {
    b.name()
}
```

Alice has [one last request for us here](https://bsky.app/profile/welltypedwit.ch/post/3mlqu5urfjc2s):

> hmmm but now this one doesn't work if the trait actually uses the `B` parameter right? (because you can't use it in `Erased`)

And that is true: `Erased` _intentionally_ has no way for it to vary what types it cares about, everything needs to be concrete so it can be put inside a `dyn` without issues. If we want to deal with multiple types, we'll have to use [`std::any::Any`](https://doc.rust-lang.org/std/any/trait.Any.html) to handle them at runtime. Here's an example ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=8552501df3bcf4ae4d80aef60d3073b8)):

```rust
use std::any::Any;
use std::marker::PhantomData;

trait Generic<B> {
    fn input(b: &B);
    fn output(&self) -> B;
}
impl Generic<f32> for i32 {
    fn input(b: &f32) { println!("f32: {b}") }
    fn output(&self) -> f32 { *self as f32 }
}
impl Generic<f64> for i32 {
    fn input(b: &f64) { println!("f64: {b}") }
    fn output(&self) -> f64 { *self as f64 }
}

trait Erased {
    fn input(&self, b: &Box<dyn Any>);
    fn output(&self) -> Box<dyn Any>;
}

impl<B: 'static, S: Generic<B>> Erased for (S, PhantomData<B>) {
    fn input(&self, b: &Box<dyn Any>) {
        S::input(b.downcast_ref().unwrap())
    }
    fn output(&self) -> Box<dyn Any> {
        Box::new(self.0.output())
    }
}
```

This compiles & runs successfully! Unfortunately, as you can see, manual erasure has a few drawbacks besides just dyn-compatibility.

<details><summary>Aside on dyn-compatibility</summary>

I've mentioned `dyn Trait` a few times in this article, but what sorts of traits can actually be put inside a `dyn`? There are a [whole bunch of rules](https://doc.rust-lang.org/reference/items/traits.html#dyn-compatibility) known as "dyn-compatibility" that boil down to "only do stuff that you can put inside a vtable". Most limiting is the fact that you _have_ to take `self` as a parameter for every function, because that is the only way we're able to get at a value's vtable. This is why `Erased::input()` takes in `&self` while `Generic::input()` does not.

</details>

This process, as I've outlined above, is _very_ manual: you have to rewrite every function signature to include `Box<dyn Any>` instead of `B`, and make a decision for each about whether to `.unwrap()` or propagate the error up somehow. If there are enough functions to do this conversion on, you _could_ write a `macro_rules!` to define a `Generic<B>` and `Erased` trait at the same time, but that seems very finnicky and I have been nerd-sniped enough already so I will not attempt that here :P

Anyways that's it, thanks for reading, hope you learned a little something in the process!

[^sized]: Ignore for the moment that trait objects are `!Sized`, it is not relevant to our purposes right now :)
[^dyn]: And the fact that it's actually represented by a trait object, of course.
[^nlab]: Very sorry for inflicting nlab type theory upon u, it is a cognitohazard of the highest order, nothing in it makes sense until you stare very very hard and then suddenly your brain falls out and everything makes sense and you can start speaking the same gibberish.
[^specialization]: At least, not until the [specialization RFC](https://rust-lang.github.io/rfcs/1210-impl-specialization.html) lands, which it probably never will :')
[^self-types]: If we wanted to use functions from `Generic<B>` that accepted `self` (no borrow) or `&mut self`, we'd have to add more functions to `DoubleAssociated` for those too, but like `as_ref()`, they're also trivial.