const Visuals = {
  skyReqId: null,
  virtualHour: new Date().getHours(),
  skyStops: [
    { t: 0, c: ["#0A0E27", "#1A1F3A", "#000510"] },
    { t: 6, c: ["#FF6B35", "#FFA07A", "#4A5899"] },
    { t: 12, c: ["#42A5F5", "#29B6F6", "#0288D1"] },
    { t: 18, c: ["#F4511E", "#FF6E40", "#7B2CBF"] },
    { t: 24, c: ["#0A0E27", "#1A1F3A", "#000510"] }
  ],
  init() {
    const c = document.createElement("canvas"); c.width = c.height = 200;
    const ctx = c.getContext("2d"), id = ctx.createImageData(200, 200), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const v = 255 * Math.random(); d[i] = d[i+1] = v; d[i+2] = 5*v; d[i+3] = 255; }
    ctx.putImageData(id, 0, 0);
    document.getElementById("noise").style.backgroundImage = `url(${c.toDataURL()})`;
    this.animateSky();
  },
  animateSky() {
    this.virtualHour = (this.virtualHour + CONFIG.skySpeed / 3600) % 24;
    const getLuminance = rgb => (([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255)(rgb.match(/\d+/g));
    const lerp = (a, b, t) => a + (b - a) * t;
    const lerpColor = (c1, c2, t) => `rgb(${(cs => [0, 1, 2].map(i => Math.round(lerp(cs[0][i], cs[1][i], t))))([c1, c2].map(c => c.match(/\w\w/g).map(x => parseInt(x, 16))))})`;
    
    let stop = this.skyStops.find((s, i) => {
      let next = this.skyStops[i + 1] || this.skyStops[0];
      let endT = next.t < s.t ? 24 + next.t : next.t;
      return this.virtualHour >= s.t && this.virtualHour < endT;
    }) || this.skyStops[0];

    let nextStop = this.skyStops[(this.skyStops.indexOf(stop) + 1) % this.skyStops.length];
    let duration = (nextStop.t < stop.t ? 24 + nextStop.t : nextStop.t) - stop.t;
    let t = (this.virtualHour - stop.t) / duration;
    const finalColors = [0, 1, 2].map(i => lerpColor(stop.c[i], nextStop.c[i], t));
    
    document.body.style.setProperty("--c1", finalColors[0]);
    document.body.style.setProperty("--c2", finalColors[1]);
    document.body.style.setProperty("--c3", finalColors[2]);

    const isLight = 0.45 < (getLuminance(finalColors[0]) + getLuminance(finalColors[1])) / 2;
    document.body.style.setProperty("--primary", isLight ? "var(--primary-light)" : "var(--primary-dark)");
    document.body.style.setProperty("--stroke-color", isLight ? "#000" : "#fff");
    document.body.style.setProperty("--ui-text", isLight ? "#111" : "#fff");
    document.body.style.setProperty("--ui-glass", isLight ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.85)");

    this.skyReqId = requestAnimationFrame(() => this.animateSky());
  },
  pauseSky() { if (this.skyReqId) cancelAnimationFrame(this.skyReqId); },
  resumeSky() { this.pauseSky(); this.animateSky(); },
  switchScene(type) {
    document.querySelectorAll(".scene").forEach(el => el.classList.remove("active"));
    document.getElementById(`scene-${type}`).classList.add("active");
    if (type === 'event') this.pauseSky(); else this.resumeSky();
  }
};
