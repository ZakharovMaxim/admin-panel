export default class RangeContolls {
  constructor(settings) {
    this.settings = settings;
    this.chart = settings.chart;
    this.el = settings.el;
    if (!settings || !settings.chart || !settings.el) return;
    this.offset = 25;
    this.init();
  }
  init() {
    const that = this;
    const width = this.el.node().clientWidth;
    const rangeControllContent = this.el.append('div').attr('class', 'chart-control-time chart-type');
    const controlls = rangeControllContent.append('div').attr('class', 'controlls');
    let left = controlls.append('div').attr('class', 'left');
    let right = controlls.append('div').attr('class', 'right');
    const leftHandler = left.append('div').attr('class', 'handler').attr('draggable', false).node();
    const rightHandler = right.append('div').attr('class', 'handler').attr('draggable', false).node();
    left = left.node();
    right = right.node();
    let active = false,
        direction = null,
        lastX = null,
        leftWidth = null,
        rightWidth = null;

    leftHandler.addEventListener('mousedown', (e) => activate(e, 'l'))
    rightHandler.addEventListener('mousedown', (e) => activate(e, 'r'))
    

    function activate (e, _direction) {
      active = true;
      direction = _direction;
      lastX = e.clientX;
      leftWidth = left.clientWidth;
      rightWidth = right.clientWidth;
      window.addEventListener('mouseup', deactivate)
      window.addEventListener('mousemove', mouseMove)
    }
    function deactivate () {
      active = false;
      leftWidth = null;
      rightWidth = null;
      window.removeEventListener('mouseup', deactivate)
      window.removeEventListener('mousemove', mouseMove)
      submit(direction);
      direction = null;
      lastX = null;
    }
    function mouseMove (e) {
      let diff = e.clientX - lastX;
      if (direction === 'l') {
        if (leftWidth + diff + that.offset >= width - right.clientWidth) {
          left.style.width = `${(width - this.offset - rightWidth) / width * 100}%`;
          return 
        }

        if (leftWidth + diff < 0) left.style.width = '0%';
        else if (leftWidth + diff >= width) {
          left.style.width = '100%';
        } else left.style.width = `${(leftWidth + diff) / width * 100}%`;

      } else if (direction === 'r') {
        if (rightWidth - diff + that.offset >= width - left.clientWidth) {
          right.style.width = `${(width - this.offset - leftWidth) / width * 100}%`;
          return;
        }
        if (rightWidth - diff > width) {
          right.style.width = `100%`;
        } else {
          right.style.width = `${(rightWidth - diff) / width * 100}%`;
        }
        
      }
    }
    function submit (direction) {
      that.submit(direction, left.clientWidth, right.clientWidth);
    }
  }
  submit (direction, left, right) {
    if (this.settings.byPercent) {
      let width = direction === 'l' ? left : right;
      const totalWidth = this.el.node().clientWidth;
      const percent = width / totalWidth * 100;
      
      const interval = Math.abs(this.chart.data[0].date - this.chart.data[this.chart.data.length - 1].date) * (1 - percent / 100);
      let dateOffset;
      if (direction === 'r') {
        dateOffset = new Date(+this.chart.data[0].date + interval);
      } else {
        dateOffset = new Date(+this.chart.data[this.chart.data.length - 1].date - interval);
      }
      const event = new Event('change');
      event.direction = direction;
      event.value = dateOffset;
      this.el.node().dispatchEvent(event);
    } else if (this.settings.byClass) {
      let rectXExpect = left;
      const rects = this.el.selectAll(this.settings.byClass).nodes();
      if (direction === 'r') {
        rectXExpect = this.el.node().clientWidth - right;
      }
      let foundRect;
      rects.some(rect => {
        if (+rect.getAttribute('x') >= rectXExpect) foundRect = rect;
        return +rect.getAttribute('x') >= rectXExpect;
      });
      if (!foundRect) {
        foundRect = direction === 'l' ? rects[0] : rects[rects.length - 1];
      }      
      const event = new Event('change');
      event.direction = direction;
      event.value = foundRect.getAttribute('data-dateFull');
      this.el.node().dispatchEvent(event);
    }
  }
}
