import React, {useState} from "react";

import {observer} from "mobx-react";
import ImageIcon from "./ImageIcon";
import {Action, Button, MenuButton} from "./Actions";
import {uiStore, mainStore} from "../stores/Main";
import {RichText} from "./Misc";
import MobileNav from "./MobileNav";

import EluvioLogo from "../static/images/logos/eluvio-logo-color.png";
import EluvioLogoIcon from "../static/images/logos/Eluvio E Icon.png";

import {DiscoverIcon, MenuIcon, ProfileIcon, SocialIcons, WalletIcon, XIcon} from "../static/icons/Icons";


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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      { uiStore.pageWidth <= 1000 ? notificationBanner : null }

      <header className={`header ${uiStore.isWalletPage ? "header--compact" : ""}`}>
        <Action useNavLink to="/" className="header__logo-container">
          <ImageIcon icon={uiStore.isWalletPage ? EluvioLogoIcon : EluvioLogo} title="Eluvio" className="header__logo" />
        </Action>

        { /* Desktop */ }
        <nav className="header__nav header__nav--links desktop">
          <MenuButton
            basePath="/about"
            className="dark header__nav-link"
            optionClassName="dark"
            useNavLink
            underline
            items={[
              {label: mainStore.l10n.header.news, to: "/about/news", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.partners, to: "/about/partners", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.contact, to: "/about/contact", props: {useNavLink: true, exact: true}},
            ]}
          >
            { mainStore.l10n.header.about }
          </MenuButton>
          <Action to="/creators-and-publishers" useNavLink underline className="dark header__nav-link">
            { mainStore.l10n.header.creators_and_publishers }
          </Action>
          <MenuButton
            basePath="/content-fabric"
            className="dark header__nav-link"
            optionClassName="dark"
            useNavLink
            underline
            items={[
              {label: mainStore.l10n.header.content_fabric_protocol, to: "/content-fabric", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.eluvio_technology, to: "/content-fabric/technology", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.eluvio_blockchain, to: "/content-fabric/blockchain", props: {useNavLink: true, exact: true}},
            ]}
          >
            { mainStore.l10n.header.content_fabric }
          </MenuButton>
          <MenuButton
            basePath="/features"
            className="dark header__nav-link"
            optionClassName="dark"
            useNavLink
            underline
            items={[
              {label: mainStore.l10n.header.tenancy_levels, to: "/features/tenancy-levels", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.features, to: "/features/details", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.pricing, to: "/features/pricing", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.support, to: "/features/support", props: {useNavLink: true, exact: true}},
            ]}
          >
            { mainStore.l10n.header.features }
          </MenuButton>
          <Action to="/media-wallet" useNavLink underline className="dark header__nav-link">
            { mainStore.l10n.header.media_wallet }
          </Action>
          <Action to="https://hub.doc.eluv.io" useNavLink underline className="dark header__nav-link">
            { mainStore.l10n.header.docs }
          </Action>
          <Button to="/register" className="light primary small header__register-button">
            { mainStore.l10n.header.register }
          </Button>
        </nav>
        <nav className="header__nav header__nav--icons desktop">
          <Action icon={SocialIcons.TwitterIcon} to="https://twitter.com/eluvioinc" label={mainStore.l10n.header.twitter} className="dark header__nav-link" />
          <Action icon={DiscoverIcon} to={"/wallet#/"} label={mainStore.l10n.header.discover_projects} className="dark header__nav-link" />
          <Action icon={ProfileIcon} to={"/wallet#/wallet/users/me"} label={mainStore.l10n.header.profile} className="dark header__nav-link" />
          <Action icon={WalletIcon} to={"/wallet#/wallet/profile"} label={mainStore.l10n.header.wallet} className="dark header__nav-link" />
        </nav>

        { /* Mobile */ }
        <nav className="header__nav header__nav--links mobile">
          <Action to="/wallet" useNavLink underline className="dark header__nav-link">
            { mainStore.l10n.header.discover_projects }
          </Action>
        </nav>
        <Action icon={MenuIcon} className="dark header__mobile-nav-button mobile" onClick={() => setShowMobileMenu(prevState => !prevState)} />
      </header>
      <MobileNav visible={showMobileMenu} Close={() => setShowMobileMenu(false)} />

      { uiStore.pageWidth > 1000 ? notificationBanner : null }
    </>
  );
});

export default Header;
