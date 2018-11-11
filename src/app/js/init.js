import { Widget } from "./Widget";
Number.prototype.format = function() {
  let s = parseInt(this).toString();
  let length = s.length;
  for (let i = length - 1; i >= 0; i--) {
    let diff = length - i;
    if (diff % 3 === 0 && diff != length) {
      s = s.slice(0, i) + "," + s.slice(i);
    }
  }
  return s;
};
HTMLCollection.prototype.map = Array.prototype.map;
NodeList.prototype.map = Array.prototype.map;
HTMLCollection.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.forEach = Array.prototype.forEach;
  
const loader = document.getElementById('loader');
if (loader) loader.remove();

const widget = new Widget("#app");
window.widget = widget;


// const sliderChart = document.querySelectorAll(".chart-slider");
// sliderChart.forEach(slider => {
//   let slides = slider.querySelectorAll(".chart-slider__slide");
//   let header = slider.querySelector(".chart-slider__header");
//   let title = header.querySelector(".chart-slider__title");
//   let current = 0;
//   let next = header.querySelector(".icon-arrow-right");
//   let prev = header.querySelector(".icon-arrow-left");
//   if (slides[current]) slides[current].classList.add("active");
//   next.addEventListener("click", () => {
//     slides[current].classList.remove("active");
//     current++;
//     if (current >= slides.length) current = 0;
//     slides[current].classList.add("active");
//     let newTitle = slides[current].querySelector(".title");
//     if (newTitle) title.innerText = newTitle.textContent;
//   });
//   prev.addEventListener("click", () => {
//     slides[current].classList.remove("active");
//     current--;
//     if (current < 0) current = slides.length - 1;
//     slides[current].classList.add("active");
//     let newTitle = slides[current].querySelector(".title");
//     if (newTitle) title.innerText = newTitle.textContent;
//   });
// });

