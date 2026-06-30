---
template: MarkdownPage.js
extraCss: ButtonWall.css.js
title: "88x31 Button Wall"
description: "A collection of 88x31 buttons!!"
---

## My Buttons

I made three of them because I couldn't choose just one design, plus I wanted
to get a bit better at pixel art:

<div class="buttonwall">
<img src="https://static.wolfgirl.dev/buttonwall/polywolf-88x31-1.png" alt="PolyWolf Serpinski Triangle" width=88 height=31 />
<img src="https://static.wolfgirl.dev/buttonwall/polywolf-88x31-2.png" alt="PolyWolf Random Triangles" width=88 height=31 />
<img src="https://static.wolfgirl.dev/buttonwall/polywolf-88x31-3.png" alt="PolyWolf Organized Triangles" width=88 height=31 />
</div>

I also have a Random Button Link that you can use, which changes the image
served on every page refresh (completely server-side!), which I recommend if
you want to put my button on your wall:

<div class="buttonwall">
<img src="https://wolfgirl.dev/button.png" width=88 height=31 />
</div>

<div class="copy">
  <input type="text" value='<img src="https://wolfgirl.dev/button.png" style="border: solid 2px; border-color: lightgray darkgray darkgray lightgray"
/>' readonly />
</div>

In addition to the standard 88x31 sizes, I also have all my buttons at 10x
resolution, manually upscaled so they look crisper in case you want to have
them to be big:

<div class="buttonwall large">
<img src="https://static.wolfgirl.dev/buttonwall/polywolf-88x31-1-big.png" alt="PolyWolf Serpinski Triangle" />
<img src="https://static.wolfgirl.dev/buttonwall/polywolf-88x31-2-big.png" alt="PolyWolf Random Triangles" />
<img src="https://static.wolfgirl.dev/buttonwall/polywolf-88x31-3-big.png" alt="PolyWolf Organized Triangles" />
</div>

There's a random variant of that too:

<div class="buttonwall large">
<img src="https://wolfgirl.dev/button-big.png" />
</div>

<div class="copy">
  <input type="text" value='<img src="https://wolfgirl.dev/button-big.png" style="border: solid 2px; border-color: lightgray darkgray darkgray lightgray"
/>' readonly />
</div>

<script>
  const checkSvg = `
<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 5L8 15l-5-4"/>
</svg>
  `;
  const copySvg = `
<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path fill="currentColor" fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v9a2 2 0 002 2h2v2a2 2 0 002 2h9a2 2 0 002-2V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2H4zm9 4V4H4v9h2V8a2 2 0 012-2h5zM8 8h9v9H8V8z"/>
</svg>
  `;
  const errorSvg = `
<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path fill="currentColor" fill-rule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm10.01 4a1 1 0 01-1 1H10a1 1 0 110-2h.01a1 1 0 011 1zM11 6a1 1 0 10-2 0v5a1 1 0 102 0V6z"/>
</svg>
  `;

  const installCopyButton = (divElem) => {
    const inputElem = divElem.children[0];
    const buttonElem = document.createElement("button");
    divElem.appendChild(buttonElem);

    const transition = (newState) => {
      buttonElem.dataset.state = newState;
      switch (newState) {
        case "ok":
          buttonElem.innerHTML = checkSvg;
          break;
        case "error":
          buttonElem.innerHTML = errorSvg;
          break;
        default:
          buttonElem.innerHTML = copySvg;
          break;
      }

      if (newState) {
        eventuallyGoToNeutral();
      }   
    };

    let timeout;
    const eventuallyGoToNeutral = () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(
        () => {
          transition(undefined);
          timeout = undefined;
        },
        2000,
      );
    };

    transition(undefined);
    buttonElem.onclick = () => {
      navigator.clipboard.writeText(inputElem.value)
        .then(() => transition("ok"))
        .catch((err) => {
          transition("error");
          console.error(err);
        });
    }
  }

  const copyDivs = document.querySelectorAll(".copy");
  for (const copyDiv of document.querySelectorAll(".copy")) {
    installCopyButton(copyDiv);
  }
</script>

## Others' Buttons

Coming soon! Please [message me](/links/) if you have a button you want to put
here.
