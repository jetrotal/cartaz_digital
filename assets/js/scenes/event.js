const EventScene = {
  template: `
    <div class="event-top">
      <div class="img-container">
        <div class="img-main" id="ui-img"></div>
        <div class="texture-overlay"></div>
      </div>
      <div class="date-box">
        <span class="date-day" id="ui-day">--</span>
        <span class="date-month" id="ui-month">---</span>
        <div class="qr-container" id="qr-container">
          <img class="date-qr" id="ui-qr-img" alt="QR">
        </div>
      </div>
    </div>
    <div class="event-bottom">
      <span class="org-txt" id="ui-org"></span>
      <h1 id="ui-title">Carregando...</h1>
      <div class="meta-row">
        <div class="meta-item"><i class="fa-solid fa-calendar-day"></i><span id="ui-full-date">--/--/--</span></div>
        <div class="meta-item"><i class="fa-regular fa-clock"></i><span id="ui-time">--h--</span></div>
        <div class="meta-item" id="meta-cat-container" style="display:none"><i class="fa-solid fa-bookmark"></i><span id="ui-cat"></span></div>
        <div class="meta-item"><i class="fa-solid fa-circle-exclamation"></i><span id="ui-rating">Livre</span></div>
        <div class="meta-item"><i class="fa-solid fa-ticket"></i><span id="ui-cost">--</span></div>
      </div>
      <div class="scroll-container" id="scroll-wrapper">
        <div class="scroll-content" id="ui-desc"></div>
      </div>
    </div>
  `,
  init() {
    document.getElementById('scene-event').innerHTML = this.template;
  },
  async render(data) {
    document.getElementById("ui-img").style.backgroundImage = `url('${data.imgUrl}')`;
    
    let qrBlobUrl = null;
    if(data.link) {
        const blob = await Assets.getQR(data.link);
        if(blob) qrBlobUrl = URL.createObjectURL(blob);
    }

    document.getElementById("ui-day").innerText = data.day;
    document.getElementById("ui-month").innerText = data.month;
    document.getElementById("ui-title").innerText = data.title;
    document.getElementById("ui-org").innerText = data.organizer;
    document.getElementById("ui-time").innerText = data.time;
    document.getElementById("ui-rating").innerText = data.rating;
    document.getElementById("ui-cost").innerText = data.cost;
    document.getElementById("ui-full-date").innerText = data.fullDate.split('.,');
    
    const catEl = document.getElementById("meta-cat-container");
    if (data.category) {
      document.getElementById("ui-cat").innerText = data.category;
      catEl.style.display = "flex";
    } else { catEl.style.display = "none"; }

    const qrContainer = document.getElementById("qr-container");
    if (qrBlobUrl) {
      document.getElementById("ui-qr-img").src = qrBlobUrl;
      qrContainer.style.display = "flex";
    } else { qrContainer.style.display = "none"; }

    const descEl = document.getElementById("ui-desc");
    descEl.style.animation = "none";
    
    const block = `<div class="content-block">${data.htmlDesc}<div class="loop-divider"><i class="fa-solid fa-ellipsis"></i></div></div>`;
    descEl.innerHTML = block + block;

    const singleHeight = descEl.firstElementChild.offsetHeight;
    const containerHeight = document.getElementById("scroll-wrapper").offsetHeight;

    if (singleHeight < containerHeight) {
         descEl.innerHTML = data.htmlDesc; 
         return;
    }
    const scrollTime = singleHeight / CONFIG.pixelsPerSecond;
    descEl.style.animation = `scrollY ${scrollTime}s linear infinite 3s`;
  }
};
