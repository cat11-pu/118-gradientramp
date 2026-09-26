// app.js：渲染结果
import { normalizeStops } from "./stops.js";
import { sampleAt } from "./ramp.js";

export function render(spec) {
  const stops = normalizeStops(spec.stops || []);
  const samples = spec.samples || [];
  const colors = samples.map((at) => {
    const color = sampleAt(stops, at);
    return [color.r, color.g, color.b];
  });
  const ends = [sampleAt(stops, 0), sampleAt(stops, 1)];
  const marks = new Set(stops.map((item) => item.at));
  return { colors: colors, stop_count: stops.length, between: samples.filter((at) => !marks.has(at)).length,
           endpoints_hit: JSON.stringify([ends[0].r, ends[0].g, ends[0].b]) === JSON.stringify(colors[0] || [])
             && JSON.stringify([ends[1].r, ends[1].g, ends[1].b]) === JSON.stringify(colors[colors.length - 1] || []) };
}
