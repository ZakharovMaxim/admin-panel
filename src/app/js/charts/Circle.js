import AutoResizeChart from "./AutoResizeChart.js";
export default class CircleChart extends AutoResizeChart {
  constructor(settings) {
    super(settings.el, settings.id);
    this.stroke = settings.stroke || 10;
    this.percent = settings.percent || 0;
    this.settings = settings;
    this.draw();
  }
  draw() {
    let percent = this.percent;
    let gap = this.settings.gap || 0;
    if (this.settings.partical) {
      percent = percent * (1 - gap / 100);
    }
    this.svg.innerHTML = "";

    let SVGContent = `
                <defs>
                  <linearGradient id="linear${this.id}" 
                    x1="0%" 
                    y1="50%" 
                    x2="100%" 
                    y2="50%">
                    ${
                      this.settings.colors
                        ? this.settings.colors.map(
                            (color, i) =>
                              `<stop offset="${i /
                                this.settings.colors
                                  .length}" stop-color="${color ||
                                "#00FFD2"}"/>`
                          )
                        : '<stop offset="100%" stop-color="#000"'
                    }
                  </linearGradient>
                `;
    if (this.settings.shadow) {
      SVGContent += `
      <filter id="dropShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="0" dy="0" />
          <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
          </feMerge>
      </filter>
      `;
    }
    SVGContent += "</defs>";
    SVGContent += `
                <g class="main-circle">
                  <circle 
                    cy="50%" 
                    cx="50%" 
                    r="${50 - this.stroke}%"
                    stroke-width="${this.stroke - 1}%" 
                    fill="none" 
                    stroke="#fff"
                    stroke-linecap="round"
                    style="transform: rotate(${90 + gap * 2 - gap / 4}deg)"
                    stroke-dasharray="${(100 - gap) * 2.5}%, 400%" 
                `;
    if (this.settings.shadow) {
      SVGContent += ` filter="url(#dropShadow)"`;
    }
    SVGContent += "/></g>";
    SVGContent += `
                <circle cy="50%" cx="50%"
                r="${50 - this.stroke}%"
                fill="none" stroke-width="${this.stroke}%"
                stroke="url(#linear${this.id})"
                stroke-linecap="round"
                style="transform: rotate(${90 + gap * 2 - gap / 4}deg)"
                stroke-dasharray="${percent * 2.5}%, 400%" 
                />
    `;

    // draw svg Element
    this.el.select("svg").node().innerHTML = SVGContent;

    // draw label
    if (this.settings.label) this.drawLabels();
  }
  drawLabels() {
    const settings = this.settings.label;
    if (!settings) return;
    if (Array.isArray(settings)) {
      settings.forEach(setting => {
        create(setting, this);
      });
    } else {
      create(settings, this);
    }
    // function for create label
    function create(settings, context) {
      if (!settings.value) return;
      const label = document.createElement("DIV");
      let labelClass = `label`;
      if (settings.className && settings.className !== labelClass) {
        labelClass += " " + settings.className;
      }
      if (settings.position) {
        if (settings.position.x) {
          labelClass += ` label-x-${settings.position.x}`;
        }
        if (settings.position.y) {
          labelClass += ` label-y-${settings.position.y}`;
        }
      }
      let labelHTML = `<span class="label-value">${settings.value}</span>`;
      if (settings.prefix) {
        labelHTML =
          `<span class="label-prefix">${settings.prefix}</span>` + labelHTML;
      }
      if (settings.suffix) {
        labelHTML += `<span class="label-suffix">${settings.suffix}</span>`;
      }
      label.innerHTML = labelHTML;
      label.classList = labelClass;
      context.el.node().appendChild(label);
    }
    // draw triangle
    if (this.settings.triangle) {
      const tri = document.createElement("DIV");
      tri.classList.add("chart-progress-triangle");
      const bottomLabel = this.el.select(".label-y-bottom").node();
      if (bottomLabel) {
        bottomLabel.appendChild(tri);
      } else {
        this.el.node().appendChild(tri);
      }
    }
  }
}
