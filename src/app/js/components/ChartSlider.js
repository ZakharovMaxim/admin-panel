export default class ChartSlider {
  constructor (el) {
    this.slides = el.getElementsByClassName('chart-slider__slide').map(slide => {
      let title = slide.getElementsByClassName('title')[0];
      title = title ? title.innerHTML : 'Chart';
      return {
        title,
        slide
      }
    });
    if (this.slides.length < 2) return;
    this.length = this.slides.length;
    this.activeSlide = 0;
    this.slides[this.activeSlide].slide.classList.add('active');
    this.header = el.getElementsByClassName('chart-slider__title')[0];
    this.prev = el.getElementsByClassName('chart-slider__prev')[0];
    this.next = el.getElementsByClassName('chart-slider__next')[0];
    if (this.prev) this.prev.addEventListener('click', () => this.prevSlide())
    if (this.next) this.next.addEventListener('click', () => this.nextSlide())
  }
  prevSlide () {
    this.slides[this.activeSlide].slide.classList.remove('active');
    this.activeSlide--;
    if (this.activeSlide < 0) this.activeSlide = this.length - 1;
    this.slides[this.activeSlide].slide.classList.add('active');
    this.setHeader(this.slides[this.activeSlide].title);
  }
  nextSlide () {
    this.slides[this.activeSlide].slide.classList.remove('active');
    this.activeSlide++;
    if (this.activeSlide >= this.length) this.activeSlide = 0;
    this.slides[this.activeSlide].slide.classList.add('active');
    this.setHeader(this.slides[this.activeSlide].title);
  }
  setHeader (text) {
    if (!this.header) return;
    this.header.textContent = text;
  }
}