declare module "driver" {
  /**
   * Easily-copyable reference to an object in the object store
   */
  interface StoreObject {
    data(): Uint8Array;
    toString(): string;
  }

  /** Given a file, gets its contents */
  function read_file(filename: string): Promise<StoreObject>;
  /** Given a directory, lists all the files/subdirectories in it. */
  function list_directory(dirname: string): Promise<string[]>;
  /** Returns the type of a local file. For use in determining how to operate on the entries of list_directory. */
  function file_type(name: string): "file" | "dir" | "symlink" | "unknown";
  /** Given a URL, gets its contents. Cached according to remote headers. */
  function get_url(url: string): Promise<StoreObject>;

  type Arg = undefined | null | number | string | Arg[] | StoreObject;

  /**
   * Run a given file. The file will have the global variable `ARGS` populated with
   * whatever you pass in, if anything. If the same filename/argument combination is run multiple
   * times, later results will be cached from the first run.
   */
  function run_task(filename: string, arg: Arg): Promise<Arg>;

  /**
   * Puts a value into the object store. Required to interface with the other methods that transform values.
   */
  function store(value: string | Uint8Array): StoreObject;
  /**
   * Converts a markdown string into an HTML string.
   */
  function markdown_to_html(md: StoreObject): Promise<StoreObject>;
  /**
   * Minifies a given HTML string.
   */
  function minify_html(html: StoreObject): Promise<StoreObject>;
  /**
   * Writes an object from the store to a path relative to the build directory.
   */
  function write_output(pathname: string, content: StoreObject): void;
}

declare global {
  function print(message: string): void;
}
