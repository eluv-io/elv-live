import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import {inject, observer} from "mobx-react";
import CartIcon from "Assets/icons/cart.svg";
import ImageIcon from "Common/ImageIcon";
import CartOverlay from "Event/checkout/CartOverlay";
import Checkout from "Event/checkout/Checkout";

import Logo from "Images/logo/whiteEluvioLiveLogo.svg";

@inject("siteStore")
@inject("cartStore")
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
    if(!this.props.siteStore.currentSite) { return null; }

    const itemCount = this.props.cartStore.CartDetails().itemCount;

    return (
      <header className={`header ${this.props.mainPage ? "header-main" : ""} ${this.state.scrolled ? "header-scrolled" : ""} ${this.props.inverted ? "header-inverted" : ""}`}>
        {
          this.props.mainPage ?
            <a href={window.location.origin} className="header__logo">
              <ImageIcon icon={Logo} label="Eluvio Live" />
            </a> :
            <NavLink to={this.props.siteStore.baseSitePath} className="header__logo">
              <ImageIcon icon={Logo} label="Eluvio Live" />
            </NavLink>
        }
        <div className="header__spacer" />
        <div className="header__links">
          {
            this.props.hideRedeem ? null :
              <NavLink to={this.props.siteStore.SitePath(this.props.siteStore.currentSiteTicketSku ? "event" : "code")} className="header__link" activeClassName="header__link-active">
                Redeem Ticket
              </NavLink>
          }
          {
            this.props.hideCheckout ? null :
              <button
                title="Your Cart"
                onClick={this.props.cartStore.ToggleCartOverlay}
                className="cart-overlay-toggle"
              >
                <ImageIcon
                  icon={CartIcon}
                />
                {
                  itemCount === 0 ? null :
                    <div className="cart-overlay-item-count">{ itemCount }</div>
                }
              </button>
          }
        </div>
        <CartOverlay />
        <Checkout />
      </header>
    );
  }
}

export default Header;
