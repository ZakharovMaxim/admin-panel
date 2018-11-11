const date = {
  month: ['Enero', 'Febrero', 'Marzo', 'Abril','Mayo','Junio','Julio','Agosto','Septriembre','Octubre','Noviembre','Diciembre'],
  getMonth(n) {
    return this.month[n];
  },
  getMonthShort(n) {
    return this.month[n] ? this.month[n].slice(0, 3) : '';
  },
  getAllMonthShort(n) {
    return this.month.map(m => m.toLowerCase().slice(0,3));
  },
  getMonthNumber(short) {
    let index = 0;
    this.month.forEach((d, i) => {
      if(d.toLowerCase().slice(0, 3) == short) index = i;
    });
    return index;
  }
};
export default date;
