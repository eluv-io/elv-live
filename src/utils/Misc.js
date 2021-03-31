import DayJS from "dayjs";
import DayJSAdvancedFormatting from "dayjs/plugin/advancedFormat";
import DayJSTimezone from "dayjs/plugin/timezone";
DayJS.extend(DayJSTimezone);
DayJS.extend(DayJSAdvancedFormatting);

export const FormatDateString = (date, dateOnly=false, timeOnly=false) => {
  if(!date) { return ""; }

  const zoneAbbreviation = new Date().toLocaleString("en", { timeZoneName: "short" }).split(" ").pop() || "";
  try {
    if(dateOnly) {
      return DayJS(date).format("MMMM D, YYYY");
    } else if(timeOnly) {
      return `${DayJS(date).format("h:mm A")} ${zoneAbbreviation}`;
    } else {
      return `${DayJS(date).format("MMMM D, YYYY · h:mm A")} ${zoneAbbreviation}`;
    }
  } catch(error) {
    // TODO: Central error reporting
    console.error(`Failed to parse date ${date}`);
    console.error(date);

    return "";
  }
};

export const ValidEmail = email => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(email);
};

export const onEnterPressed = (fn) => {
  return (event) => {
    if(event.key && event.key.toLowerCase() !== "enter") {
      return;
    }

    fn(event);
  };
};
