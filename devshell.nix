{
  pkgs,
  ...
}:
pkgs.mkShell {
  buildInputs = [ ];
  nativeBuildInputs = with pkgs; [
    awscli2
    corepack
    nodejs

    entr
    hyperfine
    just
    live-server
  ];
}
