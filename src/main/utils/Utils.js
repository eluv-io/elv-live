const DateOrdinal = date => date + (date > 0 ? ["th", "st", "nd", "rd"][(date > 3 && date < 21) || date % 10 > 3 ? 0 : date % 10] : "");

export const FormatDate = date => {
  date = new Date(date);
  return `${date.toLocaleString("default", { month: "long" })} ${DateOrdinal(date.getDate())}, ${date.getFullYear()}`;
};
