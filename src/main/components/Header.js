import React, {useState} from "react";

import {observer} from "mobx-react";
import ImageIcon from "./ImageIcon";
import {Action, ButtonWithMenu} from "./Actions";
import {uiStore, mainStore} from "../stores/Main";
import {useLocation} from "react-router";

import EluvioLogo from "../static/images/logos/eluvio-logo-color.png";

import {MenuIcon, XIcon} from "../static/icons/Icons";
import {RichText} from "./Misc";
import MobileNav from "./MobileNav";

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      { uiStore.pageWidth <= 1000 ? notificationBanner : null }

      <header className="header">
        <Action useNavLink to="/" className="header__logo-container">
          <ImageIcon icon={EluvioLogo} title="Eluvio" className="header__logo" />
        </Action>

        { /* Desktop */ }
        <nav className="header__nav desktop">
          <ButtonWithMenu
            className={`dark header__nav-link ${location.pathname.includes("about") ? "active active--underline" : "inactive inactive--underline"}`}
            optionsClassName="dark"
            items={[
              {label: "News", to: "/about/news"},
              {label: "Partners", to: "/about/partners"},
              {label: "Contact Us", to: "/about/contact"},
            ]}
          >
            About
          </ButtonWithMenu>
          <Action to="/creators-and-publishers" useNavLink underline className="dark header__nav-link">
            Creators & Publishers
          </Action>
          <ButtonWithMenu
            className={`dark header__nav-link ${location.pathname.includes("content-fabric") ? "active active--underline" : "inactive inactive--underline"}`}
            optionsClassName="dark"
            items={[
              {label: "The Content Fabric Protocol", to: "/content-fabric"},
              {label: "Eluv.io Technology", to: "/content-fabric/technology"},
              {label: "Eluv.io Blockchain", to: "/content-fabric/blockchain"},
            ]}
          >
            Content Fabric
          </ButtonWithMenu>
          <ButtonWithMenu
            className={`dark header__nav-link ${location.pathname.includes("features") ? "active active--underline" : "inactive inactive--underline"}`}
            optionsClassName="dark"
            items={[
              {label: "Tenancy Levels", to: "/features/tenancy-levels"},
              {label: "Features", to: "/features/details"},
              {label: "Pricing", to: "/features/pricing"},
              {label: "Support", to: "/features/support"},
            ]}
          >
            Features
          </ButtonWithMenu>
        </nav>

        { /* Mobile */ }
        <nav className="header__nav mobile">
          <Action to="/about" useNavLink underline className="dark header__nav-link">
            Discover Projects
          </Action>
        </nav>
        <Action icon={MenuIcon} className="dark header__mobile-nav-button mobile" onClick={() => setShowMobileMenu(prevState => !prevState)} />
      </header>
      <MobileNav open={showMobileMenu} onOpenChange={value => setShowMobileMenu(value)} />

      { uiStore.pageWidth > 1000 ? notificationBanner : null }
    </>
  );
});

export default Header;
