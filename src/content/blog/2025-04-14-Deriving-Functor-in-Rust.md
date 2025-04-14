---
title: "Deriving `Functor` in Rust"
description: "Wow it\u0027s been a hot minute! I kept meaning to write about this, but each time I sat down, I came up with a new idea that I just _had_ to..."
tags: ["programming", "rust-lang"]
published: 1744645076
---

Wow it's been a hot minute! I kept meaning to write about this, but each time I sat down, I came up with a new idea that I just _had_ to try out. At this point, I have tried enough things, and am reasonably confident all my explanations will be correct. So, without further ado,

## Problem Statement

Given:
+ A finite set of `struct`s/`enum`s (henceforth referred to as "items"), possibly generic
Create:
+ A way to, for each item in the set, recursively transform any other item, including inner generic parameters, if possible.

Let's take a look at a simple example:

```rust
struct ListNode<T> {
    val: Val<T>,
    next: Option<Box<ListNode<T>>>
}
struct Val<T>(T);
```

Then, given a `ListNode<T>`, we'd like to be able to turn it into a `ListNode<U>`, just by specifying how to turn `Val<T>` into `Val<U>`.

## Approach 1: Write a traversal manually

```rust
impl<T> ListNode<T> {
    fn transform<U>(self, f: impl FnMut(Val<T>) -> Val<U>) -> ListNode<U> {
        ListNode {
            val: f(self.val),
            next: self.next.map(|n| Box::new((*n).transform(f))),
        }
    }
}
```

Great! Nice & simple. However, manually mapping through the `Option` and `Box` is a bit tedious, especially if we want to write other, similar transforms. Let's see if we can solve that.

## Approach 2: `Functor` time!!

In my [last post on this subject](https://wolfgirl.dev/blog/2024-11-24-a-novel-idea-about-functor-in-rust/), I covered this crazy wacky trait I called `Functor`, invented specifically to do these sorts of transforms. Here's the trait definition[^functor]:

```rust
trait Functor<Output> {
    type Input;
    type Mapped;
    fn fmap(self, f: impl FnMut(Self::Input) -> Output) -> Self::Mapped;
}
```

And here's how it's used ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=986293cbdec0b24e8f2f7a3f3406067e)), with doc comments explaining what each part means:

```rust
/// There are 4 types involved in any Functor implementation: {Input, Output} x {Inner, Container}.
/// What a Functor implementation means is, given a function InputInner -> OutputInner, you can write a function InputContainer -> OutputContainer.
/// Writing the full name of each type is a bit hard, so we have shorthand:
/// + InputInner = Input (Val<T>)
/// + OutputInner = Output (Val<U>)
/// + InputContainer = Self (ListNode<T>)
/// + OutputContainer = Mapped (ListNode<U>)
impl<T, U> Functor<Val<U>> for ListNode<T> {
    type Input = Val<T>;
    type Mapped = ListNode<U>;
    fn fmap(self, mut f: impl FnMut(Val<T>) -> Val<U>) -> ListNode<U> {
        ListNode {
            val: f(self.val),
            next: self.next.fmap(&mut f),
        }
    }
}
/// Given all types T that can be mapped over, allow Option<T> to be mapped over in the same way, automatically un/re-wrapping the Some case as required
impl<T, Output> Functor<Output> for Option<T>
where
    T: Functor<Output>
{
	/// Input is the type given as input to the internal transform. In this case, because we are transparent, we use T's input
    type Input = T::Input;
    /// Mapped is the external type after the transform has been done. Because we are wrapping T as input, we also wrap T's mapped type as output.
    type Mapped = Option<T::Mapped>;
    fn fmap(
        self, //: Option<T>
        f: impl FnMut(T::Input) -> Output,
    ) -> Option<T::Mapped> {
        Option::map(self, |x| x.fmap(f))
    }
}

/// The implementation for Box<T> is very similar to that for Option<T>, included for completeness.
impl<T, Output> Functor<Output> for Box<T>
where
    T: Functor<Output>,
{
    type Input = T::Input;
    type Mapped = Box<T::Mapped>;
    fn fmap(
        self,
        f: impl FnMut(Self::Input) -> Output,
    ) -> Box<T::Mapped> {
        Box::new((*self).fmap(f))
    }
}
```

Neat! This way, if we're writing a lot of transforms, they'll be composable with existing container types like `Option` & `Box`, as well as any other container types we might try.

