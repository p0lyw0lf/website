import { HeaderPfp } from "./HeaderPfp.js";
import { RandomChoice } from "./RandomChoice.js";

/**
 * @returns string
 */
export const RandomHeaderPfp = () => {
  const propChoices = [
    {
      src: "_2023-01-gmang.png",
      alt: "PolyWolf in a wintry forest",
    },
    { src: "_2021-12-shadow.png", alt: "PolyWolf in a fur coat" },
    { src: "_2022_toshca.png", alt: "Chibi PolyWolf eating a steak" },
    {
      src: "_2022-09-sniper.png",
      alt: "PolyWolf in camouflage",
    },
    {
      src: "_2023_spect_ion.png",
      alt: "PolyWolf looking over her shoulder",
    },
    {
      src: "_2023-02-sidelunge.png",
      alt: "PolyWolf glares at you",
    },
    {
      src: "_2024-07-pfp.png",
      alt: "PolyWolf in a baseball cap flashing a peace sign",
    },
    {
      src: "_2024-07-princess.png",
      alt: "PolyWolf holding a crown, sticking her tongue out",
    },
  ];

  return RandomChoice({ Component: HeaderPfp, propChoices, id: "pfp" });
};
