import React, {useState, useEffect} from "react";
import {observer, inject} from "mobx-react";

const CookieBanner = inject("siteStore")(observer(({siteStore}) => {
  const [setting, setSetting] = useState(localStorage.getItem("cookie-setting"));

  const SetCookiePermissions = setting => {
    setSetting(setting);
    localStorage.setItem("cookie-setting", setting);
  };

  const required = siteStore.currentSiteInfo.event_info && siteStore.currentSiteInfo.event_info.show_cookie_banner;

  useEffect(() => {
    // Required may be undefined, do not load unless it is specifically false
    if(setting || required === false) {
      siteStore.LoadCookieDependentItems(setting === "allow" || required === false);
    }
  }, [setting]);

  if(typeof required === "undefined" || required === false || setting) { return null; }

  return (
    <div className="cookie-banner">
      <div className="cookie-banner__message">
        This site uses cookies to help us provide the best possible experience
      </div>
      <div className="cookie-banner__actions">
        <button className="cookie-banner__action cookie-banner__action-allow" onClick={() => SetCookiePermissions("allow")}>
          Accept All
        </button>
        <button className="cookie-banner__action cookie-banner__action-reject" onClick={() => SetCookiePermissions("reject")}>
          Essential Only
        </button>
      </div>
    </div>
  );
}));

export default CookieBanner;
