---
title: "Quick Thoughts On: React vs SolidJS"
description: "TL;DR just use React, or Preact if you care about bundle size.\r \r ---\r \r A while ago, I [wrote my own post composer](https://wolfgirl.dev..."
tags: ["programming", "reactjs", "javascript"]
published: 1742489775
mastodon: "https://social.treehouse.systems/@PolyWolf/114195809951859457"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3lkt6442g2k2v"
---

TL;DR just use React, or Preact if you care about bundle size.

---

A while ago, I [wrote my own post composer](https://wolfgirl.dev/blog/2024-11-08-what-if-anyone-could-use-my-post-composer-/), which I use to make blog posts from my phone, including this one. It's pretty nice!

One of the requirements I had when making it was "I want my bundle sizes to be as small as possible". Inspired by seeing my work's 66MB React app, I decided to look for other frontend frameworks, still reactive (because that _is_ just the best paradigm), but smaller & faster.

Eventually, I settled on SolidJS. After having used it for a while on more than just a simple "Hello, World!" project, I can confidently claim there's a pretty fatal (for me) flaw:

## SolidJS defaults to _not_ re-rendering when values change

From my understanding, this is how SolidJS works: everything is based around the "signal" as the underlying reactive primitive, with function calls as the way to subscribe to those signals:

```jsx
export const Component = (props) => {
  const [name, setName] = createSignal("");
  const title = () => `${props.greeting}, ${name()}`;
  return (
    <form>
      <Title text={title()} />
      <input type="text" value={name()} onChange={e => setName(e.target.value)} />
    </form>
  );
}
```

When `title()` is called, it will then call both `name()` (obviously) and `props.greeting` (non-obviously, since it's a special getter, which is why [you can't destructure `props`](https://docs.solidjs.com/concepts/components/props#destructuring-props)). By calling these functions, anything that calls `title()` will then know to re-render whenever either `name()` or `props.greeting` changes. So, `<Title />` will re-render when `props.greeting` changes, and both `<Title />` and `<input>` will re-render when `name()` changes.

However, if you _don't_ make `title` a function, then `name()` and `props.greeting` will be called "too early", and `<Title />` will never re-render; the body of `Component` isn't hooked up to any reactivity, just special places like the return value & `createEffect`.

This whole approach makes fine-grained reactivity quite simple, but also makes actually writing components a bit complex. You have to hook up all the reactive parts yourself!! It's very easy to get this wrong (I did many times), and the tooling (eslint) isn't helpful at detecting when it happens.

## React may over-render, but at least it's easier to conceptualize

Here's the equivalent React example; it's just minor syntactical differences:

```jsx
export const Component = ({ greeting }) => {
  const [name, setName] = useState("");
  const title = `${greeting}, ${name}`;
  return (
    <form>
      <Title text={title} />
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
    </form>
  );
}
```

How React works is, any time the component props/`useState` values change, it runs the component body again, as well as any children, recursively. This gets us a lot of neat benefits over SolidJS, like:
* you can destructure `props`
* not everything has to be functions
* if something changes in state, it is guaranteed to cause a re-render that will display the change.

That approach would be expensive if, when a re-render happened, we had to remove all the old HTML elements from the page and add back the new ones, so instead React uses something called "Virtual DOM Diffing" to only call browser APIs for elements/attributes that need changing. Some unavoidable downsides are the fact you need to keep a virtual copy of the whole tree in-memory, as well as the pretty complex algorithm to do the diffing.

SolidJS cuts thru all this implementation complexity & potential runtime wastefulness by composing a simple + powerful primitive, signals. Unfortunately, it's a bit _too_ simple + powerful, ending up finnicky to use as a result, like a Lisp, perhaps.

If you're making a non-trivial Javascript-powered application, just use React. The [React Compiler](https://react.dev/learn/react-compiler) takes care of a lot of the problems React has, effectively providing fine-grained reactivity "for free" (bit more compile-time cost oop). [Preact](https://preactjs.com/) is also available if you care about bundle sizes; the only reason I didn't choose it initially was because I wanted to learn a new framework. Still, sometimes u just gotta go back to ol' reliable.