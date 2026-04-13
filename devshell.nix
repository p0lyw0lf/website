{
  pkgs,
  ...
}:
pkgs.mkShell {
  buildInputs = [ ];
  nativeBuildInputs = with pkgs; [
    corepack
    nodejs

    entr
    hyperfine
    just
  ];
}