However, I'm still a bit sad about having to write these transforms by hand. Especially given the fact that, while `Functor` is nice to implement for wrapper types like `Option` and `Box`, it isn't as nice for "AST-like" types...

### Problems With AST-like Types

Consider what would happen if we had the following set of items:

```rust
struct A {
    b: B,
}
struct B {
    c: C,
}
struct C(i32);
```

Naturally, we'd want to call `a.fmap(|c: C| ...)`. But! There is no item `C` in any direct fields of `A`, only indirectly thru `b: B`. If we only cared about this one `fmap` call, we could write:

```rust
impl Functor<C> for A {
	type Input = C;
	type Mapped = A;
	fn fmap(self, f: impl FnMut(C) -> C) -> A {
		A { b: self.fmap(f) }
	}
}
impl Functor<C> for B {
	type Input = C;
	type Mapped = B;
	fn fmap(self, mut f: impl FnMut(C) -> C) -> B {
		B { c: f(self.c) }
	}
}
```

Which is fine. But, you might eventually add an item `D` that you also want to map over from `A`. Then you'd have to write:

```rust
impl Functor<D> for A { ... }
impl Functor<D> for B { ... }
impl Functor<D> for C { ... }
```

Apparently, the number of `Functor` implementations you have to write scales linearly with both the depth of the tree *and* the number of things you want to map over, so quadratically in total, which is quite bad.

Ideally, you'd like to just scale linearly with the size of the tree. Here's one approach for this:

```rust
/// These "base impls" can all be easily generated with a macro
impl Functor<A> for A {
	type Input = A;
	type Mapped = A;
	fn fmap(self, mut f: impl FnMut(A) -> A) -> A {
		f(self)
	}
}
impl Functor<B> for B { ... }
impl Functor<C> for C { ... }

/// These "recursive impl"s are written manually, but that's OK, we only need one per item!
impl<T> Functor<T> for A where B: Functor<T, Mapped=B> {
    type Input = <B as Functor<T>>::Input;
    type Mapped = A;
    fn fmap(self, f: impl FnMut(Self::Input) -> T) -> A {
        Self {
            b: self.b.fmap(f),
        }
    }
}
impl<T> Functor<T> for B where C: Functor<T, Mapped=C> { ... }
```

Seasoned Rust veterans may be able to spot the problem: `impl<A> Functor<A> for A` and `impl<T> Functor<T> for A` conflict! Never mind that `where` clause, the Rust compiler is sometimes very particular about preventing future conflicts too[^conflicts], just in case `B: Functor<A, Mapped=B>` somehow.

If only there were a way to automatically write all those quadratic dumb-but-non-conflicting implementations... then it wouldn't matter that there's so many...[^compiletimes]

## Approach 3: Use A `proc_macro`

Turns out, there's enough information in the item definitions alone to generate the traversals automatically. All we really need is:

1. A list of all items considered a part of the AST
2. The type of each field in each item
3. A way of determining valid transforms to generate for each item
4. A way of generating each valid transform

We need (1) because of the problem presented before: it's not possible to generate `Functor` impls for _arbitrary_ types, so we must explicitly choose the ones we want to map over.

(2) and (4) are also fairly straightforward given Rust's de-facto introspection libraries, [syn](https://docs.rs/syn/latest/syn/) & [quote](https://docs.rs/quote/latest/quote/)[^dtolnay]. There are some subtleties when it comes to actually extracting the information we want (the Rust type grammar is so much...), but overall "get the type of a field" and "get the shape of an item" is not too hard. Same with generating the transform; once you have the information of "what type am I transforming" and "what fields should I transform for that type", emitting the code is fairly straightforward. You can [take a look at my code](https://github.com/p0lyw0lf/pwcc/blob/715eca08fc3e6acc5ba65030d096bf383c78c054/functional_macros/src/traits/functor.rs) if you're curious, but I promise it's really boring.

(3), on the other hand, is much more difficult + interesting, and is a big reason I kept delaying this piece. Turns out re-creating the Rust trait implementation coherence semantics is pretty involved!!

### What Even Is A Valid Transformation?

Let's start out with the most basic criteria. Any valid implementation of `Functor<B> for A` comes about because:
1. `A` has a field with type `B`, where "with type" looks inside any wrapper types like `Option`/`Box`, OR
2. `A` has a field with type `C`, where `Functor<B> for C` is a valid transform.

We get the information for (1) when reading in the items initially. To get (2), we must turn to the horror that is graph algorithms in Rust. Get ready for some math!

