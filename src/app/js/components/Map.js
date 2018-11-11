export default class Map {
  constructor (center, data) {
    this.center = center;
    this.markers = [];
    this.whitePinUrl = "/public/images/icons/white_geo.png";
    this.bluePinUrl = "/public/images/icons/primary_geo.png";
    this.data = data;
    this.drawMap();
  }
  drawPins() {
    let places = this.data;
    if (!places) return;
    places.forEach(place => {
      const image = !place.status
        ? { url: this.whitePinUrl }
        : { url: this.bluePinUrl };
      image.size = new google.maps.Size(25, 35);
      //image.origin = new google.maps.Point(0, 0);
      //image.anchor = new google.maps.Point(0, 0);
      image.scaledSize = new google.maps.Size(25, 35);
      let list = "";
      if (place.list) {
        list += "<ul>";
        place.list.forEach(i => {
          list += `<li>${i}</li>`;
        });
        list += "</ul>";
      }
      let marker = new google.maps.Marker({
        position: { lat: place.latitude, lng: place.longitude },
        map: this.map,
        icon: image,
        title: place.name,
        status: place.status,
        href: place.href,
        list: list,
        total: place.total
      });
      marker.addListener("click", () => this.showInfoMap(marker));
      this.markers.push(marker);
    });
    this.mapFilter();
  }
  drawMap () {
    this.map = new google.maps.Map(
      document.querySelector("#map .map__content"),
      {
        center: this.center,
        zoom: 6,
        gestureHandling: "cooperative",
        streetViewControl: false,
        clickableIcons: false,
        fullscreenControl: false
      }
    );
    const zoomControl = document.createElement("div");
    zoomControl.classList.add("zoomControl");
    zoomControl.insertAdjacentHTML(
      "afterbegin",
      `
      <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="23.5" cy="23.5" r="22.5" stroke="#757474" stroke-width="2"/>
        <circle cx="12.5" cy="12.5" r="12.5" transform="translate(11 11)" fill="#757474"/>
      </svg>
    `
    );
    zoomControl.addEventListener("click", () => {
      this.map.setCenter(this.center);
      this.map.setZoom(6);
    });
    zoomControl.index = 1;
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControl);
    this.createInfoMap();
    this.drawPins();
  }
  createInfoMap(e) {
    let html = `<div class="info-message">
                    <div class="info-message__content">
                      <div class="title-info"></div>
                      <div class="list">
                      </div>
                      `;
    html += `<div class="total"><span class="number"></span>kWp</div>`;
    html += `<div class="link"><a href="#"><span class="icon-arrow-right"></span></a></div>
              <div class="bottom">
                <div class="part-1">
                  <div></div>
                </div>
                <div class="part-2">
                <div></div>
                </div>
              </div>
            </div>
          </div>`;
    const infowindow = new google.maps.InfoWindow({
      content: html
    });
    this.infoMap = infowindow;
    infowindow.open(this.map, null);
  }
  mapFilter(filterTitle = "") {
    let filter = {
      activos: 1,
      proceso: 1
    };
    filter.title = filterTitle;
      const checkboxes = document.querySelectorAll(".state .checkbox");
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener("click", () => {
          let input = checkbox.parentNode.querySelector("input");
          if (filter[input.name] !== "undefined") {
            filter[input.name] = +input.checked;
            this.mapFilterApply(filter);
          }
        });
      });
      let inputs = document.querySelectorAll(".map__control input");
      inputs.forEach(input => {
        if (input.type.toLowerCase() === "text") {
          input.addEventListener("keyup", () => {
            filter.title = input.value;
            this.mapFilterApply(filter);
          });
          input.addEventListener("change", () => {
            filter.title = input.value;
            this.mapFilterApply(filter);
          });
        } else {
          input.addEventListener("change", () => {
            if (filter[input.name] !== "undefined") {
              filter[input.name] = +input.checked;
              this.mapFilterApply(filter);
            }
          });
        }
      });
    this.mapFilterApply(filter);
  }
  mapFilterApply(filter) {
    function markerActive(marker) {
      // if(!marker.status) marker.icon.url = that.whitePinUrl;
      // else marker.icon.url = that.bluePinUrl;
      // marker.setZIndex(500);
      marker.visible = 1;
    }
    function markerDeActive(marker) {
      // if(!marker.status) marker.icon.url = that.whitePinUrl;
      // else marker.icon.url = that.bluePinUrl;
      // marker.setZIndex(100);
      marker.visible = 0;
    }
    this.markers.forEach(marker => {
      if (!marker.status) {
        if (filter.activos && ~marker.title.indexOf(filter.title)) {
          marker.visible = 1;
        } else {
          marker.visible = 0;
        }
        
      } else {
        
        if (filter.proceso && ~marker.title.indexOf(filter.title)) {
          marker.visible = 1;
        } else {
          marker.visible = 0;
        }
      }
    });
    google.maps.event.trigger(this.map, "resize");
    this.map.setZoom(this.map.getZoom() - 2);
    this.map.setZoom(this.map.getZoom() + 2);
    
  }
  showInfoMap(e) {
    this.infoMap.open(this.map, e);
    this.infoMapParent = this.$(".gm-style-iw").parentNode;
    this.infoMapParent.style.opacity = "0";
    this.$(".info-message .title-info").innerText = e.title;
    if (!e.total) {
      this.$(".info-message .total").style.display = "none";
    } else {
      this.$(".info-message .total").style.display = "block";
      this.$(".info-message .total .number").innerText = e.total;
    }
    this.$(".info-message .list").innerHTML = e.list;
    if (!e.href) {
      this.$(".info-message .link a").style.display = "none";
    } else {
      this.$(".info-message .link a").href = e.href;
      this.$(".info-message .link a").style.display = "block";
    }
    setTimeout(() => (this.infoMapParent.style.opacity = 1), 100);
  }
  $ (selector) {
    return document.querySelector(selector) || document.createElement('SPAN');
  }
}