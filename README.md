# 🍱 lowlighter's standalone libraries

This is a collection of carefully crafted _TypeScript_ standalone libraries. These try to be minimal, unbloated and convenient.

Most of them are written with [deno](https://deno.com) in mind, but as the code honors [web standards](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/The_web_and_web_standards) they should be usable on any runtime that follows web specifications
(including browsers).

### Index

- [🔳 QR Code generator](/#-qr-code-generator)
- [🔑 Time-based One-Time Password (TOTP)](/#-time-based-one-time-password-totp)
- [➕ Diff (patience algorithm)](/#-time-based-one-time-password-totp)
- [🔐 Symmetric encryption (using AES-GCM 256 with a PBKDF2 derived key)](/#-symmetric-encryption-using-aes-gcm-256-with-a-pbkdf2-derived-key)
- [📰 Logger](/#-logger)
- [🗜️ Bundler](/#-bundler)

These libraries are published at [deno.land/x/libs](https://deno.land/x/libs).

> [!IMPORTANT]\
> Love these bytes ? Consider [`💝 sponsoring me`](https://github.com/sponsors/lowlighter), even one-time contributions are greatly appreciated !

## ℹ️ About

While this repository is open, it is not really intended to be a collaborative project. Pull requests for bug fixes or improvements are still welcome, but I may not accept any feature request if it doesn't seem to fit the scope of this project.

Additionally, these libraries tends to follow my own coding style which:

- use ES next syntax
- try to be minimalistic and visually unbloated (no semicolons, infered typing, etc.)
- use caseless convention (single whole words are preferred assuming they're unambiguous depending on the local context)

## 📜 License

This work is licensed under the [MIT License](./LICENSE).

If you include a significant part of it in your own project, _**you should keep the license notice**_ with it, including the mention of the additional original authors if any.

# 📦 Libraries

## 🔳 QR Code generator

[`🦕 Playground`](https://dash.deno.com/playground/libs-qrcode)

This library is based on the awesome work of [@nayiki](https://github.com/nayuki). Please take a look at their articles about QR Codes:

- [Creating a QR Code step by step](https://www.nayuki.io/page/creating-a-qr-code-step-by-step)
- [QR Code generator library](https://www.nayuki.io/page/qr-code-generator-library)

I rewrote this because I couldn't find a suitable implementation using EcmaScript modules. Oddly enough, most of the libraries I found also required a [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) to properly work (but I specifically wanted a SVG
image output). Usually it's because they were maily intended for client-side usage. A few other implementations had either some dated code or obfuscated code which I didn't want.

### Features

- Support out-of-the-box `array`, `console` and `svg` outputs
- Customizable colors and error correction level (ECL)
- No external dependencies
- Not canvas based (i.e. no DOM dependencies and thus cross-platform)

### Usage

```ts
import { qrcode } from "./qrcode.ts"

// SVG output
const svg = qrcode("https://example.com", { output: "svg" })
console.assert(svg.includes("</svg>"))

// Console output
qrcode("https://example.com", { output: "console" })

// Array output
const array = qrcode("https://example.com")
console.assert(Array.isArray(array))
```

## 🔑 Time-based One-Time Password (TOTP)

[`🦕 Playground`](https://dash.deno.com/playground/libs-totp)

This library is based on the well-written article of [@rajat-sr](https://github.com/rajat-sr) on [hackernoon](https://hackernoon.com) :

- [How To Implement Google Authenticator Two Factor Auth in JavaScript](https://hackernoon.com/how-to-implement-google-authenticator-two-factor-auth-in-javascript-091wy3vh3)

Their explanation was specifically intended for NodeJS so I rewrote it to make it compatible with native Web APIs. Additionally, the URL scheme for TOTP was implemented, and combined with the QR Code generator library it can be used to make it scannable with with an authenticator
app such as [Microsoft Authenticator](https://support.microsoft.com/en-us/account-billing/download-and-install-the-microsoft-authenticator-app-351498fc-850a-45da-b7b6-27e523b8702a) or
[Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pli=1).

### Features

- Issue a new TOTP secret with metadata (issuer, account, image, etc.)
- No external dependencies
- Lightweight

### Usage

```ts
import { otpauth, otpsecret, verify } from "./totp.ts"
import { qrcode } from "./qrcode.ts"

// Issue a new TOTP secret
const secret = otpsecret()
const url = otpauth({ issuer: "example.com", account: "alice", secret })
console.log(`Please scan the following QR Code:`)
qrcode(url.href, { output: "console" })

// Verify a TOTP token
const token = prompt("Please enter the token generated by your app:")!
console.assert(await verify({ token, secret }))
```

## ➕ Diff (patience algorithm)

[`🦕 Playground`](https://dash.deno.com/playground/libs-diff)

This library is based on the previous work of [@jonTrent](https://github.com/jonTrent) which is itself based on the work of Bram Cohen.

- [Original JavaScript source code](https://github.com/jonTrent/PatienceDiff/blob/dev/PatienceDiff.js)

I wrote this library because I'm working on a side project that allows edition of text content, and I wanted to implemente some kind of versioning system _à la [git](https://git-scm.com)_. The thing is I didn't want to create a binary dependency on a binary, especially since the
tracked content are mostly small text that may be anywhere in the filesystem, including remote files which would have been outside boundaries of git versioning.

> [!NOTE]\
> `patch()` is not implemented yet because I'm currently working on another personal project that I want to finish first (it's actually the project that required both the QR code and the TOTP libraries) but it'll eventually be available in the future.

### Features

- Compute [unified patch](https://opensource.com/article/18/8/diffs-patches) between two strings
- Match [`diff`](https://www.man7.org/linux/man-pages/man1/diff.1.html) command line output
- No external dependencies
- Lightweight

### Usage

```ts
import { diff } from "./diff.ts"

// Print unified patch
console.log(diff("foo", "bar"))
```

```diff
--- a
+++ b
@@ -1 +1 @@
-foo
+bar
```

## 🔐 Symmetric encryption (using AES-GCM 256 with a PBKDF2 derived key)

[`🦕 Playground`](https://dash.deno.com/playground/libs-encryption)

This library is inspired by existing password managers, where the aim is to provide a secure way to store credentials at rest (for example in a [`Deno.Kv` store](https://docs.deno.com/deploy/kv/manual)) while being able to recover them later using a single master key.

Here, it is achieved by using [`AES-GCM 256-bits`](https://en.wikipedia.org/wiki/Galois/Counter_Mode) with [`PBKDF2`](https://en.wikipedia.org/wiki/PBKDF2) derived key. The latter could for instance use a username as `salt` and a password as `seed` to consistently forge back the
key and decrypt the stored credentials. These are provided by the native [`Web Crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) APIs.

This library also adds additional features such as data integrity and original length obfuscation. It _**does not**_ re-implement cryptographic primitives, it just provides a convenient way to use them.

> [!CAUTION]\
> As explained in the [license](/LICENSE):
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND
>
> The author is not responsible for any damage that could be caused by the use of this library. It is your responsibility to use it properly and to understand the security implications of the choices you make.

### Features

- Use native [`Web Crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) APIs
- Use [`AES-GCM 256-bits`](https://en.wikipedia.org/wiki/Galois/Counter_Mode) with [`PBKDF2`](https://en.wikipedia.org/wiki/PBKDF2) derived key to encrypt and decrypt messages
  - Encrypted messages are different each time thanks to [initialization vector](https://en.wikipedia.org/wiki/Initialization_vector)
  - The derived key from a given `seed`/`password` are always the same
- Added functionalities which also introduce additional entropy:
  - With [SHA-256](https://en.wikipedia.org/wiki/SHA-2) to guarantee integrity
  - With stored size to guarantee integrity _(for messages with length < 255)_
  - With padding to force length be `256` or `512` bytes and obfuscate the original size _(can be disabled using `0` as value)_

### Usage

```ts
import { decrypt, encrypt, exportKey, importKey } from "./encryption.ts"

// Generate a key. Same seed and salt combination will always yield the same key
const key = await exportKey({ seed: "hello", salt: "world" })
console.assert(key === "664d43091e7905723fc92a4c38f58e9aeff6d822488eb07d6b11bcfc2468f48a")

// Encrypt a message
const message = "🍱 bento"
const secret = await encrypt(message, { key, length: 512 })
console.assert(secret !== message)

// Encrypted messages are different each time and can also obfuscate the original message size
console.assert(secret !== await encrypt(message, { key, length: 512 }))
console.assert(secret.length === 512)

// Decrypt a message
const decrypted = await decrypt(secret, { key })
console.assert(decrypted === message)
```

## 📰 Logger

[`🦕 Playground`](https://dash.deno.com/playground/libs-logger)

This library is a simple improvement upon [`console`](https://developer.mozilla.org/en-US/docs/Web/API/console) API to provide additional metadata (such as timestamps and tags), and customization options.

When executed on a v8 runtime (such as deno), it can also provide caller information (like file path, function name, line and column) using the [`Error.prepareStackTrace`](https://v8.dev/docs/stack-trace-api) API.

_Example output (with all options enabled):_ ![demo](/.github/images/logger_demo.png)

### Features

- Colored output
- Log levels
- Tags
- Timestamps
  - Date
  - Time
- Delta
- Caller information
  - File
  - Function name
  - Line and column
- Log formatters
  - Text
  - JSON

### Usage

```ts
import { Logger } from "./logger.ts"

// Configure logger
const tags = { foo: true, bar: "string" }
const options = { date: true, time: true, delta: true, caller: { file: true, fileformat: /.*\/(?<file>libs\/.*)$/, name: true, line: true } }
const log = new Logger({ level: Logger.level.debug, options, tags })

// Print logs
log.error("🍱 bento")
log.warn("🍜 ramen")
log.info("🍣 sushi")
log.log("🍥 narutomaki")
log.debug("🍡 dango")
```

## 🗜️ Bundler

[`🦕 Playground`](https://dash.deno.com/playground/libs-bundle)

A wrapper around [`deno_emit`](https://github.com/denoland/deno_emit) to bundle and transpile TypeScript to JavaScript.

### Features

- Support for raw TypeScript string input
- Support for banner option
- Minification enabled by default
- Support advanced minification through [Terser](https://terser.org)

### Usage

```ts
import { bundle } from "./bundle.ts"
const base = new URL("testing/bundle/", import.meta.url)

// From string
console.log(await bundle(`console.log("Hello world")`))

// From file
console.log(await bundle(new URL("test_bundle.ts", base)))

// Using an import map
console.log(await bundle(new URL("test_import_map.ts", base), { map: new URL("deno.jsonc", base) }))
```
