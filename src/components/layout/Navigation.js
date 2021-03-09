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
@observer
@withRouter
class Header extends React.Component {
  render() {
    return (
      <header className={`header ${this.props.match.url === this.props.siteStore.baseSitePath ? "header-main" : ""}`}>
        <NavLink to={this.props.siteStore.baseSitePath} className="header__logo">
          <ImageIcon icon={Logo} label="Eluvio Live" />
        </NavLink>
        <div className="header__spacer" />
        <div className="header__links">
          <NavLink to={this.props.siteStore.SitePath("code")} activeStyle={{fontWeight: "bold", color: "black"}} className="header__link" activeClassName="header__link-active">
            Redeem Ticket
          </NavLink>

          <button
            title="Your Cart"
            onClick={this.props.cartStore.ToggleCartOverlay}
            className="cart-overlay-toggle"
          >
            <ImageIcon
              icon={CartIcon}
            />
          </button>
        </div>
        <CartOverlay />
        <Checkout />
      </header>
    );
  }
}

export default Header;
