// Everyday Things, Two Lines: a toaster, explained to a 10-year-old.
// Writes exactly two lines to $MAKEFUN_OUTPUT_DIR/entry.txt:
//   line 1 — the analogy (one vivid sentence),
//   line 2 — why the analogy works: what it maps and what it leaves out.
const fs = require("node:fs");
const path = require("node:path");

const LINE1 =
  "A toaster is a tiny sunbed where bread lies under glowing wires until it turns golden brown.";
const LINE2 =
  "The sunbed maps the heat that browns the bread, but it leaves out the timer and the spring that pop the toast up before it burns.";

const text = LINE1 + "\n" + LINE2;

function fail(message) {
  throw new Error("entry invalid: " + message);
}

// Guards: 1-400 code points, exactly two lines, not whitespace-only.
const codePoints = [...text].length;
if (codePoints < 1 || codePoints > 400) {
  fail("length " + codePoints + " code points, expected 1-400");
}
const lines = text.split("\n");
if (lines.length !== 2) {
  fail("expected exactly 2 lines, got " + lines.length);
}
if (lines.some((line) => line.trim() === "")) {
  fail("a line is empty or whitespace-only");
}
if (text.trim() === "") {
  fail("text is whitespace-only");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  fail("MAKEFUN_OUTPUT_DIR is not set");
}
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "entry.txt");
fs.writeFileSync(outPath, text, "utf8");

// Round-trip validation: read back exactly what was just written.
const roundTrip = fs.readFileSync(outPath, "utf8");
if (roundTrip !== text) {
  fail("round-trip mismatch: written bytes differ from what was read back");
}
const roundTripLines = roundTrip.split("\n");
if (roundTripLines.length !== 2 || [...roundTrip].length !== codePoints) {
  fail("round-trip validation failed");
}
console.log("wrote " + outPath + " (" + codePoints + " characters, 2 lines)");
