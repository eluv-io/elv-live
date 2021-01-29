import {DateTime} from "luxon";

export const FormatDateString = date => {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL) + " · " +
    DateTime.fromISO(date).toLocaleString({hour: "numeric", minute: "numeric", timeZoneName: "short"});
};

export const FormatPriceString = price => {
  const currentLocale = (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
  return new Intl.NumberFormat(currentLocale || "en-US", { style: "currency", currency: price.currency }).format(parseFloat(price.amount));
};

export const ValidEmail = email => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(email);
};
