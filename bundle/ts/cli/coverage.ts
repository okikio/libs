/**
 * CLI utility to enhance code coverage reports with matcha theme and create SVG badges
 *
 * @module
 */

// Imports
import { expandGlob } from "@std/fs"
import { dirname, resolve } from "@std/path"
import { default as syntax } from "highlight.js"
import { DOMParser } from "@lowlighter/deno-dom/deno-dom-wasm"
import { basename } from "@std/path"
import { parseArgs } from "@std/cli"
import { Logger, type loglevel } from "@libs/logger"

const { help, loglevel, root = "coverage", exclude, _: globs, ...flags } = parseArgs(Deno.args, {
  boolean: ["help", "summary", "no-matcha", "no-highlight", "no-write", "no-badge"],
  alias: { help: "h", loglevel: "l", root: "r", exclude: "e", summary: "s", "no-matcha": "M", "no-highlight": "H", "no-write": "W", "no-badge": "B" },
  string: ["loglevel", "root", "exclude"],
  collect: ["exclude"],
})
if (help) {
  console.log("Code coverage enhancer and badge generator")
  console.log("https://github.com/lowlighter/libs - MIT License - (c) 2024 Simon Lecoq")
  console.log("")
  console.log("This tool is intended to be run on coverage reports generated by deno coverage.")
  console.log("It will apply matcha.css theme which provides a nice styling in addition to dark mode support,")
  console.log("apply syntax highlighting and also generate a static coverage badge from imgs.shields.io.")
  console.log("")
  console.log("Usage:")
  console.log("  deno --allow-read --allow-write=coverage --allow-net=img.shields.io coverage.ts [options] [files...=**/*.html]")
  console.log("")
  console.log("Options:")
  console.log("  -h, --help                 Show this help")
  console.log("  -l, --loglevel=[log]       Log level (disabled, debug, log, info, warn, error)")
  console.log("  -e, --exclude              Exclude files matching glob pattern (can be used multiple times)")
  console.log("  [-r, --root=coverage]      Root directory to search for files")
  console.log("  -s, --summary              Generate global summary (intended for multi-package projects)")
  console.log("  -M, --no-matcha            Disable matcha.css styling")
  console.log("  -H, --no-highlight         Disable syntax highlighting")
  console.log("  -W, --no-write             Do not rewrite html files")
  console.log("  -B, --no-badge             Do not generate coverage badge")
  console.log("")
  Deno.exit(0)
}

const logger = new Logger({ level: Logger.level[loglevel as loglevel] })
if (!globs.length) {
  globs.push("**/*.html")
}

// Process files
let summary = new DOMParser().parseFromString("", "text/html")!
for (const glob of globs) {
  logger.debug(`processing glob: ${glob}`)
  for await (const { path } of expandGlob(`${glob}`, { root, exclude })) {
    // Parse document
    const log = logger.with({ path })
    log.debug("parsing document")
    const document = new DOMParser().parseFromString(await Deno.readTextFile(path), "text/html")!
    if (document.querySelector("table.global-summary")) {
      log.debug("skipped as it was the global summary")
      continue
    }
    if (!document.title.includes("Coverage report")) {
      log.warn("skipped as it does not seem to be a coverage report")
      continue
    }

    // Matcha theme
    if ((!flags["no-write"]) && (!flags["no-matcha"])) {
      log.debug("applying matcha theme")
      for (const name of ["@root", "@syntax-highlighting", "@istanbul-coverage"]) {
        if (document.querySelector(`link[href*="${name}"]`)) {
          log.debug(`skipped as it has already been themed with matcha/${name}`)
          continue
        }
        const stylesheet = document.createElement("link")
        stylesheet.setAttribute("rel", "stylesheet")
        stylesheet.setAttribute("href", `https://matcha.mizu.sh/styles/${name}/mod.css`)
        document.head.append(stylesheet)
        log.debug(`added stylesheet: matcha/${name}`)
      }
      log.log("themed with matcha")
    }

    // Syntax highlighting
    if ((!flags["no-write"]) && (!flags["no-highlight"])) {
      log.debug("highlighting document")
      document.querySelectorAll(".prettyprint").forEach((_element) => {
        const element = _element as unknown as HTMLElement
        if (element.dataset.highlighted === "true") {
          log.debug("skipped as it has already been highlighted")
          return
        }
        element.innerHTML = syntax.highlight(element.innerText, { language: "ts" }).value
        element.dataset.highlighted = "true"
        log.log("highlighted")
      })
    }

    // Write file
    if (!flags["no-write"]) {
      await Deno.writeTextFile(path, `<!DOCTYPE html>${document.documentElement!.outerHTML}`)
      log.info("updated")
    }

    // Generate badges
    if ((!flags["no-badge"]) && (basename(path) === "index.html")) {
      const coverage = document.querySelector(".clearfix .fl:last-child .strong")?.innerText ?? "-"
      const value = Number.parseFloat(coverage)
      const color = Number.isFinite(value) ? (value >= 80 ? "#3fb950" : value >= 60 ? "#db6d28" : "#f85149") : "#656d76"
      const svg = await fetch(`https://img.shields.io/badge/${encodeURIComponent(`Coverage-${coverage}-${color}`)}`).then((response) => response.text())
      await Deno.writeTextFile(resolve(dirname(path), "badge.svg"), svg)
      log.log(`generated badge: ${resolve(dirname(path), "badge.svg")}`)
    }

    // Global summary
    if (basename(path) === "index.html") {
      const directory = dirname(path).replace(resolve(root), "").replaceAll("\\", "/").replace(/^\//, "")
      if (!summary.querySelector("table")) {
        summary = document.cloneNode(true)
        summary.querySelector("table.coverage-summary")?.classList.add("global-summary")
        summary.querySelectorAll(".pad1:first-child, .status-line, table.coverage-summary tbody tr").forEach((element) => (element as unknown as HTMLElement).remove())
      }
      ;[...document.querySelectorAll("table.coverage-summary tbody tr")].forEach((row) => {
        const file = (row as unknown as HTMLTableCellElement).querySelector<HTMLAnchorElement>(".file a")!
        if (file.innerText.endsWith("/")) {
          return
        }
        file.innerText = `${directory}/${file.innerText}`
        file.setAttribute("href", `${directory}/${file.getAttribute("href")}`)
        summary.querySelector("table.coverage-summary")!.append(row)
      })
    }
  }
}

// Write global summary
if (!flags.summary) {
  const path = resolve(root, "index.html")
  await Deno.writeTextFile(resolve(root, "index.html"), `<!DOCTYPE html>${summary.documentElement!.outerHTML}`)
  logger.with({ path }).info("updated summary")
}
