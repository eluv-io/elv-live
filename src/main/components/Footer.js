import React from "react";
import ImageIcon from "./ImageIcon";
import {Action} from "./Actions";
import {mainStore} from "../stores/Main";

import EluvioLogo from "../static/images/logos/eluvio-logo.svg";
import {LinkIcon, DocumentIcon, SocialIcons, DiscoverIcon} from "../static/icons/Icons";
import {observer} from "mobx-react";

const SocialLinks = ({dark=false}) => {
  const links = [
    { name: "Instagram", link: "https://www.instagram.com/eluvioinc", icon: SocialIcons.InstagramIcon },
    { name: "X", link: "https://x.com/eluvioinc", icon: SocialIcons.XLogoIcon },
    { name: "Facebook", link: "https://www.facebook.com/EluvioInc/", icon: SocialIcons.FacebookIcon },
    { name: "LinkedIn", link: "https://www.linkedin.com/company/eluv-io", icon: SocialIcons.LinkedInIcon },
    { name: "Github", link: "https://github.com/eluv-io", icon: SocialIcons.GithubIcon },
    { name: "Discord", link: "https://discord.gg/Mu9GzdutwF", icon: SocialIcons.DiscordIcon }
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

const Links = observer(({dark=false}) => {
  const icons = {
    discover: DiscoverIcon,
    document: DocumentIcon,
    link: LinkIcon,
  };
  const roadmapDoc = require("../pages/technology/documents/Technology-Roadmap-Full.pdf");
  const whitepaperDoc = require("../pages/technology/documents/EluvioContentFabricWhitepaper.pdf");
  const nextGenWhitepaperDoc = require("../pages/technology/documents/Eluvio Content Fabric - Next Generation CDN and Media Cloud.pdf");

  const linkDocMap = {
    "roadmap": roadmapDoc,
    "whitepaper": whitepaperDoc,
    "next-gen-whitepaper": nextGenWhitepaperDoc
  };

  return (
    <div className="footer__links">
      {
        mainStore.l10n.footer.map(({title, icon, links}) =>
          <div key={`footer-section-${title}`} className="footer__link-section">
            <h5 className="footer__link-section__header">
              <ImageIcon icon={icons[icon] || LinkIcon} className="footer__link-section__header-icon" />
              { title }
            </h5>
            {
              links.map(({text, link, link_type}) => {
                const toPath = link.startsWith("https://") ? undefined : link;
                const href = link.startsWith("https://") ? link : undefined;

                const to = link_type === "doc" ? linkDocMap[link] : toPath;

                return (
                  <Action
                    to={to}
                    href={href}
                    rel="noopener"
                    target={href ? "_blank" : ""}
                    key={`footer-link-${title}-${text}`}
                    className={`footer__link ${dark ? "dark" : "light"}`}
                  >
                    { text }
                  </Action>
                );
              })
            }
          </div>
        )
      }
    </div>
  );
});

const TermsLinks = ({dark=false}) => {
  return (
    <div className="footer__terms-links">
      <Action
        href="/terms"
        target="_blank"
        className={`footer__link footer__terms-link ${dark ? "dark" : "light"}`}
      >
        End User Agreement
      </Action>
      <Action
        href="/privacy"
        target="_blank"
        className={`footer__link footer__terms-link ${dark ? "dark" : "light"}`}
      >
        Privacy Policy
      </Action>
      <Action
        href="/platform-terms"
        target="_blank"
        className={`footer__link footer__terms-link ${dark ? "dark" : "light"}`}
      >
        Tenant Platform Services Agreement
      </Action>
    </div>
  );
};

const Footer = ({dark=false, className=""}) => {
  return (
    <footer className={`footer ${dark ? "dark" : "light"} ${className}`}>
      <div className="padded-block">
        <div className="footer__branding">
          <ImageIcon icon={EluvioLogo} title="Eluvio" className="footer__logo" />
          <SocialLinks dark={dark} />
        </div>
        <Links dark={dark} />
        <TermsLinks dark={dark} />
      </div>
    </footer>
  );
};

export default Footer;
