import Month from "../Date.js";
import HandleResizeChart from "./HandleResizeChart.js";
export default class Linear extends HandleResizeChart {
  constructor(settings) {
    super(settings);
    this.dataGet();
  }
  dataSort (data) {
    data.forEach(item => {
      item.frequency = +item.frequency;
      item.date = new Date(item.date);
    });
    return data;
  }
  draw() {
    if (!this.data) return this.showError('No data found');
    this.el.select("svg").node().innerHTML = "";
    const color1 = this.el.select(".chart-type").attr("data-color2") || "#000";
    let svg = this.el.select("svg"),
      margin = { top: 50, right: 80, bottom: 30, left: 50 },
      width = this.width - margin.left - margin.right,
      height = this.height - margin.top - margin.bottom,
      g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var valueline = d3
      .line()
      .x(function(d) {
        d.x = x(d.date);
        return x(d.date);
      })
      .y(function(d) {
        d.y = y(d.x1);
        return y(d.x1);
      });

    x.domain(
      d3.extent(this.data, function(d) {
        return d.date;
      })
    );
    y.domain([
      0,
      d3.max(this.data, function(d) {
        return d.x1;
      })
    ]);
    if (typeof this.settings.xAxis === 'boolean') {
      this.drawCustomXAXis({
        height,
        width,
        group: g
      });
    } else if (typeof this.settings.xAxis === 'object') {
      this.drawCustomXAXis({
        format: this.settings.xAxis[this.period],
        height,
        width,
        group: g
      });
    }
    g.append("path")
      .data([this.data])
      .attr("class", "line")
      .attr("d", valueline)
      .style("stroke", color1)
      .style("stroke-width", 2)
      .style("fill", "none");

    g.append("text")
      .attr("x", -margin.left / 2)
      .attr("y", -margin.top / 2)
      .attr("fill", "#000")
      .attr("class", "chart-label")
      .text(this.label);
    
    if (this.settings.yAxis) {
      g.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", `translate(0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat(d => this.formatedLabel(d))
      );
    }
    if (this.settings.highlightOnHover) {
      this.data.forEach(d => {
        const circleGroup = g.append("g");
        const circle = circleGroup
          .append("circle")
          .attr("cx", d["x"])
          .attr("class", "linear-info-range")
          .attr("data-date", d["date"])
          .attr("data-value", d["x1"])
          .attr("cy", d["y"])
          .attr("r", 10)
          .attr("fill", "#fff")
          .style("opacity", 0);
        let date = new Date(circle.attr("data-date"));
        date =
          date.getDate() +
          "/" +
          Month.getMonthShort(date.getMonth()).toLowerCase() +
          "/" +
          date.getFullYear();
        circle.node().addEventListener("mouseover", e => {
          if (
            e.fromElement.parentNode == e.target.parentNode &&
            e.fromElement.classList.contains("linear-info-highlight")
          )
            return;
          const text = g
            .append("text")
            .attr("class", "linear-text-info")
            .attr("x", +circle.attr("cx") + 5)
            .attr("y", circle.attr("cy") - 25);
          text
            .append("tspan")
            .text(this.formatedValueDecimal(circle.attr("data-value")));
          text
            .append("tspan")
            .attr("y", circle.attr("cy") - 10)
            .attr("x", +circle.attr("cx") + 5)
            .text(date);
          circleGroup
            .append("circle")
            .attr("class", "linear-info-highlight")
            .attr("cx", circle.attr("cx"))
            .attr("cy", circle.attr("cy"))
            .attr("r", 3)
            .attr("fill", "#00556D");
        });
        circle.node().addEventListener("mouseout", e => {
          if (
            e.toElement.parentNode == e.target.parentNode &&
            e.toElement.classList.contains("linear-info-highlight")
          )
            return;
          g.selectAll(".linear-text-info").remove();
          g.selectAll(".linear-info-highlight").remove();
        });
      });
    }
  }
}
