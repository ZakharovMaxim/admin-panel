import CircleChart from "./Circle.js";
import LinearChart from "./Linear.js";
import AreaChart from "./Area.js";
import PieChart from "./Pie.js";
import BarChart from "./Bar.js";
import BarChartComplex from "./BarComplex.js";
import {types} from '../share/getPeriod'
export default function init (chartsNodes) {
  const charts = [];
  chartsNodes.forEach((chart, index) => {
    let type = chart.querySelector(".chart-type");
    if (type.classList.contains("chart-progress-part")) {
      charts.push(new CircleChart({
        el: chart,
        percent: chart.getAttribute('data-percent'),
        partical: true,
        id: index,
        shadow: true,
        gap: 20,
        label: [
          {
            value: chart.getAttribute('data-value'),
            position: {
              x: 'center',
              y: 'center'
            }
          },
          {
            value: chart.getAttribute('data-total'),
            position: {
              x: 'center',
              y: 'border'
            }
          }
        ],
        colors: [chart.getAttribute('data-color2'), chart.getAttribute('data-color1')]
      }));
    }
    if (type.classList.contains("chart-progress")) {
      const percent = chart.getAttribute('data-percent');
      const settings = {
        id: index,
        el: chart,
        percent,
        triangle: true,
        label: {
          suffix: "%",
          value: percent,
          position: {
            x: "center",
            y: "center"
          }
        },
        colors: [chart.getAttribute('data-color1'), chart.getAttribute('data-color2')]
      };
      if (chart.id === 'chart-3') {
        settings.triangle = false;
        settings.label.suffix = null;
        settings.label.value = chart.getAttribute('data-value');
        settings.colors.push(chart.getAttribute('data-color3'),chart.getAttribute('data-color4'),chart.getAttribute('data-color5'),chart.getAttribute('data-color6'),chart.getAttribute('data-color7'))
      }
      if (chart.id === 'chart-5' || chart.id === 'chart-7') {
        settings.label = [{
          suffix: 'kWh',
          value: chart.getAttribute('data-value'),
          position: {
            x: "center",
            y: "center"
          }
        },{
          suffix: 'kWh',
          value: chart.getAttribute('data-total'),
          position: {
            x: "center",
            y: "bottom"
          }
        }]
      }
      charts.push(new CircleChart(settings));
    }
    // if (type.classList.contains("chart-progress-part")) {
    //   charts.push(new CircleChartPart(chart, index));
    // }
    if (type.classList.contains("chart-pie")) {
      charts.push(new PieChart({
        el: chart,
        id: index,
        data: chart.getAttribute('data-data'),
        colors: [
          {
            c1: "#00C3C1",
            c2: "#00FBD0"
           },
           {
            c1: "#FCD299",
            c2: "#FCD299"
           },
           {
            c1: "#ff9933",
            c2: "#FF7F00"
           }
        ]
      }));
    }
    if (type.classList.contains("chart-bar")) {
      const settings = {
        el: chart,
        id: index,
        xAxis: true,
        yAxis: true,
        highlightOnHover: true
      };
      if (chart.id === 'chart-8' || chart.id === 'chart-6') {
        settings.highlightLast = true;
      }
      charts.push(new BarChart(settings));
    }
    if (type.classList.contains("chart-bar-complex")) {
      const settings = {
        el: chart,
        id: index,
        baseURL: chart.getAttribute('data-datasource-url'),
        xAxis: true,
        yAxis: true,
        highlightOnHover: true
      }
      if (chart.id === 'chart-13') {
        settings.periods = [
          {
            name: types.year
          }
        ];
        settings.xAxis = {
          [types.year]: 'mmm yy'
        }
      }
      if (chart.id === 'chart-9') {
        settings.rangeControlls = true;
        settings.xAxis = {
          [types.personal]: 'mmm yy'
        }
      }
      charts.push(new BarChartComplex(settings));
    }
    if (type.classList.contains("chart-linear")) {
      charts.push(new LinearChart({
        el: chart,
        id: index,
        xAxis: {
          [types.year]: 'mmm'
        },
        yAxis: true,
        highlightOnHover: true,
        baseURL: chart.getAttribute('data-datasource-url'),
        periods: [
          {
            name: types.year
          }
        ]
      }));
    }
    if (type.classList.contains("chart-area")) {
      charts.push(new AreaChart({
        el: chart,
        id: index,
        rangeControlls: true,
        baseURL: chart.getAttribute('data-datasource-url'),
        periods: [
          {
            name: types.month
          }
        ],
        yAxis: true,
        xAxis: {
          [types.month]: 'dd/mm'
        }
      }));
    }
    // if (type.classList.contains("chart-histogram")) {
    //   charts.push(new HistogramChart(chart, index));
    // }
  });
  window.addEventListener('resize', () => {
    charts.forEach(chart => {
      if (chart.resize) chart.resize();
    })
  })
  return charts;
}