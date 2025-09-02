import React, {useState} from "react";

import {observer} from "mobx-react";
import ImageIcon from "./ImageIcon";
import {Action, Button, MenuButton} from "./Actions";
import {uiStore, mainStore} from "../stores/Main";
import {RichText} from "./Misc";
import MobileNav from "./MobileNav";

import EluvioLogo from "../static/images/logos/eluvio-black-logo.png";
import EluvioLogoIcon from "../static/images/logos/Eluvio E Icon.png";

import {MenuIcon, XIcon, NavIcons, SocialIcons} from "../static/icons/Icons";

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
      { notificationBanner }
      <header className={`header ${uiStore.isWalletPage ? "header--compact" : ""}`}>
        <Action useNavLink to="/" className="header__logo-container">
          <ImageIcon icon={uiStore.isWalletPage ? EluvioLogoIcon : EluvioLogo} title="Eluvio" className="header__logo" />
        </Action>

        { /* Desktop */ }
        <nav className="header__nav header__nav--links desktop">
          <MenuButton
            basePath="/about"
            className="light header__nav-link"
            optionClassName="light"
            useNavLink
            items={[
              {label: mainStore.l10n.header.news, to: "/about/news", props: {useNavLink: true, exact: true}, subtitle: "Eluvio Wins 2025 NAB Show Product of the Year Award for the Content Fabric “Bangkok Release\n\nEluvio Announces Content Fabric “Bangkok Release” for Next-Gen Video Distribution and Monetization at NAB 2025"},
              // {label: mainStore.l10n.header.team, to: "/#eluvio-team", props: {useNavLink: true, exact: true}, subtitle: "Eluvio Announces Content Fabric “Bangkok Release” for Next-Gen Video Distribution and Monetization at NAB 2025"}
            ]}
          >
            { mainStore.l10n.header.about }
          </MenuButton>
          <MenuButton
            basePath="/content-fabric"
            className="light header__nav-link"
            optionClassName="light"
            useNavLink
            items={[
              {label: mainStore.l10n.header.content_fabric_protocol, to: "/content-fabric", props: {useNavLink: true, exact: true}, icon: NavIcons.FabricProtocolIcon},
              {label: mainStore.l10n.header.eluvio_blockchain, to: "/content-fabric/blockchain", props: {useNavLink: true, exact: true}, icon: NavIcons.BlockchainNavIcon},
              {label: mainStore.l10n.header.eluvio_technology, to: "/content-fabric/technology", props: {useNavLink: true, exact: true}, icon: NavIcons.FabricIcon},
              // {label: mainStore.l10n.header.learning_resources, to: "/content-fabric/blockchain", props: {useNavLink: true, exact: true}, icon: NavIcons.LearningResourcesIcon}
            ]}
          >
            { mainStore.l10n.header.content_fabric }
          </MenuButton>
          <MenuButton
            basePath="/av-core"
            className="light header__nav-link"
            optionClassName="light"
            useNavLink
            items={[
              {label: mainStore.l10n.header.fabric_core, to: "/av-core/fabric-core", props: {useNavLink: true, exact: true}, icon: NavIcons.FabricIcon},
              {label: mainStore.l10n.header.management_tools, to: "/av-core/fabric-core#tools", props: {useNavLink: true, exact: true}, icon: NavIcons.ManagementToolsIcon},
              {label: mainStore.l10n.header.all_features, to: "/av-core/core-utilities", props: {useNavLink: true, exact: true}, icon: NavIcons.FeaturesIcon},
              {
                items: [
                  {label: mainStore.l10n.header.fabric_browser, to: "/av-core/fabric-core#tools", props: {useNavLink: true, exact: true}, icon: NavIcons.ELightIcon},
                  {label: mainStore.l10n.header.media_ingest, to: "/av-core/fabric-core#tools", props: {useNavLink: true, exact: true}, icon: NavIcons.MediaIngestIcon},
                  {label: mainStore.l10n.header.live_stream_manager, to: "/av-core/fabric-core#tools", props: {useNavLink: true, exact: true}, icon: NavIcons.LiveStreamManagerIcon},
                ]
              }
            ]}
          >
            { mainStore.l10n.header.apps }
          </MenuButton>
          <MenuButton
            basePath="/monetization"
            className="light header__nav-link"
            optionClassName="light"
            useNavLink
            items={[
              {label: mainStore.l10n.header.analytics, to: "/monetization/analytics", props: {useNavLink: true, exact: true}, icon: NavIcons.MonetizationIcon},
              {label: mainStore.l10n.header.elv_media_wallet, to: "/monetization/media-wallet", props: {useNavLink: true, exact: true}, icon: NavIcons.EDarkFillIcon},
              {label: mainStore.l10n.header.creator_studio, to: "/monetization/creator-studio", props: {useNavLink: true, exact: true}, icon: NavIcons.LiveStreamManagerIcon},
              {label: mainStore.l10n.header.embeddable_player, to: "/monetization/embeddable-player", props: {useNavLink: true, exact: true}, icon: NavIcons.PlayerIcon}
            ]}
          >
            { mainStore.l10n.header.monetization }
          </MenuButton>
          <MenuButton
            basePath="/video-intelligence"
            className="light header__nav-link"
            optionClassName="light"
            useNavLink
            items={[
              {label: mainStore.l10n.header.video_editor, to: "/video-intelligence/video-editor", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.ai_clip_search, to: "/video-intelligence/ai-search", props: {useNavLink: true, exact: true}},
              {label: mainStore.l10n.header.ai_labs, to: "https://medium.com/@eluvio_ai", props: {useNavLink: true, exact: true}}
            ]}
          >
            { mainStore.l10n.header.video_intelligence }
          </MenuButton>
          <MenuButton
            basePath="/resources"
            className="light header__nav-link"
            optionClassName="light"
            useNavLink
            items={[
              {label: mainStore.l10n.header.docs, to: "https://docs.eluv.io/", props: {useNavLink: true}, subtitle: "Subtitle text", icon: NavIcons.DocsIcon},
              {label: mainStore.l10n.header.learning_resources, to: "", props: {useNavLink: true}, subtitle: "Subtitle text", icon: NavIcons.LearningResourcesIcon},
              {label: mainStore.l10n.header.github, to: "https://github.com/eluv-io", props: {useNavLink: true}, subtitle: "Subtitle text", icon: SocialIcons.GithubIcon},
              {label: mainStore.l10n.header.community, to: "https://live.eluv.io/community", props: {useNavLink: true}, subtitle: "Subtitle text", icon: NavIcons.EDarkFillIcon}
            ]}
          >
            { mainStore.l10n.header.resources }
          </MenuButton>
          <div className="header__buttons">
            <ImageIcon icon={EluvioLogoIcon} title="Eluvio" className="header__eluvio-icon" />
            <Button href={mainStore.walletAppUrl} target="_blank" className="light header__button header__button--discover">
              { mainStore.l10n.header.try_the_fabric }
            </Button>
            <Button to="https://contentfabric.io/" target="_blank" className="light header__button header__button--fabric">
              { mainStore.l10n.header.sign_in }
            </Button>
          </div>
        </nav>

        { /* Mobile */ }
        <nav className="header__nav header__nav--links mobile">
          <Action href={mainStore.walletAppUrl} target="_blank" className="light header__nav-link">
            { mainStore.l10n.header.discover }
          </Action>
        </nav>
        <Action icon={MenuIcon} className="light header__mobile-nav-button mobile" onClick={() => setShowMobileMenu(prevState => !prevState)} />
      </header>
      <MobileNav visible={showMobileMenu} Close={() => setShowMobileMenu(false)} />
    </>
  );
});

export default Header;
