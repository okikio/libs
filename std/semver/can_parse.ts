import { canParse as _function_canParse } from "jsr:@std/semver@0.224.3/can-parse"
/**
 * Returns true if the string can be parsed as SemVer.
 *
 * @example Usage
 * ```ts
 * import { canParse } from "@std/semver/can-parse";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(canParse("1.2.3"));
 * assertFalse(canParse("invalid"));
 * ```
 *
 * @param version The version string to check
 * @return `true` if the string can be parsed as SemVer, `false` otherwise
 */
const canParse = _function_canParse
export { canParse }
