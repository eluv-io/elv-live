import React, {useCallback, useEffect, useState} from "react";
import {Action} from "./Actions";
import {ExternalLinkIcon, NavIcons, SocialIcons, XIcon} from "../static/icons/Icons";
import {observer} from "mobx-react";
import {mainStore, uiStore} from "../stores/Main";
import {useLocation} from "react-router-dom";
import {runInAction} from "mobx";
import {ChevronLeftIcon} from "@eluvio/elv-player-js/lib/static/icons/Icons";
import ImageIcon from "./ImageIcon";
import UrlJoin from "url-join";

const MobileNav = observer(({visible, Close}) => {
  const location = useLocation();
  const [originalLocation, setOriginalLocation] = useState(location.pathname);

  useEffect(() => {
    console.log("LOAD")
    runInAction(() => mainStore.LoadNews());
  }, []);

  const newsItems = (mainStore.newsItems || [])
    .slice(0, 2)
    .map(({title, slug, index}) => ({title, slug, index}));

  const newsLinks = newsItems.map((item) => ({
    label: item.title,
    to: UrlJoin("/about/news", item.slug || item.index.toString()),
    props: {useNavLink: true, exact: true}
  }));

  const navLinks = [
    {
      label: mainStore.l10n.header.about,
      children: [
        {label: mainStore.l10n.header.news, to: "/about/news", props: {useNavLink: true, exact: true}, subItemProps: {indent: false, faded: true}},
        ...newsLinks || []
      ]
    },
    {
      label: mainStore.l10n.header.content_fabric,
      children: [
        {label: mainStore.l10n.header.content_fabric_protocol, to: "/content-fabric", props: {useNavLink: true, exact: true}, icon: NavIcons.FabricProtocolIcon},
        {label: mainStore.l10n.header.eluvio_blockchain, to: "/content-fabric/blockchain", props: {useNavLink: true, exact: true}, icon: NavIcons.BlockchainNavIcon},
        {label: mainStore.l10n.header.eluvio_technology, to: "/content-fabric/technology", props: {useNavLink: true, exact: true}, icon: NavIcons.FabricIcon}
      ]
    },
    {
      label: mainStore.l10n.header.apps,
      children: [
        {label: mainStore.l10n.header.fabric_core, to: "/av-core/fabric-core", props: {useNavLink: true, exact: true}, icon: NavIcons.FabricIcon},
        {label: mainStore.l10n.header.all_features, to: "/av-core/core-utilities", props: {useNavLink: true, exact: true}, icon: NavIcons.FeaturesIcon},
        {
          label: mainStore.l10n.header.management_tools,
          to: "/av-core/fabric-core#tools",
          props: {useNavLink: true, exact: true},
          icon: NavIcons.ManagementToolsIcon,
        }
      ]
    },
    {
      label: mainStore.l10n.header.monetization,
      children: [
        {label: mainStore.l10n.header.analytics, to: "/monetization/analytics", props: {useNavLink: true, exact: true}, icon: NavIcons.MonetizationIcon},
        {label: mainStore.l10n.header.elv_media_wallet, to: "/monetization/media-wallet", props: {useNavLink: true, exact: true}, icon: NavIcons.EDarkFillIcon},
        {label: mainStore.l10n.header.creator_studio, to: "/monetization/creator-studio", props: {useNavLink: true, exact: true}, icon: NavIcons.LiveStreamManagerIcon},
        {label: mainStore.l10n.header.embeddable_player, to: "/monetization/embeddable-player", props: {useNavLink: true, exact: true}, icon: NavIcons.PlayerIcon}
      ]
    },
    {
      label: mainStore.l10n.header.video_intelligence,
      children: [
        {label: mainStore.l10n.header.video_editor, to: "/video-intelligence/video-editor", props: {useNavLink: true, exact: true}, icon: NavIcons.EvieIcon},
        {label: mainStore.l10n.header.ai_clip_search, to: "/video-intelligence/ai-search", props: {useNavLink: true, exact: true}, icon: NavIcons.AiSearchIcon},
        {label: mainStore.l10n.header.ai_labs, to: "https://medium.com/@eluvio_ai", props: {useNavLink: true, exact: true}, icon: NavIcons.MIcon}
      ]
    },
    {
      label: mainStore.l10n.header.resources,
      children: [
        {label: mainStore.l10n.header.docs, to: "https://docs.eluv.io/", props: {useNavLink: true}, icon: NavIcons.DocsIcon},
        {label: mainStore.l10n.header.github, to: "https://github.com/eluv-io", props: {useNavLink: true}, icon: SocialIcons.GithubIcon},
        {label: mainStore.l10n.header.community, to: "https://wallet.contentfabric.io/ibc", props: {useNavLink: true}, icon: NavIcons.EDarkFillIcon},
        {label: mainStore.l10n.header.careers, to: "https://apply.workable.com/eluvio/", props: {useNavLink: true}, icon: NavIcons.ELightIcon}
      ]
    }
  ];

  const [menuHistory, setMenuHistory] = useState([navLinks]);

  const currentMenu = menuHistory[menuHistory.length - 1];

  const navigateToSubMenu = useCallback((subMenu) => {
    setMenuHistory(prevHistory => [...prevHistory, subMenu]);
  }, []);

  const navigateBack = useCallback(() => {
    if(menuHistory.length > 1) {
      setMenuHistory(prevHistory => prevHistory.slice(0, -1));
    }
  }, [menuHistory]);

  useEffect(() => {
    if(visible) {
      window.scrollTo(0, 0);

      // Disable body scroll so only nav menu can scroll
      document.body.classList.add("mobile-menu");

      return () => {
        document.body.classList.remove("mobile-menu");
      };
    } else {
      document.body.classList.remove("mobile-menu");
      // Scroll back up to top after fading out
      setTimeout(() => {
        document.querySelector(".mobile-nav")?.scrollTo(0, 0);
      }, 500);
    }
  }, [visible]);

  useEffect(() => {
    runInAction(() => {
      if(uiStore.pageWidth > 1000) {
        Close();
      }
    });
  }, [uiStore.pageWidth]);

  useEffect(() => {
    if(location.pathname !== originalLocation) {
      Close();
    }

    setOriginalLocation(location.pathname);
  }, [location]);

  useEffect(() => {
    const HandleEscapeKey = event => event.key === "Escape" && Close();
    document.addEventListener("keydown", HandleEscapeKey);

    return (() => document.removeEventListener("keydown", HandleEscapeKey));
  }, []);


  return (
    <div className={`mobile-nav ${visible ? "" : "mobile-nav--hidden"}`}>
      {/* Nav Header Toolbar */}
      <div className="mobile-nav__header-toolbar">
        {menuHistory.length > 1 && (
          <Action icon={ChevronLeftIcon} className="light mobile-nav__back-button" onClick={navigateBack} />
        )}
        <Action icon={XIcon} className="light mobile-nav__close-button mobile" onClick={Close} />
      </div>

      {/* Nav app links */}
      <div className="mobile-nav__menu-content">
        <div className="mobile-nav__menu-links mobile-nav__menu-section mobile-nav__menu-primary-links">
          {
            currentMenu.map((item, index) => (
              item.children ?
                (
                  <Action key={index} onClick={() => navigateToSubMenu(item.children)} className={item.subItemProps?.faded ? "subtle" : ""}>
                    {
                      item.icon &&
                      <ImageIcon icon={item.icon} className="mobile-nav__item-icon" />
                    }
                    { item.label }
                  </Action>
                ) :
                (
                  <Action key={index} useNavLink exact to={item.path} onClick={Close}>
                    {
                      item.icon &&
                      <ImageIcon icon={item.icon} className="mobile-nav__item-icon" />
                    }
                    { item.label }
                  </Action>
                )
            ))
          }
        </div>

        {/* Nav external links */}
        {
          menuHistory.length <= 1 &&
          <div className="mobile-nav__menu-links mobile-nav__menu-section mobile-nav__menu-secondary-links">
            <Action useNavLink className="mobile-nav__link" exact to="https://contentfabric.io/">
              { mainStore.l10n.header.content_fabric_io }
              <ImageIcon icon={ExternalLinkIcon} />
            </Action>
            <Action useNavLink className="mobile-nav__link" exact to={mainStore.walletAppUrl}>
              { mainStore.l10n.header.media_wallet }
              <ImageIcon icon={NavIcons.EMobileIcon} />
            </Action>
          </div>
        }
      </div>
    </div>
  );
});

export default MobileNav;
