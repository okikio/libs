import type { ParsedPath as _interface_ParsedPath } from "jsr:@std/path@1.0.1/types"
/**
 * A parsed path object generated by path.parse() or consumed by path.format().
 *
 * @example ```ts
 * import { parse } from "@std/path";
 *
 * const parsedPathObj = parse("c:\\path\\dir\\index.html");
 * parsedPathObj.root; // "c:\\"
 * parsedPathObj.dir; // "c:\\path\\dir"
 * parsedPathObj.base; // "index.html"
 * parsedPathObj.ext; // ".html"
 * parsedPathObj.name; // "index"
 * ```
 */
interface ParsedPath extends _interface_ParsedPath {}
export type { ParsedPath }
