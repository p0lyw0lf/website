declare module "memoized" {
  import { StoreObject } from "io";

  /** Given a file, gets its contents */
  function read_file(filename: string): Uint8Array;
  /** Given a directory, lists all the files/subdirectories in it. */
  function list_directory(dirname: string): string[];

  type Arg = undefined | null | number | string | Arg[] | StoreObject;
  /**
   * Queue a file to be run next. The file will have the global variable `ARGS` populated with
   * whatever you pass in, if anything.
   */
  function run_task(filename: string, arg: Arg): Arg;
}

declare module "io" {
  interface StoreObject {
    data(): Uint8Array;
    toString(): string;
  }

  function file_type(name: string): "file" | "dir" | "symlink" | "unknown";

  function store(value: string | Uint8Array): StoreObject;
  function markdown_to_html(md: StoreObject): StoreObject;
  function minify_html(html: StoreObject): StoreObject;
  function write_output(pathname: string, content: StoreObject): void;
}

declare global {
  function print(message: string): void;
}
