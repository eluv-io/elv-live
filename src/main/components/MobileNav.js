import React, {useEffect, useState} from "react";
import {Action} from "./Actions";
import {DiscoverIcon, ProfileIcon, SocialIcons, WalletIcon, XIcon} from "../static/icons/Icons";
import {observer} from "mobx-react";
import {uiStore} from "../stores/Main";
import {useLocation} from "react-router-dom";

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
        document.querySelector(".mobile-nav").scrollTo(0, 0);
      }, 500);
    }
  }, [visible]);

  useEffect(() => {
    if(uiStore.pageWidth > 1000) {
      Close();
    }
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
            Projects
          </Action>
          <Action className="mobile-nav__menu-header-item" icon={ProfileIcon} alt="Profile" onClick={Close} to="/wallet#/wallet/users/me">
            Profile
          </Action>
          <Action className="mobile-nav__menu-header-item" icon={WalletIcon} alt="Wallet" onClick={Close} to="/wallet#/wallet/profile">
            Wallet
          </Action>
        </div>
        <div className="mobile-nav__menu-links mobile-nav__menu-section mobile-nav__menu-primary-links">
          <Action useNavLink exact to="/creators-and-publishers">Creators & Publishers</Action>
          <Action useNavLink exact to="/content-fabric">Content Fabric</Action>
          <Action useNavLink exact to="/content-fabric/technology">Technology</Action>
          <Action useNavLink exact to="/content-fabric/blockchain">Blockchain</Action>
          <Action useNavLink exact to="/features/details">Features</Action>
        </div>
        <hr className="mobile-nav__menu-section-line" />

        <div className="mobile-nav__menu-links mobile-nav__menu-section mobile-nav__menu-secondary-links">
          <Action useNavLink className="mobile-nav__link" exact to="/features/pricing">Pricing</Action>
          <Action useNavLink className="mobile-nav__link" exact to="/features/support">Support</Action>
          <Action useNavLink className="mobile-nav__link" exact to="/community">Community</Action>
          <Action useNavLink className="mobile-nav__link" exact to="/about/partners">Partners</Action>
          <Action useNavLink className="mobile-nav__link" exact to="/about/news">News</Action>
          <Action useNavLink className="mobile-nav__link" exact to="/about/contact">Contact Us</Action>
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
