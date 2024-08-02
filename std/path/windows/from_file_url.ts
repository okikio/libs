import { fromFileUrl as _function_fromFileUrl } from "jsr:@std/path@1.0.2/windows/from-file-url"
/**
 * Converts a file URL to a path string.
 *
 * @example Usage
 * ```ts
 * import { fromFileUrl } from "@std/path/windows/from-file-url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(fromFileUrl("file:///home/foo"), "\\home\\foo");
 * assertEquals(fromFileUrl("file:///C:/Users/foo"), "C:\\Users\\foo");
 * assertEquals(fromFileUrl("file://localhost/home/foo"), "\\home\\foo");
 * ```
 *
 * @param url The file URL to convert.
 * @return The path string.
 */
const fromFileUrl = _function_fromFileUrl
export { fromFileUrl }
