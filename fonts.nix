{
  stdenvNoCC,

  anonymous-pro-fonts,
  b612,
  fira-mono,
  ibm-plex,
  intel-one-mono,
  inter,
  jost,
  montserrat,
  redhat-official-fonts,
}:
let
  fonts = [
    anonymous-pro-fonts
    b612
    fira-mono
    ibm-plex
    intel-one-mono
    inter
    jost
    montserrat
    redhat-official-fonts
  ];
  installFont = pkg: ''
    install -m444 -Dt $out ${pkg}/share/fonts/opentype/*
    install -m444 -Dt $out ${pkg}/share/fonts/truetype/*
  '';
in

stdenvNoCC.mkDerivation {
  pname = "fonts";
  version = "0.1";

  src = null;
  dontUnpack = true;

  installPhase = ''
    runHook preInstall
  ''
  + builtins.concatStringsSep "\n" (map installFont fonts)
  + ''
    runHook postInstall
  '';
}
