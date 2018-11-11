exports.getPeriod =  (period, date, delimiter) => {
  let res = '';
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDate().toString();
  switch (period) {
    case types.year: {
      res = year;
      break;
    }
    case types.month: {
      res = year + delimiter + month;
      break;
    }
    case types.week:
    case types.day: {
      res = year + delimiter + month + delimiter + day;
      break;
    }
    default: res = types.personal
  }
  return res;
}
const types = {
  personal: 'full',
  year: 'year',
  month: 'month',
  week: 'week',
  day: 'day'
}
exports.types = types;