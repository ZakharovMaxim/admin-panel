export default (format, dateStr) => {
  const realDate = new Date(dateStr);
  const year = realDate.getFullYear();
  const yearShort = year.toString().slice(2);
  const month = realDate.getMonth();
  const day = realDate.getDate();
  let resultDate = "";
  switch (format) {
    case "mmm yy":
      resultDate = monthes[month].slice(0, 3) + " " + yearShort;
      break;
    case "mmm":
      resultDate = monthes[month].slice(0, 3);
      break;
      case "dd/mm":
      resultDate = day + '/' + monthes[month].slice(0, 3);
      break;
    default:
      resultDate = monthes[month].slice(0, 3) + "/" + yearShort;
  }
  return resultDate;
};
const monthes = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "jule",
  "august",
  "september",
  "october",
  "november",
  "december"
];
