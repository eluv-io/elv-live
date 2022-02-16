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
    const marketplaceInfo = this.props.siteStore.loginCustomization || {};
    if(!marketplaceInfo.marketplace_slug) {
      return null;
    }

    const walletState = this.props.rootStore.currentWalletState || {};
    const loggedIn = this.props.rootStore.walletLoggedIn;
    const currentPage = (walletState.location || {}).page;
    const walletOpen = walletState.visibility === "full";
    const hideGlobalNavigation = marketplaceInfo.hide_global_navigation;

    // Actual current wallet path matches the one that the button has opened - so a second click should close it
    const matchingPage = walletState.route === this.props.rootStore.currentWalletRoute;


    if(!this.props.rootStore.walletClient || !this.props.rootStore.showWalletLinks) {
      return null;
    } else if(!this.props.rootStore.walletLoggedIn) {
      return (
        <>
          <button
            onClick={() => {
              this.props.rootStore.SetWalletPanelVisibility({
                visibility: "modal",
                location: {
                  page: "wallet"
                }
              });
            }}
            className="header__link"
          >
            <div className="header__link__icon">
              <ImageIcon icon={WalletIcon} title="My Wallet" className="header__link__image"/>
            </div>
            Log In
          </button>
        </>
      );
    } else {
      return (
        <>
          {
            this.props.siteStore.currentDropEvent ?
              <NavLink
                to={this.props.siteStore.SitePath("drop", this.props.siteStore.currentDropEvent, "event")}
                onClick={() => this.props.rootStore.SetWalletPanelVisibility(this.props.rootStore.defaultWalletState)}
                className={`header__link ${loggedIn && currentPage === "drop" ? "header__link-active" : ""}`}
              >
                <div className="header__link__icon">
                  <ImageIcon icon={EventIcon} title="My Wallet" className="header__link__image"/>
                </div>
                Event
              </NavLink> : null
          }
          <button
            onClick={() => {
              this.props.rootStore.SetWalletPanelVisibility(
                walletState.visibility === "full" && walletState.location && walletState.location.page === "marketplace" && matchingPage ?
                  this.props.rootStore.defaultWalletState :
                  {
                    visibility: "full",
                    location: {
                      page: "marketplace",
                      params: {
                        tenantSlug: marketplaceInfo.tenant_slug,
                        marketplaceSlug: marketplaceInfo.marketplace_slug
                      }
                    }
                  }
              );
            }}
            className={`header__link ${loggedIn && walletOpen && currentPage === "marketplace" ? "header__link-active" : ""}`}
          >
            <div className="header__link__icon">
              <ImageIcon icon={CartIcon} title="My Wallet" className="header__link__image"/>
            </div>
            Store
          </button>
          {
            !hideGlobalNavigation ?
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
                className={`header__link ${loggedIn && walletOpen && currentPage === "marketplaces" ? "header__link-active" : ""}`}
              >
                <div className="header__link__icon header__link__icon-marketplace">
                  <ImageIcon icon={MarketplacesIcon} title="My Wallet" className="header__link__image"/>
                </div>
                Marketplaces
              </button> : null
          }
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
            className={`header__link header__link-wallet ${loggedIn && walletOpen && ["wallet", "marketplaceWallet"].includes(currentPage) ? "header__link-active" : ""}`}
          >
            <div className="header__link__icon">
              <ImageIcon icon={WalletIcon} title="My Wallet" className="header__link__image"/>
            </div>
            My Wallet
          </button>
        </>
      );
    }
  }

  Links() {
    if(this.props.siteStore.ticketClasses.length === 0) {
      return null;
    }

    const itemCount = this.props.cartStore.CartDetails().itemCount;
    const redeemAvailable = !this.props.hideRedeem && !["Inaccessible", "Ended", "Live Ended"].includes(this.props.siteStore.currentSiteInfo.state);
    const couponMode = redeemAvailable && (this.props.siteStore.currentSiteInfo.coupon_redemption || {}).coupon_mode;

    return (
      <>
        {
          redeemAvailable && couponMode ?
            <NavLink to={this.props.siteStore.SitePath("coupon-code")} className="header__link" activeClassName="header__link-active">
              Redeem Coupon
            </NavLink> : null
        }
        {
          redeemAvailable ?
            <NavLink to={this.props.siteStore.SitePath("code")} className="header__link" activeClassName="header__link-active">
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
