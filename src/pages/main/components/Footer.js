import React from "react";
import {inject, observer} from "mobx-react";
import {NavLink} from "react-router-dom";
import {IconContext} from "react-icons";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookSquare,
  FaLinkedin
} from "react-icons/fa";

import Logo from "Assets/images/logo/whiteEluvioLiveLogo.svg";
import ImageIcon from "Common/ImageIcon";

import Copy from "../copy/Copy.yaml";

@inject("siteStore")
@observer
class Footer extends React.Component {
  SocialButton(href, Icon, name) {
    if(!href) { return null; }

    return (
      <a href={href} target="_blank" className="info-social-link">
        <IconContext.Provider value={{ className: `social-icon ${name}`, color: "black"}}>
          { Icon }
        </IconContext.Provider>
      </a>
    );
  }

  render() {
    return (
      <footer className="footer" id="footer">
        <div className="footer__logo-container">
          <button className="footer__logo-button" onClick={() => window.scrollTo(0, 0)}>
            <ImageIcon className="footer__logo" icon={Logo} label="Eluvio Live" />
          </button>
        </div>
        <div className="footer__links">
          <NavLink to="/contact" className="footer__link">Contact Us</NavLink>
          <NavLink to="/terms" className="footer__link">Terms</NavLink>
          <NavLink to="/next" className="footer__link">What's Next?</NavLink>
          <NavLink to="/privacy" className="footer__link">Privacy</NavLink>
          <a href="https://eluv.io" className="footer__link" target="_blank">eluv.io</a>
        </div>
        <div className="footer__social">
          { this.SocialButton("https://www.instagram.com/eluviolive", <FaInstagram />, "Instagram") }
          { this.SocialButton("https://twitter.com/EluvioLIVE", <FaTwitter />, "Twitter") }
          { this.SocialButton("https://www.facebook.com/EluvioLIVE", <FaFacebookSquare />, "Facebook") }
          { this.SocialButton("https://www.linkedin.com/company/eluv-io", <FaLinkedin />, "LinkedIn") }
        </div>
        <pre className="footer__attributions" dangerouslySetInnerHTML={{__html: Copy.footer.attributions}} />
        <div className="footer__copyright">
          { Copy.footer.copyright }
        </div>
      </footer>
    );
  }
}

export default Footer;
