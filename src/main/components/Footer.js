import React from "react";
import ImageIcon from "./ImageIcon";

import FooterConfiguration from "../content/Footer.yaml";

import EluvioLogo from "../static/images/logos/eluvio-logo.svg";

import {LinkIcon, DiscoverIcon, DocumentIcon, SocialIcons} from "../static/icons/Icons";

import {Action} from "./Actions";

const SocialLinks = ({dark=false}) => {
  const links = [
    { name: "Instagram", link: "https://www.instagram.com/eluvioinc", icon: SocialIcons.InstagramIcon },
    { name: "Twitter", link: "https://twitter.com/eluvioinc", icon: SocialIcons.TwitterIcon },
    { name: "Facebook", link: "https://www.facebook.com/EluvioInc/", icon: SocialIcons.FacebookIcon },
    { name: "LinkedIn", link: "https://www.linkedin.com/company/eluv-io", icon: SocialIcons.LinkedInIcon },
    { name: "Github", link: "https://github.com/eluv-io", icon: SocialIcons.GithubIcon },
    // TODO: Discord link
    { name: "Discord", link: "https://mobile.twitter.com/eluvioinc", icon: SocialIcons.DiscordIcon }
  ];

  return (
    <div className="footer__social-links">
      {
        links.map(({name, link, icon}) =>
          <Action href={link} target="_blank" rel="noopener" className={`${dark ? "dark" : "light"} footer__social-link`} key={`link-${name}`}>
            <ImageIcon icon={icon} title={name} className="footer__social-link__icon" />
          </Action>
        )
      }
    </div>
  );
};

const Links = ({dark=false}) => {
  const icons = {
    discover: DiscoverIcon,
    document: DocumentIcon,
    link: LinkIcon,
  };

  return (
    <div className="footer__links">
      {
        FooterConfiguration.map(({title, icon, links}) =>
          <div key={`footer-section-${title}`} className="footer__link-section">
            <h5 className="footer__link-section__header">
              <ImageIcon icon={icons[icon] || LinkIcon} className="footer__link-section__header-icon" />
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
        <SocialLinks dark={dark} />
      </div>
      <Links dark={dark} />
    </footer>
  );
};

export default Footer;
