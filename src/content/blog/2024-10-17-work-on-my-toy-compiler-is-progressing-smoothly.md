---
title: "work on my toy compiler is progressing smoothly"
description: "as mentioned in my [projects](/projects/) page, i\u0027m writing a toy compiler called [PolyWolf\u0027s C Compiler](https://github.com/p0lyw0lf/pwc..."
tags: ["programming", "pwcc"]
published: 1729218226
---

as mentioned in my [projects](/projects/) page, i'm writing a toy compiler called [PolyWolf's C Compiler](https://github.com/p0lyw0lf/pwcc) based off the book [Writing a C Compiler](https://nostarch.com/writing-c-compiler). I've used it as an excuse to do a good amount of Rust metaprogramming (`macro_rules!` only!!), and now that I've figured out a bunch of the tricky bits, it's been smooth sailing putting more recent chapters into my mostly-declarative framework.

my approach diverges a bit from the book, however, even by chapter 4 (out of many, many more) and I think that's important to write down. `wacc` does not distinguish between "all possible operands" and "all operands that can be written to", making it possible to represent illegal instructions like `mov $1, $2`. `pwcc` _does_ make a distinction between these, respectively calling them "Val" & "Temporary" at the IR stage and "Operand" & "Location" at the assembly generation stage.

however, this doesn't resolve _all_ issues. memory-to-memory `mov`s still aren't allowed & need to be dealt with the same way, by introducing an intermediate register[^1]. it also has created more problems, like needing to allocate extra Temporaries in certain scenarios the result of an expression is a Val, when the original code just uses a register instead of stack space. my hope is that my structure is amenable to optimizations later, plus it just feels better to have more invalid states not representable via types :) I do wonder if I can make _all_ invalid instructions not representable, i.e. by also distinguishing between register and memory operands earlier... maybe not worth it b/c better to consolidate that logic into the hardware pass at the end instead of forcing it to be in the IR -> Assembly pass? idk we'll see

[^1]: i don't feel great about this solution; the book allocates an entire **_2_** registers for this purpose, `%r10d` and `%r11d`, which i think is way too much for the limited number x86 has.
