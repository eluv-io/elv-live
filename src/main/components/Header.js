import React, {useState} from "react";

import {observer} from "mobx-react";
import ImageIcon from "./ImageIcon";
import {Action, Button, MenuButton} from "./Actions";
import {uiStore, mainStore} from "../stores/Main";
import {RichText} from "./Misc";
import MobileNav from "./MobileNav";

import EluvioLogo from "../static/images/logos/eluvio-logo-white.png";
import EluvioLogoIcon from "../static/images/logos/Eluvio E Icon.png";

import {MenuIcon, XIcon, EluvioEIconColor} from "../static/icons/Icons";


const NotificationBanner = observer(({className=""}) => {
  if(!mainStore.notification) { return null; }

  return (
    <div className={`notification-banner ${className}`}>
      <h3>{ mainStore.notification.header }</h3>
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
              {label: mainStore.l10n.header.fabric_core, to: "/content-fabric/fabric-core", props: {useNavLink: true, exact: true}}
            ]}
          >
            { mainStore.l10n.header.content_fabric }
          </MenuButton>
          <MenuButton
            basePath="/apps"
            className="dark header__nav-link"
            optionClassName="dark"
            useNavLink
            underline
            items={[
              {label: mainStore.l10n.header.creator_studio, to: "/apps/creator-studio", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.analytics, to: "/apps/analytics", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.ai_clip_search, to: "/apps/ai-clip-search", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.video_editor, to: "/apps/video-editor", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.elv_media_wallet, to: "/apps/media-wallet", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.embeddable_player, to: "/apps/embeddable-player", props: {useNavLink: true, exact: true}}
            ]}
          >
            { mainStore.l10n.header.apps }
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
          <Action to="https://docs.eluv.io/" useNavLink underline className="dark header__nav-link">
            { mainStore.l10n.header.docs }
          </Action>
          <Action to="/register" useNavLink underline className="dark header__nav-link">
            { mainStore.l10n.header.register }
          </Action>
          <div className="header__buttons">
            <Button href={mainStore.walletAppUrl} target="_blank" icon={EluvioEIconColor} className="light header__button header__button--discover">
              { mainStore.l10n.header.discover }
            </Button>
            <Button to="https://contentfabric.io/" target="_blank" className="light header__button header__button--fabric">
              { mainStore.l10n.header.sign_in }
            </Button>
          </div>
        </nav>

        { /* Mobile */ }
        <nav className="header__nav header__nav--links mobile">
          <Action href={mainStore.walletAppUrl} target="_blank" underline className="dark header__nav-link">
            { mainStore.l10n.header.discover }
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
