import { readAll as _function_readAll } from "jsr:@std/io@0.224.4/read-all"
/**
 * Read {@linkcode Reader} `r` until EOF (`null`) and resolve to the content as
 * {@linkcode Uint8Array}.
 *
 * @example ```ts
 * import { readAll } from "@std/io/read-all";
 *
 * // Example from stdin
 * const stdinContent = await readAll(Deno.stdin);
 *
 * // Example from file
 * using file = await Deno.open("my_file.txt", {read: true});
 * const myFileContent = await readAll(file);
 * ```
 */
const readAll = _function_readAll
export { readAll }

import { readAllSync as _function_readAllSync } from "jsr:@std/io@0.224.4/read-all"
/**
 * Synchronously reads {@linkcode ReaderSync} `r` until EOF (`null`) and returns
 * the content as {@linkcode Uint8Array}.
 *
 * @example ```ts
 * import { readAllSync } from "@std/io/read-all";
 *
 * // Example from stdin
 * const stdinContent = readAllSync(Deno.stdin);
 *
 * // Example from file
 * using file = Deno.openSync("my_file.txt", {read: true});
 * const myFileContent = readAllSync(file);
 * ```
 */
const readAllSync = _function_readAllSync
export { readAllSync }
