export default class Table {
  constructor(el) {
    this.table = el;
    this.rows = Array.prototype.slice.call(this.table.querySelectorAll('.tbody .tr'));
    this.order = '';
    this.headers = this.table.querySelectorAll('.thead .th');
    this.headers.forEach(th => {
      th.addEventListener('click', (e) => this.changeSort(e) );
    })
    $(".table .tbody").mCustomScrollbar({
      axis: 'y'
    })
  }
  changeSort(e) {
    if(e.target.classList.contains('header__name')) {
      if(this.table.classList.contains('order-by-name-asc')) {
        this.order = 'order-by-name-desc';
      } else if(this.table.classList.contains('order-by-name-desc')) {
        this.order = 'order-by-name-asc';
      } else {
        this.order = 'order-by-name-asc';
      }
      this.redraw();
    } else if(e.target.classList.contains('header__place')) {
      if(this.table.classList.contains('order-by-place-asc')) {
        this.order = 'order-by-place-desc';
      } else if(this.table.classList.contains('order-by-name-desc')) {
        this.order = 'order-by-place-asc';
      } else {
        this.order = 'order-by-place-asc';
      }
      this.redraw();
    } else if(e.target.classList.contains('header__date')) {
      if(this.table.classList.contains('order-by-date-asc')) {
        this.order = 'order-by-date-desc';
      } else if(this.table.classList.contains('order-by-date-desc')) {
        this.order = 'order-by-date-asc';
      } else {
        this.order = 'order-by-date-asc';
      }
      this.redraw();
    } else if(e.target.classList.contains('header__rate')) {
      if(this.table.classList.contains('order-by-rate-asc')) {
        this.order = 'order-by-rate-desc';
      } else if(this.table.classList.contains('order-by-rate-desc')) {
        this.order = 'order-by-rate-asc';
      } else {
        this.order = 'order-by-rate-asc';
      }
      this.redraw();
    }
    else if(e.target.classList.contains('header__energy')) {
      if(this.table.classList.contains('order-by-energy-asc')) {
        this.order = 'order-by-energy-desc';
      } else if(this.table.classList.contains('order-by-energy-desc')) {
        this.order = 'order-by-energy-asc';
      } else {
        this.order = 'order-by-energy-asc';
      }
      this.redraw();
    }
  }
  redraw() {
    this.table.classList.remove('order-by-rate-asc');
    this.table.classList.remove('order-by-rate-desc');
    this.table.classList.remove('order-by-energy-asc');
    this.table.classList.remove('order-by-energy-desc');
    this.table.classList.remove('order-by-name-asc');
    this.table.classList.remove('order-by-name-desc');
    this.table.classList.remove('order-by-date-asc');
    this.table.classList.remove('order-by-date-desc');
    this.table.classList.remove('order-by-place-asc');
    this.table.classList.remove('order-by-place-desc');
    this.table.classList.add(this.order);
    let sortFunction;
    let regExp = /\//gi;
    switch(this.order) {
      case "order-by-rate-asc" : sortFunction = (a, b) => +a.querySelector('.row__rate').getAttribute('data-rate') - +b.querySelector('.row__rate').getAttribute('data-rate'); break;
      case "order-by-rate-desc" : sortFunction = (a, b) => +b.querySelector('.row__rate').getAttribute('data-rate') - +a.querySelector('.row__rate').getAttribute('data-rate'); break;
      case "order-by-energy-desc" : sortFunction = (a, b) => {
        let val1 = parseInt(a.querySelector('.row__energy').textContent) || 0;
        let val2 = parseInt(b.querySelector('.row__energy').textContent) || 0;
        return  val2 - val1; 
      }; 
        break;
      case "order-by-energy-asc" : sortFunction = (a, b) => {
        let val1 = parseInt(a.querySelector('.row__energy').textContent) || 0;
        let val2 = parseInt(b.querySelector('.row__energy').textContent) || 0;
        return  val1 - val2; 
      }; break;
      case "order-by-date-asc" : sortFunction = (a, b) => {
        let str1 = a.querySelector('.row__date').getAttribute('data-date').replace(regExp, '-');
        let str2 = b.querySelector('.row__date').getAttribute('data-date').replace(regExp, '-');
        if(!str1) {
          str1 = 0;
        } else {
          str1 = str1.split('-').reverse().join('-');
        }
        if(!str2) {
          str2 = 0;
        } else {
          str2 = str2.split('-').reverse().join('-');
        }
        let date1 = new Date(str1);
        let date2 = new Date(str2);
        return date1 - date2;
      }; 
      break;
      case "order-by-date-desc" : sortFunction = (a, b) => {
        let str1 = a.querySelector('.row__date').getAttribute('data-date').replace(regExp, '-');
        let str2 = b.querySelector('.row__date').getAttribute('data-date').replace(regExp, '-');
        if(!str1) {
          str1 = 0;
        } else {
          str1 = str1.split('-').reverse().join('-');
        }
        if(!str2) {
          str2 = 0;
        } else {
          str2 = str2.split('-').reverse().join('-');
        }
        let date1 = new Date(str1);
        let date2 = new Date(str2);
        return date2 - date1;
      };  
      break;

      case "order-by-name-asc" : sortFunction = (a, b) => a.querySelector('.row__name').textContent > b.querySelector('.row__name').textContent ? 1 : a.querySelector('.row__name').textContent < b.querySelector('.row__name').textContent ? -1 : 0; break;
      case "order-by-name-desc" : sortFunction = (a, b) => a.querySelector('.row__name').textContent > b.querySelector('.row__name').textContent ? -1 : a.querySelector('.row__name').textContent < b.querySelector('.row__name').textContent ? 1 : 0; break;

      case "order-by-place-asc" : sortFunction = (a, b) => a.querySelector('.row__place').textContent > b.querySelector('.row__place').textContent ? 1 : a.querySelector('.row__place').textContent < b.querySelector('.row__place').textContent ? -1 : 0; break;
      case "order-by-place-desc" : sortFunction = (a, b) => a.querySelector('.row__place').textContent > b.querySelector('.row__place').textContent ? -1 : a.querySelector('.row__place').textContent < b.querySelector('.row__place').textContent ? 1 : 0; break;

      //default: sortFunction = (a, b) => a == b;
    }
    let body = this.table.querySelector('#mCSB_1_container');
    body.innerHTML = '';
    this.rows.sort(sortFunction);
    this.rows.forEach(item => {
      body.appendChild(item);
    });
  }
}
