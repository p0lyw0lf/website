declare module "memoized" {
  /** Given a file, gets its contents */
  function read_file(filename: string): Uint8Array;
  /** Given a directory, lists all the files/subdirectories in it. */
  function list_directory(dirname: string): string[];

  type Arg = undefined | null | number | string | Arg[];
  /**
   * Queue a file to be run next. The file will have the global variable `ARGS` populated with
   * whatever you pass in, if anything.
   */
  function run_task(filename: string, arg?: Arg): Arg;
}

declare module "io" {
  function file_type(name: string): "file" | "dir" | "symlink" | "unknown";
  function markdown_to_html(md: string | Uint8Array): string;
  function minify_html(html: string | Uint8Array): Uint8Array;
  function write_output(name: string, content: string | Uint8Array): void;
}

declare global {
  function print(message: string): void;
}
