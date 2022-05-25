import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import {inject, observer} from "mobx-react";
import ImageIcon from "Common/ImageIcon";
import CartOverlay from "Event/checkout/CartOverlay";
import Checkout from "Event/checkout/Checkout";

import DefaultLogo from "Images/logo/fixed-eluvio-live-logo-light.svg";

import MarketplacesIcon from "Icons/squares.svg";
import WalletIcon from "Icons/Wallet Icon.svg";
import CartIcon from "Assets/icons/cart.svg";
import EventIcon from "Assets/icons/Event icon.svg";
import CloseIcon from "Assets/icons/arrow-left-circle.svg";

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

  MarketplaceLinks() {
    let marketplaceInfo = this.props.siteStore.loginCustomization || {};
    if(!marketplaceInfo.marketplace_slug) {
      return null;
    }

    const walletState = this.props.rootStore.currentWalletState || {};
    const currentPage = (walletState.location || {}).page;
    const walletOpen = walletState.visibility === "full";
    const hideGlobalNavigation = marketplaceInfo.hide_global_navigation;

    // Actual current wallet path matches the one that the button has opened - so a second click should close it
    const matchingPage = walletState.route === walletState.route;

    let loginButton, walletButton;
    if(this.props.rootStore.walletLoggedIn) {
      walletButton = (
        <button
          onClick={() => {
            this.props.rootStore.SetWalletPanelVisibility(
              walletState.visibility === "full" && walletState.location && walletState.location.page === "wallet" && matchingPage ?
                this.props.rootStore.defaultWalletState :
                {
                  visibility: "full",
                  location: {
                    page: hideGlobalNavigation ? "marketplaceWallet" : "wallet",
                    params: {
                      tenantSlug: marketplaceInfo.tenant_slug,
                      marketplaceSlug: marketplaceInfo.marketplace_slug
                    }
                  }
                }
            );
          }}
          className={`header__link header__link-wallet ${walletOpen && ["wallet", "marketplaceWallet"].includes(currentPage) ? "header__link-active" : ""}`}
        >
          <div className="header__link__icon">
            <ImageIcon icon={WalletIcon} title="My Wallet" className="header__link__image"/>
          </div>
          My Wallet
        </button>
      );
    } else if(this.props.rootStore.currentWalletState.visibility === "hidden") {
      loginButton = (
        <button
          onClick={() => this.props.rootStore.ShowLogin()}
          className="header__link"
        >
          <div className="header__link__icon">
            <ImageIcon icon={WalletIcon} title="Wallet" className="header__link__image"/>
          </div>
          Log In
        </button>
      );
    }

    let eventButton;
    if(this.props.siteStore.currentDropEvent) {
      eventButton = (
        <NavLink
          to={this.props.siteStore.SitePath("drop", this.props.siteStore.currentDropEvent, "event")}
          onClick={() => this.props.rootStore.SetWalletPanelVisibility(this.props.rootStore.defaultWalletState)}
          className={`header__link ${currentPage === "drop" ? "header__link-active" : ""}`}
        >
          <div className="header__link__icon">
            <ImageIcon icon={EventIcon} title="Event" className="header__link__image"/>
          </div>
          Event
        </NavLink>
      );
    }

    const storeButton = (
      <button
        onClick={() => {
          this.props.rootStore.SetWalletPanelVisibility(
            walletState.visibility === "full" && walletState.location && ["marketplace", "marketplaceListings"].includes(currentPage) && matchingPage ?
              this.props.rootStore.defaultWalletState :
              {
                visibility: "full",
                location: {
                  page: marketplaceInfo.default_store_page === "Listings" ? "marketplaceListings" : "marketplace",
                  params: {
                    tenantSlug: marketplaceInfo.tenant_slug,
                    marketplaceSlug: marketplaceInfo.marketplace_slug
                  }
                }
              }
          );
        }}
        className={`header__link ${walletOpen && ["marketplace", "marketplaceListings"].includes(currentPage) ? "header__link-active" : ""}`}
      >
        <div className="header__link__icon">
          <ImageIcon icon={CartIcon} title="Store" className="header__link__image"/>
        </div>
        Store
      </button>
    );

    let marketplacesButton;
    if(!hideGlobalNavigation) {
      marketplacesButton = (
        <button
          onClick={() => {
            this.props.rootStore.SetWalletPanelVisibility(
              walletState.visibility === "full" && walletState.location && walletState.location.page === "marketplaces" && matchingPage ?
                this.props.rootStore.defaultWalletState :
                {
                  visibility: "full",
                  location: {
                    page: "marketplaces"
                  }
                }
            );
          }}
          className={`header__link header__link--no-mobile ${walletOpen && currentPage === "marketplaces" ? "header__link-active" : ""}`}
        >
          <div className="header__link__icon header__link__icon-marketplace">
            <ImageIcon icon={MarketplacesIcon} title="Marketplaces" className="header__link__image"/>
          </div>
          Marketplaces
        </button>
      );
    }


    if(!this.props.rootStore.walletClient || !this.props.rootStore.walletLoaded) {
      return null;
    }

    return (
      <>
        { loginButton }
        { eventButton}
        { storeButton }
        { marketplacesButton }
        { walletButton }
      </>
    );
  }

  Links() {
    if(this.props.siteStore.ticketClasses.length === 0) {
      return null;
    }

    const itemCount = this.props.cartStore.CartDetails().itemCount;
    const redeemAvailable = !this.props.hideRedeem && !["Inaccessible", "Ended", "Live Ended"].includes(this.props.siteStore.currentSiteInfo.state);
    const couponMode = redeemAvailable && (this.props.siteStore.currentSiteInfo.coupon_redemption || {}).coupon_mode;
    const ticketsAvailable = !!this.props.siteStore.ticketClasses
      .find(ticketClass => !ticketClass.hidden && (ticketClass.skus || []).find(sku => !sku.hidden));

    return (
      <>
        {
          !this.props.siteStore.currentDropEvent && redeemAvailable && couponMode ?
            <NavLink
              to={this.props.siteStore.SitePath("coupon-code")}
              onClick={() => this.props.rootStore.SetWalletPanelVisibility(this.props.rootStore.defaultWalletState)}
              className="header__link header__link--no-wallet"
              activeClassName="header__link-active"
            >
              Redeem Coupon
            </NavLink> : null
        }
        {
          !this.props.siteStore.currentDropEvent && redeemAvailable ?
            <NavLink
              to={this.props.siteStore.SitePath("code")}
              onClick={() => this.props.rootStore.SetWalletPanelVisibility(this.props.rootStore.defaultWalletState)}
              className="header__link header__link--no-wallet"
              activeClassName="header__link-active"
            >
              Redeem Ticket
            </NavLink> : null
        }
        {
          !ticketsAvailable || this.props.siteStore.currentSiteInfo.state === "Inaccessible" || this.props.hideCheckout ? null :
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
      </>
    );
  }

  render() {
    if(!this.props.siteStore.currentSite) { return null; }

    let logo = <ImageIcon icon={DefaultLogo} title="Eluvio LIVE" className="header__logo header__logo-default" />;
    let logoUrl = window.location.origin;

    if(this.props.siteStore.SiteHasImage("logo")) {
      logo = (
        <ImageIcon
          icon={this.props.siteStore.SiteImageUrl("logo")}
          alternateIcon={DefaultLogo}
          className="header__logo"
          title="Logo"
        />
      );

      logoUrl = this.props.siteStore.currentSiteInfo.event_images && this.props.siteStore.currentSiteInfo.event_images.logo_link || logoUrl;
    }

    const hasTickets = this.props.siteStore.ticketClasses.length > 0;

    return (
      <header className={`
        header 
        ${this.props.transparent ? "header-transparent" : ""} 
        ${this.state.scrolled ? "header-scrolled" : ""} 
        ${this.props.siteStore.darkMode || this.props.dark || this.props.rootStore.currentWalletState.visibility === "full" ? "header-dark" : ""}
        ${this.props.rootStore.currentWalletState.visibility === "full" ? "header-wallet" : ""}
      `}>
        {
          this.props.rootStore.currentWalletState.visibility === "full" ?
            <button
              className="header__wallet-close-button"
              onClick={() => this.props.rootStore.SetWalletPanelVisibility(this.props.rootStore.defaultWalletState)}
            >
              <ImageIcon
                icon={CloseIcon}
                title="Close Wallet"
              />
            </button> :
            this.props.mainPage ?
              <a href={logoUrl} className="header__logo-container">
                { logo }
              </a> :
              <NavLink to={this.props.siteStore.baseSitePath} className="header__logo-container">
                { logo }
              </NavLink>
        }
        <div className="header__spacer" />
        <div className={`header__links ${hasTickets ? "header__links-no-icons" : ""}`}>
          { this.MarketplaceLinks() }
          { hasTickets ? this.Links() : null }
        </div>
        <CartOverlay />
        <Checkout />
      </header>
    );
  }
}

export default Header;
