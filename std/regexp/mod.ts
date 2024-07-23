/**
 * Functions for tasks related to
 * {@link https://en.wikipedia.org/wiki/Regular_expression | regular expression} (regexp),
 * such as escaping text for interpolation into a regexp.
 *
 * ```ts
 * import { escape } from "@std/regexp/escape";
 * import { assertEquals, assertMatch, assertNotMatch } from "@std/assert";
 *
 * const re = new RegExp(`^${escape(".")}$`, "u");
 *
 * assertEquals("^\\.$", re.source);
 * assertMatch(".", re);
 * assertNotMatch("a", re);
 * ```
 *
 * @module
 */
import { escape as _function_escape } from "jsr:@std/regexp@1.0.0"
/**
 * Escapes arbitrary text for interpolation into a regexp, such that it will
 * match exactly that text and nothing else.
 *
 * @example Usage
 * ```ts
 * import { escape } from "@std/regexp/escape";
 * import { assertEquals, assertMatch, assertNotMatch } from "@std/assert";
 *
 * const re = new RegExp(`^${escape(".")}$`, "u");
 *
 * assertEquals("^\\.$", re.source);
 * assertMatch(".", re);
 * assertNotMatch("a", re);
 * ```
 *
 * @param str The string to escape.
 * @return The escaped string.
 */
const escape = _function_escape
export { escape }
