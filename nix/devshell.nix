{
  pkgs,
  ...
}:
pkgs.mkShell {
  buildInputs = [ ];
  nativeBuildInputs = with pkgs; [
    # For building
    minhtml
    typst
    driver # custom
    driver-comrak # custom

    # For uploading static files
    awscli2

    # For language server
    corepack
    nodejs
    tinymist

    # For developing
    hyperfine
    just
    live-server
  ];

  shellHook = ''
    export TYPST_FONT_PATHS=${pkgs.callPackage ./fonts.nix { }}
  '';
}
