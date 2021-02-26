import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import {inject, observer} from "mobx-react";
import DarkLogo from "Images/logo/darkEluvioLiveLogo.png";
import LightLogo from "Images/logo/lightEluvioLiveLogo.png";
import SunIcon from "Assets/icons/sun.svg";
import CartIcon from "Assets/icons/cart.svg";
import ImageIcon from "Common/ImageIcon";
import CartOverlay from "Event/checkout/CartOverlay";
import Checkout from "Event/checkout/Checkout";

@inject("rootStore")
@inject("siteStore")
@inject("cartStore")
@observer
class Navigation extends React.Component {
  render() {
    return (
      <div className="navigation">
        <div className="main-nav">
          <NavLink to={this.props.siteStore.baseSitePath}  className="main-nav--logo">
            <img src={this.props.siteStore.darkMode ? LightLogo : DarkLogo} className="main-nav--logo" />
          </NavLink>

          <div className="main-nav__link-group">
            <NavLink to={this.props.siteStore.SitePath("code")} activeStyle={{fontWeight: "bold", color: "black"}} className="link-item">
              Redeem Ticket
            </NavLink>
          </div>

          <button
            title="Your Cart"
            onClick={this.props.cartStore.ToggleCartOverlay}
            className="cart-overlay-toggle"
          >
            <ImageIcon
              icon={CartIcon}
            />
          </button>

          <button
            title={`Switch to ${this.props.siteStore.darkMode ? "light" : "dark"} mode`}
            onClick={this.props.siteStore.ToggleDarkMode}
            className="dark-mode-toggle"
          >
            <ImageIcon
              icon={SunIcon}
            />
          </button>
        </div>

        <CartOverlay />
        { this.props.cartStore.showCheckoutOverlay ? <Checkout /> : null }
      </div>
    );
  }
}


export default withRouter(Navigation);

