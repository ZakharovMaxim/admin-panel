export default class Slider {
  constructor(el) {
    this.el = el;
    this.slidesWrap = this.el.querySelector('.slides');
    this.slides = this.slidesWrap.querySelectorAll('.slide');
    this.next = this.el.querySelector('.slider__next');
    this.prev = this.el.querySelector('.slider__prev');
    this.prev.addEventListener('click', e => this.prevSlide(e));
    this.next.addEventListener('click', e => this.nextSlide(e));
    this.slidesCount = 3;
    this.slideWidth = 100 / this.slides.length;
    this.current = 0;
    this.prev.classList.add('slider__prev-hidden');
    this.draw();
  }
  draw() {
    this.slidesWrap.style.width = 100 / this.slidesCount * this.slides.length + "%";
    this.slides.forEach(slide => {
      slide.style.width = this.slideWidth + '%';
    });

  if(this.slides.length <= this.slidesCount) this.next.classList.add('slider__next-hidden');
  }
  nextSlide(e) {
    this.prev.classList.remove('slider__prev-hidden');
    this.current++;
    this.slidesWrap.style.transform = `translateX(${(this.slideWidth*this.current) * (-1)}%)`;
    if(this.current == this.slides.length - this.slidesCount) {
      this.next.classList.add('slider__next-hidden');
    }
  }
  prevSlide(e) {
    this.next.classList.remove('slider__next-hidden');
    this.current--;
    this.slidesWrap.style.transform = `translateX(${(this.slideWidth*this.current) * (-1)}%)`
    if(this.current == 0) {
      this.prev.classList.add('slider__prev-hidden');
    }
  }
  resize() {
    if(window.innerWidth <= 700) {
      this.slidesCount = 1;
    } else {
      this.slidesCount = 3;
    }
    this.slideWidth = this.slideWidth = 100 / this.slides.length;;
    this.slidesWrap.style.transform = `translateX(${(this.slideWidth*this.current) * (-1)}%)`
    this.draw();
  }
}
