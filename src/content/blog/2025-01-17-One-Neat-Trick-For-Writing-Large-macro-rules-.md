---
title: "One Neat Trick For Writing Large `macro_rules!`"
description: "First, let\u0027s start with a related \"neat trick\" that lets you write _composable_ `macro_rules!`. Say you have a macro that generates struc..."
tags: ["programming", "rust-lang", "pwcc"]
published: 1737163083
mastodon: "https://social.treehouse.systems/@PolyWolf/113846719871374136"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3lfy5acsm5s2z"
---

First, let's start with a related "neat trick" that lets you write _composable_ `macro_rules!`. Say you have a macro that generates struct definitions[^1]:

```rust
macro_rules! node {
    (
        $name:ident [ $subnode:ident ]
    ) => {
        pub struct $name(Vec<$subnode>);
    };
    (
        $name:ident ( $(
            * $field:ident : $ty:ty
        )+ )
    ) => {
        pub struct $name { $(
            $field: $ty,
        )+ }
    };
    (
        $name:ident ( $(
            + $ty:ident
        )+ )
    ) => {
        pub enum $name { $(
            $ty($ty),
        )+ }
    };
}
```

Then, what you might want to do next is generate all these all in one macro invocation, so you don't have to write `node!()` over and over again. You might think, "darn, looks like I'll have to write all these exact branches again in order to capture them in an outer macro". But fear not, weary traveler! For I bear great news:

> Neat Trick 1: Use `tt` to capture arguments that you pass to other macro invocations.

```rust
macro_rules! nodes {
    ( $(
        $name:ident $tt:tt ;
    )* ) => {
        $(
            node!($name $tt);
        )*
    }
}
```

`tt`, or TokenTree, represents a pair of braces (round `()`, square `[]`, or curly `{}`)[^2], with _anything_ inside them. Rust is really good about enforcing braces to be in pairs even at the lex level, and this is represented in macros, which _do_ just take in an arbitrary list of tokens.

So now we have a macro that we can use like this:

```rust
mod ast {
    nodes!(
        Program[Function];
        Function(
            *open_brace: OpenBrace
            *body: Body
            *close_brace: CloseBrace
        );
        Body[BlockItem];
        BlockItem( +Statement +Declaration );
        // ...
    );
}
```

But what if that's not good enough? What if we need **_more_**?

## More?

To keep things short: in my [compiler project](https://github.com/p0lyw0lf/pwcc), I have a proc_macro that wants to read in a whole bunch of `struct`/`enum` definitions at once, by being an attribute on a module. However! There is a dilemma: the simplest approach doesn't work.

```rust
#[my_proc_macro]
mod ast {
    nodes!(/* ... */);
}
```

This is because of the order in which Rust runs macros. `#[my_proc_macro]` runs first, because it could transform the output to be _literally anything_ (see the `#[cfg]` attribute macros, which wholesale remove the thing they're applied to). What is this means, however, is that when `#[my_proc_macro]` runs, all it sees is a module with a single macro invocation, which it doesn't like, so it moves on without doing any work :(. Only then does `nodes!()` run and generate all the `struct`/`enum` definitions, too late.

Our goal is to have `#[my_proc_macro]` operate on a module with expanded `struct`/`enum` definitions. Knowing how Rust evaluates macros, we have two options:

1. Have `#[my_proc_macro]` eagerly expand all macro invocations inside it.
2. Have `nodes!()` generate everything in one shot, applying `#[my_proc_macro]` to the finished product.

(1) is not possible unless we're The Rust Compiler/willing to resort to dirty hacks, so we're left with (2).

## Generating Everything In One Pass

> Neat Trick 2: Inside a repetition `$()*`, you can use `$()?` like individual `macro_rules!` cases, and the results will be the same, so long as you use an appropriate delimiter[^3].

```rust
macro_rules! nodes_prime {
    (
        $(
            $name:ident
            $(
                // Case 1
                [ $a_subnode:ident ]
            )?
            $(
                // Case 2
                ( $(
                    * $b_field:ident : $b_ty:ty
                )+ )
            )?
            $(
                // Case 3
                ( $(
                    + $c_ty:ident
                )+ )
            )?
            // Delimiter
            ;
        )*
    ) => {
        #[my_proc_macro]
        mod ast {
            use super::*;

        $(
            $(
                // Case 1
                pub struct $name(Vec<$a_subnode>);
            )?
            $(
                // Case 2
                pub struct $name { $(
                    $b_field: $b_ty,
                )+ }
            )?
            $(
                // Case 3
                pub enum $name { $(
                    $c_ty($c_ty),
                )+ }
            )?
        )*

        }
    };
}
```

Whoa! That's a big macro, huh? Hopefully each part makes sense given the previous two macros.

How this trick works is, whenever Rust encounters a series of `$()?`, it checks the next token to see which branch matches. Assuming exactly one does, it takes that branch and emits that case within the repetition. Neat! However, there are some downsides:

1. The criteria for making `$()?` cases distinct is stricter than making `macro_rules!` cases distinct, due to the eager one-token lookahead.
2. You must make the variable names in each case distinct, which either leads to visual clutter (prefixes) or confusion (no prefixes).
3. The compiler will yell at you real good if you mess up at either of the above.

Still, at least for me, the benefit of generating everything in one shot & being compatible with `#[my_proc_macro]` easily outweighs the cost. I hope to have a blog post soon about what exactly I'm _doing_ in `#[my_proc_macro]` that makes it so cool (whoops I hinted at such a post [months ago already](https://wolfgirl.dev/blog/2024-11-24-a-novel-idea-about-functor-in-rust/), oh well). Anyways, take care, see you next time!!

[^1]: Apologies if you have trouble reading `macro_rules!` syntax from a cold start. I hope the usage example later helps.
[^2]: Yes, this list is complete, we're not forgetting angle `<>` braces, which need to be paired up in types. Rust doesn't force those to be paired up, because those tokens can also be part of comparison operators!
[^3]: We can even nest this trick as much as we want! That's how we get things like [this monstrosity](https://github.com/p0lyw0lf/pwcc/blob/bf75533bba40f9f0a06ab66a7807a5f87c72147e/pwcc/src/parser/macros.rs#L24-L174) :3