### 1: The Lattice Step

I call this a "lattice" because it encodes a "higher-than" relationship that's useful for what I'm doing. It's not a _true_ lattice by many definitions of the word, but im the programmer so i get to name things badly ok

What this step looks like is, taking all edges matching `Functor<C> for A` (denoted as `A -> C`) + `C -> B`, and collecting them into a new edge `A -> B`. This is so we can get all the possible implementations that would be covered by case (2) above. There are a few subtleties when it comes to unifying generic contexts, but like the mathematician I'm cosplaying as, I'll leave those for the appendix[^unifying].

However! We're not done yet. Creating all these new edges gives us all the _possible_ implementations, but not all the _valid_ ones. To do this, we need to filter out all invalid edges, so let's look at some ways an implementation (as defined by an edge) can be invalid.

### 2: Filter Out Conflicting Generic Instantiations

Consider the following:

```rust
struct A1<T, U> {
    bt: B<T>,
    bu: B<U>,
}
struct B<T>(T);
```

If we try list out all the possible implementations, we get:

```rust
impl<T, U> Functor<B<T>> for A1<T, U> { ... }
impl<T, U> Functor<B<U>> for A1<T, U> { ... }
```

Note we have two implementations, because `B<T>` and `B<U>` are different types. But clearly, these implementations conflict! This is because `Functor<B<T>>` and `Functor<B<U>>` are _not_ different traits. Without any preference for which implementation to keep, we discard both.

There is a similar conflict if we instead have:
```rust
struct A2<T> {
    bt: B<T>,
    bi: B<i32>,
}
```

Because `Functor<B<T>>` _could_ be the same trait as `Functor<B<i32>>`, and without a "type inequality" bound (not possible to express in Rust iirc), we can't generate these. In this case, we just prefer the `Functor<B<i32>>` implementation that only transforms `bi`, because without generic parameters, implementations can never conflict.

The algorithm for deciding if a pair of instantiations conflict is as follows:
1. For each pair of arguments in order:
	1. If both are generic, they must be the same generic. Otherwise, there's a conflict.
	2. If only one is generic, there's a conflict
	3. If neither are generic, there's no conflict.

### 3: Restrict Which Generic Parameters Are Transformed

This is a bit of a case of me being burned by making my `Functor` too complex, but screw it I _did_ want that complexity. The situation is, if you have something like:

```rust
struct A<T> {
    b: B<T>,
    c: C<T>,
}
struct B<T> {
    c: C<T>,
}
struct C<T>(T);
```

And we try to write the "full" implementation for `A -> B` that transforms its generic parameter:

```rust
impl<T, U> Functor<B<U>> for A<T> {
    type Input = B<T>;
    type Mapped = A<U>;
    fn fmap(self, f: impl FnMut(B<T>) -> B<U>) -> A<U> {
        A {
            b: f(self.b),
            c: self.c, // ERROR: expected C<U>, got C<T>
        }
    }
}
```

Oh no type error!! The reason it happens is because we can't transform the generic type of `c` even though we need to. There are a couple parts to this:

1. How do we know we need to transform `c`?
	+ Because the generic context used by field `b`, and therefore the generic context transformed by `b`, is also used by field `c`.
2. How do we know we cannot transform `c`?
	+ We look at all the outgoing edges from item `C`, and if there are none that would satisfy the transformation `C -> B` (for the same instantiated item `B` as is being considered for field `b`), then field `c` cannot be transformed.

Anyways, this is all just to check if we can transform the generic parameter `T` to `U`. If we can't, no worries, we can just generate a `Functor` implementation that doesn't transform `T` :) Like any sane person would do :)

### What Is The Correct Order For These Steps?

If you've been paying attention (no worries if not, it's a long one, you're almost there!), you may have noticed something: step 3 above look at outgoing edges for all nodes one level "below" the current. However, step 2 explicitly removes some edges from the graph. So! We must be smart about the order in which we look at nodes for step 3, so we don't end up keeping an edge `A -> B` only to later remove the edge `C -> B` that made keeping it possible.

I claim the correct traversal order is "reverse [topological sort](https://en.wikipedia.org/wiki/Topological_sorting) order". (Whoopee, more graph algorithms in Rust!) Basically, we should start with nodes that don't point to anything (the "bottom"), then nodes that only point to previously explored nodes, and so on. This ensures we don't end up in that bad scenario.

