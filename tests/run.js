import assert from "node:assert";
import { normalizeStops } from "../stops.js";
import { sampleAt } from "../ramp.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("normalizeStops returns a list", () => {
  assert.ok(Array.isArray(normalizeStops([{ at: 0, color: [0, 0, 0] }])));
});

check("sampleAt returns channels", () => {
  const color = sampleAt([{ at: 0, color: [0, 0, 0] }], 0.5);
  assert.strictEqual(typeof color.r, "number");
  assert.strictEqual(typeof color.g, "number");
  assert.strictEqual(typeof color.b, "number");
});

check("sampleAt accepts the start", () => {
  assert.strictEqual(typeof sampleAt([{ at: 0, color: [1, 2, 3] }], 0).r, "number");
});

check("render returns one color per sample", () => {
  const view = render({ stops: [{ at: 0, color: [0, 0, 0] }, { at: 1, color: [1, 1, 1] }], samples: [0, 0.5, 1] });
  assert.strictEqual(view.colors.length, 3);
});

check("render counts stops", () => {
  const view = render({ stops: [{ at: 0, color: [0, 0, 0] }], samples: [0] });
  assert.strictEqual(typeof view.stop_count, "number");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
