// ramp.js：采样，二分定位区间后按位置比例线性插值。
// 入参 stops 需已通过 normalizeStops 校验（app.render 会先归一化）。
function toColor(stop) {
  return { r: Math.round(stop.color[0]), g: Math.round(stop.color[1]), b: Math.round(stop.color[2]) };
}

export function sampleAt(stops, at) {
  if (!(at >= 0 && at <= 1)) {
    const error = new Error("sample position must be within [0, 1]");
    error.code = "E_BAD_POSITION";
    throw error;
  }
  const normalized = stops;
  const first = normalized[0];
  const last = normalized[normalized.length - 1];
  if (at <= first.at) return toColor(first);
  if (at >= last.at) return toColor(last);
  let low = 0;
  let high = normalized.length - 1;
  while (high - low > 1) {
    const mid = (low + high) >> 1;
    if (normalized[mid].at <= at) low = mid;
    else high = mid;
  }
  const left = normalized[low];
  const right = normalized[high];
  if (at === left.at) return toColor(left);
  if (at === right.at) return toColor(right);
  const ratio = (at - left.at) / (right.at - left.at);
  return {
    r: Math.round(left.color[0] + (right.color[0] - left.color[0]) * ratio),
    g: Math.round(left.color[1] + (right.color[1] - left.color[1]) * ratio),
    b: Math.round(left.color[2] + (right.color[2] - left.color[2]) * ratio),
  };
}
