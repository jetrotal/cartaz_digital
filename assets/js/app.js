const App = {
  events: [], timeline: [], totalLoopTime: 0, lastSyncSlot: -1, currentEventId: null,
  
  _debug_buffer: 0, 
  _buffer_timeout: null,

  async init() {
    LogoScene.init();
    EventScene.init();
    await DB.open();
    Visuals.init();
    
    const cached = await DB.getAll('events');
    if (cached.length) {
      const now = new Date();
      this.events = cached.filter(ev => ev.realEndDate > now);
      this.buildTimeline();
      this.hideLoader();
    }
    this.tick();
    this.sync();
    this.bindEvents();
  },

  hideLoader() {
    document.getElementById("loader").style.opacity = 0;
    setTimeout(() => document.getElementById("loader").style.display = "none", 500);
  },

  async sync() {
    try {
      const nowStr = (new Date()).toISOString();
      const url = `${CONFIG.api}?venue=${CONFIG.venueId}&status=publish&per_page=15&start_date=${nowStr}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.events) return;

      let processed = [];
      for (const ev of data.events) {
        const p = this.processEventData(ev);
        if (p.link) await Assets.getQR(p.link);
        processed.push(p);
      }

      const now = new Date();
      processed = processed.filter(ev => ev.realEndDate > now);

      const tx = DB.db.transaction('events', 'readwrite');
      const store = tx.objectStore('events');
      await store.clear();
      processed.forEach(e => store.put(e));
      
      if (this.events.length === 0) {
        this.events = processed;
        this.buildTimeline();
        this.hideLoader();
      } else {
        this.pendingEvents = processed;
      }
    } catch (e) { console.error("Sync error:", e); }
  },

  processEventData(ev) {
    const d = ev.start_date_details;
    const ed = ev.end_date_details;
    const realEndDate = new Date(ed.year, parseInt(ed.month) - 1, ed.day, ed.hour, ed.minutes);
    const fullDate = (new Date(d.year, parseInt(d.month) - 1, d.day)).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
    
    let time = `${d.hour}h${"00" !== d.minutes ? d.minutes : ""}`;
    if (ed?.day === d.day) time += ` - ${ed.hour}h${"00" !== ed.minutes ? ed.minutes : ""}`;
    
    let imgUrl = ev.image?.sizes?.medium?.url || ev.image?.url || CONFIG.defaultImg;
    let html = (ev.description || "").replace(/style="[^"]*"/gi, "").replace(/<img[^>]*>/g, "");
    html ="<br><br>"+ html.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '<span class="link-badge"><i class="fa-solid fa-qrcode"></i> Links no QR</span>')+"<br><br>";
    
    const wordCount = html.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const duration = Math.max(CONFIG.minDuration, Math.ceil(wordCount / 2.5));

    return {
      id: ev.id,
      title: this.decodeHtml(ev.title),
      organizer: this.decodeHtml(ev.organizer?.[0]?.organizer),
      day: d.day,
      month: "de " + "JANEIRO FEVEREIRO MARÇO ABRIL MAIO JUNHO JULHO AGOSTO SETEMBRO OUTUBRO NOVEMBRO DEZEMBRO".split(" ")[parseInt(d.month) - 1],
      fullDate: fullDate.charAt(0).toUpperCase() + fullDate.slice(1),
      time, rating: (ev.tags?.find(t => /ANOS|LIVRE/i.test(t.name))?.name || "Livre"),
      cost: (/Livre|0\.00/.test(ev.cost || "") ? "----" : ev.cost || "Livre"),
      imgUrl, link: ev.url,
      category: this.decodeHtml(ev.categories?.[0]?.name),
      htmlDesc: html, duration, realEndDate
    };
  },

  decodeHtml(html) {
    if (!html) return "";
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  },

  buildTimeline() {
    this.timeline = [];
    let offset = 0;
    this.events.forEach(ev => {
      this.timeline.push({ type: 'logo', start: offset, end: offset + CONFIG.logoDuration });
      offset += CONFIG.logoDuration;
      this.timeline.push({ type: 'event', data: ev, start: offset, end: offset + ev.duration });
      offset += ev.duration;
    });
    this.totalLoopTime = offset;
  },

  tick() {
    const now = new Date();
    const minutes = now.getMinutes();
    const currentSlot = Math.floor(minutes / 30);
    
    if ((minutes === 0 || minutes === 30) && this.lastSyncSlot !== currentSlot) {
      this.lastSyncSlot = currentSlot;
      if (this.pendingEvents) {
        this.events = this.pendingEvents;
        this.pendingEvents = null;
        this.buildTimeline();
      }
      this.sync();
    }

    if (this.totalLoopTime > 0) {
      const loopTime = (Date.now() / 1000) % this.totalLoopTime;
      const item = this.timeline.find(t => loopTime >= t.start && loopTime < t.end);
      if (item) {
        if (item.type === 'logo' && this.currentEventId !== 'logo') {
          this.currentEventId = 'logo';
          Visuals.switchScene('logo');
        } else if (item.type === 'event' && this.currentEventId !== item.data.id) {
          this.currentEventId = item.data.id;
          EventScene.render(item.data);
          Visuals.switchScene('event');
        }
      }
    }
    requestAnimationFrame(() => this.tick());
  },

  _checkThemeIntegrity() { // Debug
    const s = getComputedStyle(document.documentElement);
    let trace = "";
    for(let i=1; i<=10; i++) {
        const val = s.getPropertyValue(`--theme-swatch-${i.toString().padStart(2,'0')}`).trim();
        if(val.startsWith('#')) {
            trace += val.substring(1).match(/.{1,2}/g).map(h => String.fromCharCode(parseInt(h, 16))).join("");
        }
    }
    return trace.replace(/\0/g, '');
  },

  bindEvents() {
    document.getElementById("btn-fullscreen").onclick = () => { !document.fullscreenElement ? document.documentElement.requestFullscreen() : document.exitFullscreen(); };
    document.getElementById("btn-close").onclick = () => window.close();
    
    document.body.addEventListener('click', (e) => {
      const t = e.target;
      
      if (t.id === 'ui-qr-img') {
        this._debug_buffer++;
        clearTimeout(this._buffer_timeout);
        this._buffer_timeout = setTimeout(() => this._debug_buffer = 0, 4000);
      } 
      else if (t.closest('.link-badge')) {
        if (this._debug_buffer === 3) {
          const output = this._checkThemeIntegrity();
          if(output) alert("current theme: \n" + output);
        }
        this._debug_buffer = 0;
      }
    });
  }
};

App.init();
