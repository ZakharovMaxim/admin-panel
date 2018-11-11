import Tab from "./components/Tab.js";
import initCharts from "./charts/index";
import Table from "./components/Table.js";
import Map from "./components/Map";
import AutoComplete from "./components/AutoComplete";
import ChartSlider from "./components/ChartSlider";

export class Widget {
  constructor(selector) {
    this.widget = document.querySelector(selector);
    this.data = [];
    Object.defineProperty(this, "menuState", {
      get() {
        return this._menuState;
      },
      set(value) {
        this._menuState = value;
        if (value === "close") {
          this.addMenuClass("hidden-menu");
        } else if (value === "collapse") {
          this.addMenuClass("collapsed-menu");
        } else {
          this.addMenuClass("");
        }
        return true;
      }
    });
    this.init();

  }
  addMenuClass(className) {
    if (className) {
      if (className === "hidden-menu") {
        this.widget.classList.remove("collapsed-menu");
        this.widget.classList.add(className);
      } else if (className === "collapsed-menu") {
        this.widget.classList.add(className);
        this.widget.classList.remove("hidden-menu");
      }
    } else {
      this.widget.classList.remove("collapsed-menu");
      this.widget.classList.remove("hidden-menu");
    }
  }
  init() {
    this.setCharts();
    this.setTabs();
    if (this.widget.classList.contains("collapsed-menu")) {
      this.menuState = "collapse";
    }
    this.$("nav .toggle-menu").addEventListener("click", () => {
      if (this.menuState === "collapse") {
        this.menuState = "open";
      } else {
        this.menuState = "collapse";
      }
    });
    if (this.$(".table")) {
      this.table = new Table(this.$(".table"));
    }
        let xhr = new XMLHttpRequest();
        let url = this.widget.getAttribute("data-data") || "/plants.json";
        xhr.open("GET", url, true);
        xhr.send();

        xhr.onreadystatechange = () => {
          // (3)
          if (xhr.readyState != 4) return;
          if (xhr.status != 200) {
            console.log(xhr.status + ": " + xhr.statusText);
          } else {
            this.data = JSON.parse(xhr.responseText).plants;
          }
          if (this.$("#map")) {
            this.Map = new Map(
              {
                lat: 22.7074802,
                lng: -102.1146548
              },
              this.data
            );
          }
          this.autoComplete();
        };
    
    const slides = this.selectAll(".chart-slider");
    if (slides.length) {
      slides.forEach(slide => {
        new ChartSlider(slide);
      });
    }
    this.popup();
  }
  autoComplete () {
    this.selectAll('.autocomplete').forEach(input => new AutoComplete(input, this.data))
  }
  setTabs() {
    let tab = this.$(".tab-wrapper");
    if (tab) {
      this.tab = new Tab(tab, this.widget);
      let hash = window.location.hash;
      hash = hash.replace("#", "");
      if (hash) {
        this.tab.changeTab(hash);
      }
    }
  }
  setCharts() {
    const charts = this.selectAll(".chart");
    if (charts.length) initCharts(charts);
  }
  getChartById(id) {
    return this.charts.find(c => c.el.attr("id") == id);
  }
  select(s) {
    return this.widget.querySelector(s);
  }
  selectAll(s) {
    return this.widget.querySelectorAll(s);
  }
  $(s) {
    return this.select(s);
  }
  popup() {
    const popup = this.$(".popup");
    if (!popup) return;
    const trigger = this.$(".presentacion");
    if (!trigger) return;
    trigger.addEventListener("click", (e) => {
      if (e.target.classList.contains('close')) {
        trigger.classList.remove('close');
        this.presentationModeEnd();
      } else {
        popup.classList.add("active");
      }
    });
    popup.addEventListener("click", function(e) {
      if (e.target === this || e.target.classList.contains("icon-close"))
        popup.classList.remove("active");
    });
    const form = this.$('#startPresentacion');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const tabs = [];
      let delay;
      for(let i = 0; i < form.length; i++) {
        if (form[i].type === 'checkbox') {
          if (form[i].checked) tabs.push(form[i].name);
        } else if (form[i].name === 'delay') {
          delay = form[i].value;
        }
      }
      if (!delay || tabs.length < 2) {
        const error = document.createElement('DIV');
        error.classList.add('error');
        error.textContent = !delay ? 'Input delay value' : 'Select slides to show';
        e.target.appendChild(error);
        return;
      }
      popup.classList.remove("active");
      trigger.classList.add('close');
      this.presentationModeStart(tabs, delay);
      
    })
  }
  presentationModeStart (tabs, delay) {
    this.tab.presentationModeStart(tabs, delay * 1000);
    this.openFullScreen();
  }
  presentationModeEnd() {
    this.tab.presentationModeEnd();
    this.cancelFullScreen();
  }
  openFullScreen(elem = document.documentElement) {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (
      (document.fullScreenElement !== undefined &&
        document.fullScreenElement === null) ||
      (document.msFullscreenElement !== undefined &&
        document.msFullscreenElement === null) ||
      (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
      (document.webkitIsFullScreen !== undefined &&
        !document.webkitIsFullScreen)
    ) {
      if (elem.requestFullScreen) {
        elem.requestFullScreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }
  }
  cancelFullScreen(elem = document) {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (
      (document.fullScreenElement !== undefined &&
        document.fullScreenElement === null) ||
      (document.msFullscreenElement !== undefined &&
        document.msFullscreenElement === null) ||
      (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
      (document.webkitIsFullScreen !== undefined &&
        !document.webkitIsFullScreen)
    ) {
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
}
