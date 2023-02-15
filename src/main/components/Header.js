import React from "react";

import {observer} from "mobx-react";
import ImageIcon from "./ImageIcon";
import {Action, ButtonWithMenu} from "./Actions";
import {uiStore, mainStore} from "../stores/Main";
import {useLocation} from "react-router";

import EluvioLogo from "../static/images/logos/eluvio-logo-color.png";

import {MenuIcon, XIcon} from "../static/icons/Icons";
import {RichText} from "./Misc";

const NotificationBanner = observer(({className=""}) => {
  if(!mainStore.notification) { return null; }

  return (
    <div className={`notification-banner ${className}`}>
      <h2>{ mainStore.notification.header }</h2>
      <RichText richText={mainStore.notification.text} className="notification-banner__text" />
      <button
        onClick={() => mainStore.DismissNotification()}
        className="notification-banner__close-button"
      >
        <ImageIcon icon={XIcon} title="Dismiss" className="notification-banner__close-icon" />
      </button>
    </div>
  );
});

const Header = observer(() => {
  const notificationBanner = <NotificationBanner className={uiStore.pageWidth > 1000 ? "desktop" : "mobile"} />;
  const location = useLocation();

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
          <ButtonWithMenu
            className={`dark header__nav-link ${location.pathname.includes("features") ? "active active--underline" : "inactive inactive--underline"}`}
            optionsClassName="dark"
            items={[
              {label: "Tenancy Levels", to: "/features/tenancy-levels"},
              {label: "Features", to: "/features/details"},
              {label: "Pricing", to: "/features/pricing"},
              {label: "Support", to: "/features/support"},
            ]}
          >Features</ButtonWithMenu>
        </nav>
        <nav className="header__icons desktop">
          <Action to="/wallet" icon={MenuIcon} useNavLink className="dark header__nav-link" />
        </nav>

        { /* Mobile */ }
        <nav className="header__nav mobile">
          <Action to="/about" useNavLink underline className="dark header__nav-link">
            Discover Projects
          </Action>
        </nav>
        <Action icon={MenuIcon} className="dark header__mobile-nav-button mobile" onClick={() => {}} />
      </header>

      { uiStore.pageWidth > 1000 ? notificationBanner : null }
    </>
  );
});

export default Header;
