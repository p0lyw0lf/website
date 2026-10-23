{
  pkgs,
  ...
}:
pkgs.mkShell {
  buildInputs = [ ];
  nativeBuildInputs = with pkgs; [
    # For building
    minhtml
    driver # custom
    driver-comrak # custom

    # For uploading static files
    awscli2

    # For language server
    corepack
    nodejs

    # For developing
    entr
    hyperfine
    just
    live-server
  ];
}
