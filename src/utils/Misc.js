import DayJS from "dayjs";
import DayJSAdvancedFormatting from "dayjs/plugin/advancedFormat";
import DayJSTimezone from "dayjs/plugin/timezone";
DayJS.extend(DayJSTimezone);
DayJS.extend(DayJSAdvancedFormatting);

import moment from "moment-timezone";
import React, {useEffect, useState} from "react";

export const LocalizeString = (text="", variables={}, options={stringOnly: false}) => {
  let result = text
    .split(/{(\w+)}/)
    .filter(s => s)
    .map(token => typeof variables[token] !== "undefined" ? variables[token] : token);

  if(options.stringOnly) {
    return result.join("");
  }

  return (
    <>
      {result}
    </>
  );
};


const ParseDate = date => {
  try {
    return new Date(date);
  // eslint-disable-next-line no-empty
  } catch(error) {}
};

export const DateStatus = (start_date, end_date) => {
  start_date = ParseDate(start_date);
  end_date = ParseDate(end_date);

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  new Date(yesterday.toISOString().split("T")[0]);

  let today = new Date();
  new Date(today.toISOString().split("T")[0]);

  const now = new Date();

  return {
    start_date: start_date,
    end_date: end_date,
    ongoing: start_date <= now && (!end_date || end_date >= today),
    past: end_date && end_date < yesterday
  };
};

export const FormatDateString = (date, dateOnly=false, timeOnly=false, shortDate=false) => {
  if(!date) { return ""; }

  const zoneAbbreviation = moment(date).tz(moment.tz.guess()).format("z");

  try {
    if(dateOnly) {
      return DayJS(date).format("MMMM D, YYYY");
    } else if(timeOnly) {
      return `${DayJS(date).format("h:mm A")} ${zoneAbbreviation}`;
    } else if(shortDate) {
      return DayJS(date).format("M/D");
    } else {
      return `${DayJS(date).format("MMMM D, YYYY · h:mm A")} ${zoneAbbreviation}`;
    }
  } catch(error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to parse date ${date}`);
    // eslint-disable-next-line no-console
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

export const IsIOSSafari = () => {
  return (
    navigator.userAgent.match(/Safari/i) &&
    (
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/iOS/i)
    )
  );
};

export const ToggleZendesk = (enabled) => {
  if(enabled) {
    document.body.classList.remove("hide-zd");
  } else {
    document.body.classList.add("hide-zd");
  }

  if(typeof zE === "undefined") { return; }

  try {
    enabled ? zE.show() : zE.hide();
  } catch(error) {
    // eslint-disable-next-line no-console
    console.error("Failed to toggle zendesk");
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export const Copy = (text) => {
  let aux = document.createElement("input");
  aux.setAttribute("value", text || "");
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
};

export const LoadHubspotForm = async () => {
  if(window.__hubspotLoaded) { return; }

  window.__hubspotLoaded = true;

  await new Promise(resolve => {
    const script = document.createElement("script");
    script.setAttribute("src", "https://js.hsforms.net/forms/v2.js");
    script.setAttribute("type", "text/javascript");
    script.addEventListener("load", () => {
      resolve();
    });

    script.async = true;
    document.head.appendChild(script);
  });
};

export const Counter = ({to, duration=1000, className=""}) => {
  to = to || 0;

  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(0);
  const [counterInterval, setCounterInterval] = useState(undefined);

  const hertz = 30;

  const Start = () => {
    if(to === target) { return; }

    clearInterval(counterInterval);

    setTarget(to);

    const diff = to - count;
    let add = diff / (hertz * (duration / 1000));
    add = add > 0 ? Math.max(add, 0.5) : Math.min(add, -0.5);

    let newCount = count;
    let interval;
    interval = setInterval(
      () => {
        newCount = add > 0 ? Math.min(to, newCount + add) : Math.max(to, newCount + add);
        setCount(newCount);

        if(add > 0 && newCount >= to || add < 0 && newCount <= to) {
          clearInterval(interval);
        }
      }, (1 / hertz * 1000));

    setCounterInterval(interval);
  };

  useEffect(() => {
    Start();
  });

  return (
    <span className={`counter ${className}`} key={`counter-${to}`}>
      { Math.floor(count) }
    </span>
  );
};
