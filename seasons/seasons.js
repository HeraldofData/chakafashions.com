// =========================================================
//  SEASONS — decides which hero the website shows
//
//  1) MANUAL SWITCH (wins over the calendar):
//       "christmas" | "january" | "original" | null
//     Leave it as null to let the calendar decide.
const FORCE_SEASON = null;

//  2) CALENDAR (month 1 = January). Used when FORCE_SEASON is null.
const SEASONS = [
  { name: "christmas", from: { m: 11, d: 1 },  to: { m: 12, d: 26 } },
  { name: "january",   from: { m: 12, d: 27 }, to: { m: 1,  d: 31 } },
  // anything else → "original" (the clean everyday version)
];

//  Preview any version without publishing:
//     chakafashions.com/?season=january
//     chakafashions.com/?season=christmas
//     chakafashions.com/?season=original
// =========================================================

(function () {
  function inRange(now, from, to) {
    const n = (now.getMonth() + 1) * 100 + now.getDate();
    const f = from.m * 100 + from.d, t = to.m * 100 + to.d;
    return f <= t ? n >= f && n <= t : n >= f || n <= t; // handles Dec → Jan
  }

  const preview = new URLSearchParams(location.search).get("season");
  let season = preview || FORCE_SEASON;
  if (!season) {
    const hit = SEASONS.find(s => inRange(new Date(), s.from, s.to));
    season = hit ? hit.name : "original";
  }
  if (season !== "original") document.body.classList.add("season-" + season);
  window.CHAKA_SEASON = season;

  // ---------- January: bunting flags + confetti ----------
  if (season !== "january") return;
  document.addEventListener("DOMContentLoaded", () => {
    const wire = document.getElementById("buntingWire");
    const flags = document.getElementById("flags");
    if (!wire || !flags) return;

    const svg = wire.ownerSVGElement;
    const W = Math.max(svg.clientWidth, 320);
    const swags = W < 700 ? 1 : 2, step = W / swags, sag = W < 700 ? 60 : 85;
    let d = "M-10 12";
    for (let k = 0; k < swags; k++) {
      const x0 = k * step, x1 = x0 + step;
      d += ` C ${x0 + step * 0.3} ${sag}, ${x1 - step * 0.3} ${sag}, ${x1 + (k === swags - 1 ? 10 : 0)} 12`;
    }
    wire.setAttribute("d", d);
    svg.setAttribute("viewBox", `0 0 ${W} 120`);

    const ns = "http://www.w3.org/2000/svg";
    const fills = ["url(#pChevron)", "#f3efe7", "url(#pDiamond)", "#e9c46a", "url(#pStripe)", "#b4532a"];
    const len = wire.getTotalLength();
    const count = Math.round(W / 46);
    for (let i = 1; i < count; i++) {
      const p = wire.getPointAtLength((len / count) * i);
      const flag = document.createElementNS(ns, "path");
      flag.setAttribute("d", `M${p.x - 15} ${p.y} L${p.x + 15} ${p.y} L${p.x} ${p.y + 34} Z`);
      flag.setAttribute("fill", fills[i % fills.length]);
      flag.setAttribute("class", "flag");
      flag.style.animationDelay = `${-(i * 0.4) % 3}s`;
      flags.appendChild(flag);
    }

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = document.querySelector(".jan-confetti");
    const colours = ["#e9c46a", "#f3efe7", "#b4532a", "#7fe0a0", "#ffd66b"];
    const n = innerWidth < 700 ? 30 : 60;
    for (let i = 0; i < n; i++) {
      const c = document.createElement("span");
      c.className = "flake confetti";
      const w = 4 + Math.random() * 5;
      c.style.cssText = `left:${Math.random() * 100}%;width:${w}px;height:${w * 0.45}px;background:${colours[i % colours.length]};` +
        `--drift:${(Math.random() * 80 - 40).toFixed(0)}px;--spin:${(Math.random() * 720 - 360).toFixed(0)}deg;` +
        `animation-duration:${(9 + Math.random() * 9).toFixed(1)}s;animation-delay:${(-Math.random() * 18).toFixed(1)}s;`;
      box.appendChild(c);
    }
  });
})();
