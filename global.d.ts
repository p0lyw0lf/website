declare module "driver" {
  /**
   * Easily-copyable reference to an arbitrary object in the object store.
   * There are a few ways to make these:
   * 1. Create one from a Javascript value with `store()`.
   * 2. Read a file with `read_file()`.
   * 3. Fetch a URL with `get_url()`.
   * 4. Call any transformation that accepts a `StoreObject`.
   */
  interface StoreObject {
    hash(): string;
    data(): Uint8Array;
    toString(): string;
  }

  ////////// 1 //////////
  /**
   * Puts a value into the object store.
   *
   * Required to interface with the other methods that transform values.
   */
  function store(value: string): StoreObject;
  /**
   * Converts a string to a slug, using the same logic as Tera's `slugify`
   * filter.
   */
  function slugify(value: string): string;

  ////////// 2 //////////
  // NOTE: All paths are relative to the PROJECT ROOT, where the driver binary is run!!
  /** Given a file, gets its contents */
  function read_file(filename: string): Promise<StoreObject>;
  /** Given a directory, lists all the files/subdirectories in it. */
  function list_directory(dirname: string): Promise<string[]>;
  /**
   * Returns the type of a local file. For use in determining how to operate
   * on the entries of `list_directory()`.
   */
  function file_type(
    name: string,
  ): Promise<"file" | "dir" | "symlink" | "unknown">;
  /** Returns the last modified time for the given file/directory */
  function mtime(name: string): Promise<number>;

  ////////// 3 //////////
  /** Given a URL, gets its contents. Cached according to remote headers. */
  function get_url(url: string): Promise<StoreObject>;

  ////////// 4 //////////
  /**
   * Runs an external binary as a pure function of the input to produce an output.
   *
   * The command MUST contain special sentinels "INPUT" (becomes replaced with
   * a path to the input object) and "OUTPUT" (becomes replaced with a path to
   * where we should output). Both INPUT and OUTPUT are files.
   *
   * The command SHOULD be a pure function of INPUT. It will only be re-run if
   * that specified input changes.
   */
  function run_command(
    command: string[],
    input: StoreObject,
  ): Promise<StoreObject>;

  type Arg =
    | undefined
    | null
    | number
    | string
    | StoreObject
    | Arg[]
    | Record<string, Arg>;

  /**
   * Run a given Javascript file. The file will have the global variable `ARG`
   * populated with whatever you pass in, if anything. If the same
   * filename/argument combination is run multiple times, later results will be
   * cached from the first run.
   *
   * NOTE: just like `read_file()` and `list_directory()`, the `filename`
   * argument is relative to the project root.
   */
  function run_js(filename: string, arg: Arg): Promise<Arg>;

  /**
   * Run a given Tera file with the given context.
   *
   * NOTE: just like `run_js()`, the `filename` argument is relative to the
   * project root.
   */
  function run_tera(
    filename: string,
    arg: { [key in string]?: Arg },
  ): Promise<Arg>;

  /**
   * Writes an object from the store to a path relative to the build directory.
   */
  function write_output(pathname: string, content: StoreObject): void;
}

declare global {
  const ARG: any;
  function print(message: string): void;
}

export {};
