class Chart {
  constructor(el, id) {
    this.el = d3.select(el);
    this.id = id;
    this.data = {};
    this.svg = this.el.select('.chart-type')
    .append('svg');
  }
}

export default Chart;