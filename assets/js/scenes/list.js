const ListScene = {
  template: `
    <h1 class="list-header">Próximos Eventos</h1>
    <div class="list-scroll-wrapper" id="list-scroll-wrapper">
      <div class="list-scroll-content" id="ui-list-container"></div>
    </div>
  `,
  init() {
    document.getElementById('scene-list').innerHTML = this.template;
  },
  render(events) {
    const container = document.getElementById('ui-list-container');
    const itemsHtml = events.map(ev => {
      const dateStr = ev.fullDate.replace('.,', ',').replace(/\/\d{4}/, '');
      return `
      <div class="list-item">
        <div class="list-date"><i class="fa-regular fa-calendar" style="margin-right: 8px;"></i> ${dateStr} &nbsp; <i class="fa-regular fa-clock" style="margin-right: 8px; margin-left: 8px;"></i> ${ev.time}</div>
        <div class="list-title">${ev.title}</div>
      </div>
      `;
    }).join('');

    const block = `<div class="list-block">${itemsHtml}<div class="loop-divider"><i class="fa-solid fa-ellipsis"></i></div></div>`;
    container.innerHTML = block + block;
    container.style.animation = 'none';

    setTimeout(() => {
      const singleHeight = container.firstElementChild.offsetHeight;
      const wrapperHeight = document.getElementById('list-scroll-wrapper').offsetHeight;
      
      if (singleHeight < wrapperHeight) {
        container.innerHTML = `<div class="list-block">${itemsHtml}</div>`;
      } else {
        const scrollTime = singleHeight / CONFIG.pixelsPerSecond;
        container.style.animation = `scrollY ${scrollTime}s linear infinite 3s`;
      }
    }, 100);
  }
};
