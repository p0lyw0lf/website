---
title: "Packaging Multiple Dependent Python Modules Using Hatch \u0026 Nix"
description: "Alternative title: \"Overcomplicating My Website Backend Using Hatch \u0026 Nix\". For the life for me, I could not figure out how to string all..."
tags: ["programming", "python", "nix"]
published: 1747307137
---

Alternative title: "Overcomplicating My Website Backend Using Hatch & Nix". For the life for me, I could not figure out how to string all of this together until after pouring over the [nixpkgs manual](https://ryantm.github.io/nixpkgs/languages-frameworks/python/) & [NixOS Wiki](https://nixos.wiki/wiki/Packaging/Python) about 20 times each; no other resource applied cleanly to my situation. Here's hoping these instructions will help someone else going thru the same thing I did.

## Basic Setup

Say we have two Python applications that depend on a third, shared Python library. That is, something like the following:

```python
# shared/__init__.py
NAME = "PolyWolf"
```

```python
# hello/__main__.py
from shared import NAME
if __name__ == "__main__":
    print(f"Hello, {NAME}")
```

```python
# goodbye/__main__.py
from shared import NAME
if __name__ == "__main__":
    print(f"Goodbye, {NAME}")
```

Then, we can run them like so:

```
$ nix-shell -p python3 tree
fetching path input 'path:/nix/store/1dwky0bis4bkl3qngsc6pmq902swa9b6-source'

[nix-shell:/tmp/blogpost]$ tree
.
├── goodbye
│   └── __main__.py
├── hello
│   └── __main__.py
└── shared
    └── __init__.py

4 directories, 3 files

[nix-shell:/tmp/blogpost]$ python3 -m hello
Hello, PolyWolf

[nix-shell:/tmp/blogpost]$ python3 -m goodbye
Goodbye, PolyWolf
```

What the programs actually do doesn't matter all too much; what matters is the module structure, and the directory structure. We want `shared` to be, well, _shared_ between the `hello` & `goodbye` programs, and for no one program to be the obvious one to contain all the shared code. This represents how my [crossposter](https://github.com/p0lyw0lf/crossposter) is structured, and is representative of many other "monorepo"-style applications too[^python-vs-js].

### `PYTHONPATH` And You

As a slight aside, there's a specific reason we ran the programs with the `-m` flag earlier. To see this, let's try running without it:

```
[nix-shell:/tmp/blogpost]$ python3 hello
Traceback (most recent call last):
  File "<frozen runpy>", line 198, in _run_module_as_main
  File "<frozen runpy>", line 88, in _run_code
  File "/tmp/blogpost/hello/__main__.py", line 1, in <module>
    from shared import NAME
ModuleNotFoundError: No module named 'shared'
```

Oh no the dreaded `ModuleNotFoundError`!! Reading around a bit, we learn the module search path is stored in the `sys.path` variable, and learn about [its initialization procedure](https://docs.python.org/3/library/sys_path_init.html):

> The first entry in the module search path is the directory that contains the input script, if there is one. Otherwise, the first entry is the current directory, which is the case when executing the interactive shell, a -c command, or -m module.

Aha! So that's why: In the `-m` example, the `/tmp/blogpost` directory was added to the module path, because there was no "input script", just a module to be run. But without `-m`, the `/tmp/blogpost/hello` directory was added, because that's where `__main__.py` lives, and that directory does _not_ contain a `shared` module. Is there a workaround? Fortunately, yes, in the next paragraph:

> The `PYTHONPATH` environment variable is often used to add directories to the search path. If this environment variable is found then the contents are added to the module search path.

So! If we really wanted, we could do something like:

```
[nix-shell:/tmp/blogpost]$ PYTHONPATH="$(pwd):$PYTHONPATH" python3 hello
Hello, PolyWolf
```

But honestly, I just use `-m` :) Anywho, this diversion into `PYTHONPATH` & module resolution wasn't too relevant, still useful to understand, back to the main content now :)

## Transitioning To Hatch

You may have noticed something about our basic setup: it doesn't create a virtual environment :( This isn't a problem for our extremely simple `hello` and `goodbye` programs, but as soon as we need a single dependency outside the standard library, we'll be in trouble.

For the longest time, I just stuck with the ol' reliable `python3 -m venv .venv && source .venv/bin/activate && pip3 -r requirements.txt`; [venv](https://docs.python.org/3/library/venv.html) is included in the standard library, so it'll Just Work™️ on any Python installation >= 3.3, which is to say, "all of them". There are a bazillion other tools to manage Python virtual environments, like [virtualenv](https://virtualenv.pypa.io/en/latest/user_guide.html), [pipenv](https://pipenv.pypa.io/en/latest/), [conda](https://www.anaconda.com/docs/getting-started/miniconda/main), [uv](https://docs.astral.sh/uv/), & more, but I have never needed their full power, hence, ol' reliable.

Now, however, with the goal of "creating packages to be built with Nix", we might want something a bit more powerful, something capable of creating Python packages. The modern way to do this is with the [pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/) format, whose guide recommends [Hatch](https://hatch.pypa.io/latest/) as the default build backend, so that's what I'll be using for the rest of this "tutorial".

First, let's make some more directories, and move some files around. Why we're doing this will become apparent shortly:

```
[nix-shell:/tmp/blogpost]$ for lib in shared hello goodbye; do
> mkdir -p $lib/src/$lib
> mv $lib/*.py $lib/src/$lib
> done
```

Then, let's define our pyproject.toml for these new folders:

```toml
# shared/pyproject.toml
[build-system]
requires = ["hatchling >= 1.26"]
build-backend = "hatchling.build"

[project]
name = "shared"
version = "0.1.0"
```

```toml
# {hello,goodbye}/pyproject.toml
[build-system]
requires = ["hatchling >= 1.26"]
build-backend = "hatchling.build"

[project]
name = "hello" # goodbye/pyproject.toml is identical, save this line
version = "0.1.0"
dependencies = [
  "shared @ {root:parent:uri}/shared", # ":parent" is equivalent to "../", and can be stacked as many times as required
]

[tool.hatch.metadata]
allow-direct-references = true
```

We end up with a directory structure that looks like this:

```
[nix-shell:/tmp/blogpost]$ tree
.
├── goodbye
│   ├── pyproject.toml
│   └── src
│       └── goodbye
│           └── __main__.py
├── hello
│   ├── pyproject.toml
│   └── src
│       └── hello
│           └── __main__.py
└── shared
    ├── pyproject.toml
    └── src
        └── shared
            └── __init__.py

10 directories, 6 files
```

We've created 3 separate "projects", and then put our files within each project in such a way that Hatch expects to be able to build a package from them.

So! Let us now create a virtual environment, build a package, and run it, all in one handy command:

```
[nix-shell:/tmp/blogpost]$ exit

$ nix-shell -p hatch tree
fetching path input 'path:/nix/store/1dwky0bis4bkl3qngsc6pmq902swa9b6-source'

[nix-shell:/tmp/blogpost]$ cd hello

[nix-shell:/tmp/blogpost/hello]$ hatch run -- python3 -m hello
  error: subprocess-exited-with-error

  × Preparing editable metadata (pyproject.toml) did not run successfully.
  │ exit code: 1
  ╰─> [56 lines of output]
      Traceback (most recent call last):
        File "/home/nixos/.local/share/hatch/env/virtual/hello/DMd9LDvE/hello/lib/python3.12/site-packages/pip/_vendor/pyproject_hooks/_in_process/_in_process.py", line 167, in prepare_metadata_for_build_editable
...
```

_**AAAAAAAAAA**_

```
...
      ValueError: Unable to determine which files to ship inside the wheel using the following heuristics: https://hatch.pypa.io/latest/plugins/builder/wheel/#default-file-selection

      The most likely cause of this is that there is no directory that matches the name of your project (hello).

      At least one file selection option must be defined in the `tool.hatch.build.targets.wheel` table, see: https://hatch.pypa.io/latest/config/build/

      As an example, if you intend to ship a directory named `foo` that resides within a `src` directory located at the root of your project, you can define the following:

      [tool.hatch.build.targets.wheel]
      packages = ["src/foo"]
      [end of output]
...
```

aaaaa oh wait ok I think I know why this is happening: we forgot to provide an empty `__init__.py` file to appease the Python Gods. The Python Gods are displeased when a folder acts as a module & does not contain an `__init__.py` file, and we only avoided their wrath earlier because our earthly machinations provided no threat to their heavenly realm; now that we have dared snatch the fire that is "build tool that manages a virtual environment" from their palace, the only way to placate them is to fix our directory structure, _not_ to torture our config file like their oracles suggested. Allow me to demonstrate:

```
[nix-shell:/tmp/blogpost]$ for lib in hello goodbye; do touch $lib/src/$lib/__init__.py; done

[nix-shell:/tmp/blogpost]$ tree
.
├── goodbye
│   ├── pyproject.toml
│   └── src
│       └── goodbye
│           ├── __init__.py
│           └── __main__.py
├── hello
│   ├── pyproject.toml
│   └── src
│       └── hello
│           ├── __init__.py
│           └── __main__.py
└── shared
    ├── pyproject.toml
    └── src
        └── shared
            └── __init__.py

10 directories, 8 files
```

And now, we should surely be able to run:

```
[nix-shell:/tmp/blogpost/hello]$ hatch run -- python3 -m hello
/home/nixos/.local/share/hatch/env/virtual/hello/DMd9LDvE/hello/bin/python3: No module named hello
```

Ah, right, stale environment:

```
[nix-shell:/tmp/blogpost/hello]$ hatch env prune

[nix-shell:/tmp/blogpost/hello]$ hatch run -- python3 -m hello
Hello, PolyWolf
```

Big success!![^errors] 🐍, amirite? :P

## Time To Nix It Up

Referencing [Jade](https://hachyderm.io/@leftpaddotpy)'s excellent resource on [using Nix flakes the non-flake way](https://jade.fyi/blog/flakes-arent-real/), let's set up a simple devshell[^more-nix-shells]:

```nix
# flake.nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
    in
      {
        devShells.default = pkgs.callPackage ./shell.nix { };
      }
  );
}
```

```nix
# shell.nix
{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  packages = (
    with pkgs;
    [
      # The python virtual environments themselves are managed with hatch, no need for any other dependencies in this file! Unless you want to put like, language server stuff here ofc
      hatch
    ]
  );
}
```

And for this next part, it would be very useful for to do a bit of reading on Nix before continuing; I recommend the nix.dev tutorials on [`callPackage`](https://nix.dev/tutorials/callpackage) + [local files](https://nix.dev/tutorials/working-with-local-files), the NixOS Wiki page on [Overlays](https://wiki.nixos.org/wiki/Overlays), & all the basic Nix syntax ones. Otherwise, this will just be blind copy-pasting:

```nix
# shared/package.nix
{
  lib,
  buildPythonPackage,
  hatchling,
}:
buildPythonPackage {
  pname = "shared";
  version = "0.1.0";

  src = lib.fileset.toSource {
    root = ./.;
    fileset = lib.fileset.gitTracked ./.;
  };

  pyproject = true;
  build-system = [ hatchling ];
}
```

```nix
# {hello,goodbye}/package.nix
{
  lib,
  buildPythonPackage,
  hatchling,
  myproject-shared, # Here, we take the package defined by shared/package.nix as a dependency, to be hooked up later
}:
buildPythonPackage {
  pname = "hello"; # goodbye/package.nix is identical, save this line
  version = "0.1.0";

  src = lib.fileset.toSource {
    root = ./.;
    fileset = lib.fileset.gitTracked ./.;
  };

  pyproject = true;
  build-system = [ hatchling ];

  propagatedBuildInputs = [ myproject-shared ]; # Here, we declare how exactly we depend on the package defined by shared/package.nix; we'll get into what this means later
}
```

Whoa that's it!! For the Nixpkgs-style files, at least. Yeah, turns out using Hatch took care of most of the hard part of packaging, the rest is built-in to Nixpkgs itself. We do still have to repeat the dependencies of each project outside of the pyproject.toml[^repeat-dependencies], which is a bummer, but oh well the rest of the file is quite small which is good, thank u Nixpkgs

With all these files in place, our tree now looks like:

```
[nix-shell:/tmp/blogpost]$ tree
.
├── flake.lock
├── flake.nix
├── goodbye
│   ├── package.nix
│   ├── pyproject.toml
│   └── src
│       └── goodbye
│           ├── __init__.py
│           └── __main__.py
├── hello
│   ├── package.nix
│   ├── pyproject.toml
│   └── src
│       └── hello
│           ├── __init__.py
│           └── __main__.py
├── shared
│   ├── package.nix
│   ├── pyproject.toml
│   └── src
│       └── shared
│           └── __init__.py
└── shell.nix

10 directories, 14 files
```

Next, we have to wire all these packages up inside our `flake.nix` so we can actually build them. These are fairly unusual packages, turns out; they use a top-level `buildPythonPackage` variable that doesn't exist in a normal Nixpkgs `callPackage`. This aligns with the [Nixpkgs manual](https://ryantm.github.io/nixpkgs/languages-frameworks/python/): Python packages are special, because they could be built for multiple versions of the interpreter, and this is the easiest way to do that without having to do something even crazier w/ overrides.

Anyways, here's our updated `flake.nix`, then an explanation:

```nix
# flake.nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
      python3 = pkgs.python3.override {
        packageOverrides = final: prev: {
          myproject-shared = final.callPackage ./shared/package.nix { };
          myproject-hello = final.callPackage ./hello/package.nix {
            myproject-shared = final.myproject-shared;
          };
          myproject-goodbye = final.callPackage ./goodbye/package.nix {
            myproject-shared = final.myproject-shared;
          };
        };
      };
    in
    {
      packages = { inherit python3; };
      devShells.default = pkgs.callPackage ./shell.nix { };
    }
  );
}
```

Oh wow that's dense! Let's split it up a bit:

```nix
let
  python3 = pkgs.python3.override {
    # ...
  };
in
{
  packages = { inherit python3; };
}
```

This declares a new `python3` package in our Flake, defined as an override of the base `python3` package, whose final `pkgs` attribute will contain our custom packages. And how do we declare those? With the [overlay](https://nixos.wiki/wiki/Overlays) pattern!

```nix
packageOverrides = final: prev: {
  myproject-shared = final.callPackage ./shared/package.nix { };
  myproject-hello = final.callPackage ./hello/package.nix {
    myproject-shared = final.myproject-shared;
  };
  myproject-goodbye = final.callPackage ./goodbye/package.nix {
    myproject-shared = final.myproject-shared;
  };
};
```

Each package that we want to add gets `callPackage`-ed[^final-callPackage], with its dependencies injected from the "final" resolved set of packages. This is just the Nix(pkgs)-y way of doing dependency tracking such that any dependency can be overridden at arbitrarily deep levels. Fortunately, we're just adding new packages, so we don't have to think _too_ hard about that complexity here.

With that all in place, let's try to build one of our packages:

```
[nix-shell:/tmp/blogpost]$ nix build .#python3.pkgs.myproject-hello

[nix-shell:/tmp/blogpost]$ ls result
lib  nix-support

[nix-shell:/tmp/blogpost]$ ls result/lib/python3*/site-packages
hello  hello-0.1.0.dist-info
```

Huh! We might have expected a `shared` module to appear here too, given we declared it as a dependency. I guess it doesn't do those just yet... Maybe it'll be complete in the main package?

```
[nix-shell:/tmp/blogpost]$ nix build .#python3

[nix-shell:/tmp/blogpost]$ ls result
bin  include  lib  nix-support  share

[nix-shell:/tmp/blogpost]$ cd result/bin

[nix-shell:/tmp/blogpost/result/bin]$ ./python3 -m hello
/nix/store/kjvgj2n3yn70hmjifg6y0bk9m4rf7jba-python3-3.12.10/bin/python3: No module named hello
```

No, that works even less! I guess that makes sense, it's not like the default installation of python3 comes with _every Python package ever built_ by default, we'll need to do something to explicitly install those somehow. But this begs the question: how _do_ Nixpkgs Python dependencies work, anyways?
### She Propagate On My Build Input Till I Fixed Point

Referencing [the reference](https://ryantm.github.io/nixpkgs/languages-frameworks/python/#buildpythonpackage-parameters):

> * `nativeBuildInputs ? []`: Build-time only dependencies. Typically executables as well as the items listed in `setup_requires`.
> * `buildInputs ? []`: Build and/or run-time dependencies that need to be compiled for the host machine. Typically non-Python libraries which are being linked.
> * `nativeCheckInputs ? []`: Dependencies needed for running the `checkPhase`. These are added to `nativeBuildInputs` when `doCheck = true`. Items listed in `tests_require` go here.
> * `propagatedBuildInputs ? []`: Aside from propagating dependencies, `buildPythonPackage` also injects code into and wraps executables with the paths included in this list. Items listed in `install_requires` go here.

And summarizing in simpler English: use `propagatedBuildInputs` for Python library dependencies. Okie dokie! I'm sure there are various reasons for this, but we did that earlier so we're on the right track.

But wait a minute, doing a normal `nix build` did _not_ propagate this build input into the `result` directory. What gives? This confused me for a long while[^nixpkgs-confusing], until I started looking at things from the perspective of a C compiler.

Basically: Nix was originally meant for packaging C code, so a lot of its semantics make more sense when viewed that way. Packages put in `buildInputs` will be built, put into `/nix/store`, their paths exposed in certain environment variables, and then it's up to whatever linker to actually hard-code those paths into the final executable. However, there is no "final executable" at the Python library level, hence why we put the dependencies into `propagatedBuildInputs` so they'll be available by the time we get around to creating a Python environment. A Python environment can be thought of like an executable in this framework; a script can "link" (literally, create symlinks to) all specified packages into the directory structure Python expects.

Quite fortunately, our goal of "link a Python package & all of its dependencies into a functioning Python environment" already has a simple solution:

```nix
# flake.nix
# ...
      in
      {
        packages = {
          inherit python3;
          python3-myproject-hello = python3.withPackages (ps: [ ps.myproject-hello ]);
          python3-myproject-goodbye = python3.withPackages (ps: [ ps.myproject-goodbye ]);
        };
        devShells.default = pkgs.callPackage ./shell.nix { };
      }
# ...
```

This `python3.withPackages` function does exactly what we need!! Magic. Now, when we build & run:

```
[nix-shell:/tmp/blogpost]$ nix build .#python3-myproject-hello

[nix-shell:/tmp/blogpost]$ cd result/bin

[nix-shell:/tmp/blogpost/result/bin]$ ./python3 -m hello
Hello, PolyWolf
```

It works! Yay!!

## Drawbacks

Now, by now means do I intend to represent that this approach is the perfect way of doing things with Python + Nix. Far from it, really. Here are just some of rough edges I've run into in this workflow that I'd like to eventually sand off:
+ `shared`, `hello`, and `goodbye` have to live in those strange `$lib/src/$lib` directories. This is solely because pyproject.toml doesn't have good multi-package support; Nix itself is flexible enough, but I am relying on pyproject.toml to make the Nix packaging easier.
+ As mentioned earlier, we have to specify all dependencies twice: once in `pyproject.toml`, and once in `package.nix`, which is sad. Also, if there are any version constraints in `pyproject.toml`, those will effectively break `package.nix` because Nixpkgs only contains one version of each package.
+ If `shared` ever changes, the hatch environments for `hello` and `goodbye` will need to be deleted and re-recreated. Hatch itself seems to have a "development mode" where changed to the current project are reflected in the virtual environment, but it doesn't seem like that applies to this multi-project usecase.

Still, this is just about good enough for my project, so I think I will stop here. All this Nix packaging is just so I can write a [NixOS  module](https://github.com/p0lyw0lf/infrastructure/tree/d430367a2e3f9aa95783314451d1509446ea5e16/nixos) and finally start deploying my site the Cool way (`nixos-rebuild switch --flake .#devbox --target-host devbox`) instead of the Boring way (`ssh devbox 'cd crossposter; git pull; systemctl --user restart rc.wolfgirl.dev'`). Join me next time for that, I guess?? Assuming I don't get sidetracked on something else first lol

[^python-vs-js]: From what I understand, this is a much more common pattern in the Javascript & Rust worlds, where the multi-module build tooling is actually somewhat decent. No matter, we press onwards regardless of our fate here.

[^errors]: I hope showing these errors is useful, by the way. I know most tutorials just show the happy path, but I think it's also important to show the common error paths too, and ways off of them back onto the happy path.

[^more-nix-shells]: For longer reads on Nix devshells that go way too into the details (/pos) I highly recommend fasterthanlime's post series on the [non-flake way](https://fasterthanli.me/series/building-a-rust-service-with-nix/part-9) and the [flake way](https://fasterthanli.me/series/building-a-rust-service-with-nix/part-10). These are more targeted at Rust devshells and also maybe slightly out-of-date but that's ok the basics are still very pertinent & Amos is a very good writer.

[^repeat-dependencies]: I'm sure a sufficiently motivated nix-er could figure out a way to parse the pyproject.toml at evaluation time, but I am not that. Oh well!

[^final-callPackage]: Expert Nix users will note the `final.callPackage` calls are a bit strange, when usually overlays use `prev.callPackage` for various reasons beyond my ken. For another reason even further beyond my ken, `prev.callPackage` doesn't exist in this place, so we use `final.callPackage` instead ya

[^nixpkgs-confusing]: Pro tip: Don't read the [relevant section of the nixpkgs manual](https://nixos.org/manual/nixpkgs/stable/#ssec-stdenv-dependencies-propagated) when first learning how dependencies work. Only served to confuse me more tbh