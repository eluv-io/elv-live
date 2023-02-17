import React, {useState} from "react";

import {observer} from "mobx-react";
import ImageIcon from "./ImageIcon";
import {Action, ButtonWithMenu} from "./Actions";
import {uiStore, mainStore} from "../stores/Main";
import {useLocation} from "react-router";

import EluvioLogo from "../static/images/logos/eluvio-logo-color.png";

import {DiscoverIcon, MenuIcon, ProfileIcon, SocialIcons, WalletIcon, XIcon} from "../static/icons/Icons";
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
          >
            Features
          </ButtonWithMenu>
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
        <Action icon={MenuIcon} className="dark header__mobile-nav-button mobile" onClick={() => setShowMobileMenu(prevState => !prevState)} />
      </header>

      <div className={`mobile-nav__menu ${showMobileMenu ? "" : "hidden"}`}>
        <Action icon={XIcon} className="dark mobile-nav__close-button mobile" onClick={() => setShowMobileMenu(false)} />
        <div className="mobile-nav__menu-content">
          <div className="mobile-nav__menu-header mobile-nav__menu-section">
            <Action className="mobile-nav__menu-header-item" icon={DiscoverIcon} alt="Projects" to="/about">
              <span>Projects</span>
            </Action>
            <Action className="mobile-nav__menu-header-item" icon={ProfileIcon} alt="Profile" to="/">
              <span>Profile</span>
            </Action>
            <Action className="mobile-nav__menu-header-item" icon={WalletIcon} alt="Wallet" to="/">
              <span>Wallet</span>
            </Action>
          </div>
          <div className="mobile-nav__menu-links mobile-nav__menu-section mobile-nav__menu-primary-links">
            <Action to="/creators-and-publishers">Creators & Publishers</Action>
            <Action to="/content-fabric">Content Fabric</Action>
            <Action to="/content-fabric/technology">Technology</Action>
            <Action to="/content-fabric/blockchain">Blockchain</Action>
            <Action to="/features/details">Features</Action>
          </div>
          <hr className="mobile-nav__menu-section-line" />

          <div className="mobile-nav__menu-links mobile-nav__menu-section mobile-nav__menu-secondary-links">
            <Action className="link" to="/features/pricing">Pricing</Action>
            <Action className="link" to="/features/support">Support</Action>
            <Action className="link" to="/community">Community</Action>
            <Action className="link" to="/about/partners">Partners</Action>
            <Action className="link" to="/about/news">News</Action>
            <Action className="link" to="/about/contact">Contact Us</Action>
            <div className="mobile-nav__menu-social-links">
              <Action className="dark" to="https://www.instagram.com/eluvioinc" icon={SocialIcons.InstagramIcon} alt="Instagram" />
              <Action className="dark" to="https://twitter.com/eluvioinc" icon={SocialIcons.TwitterIcon} alt="Twitter" />
              <Action className="dark" to="https://www.facebook.com/EluvioInc" icon={SocialIcons.FacebookIcon} alt="Facebook" />
              <Action className="dark" to="https://www.linkedin.com/company/eluv-io" icon={SocialIcons.LinkedInIcon} alt="LinkedIn" />
            </div>
          </div>
        </div>
      </div>

      { uiStore.pageWidth > 1000 ? notificationBanner : null }
    </>
  );
});

export default Header;
