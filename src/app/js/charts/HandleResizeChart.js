import Chart from "./Chart";
import { getPeriod, types } from "../share/getPeriod";
import dateFormat from "../share/formatdate";
class HandleResizeChart extends Chart {
  constructor(settings) {
    super(settings.el, settings.id);
    this.settings = settings;
    this.width = parseFloat(getComputedStyle(settings.el).width);
    this.height = parseFloat(getComputedStyle(settings.el).height);
    this.svg
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewbox", `0 0 ${this.width} ${this.height}`);
    this.URLDelimiter = "-";
    Object.defineProperty(this, "data", {
      get() {
        
        if (this.leftOffset && this.rightOffset) {
          return this._data.filter(item => (new Date(item.date) >= this.leftOffset) && (new Date(item.date) <= this.rightOffset))
        } else if (this.leftOffset) {
          return this._data.filter(item => new Date(item.date) >= this.leftOffset)
        } else if (this.rightOffset) {
          return this._data.filter(item => new Date(item.date) <= this.rightOffset)
        } else {
          return this._data;
        }
      },
      set(data) {
        this._data = data;
        this.draw();
      }
    });
  }
  resize() {
    this.width = parseFloat(getComputedStyle(this.el.node()).width);
    this.height = parseFloat(getComputedStyle(this.el.node()).height);
    this.svg
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewbox", `0 0 ${this.width} ${this.height}`);
    if (this.rangeControlls && this.rangeControlls.chart.resize) {
      this.rangeControlls.chart.resize();
    }
    this.draw();
  }
  dataGet() {
    if (this.settings.baseURL) {
      this.dataMultiSourceInit();
    } else {
      this.dataLocal();
    }
  }
  dataMultiSourceInit() {
    if (this.settings.periods) {
      this.period = this.settings.periods[0].name;
      this.date = this.settings.periods[0].date || new Date();
    } else {
      this.period = types.personal;
      this.date = new Date();
    }

    this.dataCache = {};
    this.formatedPeriod = getPeriod(this.period, this.date, this.URLDelimiter);
    this.currentFormatedPeriod = this.formatedPeriod;
    this.dataMultiSource();
  }
  dataMultiSource() {
    const formatedPeriod = getPeriod(this.period, this.date, this.URLDelimiter);
    if (this.dataCache[this.formatedPeriod]) {
      this.data = this.dataCache[this.formatedPeriod];
    } else {
      this.dataFetch(formatedPeriod);
    }
  }
  dataFetch(period) {
    this.startLoading();
    const fetchURL =
      period && period !== types.personal
        ? this.settings.baseURL + this.URLDelimiter + period + ".json"
        : this.settings.baseURL + ".json";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", fetchURL);
    xhr.send();

    xhr.onreadystatechange = () => {
      // (3)
      if (xhr.readyState != 4) return;

      if (xhr.status != 200) {
        this.showError(xhr.status + ": " + xhr.statusText);
      } else {
        this.endLoading();
        this.dataCache[this.formatedPeriod] = this.dataSort(
          JSON.parse(xhr.responseText).items
        );
        if (this.formatedPeriod === this.currentFormatedPeriod) {
          this.data = this.dataCache[this.formatedPeriod];
        }
      }
    };
  }
  dataSort(data) {
    data.forEach(item => {
      item.frequency = +item.frequency;
      item.label = item.date;
    });
    return data;
  }
  drawCustomXAXis(settings) {
    if (typeof settings !== 'object') return;
    settings.format = settings.format || "default";
    if (!settings.height || !settings.width || !settings.group) return;
    let x = d3
      .scaleBand()
      .rangeRound([0, settings.width])
      .padding(0.2);
    if (settings.format === "default") {
      x.domain(
        this.data.map(function(d) {
          return d.label;
        })
      );
    } else {
      x.domain(
        this.data.map(function(d) {
          return dateFormat(settings.format, d.date);
        })
      );
    }

    settings.group
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + settings.height + ")")
      .call(d3.axisBottom(x));
  }
  removeError() {
    this.el.select(".error").remove();
  }
  showError(e) {
    this.endLoading();
    this.svg.node().innerHTML = "";
    this.svg
      .append("g")
      .attr("class", "error")
      .append("text")
      .attr("x", "50%")
      .attr("y", "50%")
      .attr("text-anchor", "middle")
      .attr("dominant-baseliner", "central")
      .attr("alignment-baseline", "central")
      .text(e);
  }
  startLoading() {
    const g = this.svg.append("g").attr("class", "loading-overlay");
    g.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("x", 0)
      .attr("y", 0)
      .attr("fill", "rgba(0,0,0,0.1)");
    const circle = g
      .append("circle")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", 20)
      .attr("class", "loader");
  }
  endLoading() {
    this.el.selectAll(".loading-overlay").remove();
    this.el.selectAll(".loading-circle").remove();
  }
  formatedValue(v) {
    return (
      (this.settings.valuePrefix || "") +
      parseInt(v).format() +
      (this.settings.valueSuffix || "")
    );
  }
  formatedValueDecimal(v) {
    return (
      (this.settings.valuePrefix || "") +
      parseFloat(v).toFixed(2) +
      (this.settings.valueSuffix || "")
    );
  }
  formatedLabel(v) {
    return (
      (this.settings.labelPrefix || "") +
      parseInt(v).format() +
      (this.settings.labelSuffix || "")
    );
  }
  dataLocal() {
    const dataEl = this.el.node().querySelectorAll(".data .item");
    this.data = dataEl.map(el => {
      return {
        label: el.querySelector(".item__label").innerHTML,
        frequency: +el.querySelector(".item__frequency").innerHTML
      };
    });
    this.el.select(".data").remove();
  }
}
export default HandleResizeChart;
