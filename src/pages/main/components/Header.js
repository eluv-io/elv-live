import React from "react";
import {inject, observer} from "mobx-react";

import Logo from "Images/logo/fixed-eluvio-live-logo-light.svg";
import {NavLink, withRouter} from "react-router-dom";
import ImageIcon from "Common/ImageIcon";

@inject("siteStore")
@withRouter
@observer
class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scrolled: false
    };

    this.ScrollFade = this.ScrollFade.bind(this);
  }

  componentDidMount() {
    document.addEventListener("scroll", this.ScrollFade);
  }

  componentWillUnmount() {
    document.addEventListener("scroll", this.ScrollFade);
  }

  ScrollFade() {
    const fadePoint = this.props.location.pathname === "/" ? window.innerHeight * 0.25 : 20;
    this.setState({scrolled: window.scrollY > fadePoint});
  }

  render() {
    return (
      <header className={`header ${this.props.location.pathname === "/" ? "header-main" : ""} ${this.state.scrolled ? "header-scrolled" : ""}`}>
        <NavLink to="/" className="header__logo">
          <ImageIcon icon={Logo} label="Eluvio Live" />
        </NavLink>
        <div className="header__links">
          <NavLink to="/contact" className="header__link" activeClassName="header__link-active">Go Live</NavLink>
          <NavLink to="/partners" className="header__link" activeClassName="header__link-active">Partners</NavLink>
          <NavLink to="/technology" className="header__link" activeClassName="header__link-active">Technology</NavLink>
          <NavLink to="/blockchain" className="header__link" activeClassName="header__link-active">Blockchain</NavLink>
          <NavLink to="/news" className="header__link" activeClassName="header__link-active">News</NavLink>
        </div>
      </header>
    );
  }
}

export default Header;
