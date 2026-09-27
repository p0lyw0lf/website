import { run_js } from "driver";
import { Base } from "../components/Base.js";
import { Header } from "../components/Header.js";
import { css, html } from "../render.js";

/** @type{Array<{ name: string; link: string; desc: string }>} */
const friends = [
  { name: "Ruby", link: "https://ruby.gay", desc: "a nerrrrrrrrd :3" },
  {
    name: "Gabriella",
    link: "https://www.haskellforall.com",
    desc: "Haskell & open source legend & fellow wolf!",
  },
  {
    name: "JeanHyde",
    link: "https://thephd.dev",
    desc: "master of the arcane arts (C standard committee procedures)",
  },
  {
    name: "Alice",
    link: "https://welltypedwit.ch",
    desc: "Functional programming influencer (real)",
  },
  {
    name: "Rykarn",
    link: "https://rykarn.se",
    desc: "Cohost refugee, originator of some of the best CSS Crimes",
  },
  {
    name: "Tends",
    link: "https://tends.to",
    desc: 'Cool Car Enthusiant & fellow <a href="https://www.trangirlismo.com/">Tran Girlismo</a> listener',
  },
  {
    name: "Thunderseethe",
    link: "https://thunderseethe.dev",
    desc: "Compiler sensei w/ an excellent tutorial series",
  },
  {
    name: "Waffle",
    link: "https://blog.ihatereality.space/",
    desc: "it rust kbity :3",
  },
  {
    name: "Marv",
    link: "https://temporarytm.com/",
    desc: "very good at Mahjong & lots of assorted PL",
  },
];

const Friend = ({ name, link, desc }) =>
  html`<li><a href="${link}">${name}</a> - ${desc}</li>`;

/**
 * buttons[n][0]: The URL to link to, minus the https://. SHOULD be in sorted order.
 * buttons[n][1]: If starting with a ".": The suffix to add to the URL to get the button filename. Otherwise, the full button filename.
 */
const buttons = [
  ["blog.aurahack.ca", ".gif"],
  ["blog.cat-girl.gay", ".png"],
  ["cohost.org/PolyWolf", "i-was-on-cohost.gif"],
  ["corru.observer", ".gif"],
  ["crouton.net", ".gif"],
  ["damien.zone", ".png"],
  ["eva.ac", ".png"],
  ["hamsternet.neocities.org", ".png"],
  ["izzys.casa", ".gif"],
  ["lyra.horse", ".png"],
  ["meow.garden", ".png"],
  ["mew.gay", ".gif"],
  ["nickyflowers.com", ".gif"],
  ["ruby.gay", ".gif"],
  ["rykarn.se", ".gif"],
  ["temporarytm.com", ".png"],
  ["tends.to", ".png"],
  ["wolfgirl.systems", ".gif"],
  ["www.plumpan.net", ".gif"],
  ["www.youtube.com/watch?v=FtutLA63Cp8", "bad-apple.gif"],
];

const Button = ([url, suffix]) => {
  const image = `https://static.wolfgirl.dev/buttonwall/${suffix.startsWith(".") ? url + suffix : suffix}`;
  return html`<a href="https://${url}"><img src="${image}" alt="${url}" /></a>`;
};

const content = html`
  <p>
    All these ppl are wayy cooler than me :blobsweat:<br>
    This list is incomplete! You can help by expanding it
  </p>
  <p>
    <ul>
      ${friends.map(Friend)}
    </ul>
  </p>

  <h2>Buttons</h2>
  <p>
    These are people whom I look up to & have a cool button, but am not necessarily close with. See also my <a href="/blogroll/">blogroll</a>.
  </p>
  <p>
    <div class="buttonwall">
      ${buttons.map(Button)}
    </div>
  </p>

  <h2>My Button</h2>
  <p
    >I made three of them because I couldn't choose just one design, plus I
    wanted to get a bit better at pixel art:</p
  >

  <p>
    <div class="buttonwall">
      <img
        src="https://static.wolfgirl.dev/buttonwall/polywolf-88x31-1.png"
        alt="PolyWolf Serpinski Triangle"
        width="88"
        height="31"
      />
      <img
        src="https://static.wolfgirl.dev/buttonwall/polywolf-88x31-2.png"
        alt="PolyWolf Random Triangles"
        width="88"
        height="31"
      />
      <img
        src="https://static.wolfgirl.dev/buttonwall/polywolf-88x31-3.png"
        alt="PolyWolf Organized Triangles"
        width="88"
        height="31"
      />
    </div>
  </p>

  <p
    >I also have a Random Button Link that you can use, which changes the image
    served on every page refresh (completely server-side!), which I recommend if
    you want to put my button on your wall:</p
  >

  <p>
    <div class="buttonwall">
      <img src="https://wolfgirl.dev/button.png" width="88" height="31" />
    </div>
  </p>

  <p>
    <div class="copy">
      <input
        type="text"
        value='<a href="https://wolfgirl.dev"><img src="https://wolfgirl.dev/button.png" style="image-rendering: pixelated" /></a>'
        readonly
      />
    </div>
  </p>


  <script>
    const checkSvg =
      '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 5L8 15l-5-4"/></svg>';
    const copySvg =
      '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v9a2 2 0 002 2h2v2a2 2 0 002 2h9a2 2 0 002-2V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2H4zm9 4V4H4v9h2V8a2 2 0 012-2h5zM8 8h9v9H8V8z"/></svg>';
    const errorSvg =
      '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm10.01 4a1 1 0 01-1 1H10a1 1 0 110-2h.01a1 1 0 011 1zM11 6a1 1 0 10-2 0v5a1 1 0 102 0V6z"/></svg>';

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
        timeout = setTimeout(() => {
          transition(undefined);
          timeout = undefined;
        }, 2000);
      };

      transition(undefined);
      buttonElem.onclick = () => {
        navigator.clipboard
          .writeText(inputElem.value)
          .then(() => transition("ok"))
          .catch((err) => {
            transition("error");
            console.error(err);
          });
      };
    };

    const copyDivs = document.querySelectorAll(".copy");
    for (const copyDiv of document.querySelectorAll(".copy")) {
      installCopyButton(copyDiv);
    }
  </script>
`.withStyle(css`
  ${await run_js("src/css/MarkdownPage.css.js")}
  ${await run_js(`src/css/ButtonWall.css.js`)}
`);

const title = "Friends";
export default await Base({
  pathname: "/friends/",
  title,
  description:
    "A small list of all other personal websites I know from people I trust. Also 88x31 buttons!!",
})(
  html`<div class="info"><h1 class="p-name">${title}</h1></div>
    <article class="e-content">${content}</article> `,
  {
    header: await Header({ sectionTitle: "PolyWolf's Website", homeLink: "/" }),
  },
);
