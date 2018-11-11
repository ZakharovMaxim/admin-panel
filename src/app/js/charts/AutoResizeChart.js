import Chart from './Chart';
class AutoResizeChart extends Chart {
  constructor (el, id) {
    super (el, id);
    this.svg.attr('width', '100%')
    .attr('height', '100%')
    .attr('viewbox', `0 0 100% 100%`)
  }
}
export default AutoResizeChart