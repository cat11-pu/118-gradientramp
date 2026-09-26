// stops.js：色标校验（一次扫描，位置必须严格递增）
function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

export function normalizeStops(stops) {
  if (!Array.isArray(stops) || stops.length === 0) {
    fail("E_EMPTY_STOPS", "stops must be a non-empty list");
  }
  const out = stops.slice();
  for (let i = 1; i < out.length; i += 1) {
    if (!(out[i - 1].at < out[i].at)) {
      fail("E_UNSORTED_STOPS", "stop positions must be strictly increasing");
    }
  }
  return out;
}
