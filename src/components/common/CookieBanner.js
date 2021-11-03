import React, {useState, useEffect} from "react";
import {observer, inject} from "mobx-react";
import Modal from "Common/Modal";

import Logo from "Assets/images/logo/eluvio-logo.svg";
import ImageIcon from "Common/ImageIcon";

const Switch = ({value, onChange}) => {
  return (
    <button className={`switch ${value ? "switch-active" : ""}`} onClick={() => onChange(!value)}>
      <div className="switch__slider" />
    </button>
  );
};

const CookieDetails = ({SetPreferences, Close}) => {
  const [analytics, setAnalytics] = useState(true);
  const [functional, setFunctional] = useState(true);

  const Done = () => {
    SetPreferences({
      required: true,
      analytics,
      functional
    });

    Close();
  };

  return (
    <Modal className="cookie-details-modal" Toggle={Close}>
      <div className="cookie-details">
        <div className="cookie-details__header">
          <ImageIcon
            icon={Logo}
            className="cookie-details__logo"
            alt="Eluvio"
          />
        </div>
        <div className="cookie-details__section">
          <h2 className="cookie-details__section__header">
            Cookie Preferences
          </h2>
          <div className="cookie-details__section__text">
            When you visit our website, we store cookies in your browser to collect information. The information collected might relate to you, your preferences or your device, and is mostly used to make the site work as expected and to provide a more personalized experience. You can choose not to allow certain types of cookies, which may impact your experience on the site and the services we are able to offer. You cannot opt out of our first-party strictly necessary cookies as they are necessary for the proper functioning of the site, such as authorization.
          </div>
        </div>
        <button
          onClick={() => {
            setAnalytics(true);
            setFunctional(true);
            Done();
          }}
          className="cookie-details__button"
        >
          Allow All
        </button>
        <br />
        <div className="cookie-details__section">
          <h2 className="cookie-details__section__header">
            Required
          </h2>
          <div className="cookie-details__section__text">
            These cookies are necessary for the website to function and may not be disabled. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences or authenticating. These cookies do not store any personally identifiable information.
          </div>
        </div>
        <div className="cookie-details__section">
          <h2 className="cookie-details__section__header">
            Functional
            <Switch value={functional} onChange={option => setFunctional(option)} />
          </h2>
          <div className="cookie-details__section__text">
            These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use on the site. If you do not allow these cookies then some or all of the services may not function properly.
          </div>
        </div>
        <div className="cookie-details__section">
          <h2 className="cookie-details__section__header">
            Analytics
            <Switch value={analytics} onChange={option => setAnalytics(option)} />
          </h2>
          <div className="cookie-details__section__text">
            Both Eluvio and our partners may use analytics cookies to understand how you use our site and to help us improve our offerings.
          </div>
        </div>
        <button onClick={Done} className="cookie-details__button">
          Save Preferences
        </button>
      </div>
    </Modal>
  );
};

const CookieBanner = inject("siteStore")(observer(({siteStore}) => {
  let currentSettings = localStorage.getItem("cookie-setting");
  if(currentSettings) {
    try {
      currentSettings = JSON.parse(currentSettings);
    } catch(error) {
      currentSettings = undefined;
    }
  }

  const [showDetails, setShowDetails] = useState(false);
  const [settings, setSettings] = useState(currentSettings);

  const SetCookiePermissions = settings => {
    setSettings(settings);
    localStorage.setItem("cookie-setting", JSON.stringify(settings));
  };

  const required = siteStore.currentSiteInfo.event_info && siteStore.currentSiteInfo.event_info.show_cookie_banner;
  useEffect(() => {
    if(settings || (siteStore.currentSiteInfo.event_info && !required)) {
      siteStore.LoadCookieDependentItems((settings && settings.analytics) || required === false);
    }
  }, [required, settings]);

  if(!required || settings) { return null; }

  if(showDetails) {
    return <CookieDetails SetPreferences={SetCookiePermissions} Close={() => setShowDetails(false)} />;
  }

  return (
    <div className="cookie-banner">
      <div className="cookie-banner__message">
        This site uses cookies to help us provide the best possible experience
      </div>
      <div className="cookie-banner__actions">
        <button className="cookie-banner__action cookie-banner__action-allow" onClick={() => SetCookiePermissions({required: true, analytics: true, functional: true})}>
          Accept All
        </button>
        <button className="cookie-banner__action cookie-banner__action-reject" onClick={() => setShowDetails(true)}>
          Manage Preferences
        </button>
      </div>
    </div>
  );
}));

export default CookieBanner;
