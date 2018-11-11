import Bar from "./Bar";
import RangeControlls from "./RangeControlls";
export default class BarComplex extends Bar {
  constructor(settings) {
    super(settings);
  }
  dataSort(data) {
    data = data.map(item => {
      item.date = new Date(item.date);
      item.label = new Intl.DateTimeFormat().format(item.date);
      return item;
    }).sort((i1, i2) => i1.date - i2.date);
    return data;
  }
  draw() {
    super.draw();
    if (this.settings.rangeControlls && !this.rangeControlls) {
      const rangeControllEl = d3
        .select(this.el.node().parentNode)
        .append("div")
        .attr("class", "chart-range chart");
        rangeControllEl.append('div').attr('class', 'chart-type');
      this.rangeControlls = new RangeControlls({
        chart: new Bar({
          el: rangeControllEl.node(),
          id: this.settings.id,
          data: this.data,
          nomargin: true
        }),
        el: rangeControllEl,
        byClass: '.bar-wrapper rect'
      });
      rangeControllEl.node().addEventListener('change', e => this.changeOffset(e))
    }
  }
  changeOffset (e) {
    const direction = e.direction;
    const date = new Date(e.value);
    if (direction === 'l') {
      this.leftOffset = date;
    } else {
      this.rightOffset = date;
    }
    this.draw();
  }
}
