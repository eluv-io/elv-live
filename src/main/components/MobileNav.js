import React, {useEffect, useState} from "react";
import {Action} from "./Actions";
import {DiscoverIcon, ProfileIcon, SocialIcons, WalletIcon, XIcon} from "../static/icons/Icons";
import {observer} from "mobx-react";
import {mainStore, uiStore} from "../stores/Main";
import {useLocation} from "react-router-dom";
import {runInAction} from "mobx";

const MobileNav = observer(({visible, Close}) => {
  const location = useLocation();
  const [originalLocation, setOriginalLocation] = useState(location.pathname);

  useEffect(() => {
    if(visible) {
      window.scrollTo(0, 0);

      // Disable body scroll so only nav menu can scroll
      document.body.classList.add("mobile-menu");

      return () => document.body.classList.remove("mobile-menu");
    } else {
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
      <Action icon={XIcon} className="dark mobile-nav__close-button mobile" onClick={Close} />
      <div className="mobile-nav__menu-content">
        <div className="mobile-nav__menu-header mobile-nav__menu-section">
          <Action className="mobile-nav__menu-header-item" icon={DiscoverIcon} alt="Projects" onClick={Close} to="/wallet#/">
            { mainStore.l10n.header.projects}
          </Action>
          <Action className="mobile-nav__menu-header-item" icon={ProfileIcon} alt="Profile" onClick={Close} to="/wallet#/wallet/users/me">
            { mainStore.l10n.header.profile}
          </Action>
          <Action className="mobile-nav__menu-header-item" icon={WalletIcon} alt="Wallet" onClick={Close} to="/wallet#/wallet/profile">
            { mainStore.l10n.header.wallet}
          </Action>
        </div>
        <div className="mobile-nav__menu-links mobile-nav__menu-section mobile-nav__menu-primary-links">
          <Action useNavLink exact to="/creators-and-publishers">
            { mainStore.l10n.header.creators_and_publishers }
          </Action>
          <Action useNavLink exact to="/content-fabric">
            { mainStore.l10n.header.content_fabric }
          </Action>
          <Action useNavLink exact to="/content-fabric/technology">
            { mainStore.l10n.header.eluvio_technology }
          </Action>
          <Action useNavLink exact to="/content-fabric/blockchain">
            { mainStore.l10n.header.eluvio_blockchain }
          </Action>
          <Action useNavLink exact to="/features/details">
            { mainStore.l10n.header.features }
          </Action>
        </div>
        <hr className="mobile-nav__menu-section-line" />

        <div className="mobile-nav__menu-links mobile-nav__menu-section mobile-nav__menu-secondary-links">
          <Action useNavLink className="mobile-nav__link" exact to="/features/pricing">
            { mainStore.l10n.header.pricing }
          </Action>
          <Action useNavLink className="mobile-nav__link" exact to="/features/tenancy-levels">
            { mainStore.l10n.header.tenancy_levels }
          </Action>
          <Action useNavLink className="mobile-nav__link" exact to="/features/support">
            { mainStore.l10n.header.support }
          </Action>
          <Action useNavLink className="mobile-nav__link" exact to="/about/partners">
            { mainStore.l10n.header.partners }
          </Action>
          <Action useNavLink className="mobile-nav__link" exact to="/about/news">
            { mainStore.l10n.header.news }
          </Action>
          <Action useNavLink className="mobile-nav__link" exact to="/about/contact">
            { mainStore.l10n.header.contact }
          </Action>
          <div className="mobile-nav__menu-social-links">
            <Action useNavLink className="dark" exact to="https://www.instagram.com/eluvioinc" icon={SocialIcons.InstagramIcon} alt="Instagram" />
            <Action useNavLink className="dark" exact to="https://twitter.com/eluvioinc" icon={SocialIcons.TwitterIcon} alt="Twitter" />
            <Action useNavLink className="dark" exact to="https://www.facebook.com/EluvioInc" icon={SocialIcons.FacebookIcon} alt="Facebook" />
            <Action useNavLink className="dark" exact to="https://www.linkedin.com/company/eluv-io" icon={SocialIcons.LinkedInIcon} alt="LinkedIn" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default MobileNav;
