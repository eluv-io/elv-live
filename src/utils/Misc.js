import DayJS from "dayjs";
import DayJSAdvancedFormatting from "dayjs/plugin/advancedFormat";
import DayJSTimezone from "dayjs/plugin/timezone";
DayJS.extend(DayJSTimezone);
DayJS.extend(DayJSAdvancedFormatting);

import moment from "moment-timezone";
import React, {useEffect, useState} from "react";

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
    console.error("Failed to toggle zendesk");
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
      console.log("LOADED");
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
    const add = Math.ceil(diff / (hertz * (duration / 1000)));

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
    <span className={`counter ${className}`}>
      { count }
    </span>
  );
};
