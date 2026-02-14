import { LandingPfp } from "./LandingPfp.js";
import { RandomChoice } from "./RandomChoice.js";

const pfps = [
  {
    src: "_2022-07-fila.png",
    dims: { width: 256, height: 512 },
    title: "it's me!!",
    alt: "PolyWolf in a sun hat",
    desc: `Art by <a href="https://twitter.com/kayadesu_yo">@kayadesu_yo</a>`,
  },
  {
    src: "_2023-01-gmang.png",
    dims: { width: 256, height: 512 },
    title: "it's me!!",
    alt: "PolyWolf in a wintry forest",
    desc: `Art by <a href="https://twitter.com/_Gmang">@_Gmang</a>`,
  },
  {
    src: "_2024-07-princess.png",
    dims: { width: 256, height: 512 },
    title: "it's me!!",
    alt: "PolyWolf wearing a crown",
    desc: `Art by <a href="https://instagram.com/stars_upon_stars">@stars_upon_stars</a>`,
  },
];

/**
 * @returns {string}
 */
export const RandomLandingPfp = () =>
  RandomChoice({ Component: LandingPfp, propChoices: pfps, id: "pfp" });
