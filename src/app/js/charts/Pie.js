import AutoResizeChart from './AutoResizeChart.js'
export default class Pie extends AutoResizeChart {
  constructor(settings) {
    super(settings.el, settings.id);
    NodeList.prototype.map = Array.prototype.map;
    this.settings = settings;
    this.fetch();
  }
  fetch () {
    if (!this.settings.data) return;
    const totalFrequency = this.settings.data.split(',').reduce((prev, current) => +prev + +current);
    this.data = this.settings.data.split(',').map((item, index) => {
      return {
        frequency: +item,
        percent: +item / totalFrequency * 100,
        color: {
          c1: this.settings.colors[index].c1 || "#00FFD2",
          c2: this.settings.colors[index].c2 || "#00FFD2"
        }
      }
    })
    this.draw();
  }
  draw() {
    this.svg.node().innerHTML = '';

    let defs = `<defs>`;
    this.data.forEach((item, index) => {
      defs += `<linearGradient id="pielinear${index}" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stop-color="${item.color.c2}"></stop>
                <stop offset="100%" stop-color="${item.color.c1}"></stop>
              </linearGradient></defs>`;
    })
    this.svg.node().innerHTML = defs;
    
    const pieContent = this.svg
        .append("g");
    let percentSum = 0;
    this.data.forEach((slice, index) => {
      let prevItem = this.data[index - 1];
      const circle = pieContent.append('circle')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '25%')
      .attr('fill', 'none')
      .attr('stroke', `url(#pielinear${index})`)
      .attr('stroke-width', '50%')
      .attr('stroke-dasharray', '157%')
      .attr('stroke-dashoffset', 157 - (slice.percent * (157 / 100)) + '%');

      if (prevItem) {
        percentSum += prevItem.percent;
        circle.style('transform', `rotate(${360 * percentSum / 100}deg)`)
      }
    });
  }
}
