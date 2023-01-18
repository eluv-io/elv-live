import React from "react";

import {observer} from "mobx-react";
import ImageIcon from "./ImageIcon";
import {TextLink} from "./Actions";

import EluvioLogo from "../static/images/logos/eluvio-logo-color.png";
import Icon from "../static/icons/send.svg";

const Header = observer(() => {
  return (
    <header className="header">
      <ImageIcon icon={EluvioLogo} title="Eluvio" className="header__logo" />
      <nav className="header__nav">
        <TextLink to="/about" useNavLink underline className="dark header__nav-link">
          About
        </TextLink>
        <TextLink to="/creators-and-publishers" useNavLink underline className="dark header__nav-link">
          Creators & Publishers
        </TextLink>
        <TextLink to="/content-fabric" useNavLink underline className="dark header__nav-link">
          Content Fabric
        </TextLink>
        <TextLink to="/community" useNavLink underline className="dark header__nav-link">
          Community
        </TextLink>
      </nav>
      <nav className="header__icons">
        <TextLink to="/wallet" icon={Icon} useNavLink className="dark header__nav-link" />
      </nav>
    </header>
  );
});

export default Header;
