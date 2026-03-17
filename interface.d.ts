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
    hash: string;
    data(): Uint8Array;
    toString(): string;
  }

  ////////// 1 //////////
  /**
   * Puts a value into the object store.
   * Required to interface with the other methods that transform values.
   */
  function store(value: string): StoreObject;

  ////////// 2 //////////
  // NOTE: All paths are relative to the PROJECT ROOT, where the driver binary is run!!
  /** Given a file, gets its contents */
  function read_file(filename: string): Promise<StoreObject>;
  /** Given a directory, lists all the files/subdirectories in it. */
  function list_directory(dirname: string): Promise<string[]>;
  /** Returns the type of a local file. For use in determining how to operate on the entries of
   * `list_directory()`. */
  function file_type(name: string): "file" | "dir" | "symlink" | "unknown";

  ////////// 3 //////////
  /** Given a URL, gets its contents. Cached according to remote headers. */
  function get_url(url: string): Promise<StoreObject>;

  ////////// 4 //////////
  /** Converts a markdown string into an HTML string. */
  function markdown_to_html(md: StoreObject): Promise<StoreObject>;
  /** Minifies a given HTML string. */
  function minify_html(html: StoreObject): Promise<StoreObject>;

  type ImageFormat = "jpeg" | "jxl" | "png" | "webp";
  type ImageSize = { width: number; height: number };
  /**
   * Easily-copyable reference to an image in the object store.
   * There are only 2 ways to get these:
   * 1. Parse an object with `parse_image()`
   * 2. Convert/resize an existing image with `convert_image()`
   */
  interface StoreImage {
    object: StoreObject;
    format: ImageFormat;
    size: ImageSize;
  }

  /** Parses an object into an image. Throws if the underlying object is not an image. */
  function parse_image(image: StoreObject): Promise<StoreImage>;
  /** Converts an image into a different size/format. */
  function convert_image(
    image: StoreImage,
    opts: {
      format?: ImageFormat;
      size?: ImageSize;
      fit?: "fill" | "contain" | "cover";
    },
  ): Promise<StoreImage>;

  type Arg =
    | undefined
    | null
    | number
    | string
    | StoreObject
    | StoreImage
    | Arg[];
  /**
   * Run a given file. The file will have the global variable `ARG` populated with
   * whatever you pass in, if anything. If the same filename/argument combination is run multiple
   * times, later results will be cached from the first run.
   *
   * NOTE: just like `read_file()` and `list_directory()`, the `filename` argument is relative to
   * the project root.
   */
  function run_task(filename: string, arg: Arg): Promise<Arg>;

  /**
   * Writes an object from the store to a path relative to the build directory.
   */
  function write_output(pathname: string, content: StoreObject): void;
}

declare global {
  function print(message: string): void;
}
