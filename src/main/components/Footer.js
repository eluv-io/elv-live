import React from "react";
import ImageIcon from "./ImageIcon";

import FooterConfiguration from "../content/Footer.yaml";

import EluvioLogo from "../static/images/logos/eluvio-logo.svg";

import TechnologyIcon from "../static/icons/send.svg";

import InstagramIcon from "../static/icons/social/instagram.svg";
import TwitterIcon from "../static/icons/social/twitter.svg";
import FacebookIcon from "../static/icons/social/facebook.svg";
import LinkedInIcon from "../static/icons/social/linkedin.svg";
import GithubIcon from "../static/icons/social/github.svg";
import DiscordIcon from "../static/icons/social/discord.svg";
import {Action} from "./Actions";

const SocialLinks = () => {
  const links = [
    { name: "Instagram", link: "https://www.instagram.com/eluvioinc", icon: InstagramIcon },
    { name: "Twitter", link: "https://twitter.com/eluvioinc", icon: TwitterIcon },
    { name: "Facebook", link: "https://www.facebook.com/EluvioInc/", icon: FacebookIcon },
    { name: "LinkedIn", link: "https://www.linkedin.com/company/eluv-io", icon: LinkedInIcon },
    { name: "Github", link: "https://github.com/eluv-io", icon: GithubIcon },
    // TODO: Discord link
    { name: "Discord", link: "https://mobile.twitter.com/eluvioinc", icon: DiscordIcon }
  ];

  return (
    <div className="footer__social-links">
      {
        links.map(({name, link, icon}) =>
          <a href={link} target="_blank" rel="noopener" className="footer__social-link" key={`link-${name}`}>
            <ImageIcon icon={icon} title={name} className="footer__social-link__icon" />
          </a>
        )
      }
    </div>
  );
};

const Links = ({dark=false}) => {
  return (
    <div className="footer__links">
      {
        FooterConfiguration.map(({title, links}) =>
          <div key={`footer-section-${title}`} className="footer__link-section">
            <h5 className="footer__link-section__header">
              <ImageIcon icon={TechnologyIcon} className="footer__link-section__header-icon" />
              { title }
            </h5>
            {
              links.map(({text, link}) => {
                const to = link.startsWith("https://") ? undefined : link;
                const href = link.startsWith("https://") ? link : undefined;

                return (
                  <Action
                    to={to}
                    href={href}
                    rel="noopener"
                    target={href ? "_blank" : ""}
                    key={`footer-link-${title}-${text}`}
                    className={`footer__link ${dark ? "dark" : "light"}`}
                  >
                    { text}
                  </Action>
                );
              })
            }
          </div>
        )
      }
    </div>
  );
};

const Footer = ({dark=false, className=""}) => {
  return (
    <footer className={`footer padded-block ${dark ? "dark" : "light"} ${className}`}>
      <div className="footer__branding">
        <ImageIcon icon={EluvioLogo} title="Eluvio" className="footer__logo" />
        <SocialLinks />
      </div>
      <Links dark={dark} />
    </footer>
  );
};

export default Footer;
