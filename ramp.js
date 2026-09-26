// ramp.js：采样（端点截断，区间内按位置二分定位后线性插值）
import { normalizeStops } from "./stops.js";

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

function toColor(stop) {
  return { r: Math.round(stop.color[0]), g: Math.round(stop.color[1]), b: Math.round(stop.color[2]) };
}

export function sampleAt(stops, at) {
  if (typeof at !== "number" || at < 0 || at > 1) {
    fail("E_BAD_POSITION", "sample position must be within [0, 1]");
  }
  const list = normalizeStops(stops);
  const first = list[0];
  const last = list[list.length - 1];
  if (at <= first.at) return toColor(first);
  if (at >= last.at) return toColor(last);

  // 二分：找最大的 i 使 list[i].at <= at，则 at 落在 [i, i+1]
  let lo = 0;
  let hi = list.length - 1;
  while (lo + 1 < hi) {
    const mid = (lo + hi) >> 1;
    if (list[mid].at <= at) lo = mid;
    else hi = mid;
  }
  const left = list[lo];
  const right = list[hi];
  if (at === left.at) return toColor(left);
  if (at === right.at) return toColor(right);
  const t = (at - left.at) / (right.at - left.at);
  return {
    r: Math.round(left.color[0] + (right.color[0] - left.color[0]) * t),
    g: Math.round(left.color[1] + (right.color[1] - left.color[1]) * t),
    b: Math.round(left.color[2] + (right.color[2] - left.color[2]) * t),
  };
}
