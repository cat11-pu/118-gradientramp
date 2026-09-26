// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  let at = 0.5;
  parts.log.textContent = "色标 " + (spec.stops || []).length + " 条，拖动采样位置看颜色。";

  function draw() {
    const scene = Object.assign({}, spec, { samples: [at] });
    let view = null;
    try {
      view = render(scene);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    const strip = document.createElement("div");
    strip.className = "row";
    view.colors.forEach(function (color) {
      const cell = document.createElement("span");
      cell.className = "chip";
      cell.textContent = color[0] + "," + color[1] + "," + color[2];
      cell.style.background = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
      cell.style.color = color[0] + color[1] + color[2] > 380 ? "#1f2430" : "#fff";
      strip.appendChild(cell);
    });
    parts.stage.appendChild(strip);
    const marks = document.createElement("div");
    marks.className = "row";
    (spec.stops || []).forEach(function (stop) {
      const cell = document.createElement("span");
      cell.className = "chip";
      cell.textContent = stop.at + " 处";
      marks.appendChild(cell);
    });
    parts.stage.appendChild(marks);
    parts.legend.textContent = "色标 " + view.stop_count + " 条，落在色标之间 " + view.between + " 个采样点";
    parts.log.textContent = "端点是否命中色标：" + view.endpoints_hit;
  }

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "采样";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const upButton = document.createElement("button");
  upButton.textContent = "采样位置加零点一";
  upButton.addEventListener("click", function () {
    at = Math.min(1, Math.round((at + 0.1) * 100) / 100);
    draw();
  });
  parts.controls.appendChild(upButton);

  const downButton = document.createElement("button");
  downButton.textContent = "采样位置减零点一";
  downButton.addEventListener("click", function () {
    at = Math.max(0, Math.round((at - 0.1) * 100) / 100);
    draw();
  });
  parts.controls.appendChild(downButton);

  const label = document.createElement("label");
  label.textContent = "采样位置";
  parts.controls.appendChild(label);

  const box = document.createElement("input");
  box.type = "number";
  box.value = "0.5";
  box.addEventListener("input", function () {
    const parsed = Number(box.value);
    if (parsed >= 0 && parsed <= 1) { at = parsed; draw(); }
  });
  parts.controls.appendChild(box);

  const readButton = document.createElement("button");
  readButton.textContent = "只看端点颜色";
  readButton.addEventListener("click", function () {
    const scene = Object.assign({}, spec, { samples: [0, 1] });
    const view = render(scene);
    parts.out.textContent = "起点 " + JSON.stringify(view.colors[0]) + "，终点 " + JSON.stringify(view.colors[1]);
  });
  parts.controls.appendChild(readButton);

  draw();
}
