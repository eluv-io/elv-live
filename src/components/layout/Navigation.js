import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import {inject, observer} from "mobx-react";
import ImageIcon from "Common/ImageIcon";
import CartOverlay from "Event/checkout/CartOverlay";
import Checkout from "Event/checkout/Checkout";

import DefaultLogo from "Images/logo/fixed-eluvio-live-logo-light.svg";
import EluvioLogo from "Images/logo/ELUV.IO (55x12px).png";

import WalletIcon from "Icons/Wallet icon.png";
import CartIcon from "Assets/icons/cart.svg";
import EventIcon from "Assets/icons/Event Icon.png";

@inject("rootStore")
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
      const walletState = this.props.rootStore.currentWalletState;

      return (
        <div className="header__links">
          {
            !this.props.rootStore.walletLoggedIn || !this.props.siteStore.currentDropEvent ? null :
              <NavLink
                to={this.props.siteStore.SitePath("drop", this.props.siteStore.currentDropEvent, "event")}
                onClick={() => this.props.rootStore.SetWalletPanelVisibility(this.props.rootStore.defaultWalletState)}
                className="header__link"
              >
                <div className="header__link__icon">
                  <ImageIcon icon={EventIcon} title="My Wallet" className="header__link__image"/>
                </div>
                Event
              </NavLink>
          }
          {
            !this.props.rootStore.walletLoggedIn ? null :
              <button
                onClick={() => {
                  this.props.rootStore.SetWalletPanelVisibility(
                    walletState.visibility === "full" && walletState.location && walletState.location.page === "marketplace" ?
                      this.props.rootStore.defaultWalletState :
                      {
                        visibility: "full",
                        location: {
                          page: "marketplace",
                          params: {
                            marketplaceId: this.props.siteStore.currentSiteInfo.marketplaceId
                          }
                        }
                      }
                  );
                }}
                className="header__link"
              >
                <div className="header__link__icon">
                  <ImageIcon icon={CartIcon} title="My Wallet" className="header__link__image"/>
                </div>
                Marketplace
              </button>
          }
          <button
            onClick={() => {
              this.props.rootStore.SetWalletPanelVisibility(
                walletState.visibility === "full" && walletState.location && walletState.location.page === "wallet" ?
                  this.props.rootStore.defaultWalletState :
                  {
                    visibility: "full",
                    location: {
                      page: "wallet"
                    }
                  }
              );
            }}
            className="header__link"
          >
            <div className="header__link__icon">
              <ImageIcon icon={WalletIcon} title="My Wallet" className="header__link__image" />
            </div>
            { this.props.rootStore.walletLoggedIn ? "My Wallet" : "Sign In" }
          </button>
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

    let logo = <ImageIcon icon={DefaultLogo} title="Eluvio LIVE" className="header__logo header__logo-default" />;

    if(this.props.siteStore.SiteHasImage("logo")) {
      logo = (
        <div className="header__logo">
          <ImageIcon
            icon={this.props.siteStore.SiteImageUrl("logo")}
            alternateIcon={DefaultLogo}
            className="header__logo__image"
            title="Logo"
          />
          <h2 className="header__logo__tagline">
            Powered by <ImageIcon icon={EluvioLogo} className="header__logo__tagline__image" title="Eluv.io" />
          </h2>
        </div>
      );
    }

    return (
      <header className={`
        header 
        ${this.props.mainPage ? "header-main" : ""} 
        ${this.state.scrolled ? "header-scrolled" : ""} 
        ${this.props.siteStore.darkMode || this.props.dark ? "header-dark" : ""}
        ${this.props.rootStore.currentWalletState.visibility === "full" ? "header-wallet" : ""}
      `}>
        {
          this.props.rootStore.currentWalletState.visibility === "full" ?
            <button
              className="header__logo-container"
              onClick={() => this.props.rootStore.SetWalletPanelVisibility(this.props.rootStore.defaultWalletState)}
            >
              { logo }
            </button> :
            this.props.mainPage ?
              <a href={window.location.origin} className="header__logo-container">
                { logo }
              </a> :
              <NavLink to={this.props.siteStore.baseSitePath} className="header__logo-container">
                { logo }
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
