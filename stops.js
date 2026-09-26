// stops.js：色标校验，一次扫描确认位置严格递增。
export function normalizeStops(stops) {
  if (!Array.isArray(stops) || stops.length === 0) {
    const error = new Error("stops must not be empty");
    error.code = "E_EMPTY_STOPS";
    throw error;
  }
  for (let index = 1; index < stops.length; index += 1) {
    if (!(stops[index].at > stops[index - 1].at)) {
      const error = new Error("stops must be strictly increasing by position");
      error.code = "E_UNSORTED_STOPS";
      throw error;
    }
  }
  return stops.slice();
}
