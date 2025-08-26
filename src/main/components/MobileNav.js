import React, {useEffect, useState} from "react";
import {Action} from "./Actions";
import {SocialIcons, XIcon} from "../static/icons/Icons";
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
      <Action icon={XIcon} className="dark mobile-nav__close-button mobile" onClick={Close} />
      <div className="mobile-nav__menu-content">
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
          <Action useNavLink exact to="/apps/fabric-core">
            { mainStore.l10n.header.fabric_core}
          </Action>
          <Action useNavLink exact to="/features/details">
            { mainStore.l10n.header.features }
          </Action>
          <Action useNavLink exact to="/media-wallet">
            { mainStore.l10n.header.media_wallet }
          </Action>
          <Action useNavLink exact to="https://docs.eluv.io/">
            { mainStore.l10n.header.docs }
          </Action>
          <Action useNavLink exact to="/register">
            { mainStore.l10n.header.register }
          </Action>
          <Action useNavLink exact to="https://contentfabric.io/">
            { mainStore.l10n.header.sign_in }
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
            <Action useNavLink className="dark" exact to="https://www.instagram.com/eluvioinc" icon={SocialIcons.InstagramIcon} label="Instagram" />
            <Action useNavLink className="dark" exact to="https://x.com/eluvioinc" icon={SocialIcons.XLogoIcon} label="X" />
            <Action useNavLink className="dark" exact to="https://www.facebook.com/EluvioInc" icon={SocialIcons.FacebookIcon} label="Facebook" />
            <Action useNavLink className="dark" exact to="https://www.linkedin.com/company/eluv-io" icon={SocialIcons.LinkedInIcon} label="LinkedIn" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default MobileNav;
