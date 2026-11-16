{
  stdenvNoCC,

  montserrat,
}:
let
  fonts = [
    montserrat
  ];
  installFont = pkg: ''
    install -m444 -Dt $out ${pkg}/share/fonts/*/*.{ttf,otf}
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