However! The topological sort order is only defined for directed graphs with no loops. Our graph _can_ have loops, and indeed, that's a big feature for this macro in general, being able to support trees & linked lists & such, which all have edges that look like `A -> A` or even `A -> B -> C -> A`. Are we out of luck?

Not yet! By first finding the [strongly connected components](https://en.wikipedia.org/wiki/Strongly_connected_component) (omg more graph algorithms!!), we can do a topological sort on _those_, which are guaranteed to not have loops between them, and our traversal order will be good.

"But what about the order within a strongly connected component?", you may ask. Well, thanks to our lattice step earlier, every loop `A -> B -> C -> A` in the graph will become a clique, so if `A`, `B`, and `C` are in the same strongly connected component, `A -> B` & `C -> B` will always exist. Wow it's almost like I'm actually doing math!!

So, the correct order of steps is:

1. Lattice step
2. Filter out conflicting instantiations
3. Topological sort
4. Restrict generic parameters

And that's all there is to it! ;)

## Conclusion

At long last, we have reached the end of everything I know about automatically deriving a `Functor` implementation. These rules have worked out for me in practice, for [two very](https://github.com/p0lyw0lf/pwcc/blob/715eca08fc3e6acc5ba65030d096bf383c78c054/pwcc/src/parser.rs#L24-L164) [large ASTs](https://github.com/p0lyw0lf/pwcc/blob/715eca08fc3e6acc5ba65030d096bf383c78c054/pwcc/src/codegen.rs#L19-L111). There are more things I know, like deriving [TryFunctor](https://github.com/p0lyw0lf/pwcc/blob/715eca08fc3e6acc5ba65030d096bf383c78c054/functional/src/try_functor.rs#L8-L25) and [Foldable](https://github.com/p0lyw0lf/pwcc/blob/715eca08fc3e6acc5ba65030d096bf383c78c054/functional/src/foldable.rs#L5-L22) and [Visit](https://github.com/p0lyw0lf/pwcc/blob/715eca08fc3e6acc5ba65030d096bf383c78c054/functional/src/test_visit.rs#L7-L50), but those all use these same basic principles too. There are also many more things I do not know, like "what if a field contains a generic type but doesn't have one of the designated items?" or "how can I prevent mapping invalid field types, like `fn(T) -> U`" or "am I using `panic!` to handle errors too often", but those are all left for later/never. I do not recommend anyone else attempt to use this code btw, it is simply a dangerous toy for my own amusement, and it _will_ blow up in ur face.

Anyways, thanks for reading, see u next time!! :3

[^functor]: If you look in [my repository](https://github.com/p0lyw0lf/pwcc/blob/d40f72bfd97c8b95bda9e12ec9637c1d4d6fe56c/functional/src/functor.rs#L21-L25), you'll see I actually use a couple modifications: (1) it takes in an `&mut impl FnMut`, and (2) it takes in an extra `RecursiveCall` parameter. These are for structures like binary trees, where (1) the same `f` can't be moved into both calls, and trying to `&mut` it generates an infinite sequence of `&mut` checks, and (2) controlling when `f` would be called on a parent node: before its children, after its children, or not calling into children at all. Anyways! Not important for this piece, all the other relevant details are the same.

[^conflicts]: As it turns out, if all of these implementations & items are in the same crate as `Functor`, with private visibility, this actually works out! ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=022e8efdd57f9085dd0729093a64f046).) The compiler can prove that the implementations never conflict, and these will be the only implementations that exist, so everything is groovy. Unfortunately, I do define my `Functor` trait in a separate crate from my AST items, for pretty obvious separation-of-concern reasons, so everything I've said still stands.

[^compiletimes]: Except for compile times, of course :P It did eventually get so bad in my project that I had to make "being `Input`" opt-in, reducing hot-rebuild times from 30s to 5s.

[^dtolnay]: I should really get off these... dtolnay did my boy JeanHeyd real dirty, introwospection in its full form would have been perfect for this project, but alas. If I can stomach runtime reflection instead of compile-time reflection (which might happen as soon as I take a real look at binary sizes), I should consider using [facet-reflect](https://docs.rs/facet-reflect/latest/facet_reflect/) instead...

[^unifying]: Consider a struct declared as `A<T>` with field type `B<T>`, and a struct declared as `B<U>` with field type `C<U>`. When generating the edge `A -> C`, we want to turn the `C<U>` declaration into a `C<T>` one. You have to lookup the variables in the generic context to do the mapping appropriately, neat stuff!