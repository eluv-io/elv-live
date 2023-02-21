import React from "react";
import {Action} from "./Actions";
import {DiscoverIcon, ProfileIcon, SocialIcons, WalletIcon, XIcon} from "../static/icons/Icons";

const MobileNav = ({open, onOpenChange}) => {
  if(!open) { return null; }

  return (
    <div className="mobile-nav__menu">
      <Action icon={XIcon} className="dark mobile-nav__close-button mobile" onClick={() => onOpenChange(false)} />
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
          <Action className="mobile-nav__link" to="/features/pricing">Pricing</Action>
          <Action className="mobile-nav__link" to="/features/support">Support</Action>
          <Action className="mobile-nav__link" to="/community">Community</Action>
          <Action className="mobile-nav__link" to="/about/partners">Partners</Action>
          <Action className="mobile-nav__link" to="/about/news">News</Action>
          <Action className="mobile-nav__link" to="/about/contact">Contact Us</Action>
          <div className="mobile-nav__menu-social-links">
            <Action className="dark" to="https://www.instagram.com/eluvioinc" icon={SocialIcons.InstagramIcon} alt="Instagram" />
            <Action className="dark" to="https://twitter.com/eluvioinc" icon={SocialIcons.TwitterIcon} alt="Twitter" />
            <Action className="dark" to="https://www.facebook.com/EluvioInc" icon={SocialIcons.FacebookIcon} alt="Facebook" />
            <Action className="dark" to="https://www.linkedin.com/company/eluv-io" icon={SocialIcons.LinkedInIcon} alt="LinkedIn" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
