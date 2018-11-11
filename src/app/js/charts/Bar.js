import HandleResizeChart from "./HandleResizeChart.js";
export default class Bar extends HandleResizeChart {
  constructor(settings) {
    super(settings);
    if (!settings.data) this.dataGet();
    else {
      this.data = settings.data;
    }
  }
  dataSort() {
    this.data.forEach(item => {
      item.frequency = parseInt(item.frequency);
    });
    this.draw();
  }
  draw() {
    let svg = this.svg,
      margin = this.settings.nomargin ? {top: 0, right: 0, left: 0, bottom: 0} : { top: 40, right: 20, bottom: 30, left: 90 },
      width = this.width - margin.left - margin.right,
      height = this.height - margin.top - margin.bottom;
    svg.node().innerHTML = "";
    if (height <= 0 || width <= 0) return;
    let defs = `<defs><linearGradient id="linear${
      this.id
    }" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stop-color="${this.settings.color1 || "#00FFD2"}"></stop>
        <stop offset="100%" stop-color="${this.settings.color2 || "#00948E"}"></stop>
      </linearGradient>
      <filter id="lightShadow" x="-5" y="-5" width="${width}" height="${height}">
        <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#fff" flood-opacity="1" />
      </filter></defs>`;
    svg.node().innerHTML = defs;
    let x = d3
        .scaleBand()
        .rangeRound([0, width])
        .padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);
    let g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    x.domain(
      this.data.map(function(d) {
        return d.label;
      })
    );
    y.domain([
      0,
      d3.max(this.data, function(d) {
        return d.frequency;
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
      .attr("x1", () => (this.showAxisY ? this.width : 0));
    }
    if (this.settings.label) {
      g.append("text")
      .attr("x", 0)
      .attr("y", -margin.top / 2)
      // .attr('text-anchor', "end")
      // .attr('dominant-baseliner', "central")
      // .attr('alignment-baseline', "central")
      .attr("class", "bar-label")
      .text(this.settings.label);
    }
    g.selectAll(".bar")
      .data(this.data)
      .enter()
      .append("g")
      .attr("class", "bar-wrapper")
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.label);
      })
      .attr("y", function(d) {
        return y(d.frequency);
      })
      .attr("data-dateFull", function(d) {
        return d.date;
      })
      .attr("data-label", function(d) {
        return d.label;
      })
      .attr("fq", d => {
        return d.frequency;
      })
      .attr("fill", `url(#linear${this.id})`)
      .attr("width", x.bandwidth())
      .attr("height", function(d) {
        return height - y(d.frequency) >= 0 ? height - y(d.frequency) : 0;
      });
    if (this.settings.highlightLast) {
      g.select('.bar-wrapper:last-child rect')
        .attr("filter", d => {
        if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
          return `url(#lightShadow)`;
        } else {
          return "";
        }
      });
      let lastEl = g.node().querySelector(".bar-wrapper:last-child rect");
      if (lastEl) {
        let max = {
          x: +lastEl.getAttribute("x"),
          element: lastEl,
          y: 0,
          value: this.data[this.data.length - 1].frequency
        };
        let group = d3.select(max.element.parentNode);
        let text = group
          .append("g")
          .append("text")
          .attr("text-anchor", "end")
          .attr("dominant-baseliner", "central")
          .attr("alignment-baseline", "central");
        text
          .append("tspan")
          .attr("class", "chart-max-value")
          .text(this.formatedValue(max.value));

        text
          .append("tspan")
          .attr("class", "chart-max-label")
          .text(this.valueSuffix);
        text.attr("x", max.x + x.bandwidth()).attr("y", max.y - 10);
      }
    }

    if (this.settings.highlightOnHover) {
      let rects = g.node().querySelectorAll(".bar-wrapper");
      for (let i = 0; i < rects.length; i++) {
        let wrapper = d3.select(rects[i]);
        let rect = wrapper.select("rect");

        rects[i].addEventListener("mouseover", e => {
          if (rects.length - 1 == i) return;
          let text = svg.select("text.bar-hover-label");
          if (!text.node()) {
            text = svg
              .select("g")
              .append("text")
              .attr("class", "bar-hover-label active bar-hover-label")
              .attr("x", +rect.attr("x") + +rect.attr("width") / 2)
              .attr("y", rect.attr("y") - 25);
            text
              .attr("text-anchor", "middle")
              .attr("dominant-baseliner", "central")
              .attr("alignment-baseline", "central");
            text
              .append("tspan")
              .text("Value: " + this.formatedValue(rect.attr("fq")));
            let dateFormated = rect.attr("data-label");
            if (dateFormated) {
              text
                .append("tspan")
                .attr("y", rect.attr("y") - 10)
                .attr("x", +rect.attr("x") + +rect.attr("width") / 2)
                .text("Date: " + dateFormated);
            }
          }
        });
        rects[i].addEventListener("mouseout", e => {
          g.select(".bar-hover-label").remove();
        });
      }
    }
  }
}
