const LogoScene = {
  template: `
    <div class="svg-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 843 1081">
        <defs>
          <path id="b" fill="none" stroke-linecap="butt" stroke-linejoin="bevel" stroke-width="5" d="m680 155-7-15h-23l-7 15m7-15 11-25 12 25m-153-26v41l-31-40v41m49-42v42m57-42v42m-167 0-8-41-17 36-16-36-8 41m-184-1 7-15 11-25 11 25 7 15m-7-15h-22m33-23h35m-18 0v39m-133-39h35m-18 0v39" />
          <path id="c" fill="none" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="3" stroke-width="5" d="M692 115v39h23m-101-14q10 1 16-3 5-3 5-9t-6-9q-6-4-15-2v39m-32-39q-7-1-14 1-14 4-14 18 0 12 14 17 7 2 14 1m-248-38q-5 0-9 3-9 5-9 18 0 12 9 16 4 2 9 2l8-2q9-4 9-16 0-13-9-18-4-3-8-3Zm136-2v28q0 6-4 9-4 4-10 4-12 0-14-13v-28m-255 3h-23v18h23m0 20h-23v-20m143 21-16-18q6-1 8-6 3-4 1-8-1-4-6-6-6-3-15-1v39" />
          <path id="d" fill="none" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="3" stroke-width="4" d="M631 501h81v264l-48 48h-33V501Zm0-329h81v312h-81V172Zm-101 0h81v312h-81V172Zm-202 0h81v312h-81V172Zm101 0h81v312h-81V172Zm-202 0h81v312h-81V172Zm-101 0h81v312h-81V172Zm101 329h81v312h-81V501Zm-101 0h81v312h-81V501Zm404 0h81v312h-81V501Zm-202 0h81v312h-81V501Zm101 0h81v312h-81V501Z" />
          <path id="e" fill="none" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="3" stroke-width="3.5" d="M712 813h-28l28-28v28Z" />
          <path id="f" fill="none" stroke-linecap="butt" stroke-linejoin="bevel" stroke-width="16" d="m738 967-23-51h-73l-23 51m-300 0 23-51 36-80 37 80 23 51m-23-51h-73m-69 54-27-134-53 115-51-115-27 134m527-54 36-80 37 80" />
          <path id="g" fill="none" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="3" stroke-width="16" d="M482 832v49l1 43q5 41 46 41 21 0 35-11 14-12 13-30v-43l1-49" />
          <g id="a">
            <path fill="#C01B1C" d="M684 813h28v-28l-28 28m28-48V501h-81v312h33l48-48Z" />
            <path fill="#FAC804" d="M308 501h-81v312h81V501Z" />
            <path fill="#814797" d="M409 172h-81v312h81V172Z" />
            <path fill="#3A4697" d="M611 172h-81v312h81V172Z" />
          </g>
        </defs>
        <use href="#a" />
        <use href="#b" class="dynamic-stroke" />
        <use href="#c" class="dynamic-stroke" />
        <use href="#d" class="dynamic-stroke" />
        <use href="#e" class="dynamic-stroke" />
        <use href="#f" class="dynamic-stroke" />
        <use href="#g" class="dynamic-stroke" />
      </svg>
    </div>
  `,
  init() {
    document.getElementById('scene-logo').innerHTML = this.template;
  }
};
