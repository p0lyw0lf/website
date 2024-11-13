---
title: "Swift *almost* does a really cool thing I want"
description: "On my [toy compiler](https://wolfgirl.dev/blog/2024-10-17-work-on-my-toy-compiler-is-progressing-smoothly/), I have a lot of AST manipula..."
tags: ["programming", "pwcc", "rust-lang", "swift-lang"]
published: 1731504980
---

On my [toy compiler](https://wolfgirl.dev/blog/2024-10-17-work-on-my-toy-compiler-is-progressing-smoothly/), I have a lot of AST manipulations I need to do. There is the "parsed" AST, the "IR" AST, and the "codegen" AST, all of which need various passes defined for them. Most passes boil down to "transform all nodes of a given type in-place". Now, because my ASTs are kinda big, and I have so many of them, and I have so many node types I want to map over, I _really_ don't want to have to write out this mapping function by hand.

My solution for Rust was to write a "specialized [Functor](https://hackage.haskell.org/package/base-4.20.0.1/docs/Data-Functor.html)" trait like so[^1]:

```rust
trait Functor<Inner> {
    type Input;
    type Output;
    type Mapped;
    fn fmap(self, f: &mut impl FnMut(Self::Input) -> Self::Output) -> Self::Mapped;
}

// example of how it's implemented:
impl<T, Inner, A, B> Functor<Inner> for Vec<T>
where
    T: Functor<Inner, Input=A, Output=B>,
{
    type Input = A;
    type Output = B;
    type Mapped = Vec<T::Mapped>;
    fn fmap(self, f: &mut impl FnMut(Self::Input) -> Self::Output) -> Self::Mapped {
        self.into_iter().map(&mut |x: T| x.fmap(f)).collect()
    }
}
```

I call this a "specialized Functor" because, unlike the Haskell version, it allows for implementations on arbitrary container types (e.x. parent AST nodes), for specific inner types (e.x. child AST nodes). To give an extremely simplified example:

```rust
struct Function {
    name: String,
    body: Vec<Statement>,
}

enum Statement {
    Return { val: isize },
}
```

A hand-written `Functor` implementation for `isize` would look like

```rust
impl Functor<isize> for isize {
    type Input = isize;
    type Output = isize;
    type Mapped = isize;
    fn fmap(self, f: &mut impl FnMut(Self::Input) -> Self::Output) -> Self::Mapped {
        f(self)
    }
}

impl Functor<isize> for Statement {
    type Input = isize;
    type Output = isize;
    type Mapped = Statement;
    fn fmap(self, f: &mut impl FnMut(Self::Input) -> Self::Output) -> Self::Mapped {
        match self {
            Statement::Return { val } => Statement::Return {
                val: val.fmap(f),
            },
        }
    }
}

impl Functor<isize> for Program {
    type Input = isize;
    type Output = isize;
    type Mapped = Program;
    fn fmap(self, f: &mut impl FnMut(Self::Input) -> Self::Output) -> Self::Mapped {
        Program {
            name: self.name,
            body: self.body.fmap(f),
        }
    }
}

#[test]
fn map_isize() {
    let x = Program {
        name: "main".into(),
        body: [Statement::Return { val: 1 }].into(),
    };
    // Pretend we derived Clone
    let y = Functor::<isize>::fmap(x.clone(), |i| i + 1);
    // Pretend we derived PartialEq
    assert_eq!(y, Program {
        name: "main".into(),
        body: [Statement::Return { val: 2 }].into(),
    });
}
```

That is, we re-construct the value in-place, recursively calling `fmap` to transform the appropriate fields[^3].

Now, because the entire point of this is for me to be really lazy, I did not want to have to write out all these `Functor` implementations manually. So naturally, I [wrote a macro](https://github.com/p0lyw0lf/pwcc/blob/6598df9aa48c28b4fe577540e7d824343510670f/functional/src/functor.rs)[^2] that does most of the work for me. All I have to do now is specify, for a given inner type, for each AST node above it in the tree, what fields I'd like to map over.

Unfortunately, that's still too much work!!! I have a lot of AST nodes and inner types I want to map over, so what I'd really like is a way to define something like this:

```swift
func fmap<Container, Inner>(over c: Container, f: (Inner) -> Inner) -> Container {
  // somehow `fmap` over all of `c`'s fields
  return c;
}

func fmap<Inner>(over v: Inner, f (Inner) -> Inner) -> Inner {
  return f(v);
}
```

Basically: if we're at the target node type, just call the function (definition 2), otherwise, recursively call into all fields (definition 1). Easy as pie!

Wait a minute... that syntax highlighting... yep, this "pseudocode" is in fact, valid Swift! It even does exactly we want!!! See?

```swift
print(fmap(1, { $0 + 1 })); // 2
print(fmap("hello", { $0 + 1 })); // "hello"
print(fmap("hello", { $0 + "_world" })); // "hello_world"
```

This kind of definition is impossible to do in Rust thanks to a little thing called [Coherence](https://doc.rust-lang.org/reference/items/implementations.html?highlight=coherence#trait-implementation-coherence), a.k.a. No [Specialization](https://rust-lang.github.io/rfcs/1210-impl-specialization.html). What Specialization allows us to do is write down those 2 definitions for `fmap`, and the compiler will automatically choose the "least generic" one according to some rules.

Great! Now all I have to do is implement some compile-time introspection to get it to map over the appropriate fields. How hard could that be?

[2 hours of trying to read Swift documentation and finding mostly AI-generated blog posts. Thank goodness for StackOverflow at least]

Upon looking further, it seems the built-in read-only reflection with [Mirror](https://developer.apple.com/documentation/swift/mirror) only happens at runtime, and the [Runtime](https://github.com/wickwirew/Runtime) read-write reflection library is same way (aptly-named). Also, there doesn't seem to be a way to dynamically call `fmap` based on the runtime type; instead, all recursive calls result in an `Any` type for `Container`, since that's all that can be resolved statically. By passing in types as arguments, I can get all the way down to "cannot convert value of type 'any Any.Type' to expected argument type '(any Any).Type'", which really illustrates the predicament.

I _might_ be able to hack something with the `dynamic` keyword or like Protocols or whatever, but I'm still not pleased about runtime-only reflection. I am willing to pay the slight extra binary cost for all these definitions, and Swift doesn't let me do that. Unfortunate that this was a dead end, but still pretty fun to learn something new!

Think I'll try Haskell next? :P

[^1]: Note this trait has extra considerations for "what if the thing we're mapping over is polymorphic?". The complexity is about the same even without that consideration, unfortunately...
[^2]: (Not sure where to put this but it's still relevant for footnotes) I also had the idea of using this macro to define both `Functor<Inner>` and `Functor<Result<Inner, Err>>` implementations. This works because `Inner` is never a `Result`, so everything has coherence! These latter implementations would have `Input=Inner, Output=Result<Inner, Err>` and could be configured to fail early or to collect all errors. Unfortunately, I ran into Coherence problems again when I tried to `impl Functor<Result<T, E>> for Vec<Result<T, E>>` (for `Mapped=Result<Vec<T, E>>`). I _could_ just write another trait as well, but man that's annoying!
[^3]: Note the strange function invocation outside the trait. The compiler has a hard time inferring what `Functor` implementation to use otherwise, for some reason. That's how you know we're doing something cursed!