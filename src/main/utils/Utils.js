import {useEffect, useRef} from "react";

const DateOrdinal = date => date + (date > 0 ? ["th", "st", "nd", "rd"][(date > 3 && date < 21) || date % 10 > 3 ? 0 : date % 10] : "");

export const FormatDate = date => {
  date = new Date(date);
  return `${date.toLocaleString("default", { month: "long" })} ${DateOrdinal(date.getDate())}, ${date.getFullYear()}`;
};

export const FormatCurrency = ({number, locale = "en-US", currency = "USD", maximumFractionDigits = 8}) => {
  const options = {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits
  };

  return new Intl.NumberFormat(locale, options).format(number);
};

export const useCombinedRefs = (...refs) => {
  const targetRef = useRef();

  useEffect(() => {
    refs.forEach(ref => {
      if(!ref) return;

      if(typeof ref === "function") {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};
