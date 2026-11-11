return {
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        tinymist = {},
        ts_ls = {
          cmd = { "npx", "typescript-language-server", "--stdio" },
        },
      },
    },
  },
  {
    'chomosuke/typst-preview.nvim',
    ft = 'typst',
    version = '1.*',
    opts = {
      dependencies_bin = {
        tinymist = "tinymist", -- use devshell vendored
      }
    },
  },
}
