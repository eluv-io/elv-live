import {DateTime} from "luxon";

export const FormatDateString = date => {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL) + " · " +
    DateTime.fromISO(date).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET);
};

export const FormatPriceString = price => {
  const currentLocale = (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
  return new Intl.NumberFormat(currentLocale || "en-US", { style: "currency", currency: price.currency }).format(price.amount);
};
