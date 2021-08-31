import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import {inject, observer} from "mobx-react";
import CartIcon from "Assets/icons/cart.svg";
import ImageIcon from "Common/ImageIcon";
import CartOverlay from "Event/checkout/CartOverlay";
import Checkout from "Event/checkout/Checkout";

import DefaultLogo from "Images/logo/fixed-eluvio-live-logo-light.svg";
import WalletIcon from "Icons/Wallet icon.png";

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
    document.removeEventListener("scroll", this.ScrollFade);
  }

  ScrollFade() {
    const fadePoint = this.props.location.pathname === "/" ? window.innerHeight * 0.25 : 20;
    const scrolled = window.scrollY > fadePoint;

    if(scrolled !== this.state.scrolled) {
      this.setState({scrolled});
    }
  }

  Links() {
    if(this.props.siteStore.isDropEvent) {
      return (
        <div className="header__links">
          <NavLink to={this.props.siteStore.SitePath("wallet")} className="header__link" activeClassName="header__link-active">
            <div className="header__link__icon">
              <ImageIcon icon={WalletIcon} title="My Wallet" className="header__link__image" />
            </div>
            My Wallet
          </NavLink>
        </div>
      );
    }

    const itemCount = this.props.cartStore.CartDetails().itemCount;
    const redeemAvailable = !this.props.hideRedeem && !["Inaccessible", "Live Ended"].includes(this.props.siteStore.currentSiteInfo.state);
    const couponMode = redeemAvailable && (this.props.siteStore.currentSiteInfo.coupon_redemption || {}).coupon_mode;

    const logo = this.props.siteStore.siteSlug === "ms" ? WinLogo : EluvioLogo;
    const link = this.props.siteStore.siteSlug === "ms" ? "https://www.microsoft.com/en-us/windows/get-windows-11" : window.location.origin;

    return (
      <div className="header__links">
        {
          redeemAvailable && couponMode ?
            <NavLink to={this.props.siteStore.SitePath("coupon-code")} className="header__link" activeClassName="header__link-active">
              Redeem Coupon
            </NavLink> : null
        }
        {
          redeemAvailable ?
            <NavLink to={this.props.siteStore.SitePath(this.props.siteStore.currentSiteTicketSku ? "event" : "code")} className="header__link" activeClassName="header__link-active">
              Redeem Ticket
            </NavLink> : null
        }
        {
          this.props.siteStore.currentSiteInfo.state === "Inaccessible" || this.props.hideCheckout ? null :
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
    );
  }

  render() {
    if(!this.props.siteStore.currentSite) { return null; }

    const logo = this.props.siteStore.SiteHasImage("logo") ? this.props.siteStore.SiteImageUrl("logo") : DefaultLogo;

    return (
      <header className={`header ${this.props.mainPage ? "header-main" : ""} ${this.state.scrolled ? "header-scrolled" : ""} ${this.props.inverted ? "header-inverted" : ""}`}>
        {
          this.props.mainPage ?
            <a href={window.location.origin} className="header__logo">
              <ImageIcon icon={logo} alternateIcon={DefaultLogo} label="Eluvio Live" />
            </a> :
            <NavLink to={this.props.siteStore.baseSitePath} className="header__logo">
              <ImageIcon icon={logo} alternateIcon={DefaultLogo} label="Eluvio Live" />
            </NavLink>
        }
        <div className="header__spacer" />
        { this.Links() }
        <CartOverlay />
        <Checkout />
      </header>
    );
  }
}

export default Header;
