return {
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        ts_ls = {
          cmd = { "npx", "typescript-language-server", "--stdio" },
        },
      },
    },
  },
}
