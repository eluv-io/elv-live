import React, {useState} from "react";

import {observer} from "mobx-react";
import ImageIcon from "./ImageIcon";
import {Action} from "./Actions";
import {uiStore} from "../stores/Main";

import EluvioLogo from "../static/images/logos/eluvio-logo-color.png";
import CloseIcon from "../static/icons/x.svg";
import Icon from "../static/icons/send.svg";
import MobileMenuIcon from "../static/icons/menu.svg";

const NotificationBanner = ({children, Dismiss, className=""}) => {
  return (
    <div className={`notification-banner ${className}`}>
      { children }
      <button onClick={Dismiss} className="notification-banner__close-button">
        <ImageIcon icon={CloseIcon} title="Dismiss" className="notification-banner__close-icon" />
      </button>
    </div>
  );
};

const Header = observer(({notification}) => {
  const [showNotification, setShowNotification] = useState(!!mainStore.notification);

  const notificationBanner = showNotification ?
    <NotificationBanner
      Dismiss={() => {
        setShowNotification(false);
        mainStore.DismissNotification();
      }}
      className={uiStore.pageWidth > 1000 ? "desktop" : "mobile"}
    >
      {notification}
    </NotificationBanner> : null;

  return (
    <>
      { uiStore.pageWidth <= 1000 ? notificationBanner : null }
      <header className="header">
        <Action useNavLink to="/" className="header__logo-container">
          <ImageIcon icon={EluvioLogo} title="Eluvio" className="header__logo" />
        </Action>

        { /* Desktop */ }
        <nav className="header__nav desktop">
          <Action to="/partners" useNavLink underline className="dark header__nav-link">
            About
          </Action>
          <Action to="/creators-and-publishers" useNavLink underline className="dark header__nav-link">
            Creators & Publishers
          </Action>
          <Action to="/content-fabric" useNavLink underline className="dark header__nav-link">
            Content Fabric
          </Action>
          <Action to="/community" useNavLink underline className="dark header__nav-link">
            Community
          </Action>
        </nav>
        <nav className="header__icons desktop">
          <Action to="/wallet" icon={Icon} useNavLink className="dark header__nav-link" />
        </nav>

        { /* Mobile */ }
        <nav className="header__nav mobile">
          <Action to="/about" useNavLink underline className="dark header__nav-link">
            Discover Projects
          </Action>
        </nav>
        <Action icon={MobileMenuIcon} className="dark header__mobile-nav-button mobile" onClick={() => {}} />
      </header>
      { uiStore.pageWidth > 1000 ? notificationBanner : null }
    </>
  );
});

export default Header;
