import React from "react";
import {inject, observer} from "mobx-react";
import {NavLink} from "react-router-dom";

import Logo from "Assets/images/logo/whiteEluvioLiveLogo.svg";
import ImageIcon from "Common/ImageIcon";

@inject("siteStore")
@observer
class Footer extends React.Component {
  render() {
    return (
      <footer className="footer" id="footer">
        <div className="footer__logo-container">
          <ImageIcon className="footer__logo" icon={Logo} label="Eluvio Live" />
        </div>
        <div className="footer__links">
          <NavLink to="/contact" className="footer__link">Contact Us</NavLink>
          <NavLink to="/terms" className="footer__link">Terms</NavLink>
          <NavLink to="/support" className="footer__link">Support</NavLink>
          <NavLink to="/privacy" className="footer__link">Privacy</NavLink>
          <a href="https://eluv.io" className="footer__link" target="_blank">eluv.io</a>
        </div>
      </footer>
    );
  }
}

export default Footer;
