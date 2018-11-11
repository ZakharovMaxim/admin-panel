import RangeControlls from "./RangeControlls";
import HandleResizeChart from "./HandleResizeChart.js";

/**
 * settings
 * el - element in which will be mount chart
 * id - identifier
 * rangeControll - boolean, create rangeControll component
 * baseURL - string, url for data fetch
 * periods - array
 * yAxis - draw Y axis
 * xAxis - draw X axis
 */
export default class Area extends HandleResizeChart {
  constructor(settings) {
    super(settings);
    // if havent data attr try to fetch

    if (!settings.data) this.dataGet();
    else {
      this.data = settings.data;
    }
  }
  dataSort(data) {
    // parsing data, split date string by this way for compatibility with safari
    data = data
      .map(item => {
        let date = item.date.split(" ")[0];
        let time = item.date.split(" ")[1];
        item.date = new Date(
          date.split("-")[0],
          +date.split("-")[1] - 1,
          date.split("-")[2],
          time.split(":")[0],
          time.split(":")[1],
          time.split(":")[2]
        );
        return item;
      })
      .sort((i1, i2) => i1.date - i2.date);
    return data;
  }
  draw() {
    const color1 = this.settings.color1 || "#00FFD2";
    const color2 = this.settings.color2 || "#00948E";
    const data = this.data;
    let margin = this.settings.nomargin
        ? { top: 0, right: 0, bottom: 0, left: 0 }
        : { top: 60, right: 20, bottom: 30, left: 50 },
      width = this.width - margin.left - margin.right,
      height = this.height - margin.top - margin.bottom;

    this.svg.node().innerHTML = "";

    let defs = `<defs><linearGradient id="linear${
      this.id
    }" x1="50%" y1="0%" x2="50%" y2="100%">
                   <stop offset="0%" stop-color="${color1}"></stop>
                    <stop offset="100%" stop-color="${color2}"></stop>
                 </linearGradient>
                </defs>`;

    this.svg.node().innerHTML = defs;

    let g = this.svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleTime().rangeRound([0, width]);

    let y = d3.scaleLinear().rangeRound([height, 0]);

    let area = d3
      .area()
      .x(function(d) {
        return x(d.date);
      })
      .y1(function(d) {
        return y(d.potency);
      });

    x.domain(
      d3.extent(data, function(d) {
        return d.date;
      })
    );

    y.domain([
      0,
      d3.max(data, function(d) {
        return d.potency;
      })
    ]);

    area.y0(y(0));

    // some charts may have a few periods, xAxis will be different for different periods
    if (typeof this.settings.xAxis === "boolean") {
      this.drawCustomXAXis({
        height,
        width,
        group: g
      });
    } else if (typeof this.settings.xAxis === "object") {
      this.drawCustomXAXis({
        format: this.settings.xAxis[this.period],
        height,
        width,
        group: g
      });
    }
    if (this.settings.yAxis) {
      g.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", `translate(0)`)
        .call(
          d3
            .axisLeft(y)
            .ticks(5)
            .tickFormat(d => {
              return this.formatedLabel(d);
            })
        )
        .selectAll(".tick line")
        .attr("x1", () => this.width);
    }
    g.append("text")
      .attr("transform", `translate(${-margin.left / 2}, ${-margin.top / 2})`)
      .attr("class", "bar-label")
      .text(this.settings.label);
    g.append("path")
      .datum(data)
      .attr("fill", `url(#linear${this.id})`)
      .attr("class", "main-path")
      .attr("d", area);

    if (this.settings.rangeControlls && !this.rangeControlls) {
      const rangeControllEl = d3
        .select(this.el.node().parentNode)
        .append("div")
        .attr("class", "chart-range chart");
      rangeControllEl.append("div").attr("class", "chart-type");
      // creating rangeControll Component
      this.rangeControlls = new RangeControlls({
        chart: new Area({
          el: rangeControllEl.node(),
          id: this.settings.id,
          data: this.data,
          nomargin: true
        }),
        el: rangeControllEl,
        byPercent: true
      });
      rangeControllEl
        .node()
        .addEventListener("change", e => this.changeOffset(e));
    }
  }
  resize() {
    super.resize();
    this.draw();
  }
  // method for change intervals by rangeControll component
  changeOffset(e) {
    const direction = e.direction;
    const dateOffset = e.value;
    if (direction === "l") {
      this.leftOffset = dateOffset;
    } else if (direction === "r") {
      this.rightOffset = dateOffset;
    }
    this.draw();
  }
}
