import fs from "node:fs";
import { normalizeStops } from "./stops.js";
import { sampleAt } from "./ramp.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/ramp.json", "utf8"));
const view = render(spec);

emit("采样的颜色 =", JSON.stringify(view.colors));
emit("端点是否命中色标 =", view.endpoints_hit);
emit("色标条数 =", view.stop_count);
emit("采样条数 =", view.colors.length);
emit("落在色标之间的采样点数 =", view.between);
emit("色标没排序的错误码 =", spec.unsorted_error_code);
emit("色标为空的错误码 =", spec.empty_error_code);
emit("采样位置越界的错误码 =", spec.position_error_code);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  normalizeStops([{ at: 0.5, color: [1, 1, 1] }, { at: 0.2, color: [2, 2, 2] }]);
  emit("色标没排序的错误码", "没有报错");
} catch (error) {
  emit("色标没排序的错误码", error && error.code ? error.code : String(error.message));
}
try {
  normalizeStops([]);
  emit("色标为空的错误码", "没有报错");
} catch (error) {
  emit("色标为空的错误码", error && error.code ? error.code : String(error.message));
}
try {
  sampleAt([{ at: 0, color: [0, 0, 0] }, { at: 1, color: [9, 9, 9] }], 1.5);
  emit("采样位置越界的错误码", "没有报错");
} catch (error) {
  emit("采样位置越界的错误码", error && error.code ? error.code : String(error.message));
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "采样的颜色": [
    [
      0,
      0,
      0
    ],
    [
      128,
      0,
      0
    ],
    [
      255,
      0,
      0
    ],
    [
      255,
      119,
      119
    ],
    [
      255,
      255,
      255
    ]
  ],
  "端点是否命中色标": true,
  "色标条数": 3,
  "采样条数": 5,
  "落在色标之间的采样点数": 2,
  "色标没排序的错误码": "E_UNSORTED_STOPS",
  "色标为空的错误码": "E_EMPTY_STOPS",
  "采样位置越界的错误码": "E_BAD_POSITION"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
