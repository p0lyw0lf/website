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

  shellHook =
    let
      fonts = pkgs.callPackage ./fonts.nix { };
    in
    ''
      export TYPST_FONT_PATH=${
        builtins.concatStringsSep ":" [
          (fonts / "share/fonts/truetype")
          (fonts / "share/fonts/opentype")
        ]
      }
    '';
}
