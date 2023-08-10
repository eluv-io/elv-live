import React from "react";
import { NavLink } from "react-router-dom";
import {inject, observer} from "mobx-react";
import ImageIcon from "Common/ImageIcon";
import CartOverlay from "Event/checkout/CartOverlay";
import Checkout from "Event/checkout/Checkout";
import MenuButton from "Common/MenuButton";
import {rootStore, siteStore} from "Stores";
import UrlJoin from "url-join";

import DefaultLogo from "Images/logo/fixed-eluvio-live-logo-light.svg";

import DiscoverIcon from "Icons/discover.svg";
import WalletIcon from "Icons/Wallet Icon.svg";
import CartIcon from "Assets/icons/cart.svg";
import EventIcon from "Assets/icons/Event icon.svg";
import CloseIcon from "Assets/icons/arrow-left-circle.svg";

const StoreDropdown = observer(({walletOpen, currentPage}) => {
  const marketplaces = [siteStore.marketplaceInfo, ...siteStore.additionalMarketplaces.filter(marketplace => !marketplace.hidden)];

  const ShowMarketplace = ({tenant_slug, marketplace_slug, default_store_page}) => {
    rootStore.SetWalletPanelVisibility({
      visibility: "full",
      location: {
        page: default_store_page === "Listings" ? "marketplaceListings" : "marketplace",
        params: {
          tenantSlug: tenant_slug,
          marketplaceSlug: marketplace_slug
        }
      }
    });
  };

  if(marketplaces.length === 1) {
    return (
      <button
        onClick={() => ShowMarketplace({...marketplaces[0]})}
        className={`header__link ${walletOpen && ["marketplace", "marketplaceListings"].includes(currentPage) ? "header__link-active" : ""}`}
      >
        <div className="header__link__icon">
          <ImageIcon icon={CartIcon} title="Store" className="header__link__image"/>
        </div>
        { siteStore.l10n.header.store }
      </button>
    );
  }

  return (
    <MenuButton
      items={marketplaces.map(marketplaceInfo => ({
        onClick: () => ShowMarketplace({...marketplaceInfo}),
        label: marketplaceInfo.name
      }))}
      className={`header__link header__dropdown ${walletOpen && ["marketplace", "marketplaceListings"].includes(currentPage) ? "header__link-active" : ""}`}
    >
      <div className="header__link__icon">
        <ImageIcon icon={CartIcon} title="Store" className="header__link__image"/>
      </div>
      { siteStore.l10n.header.stores }
    </MenuButton>
  );
});

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scrolled: false,
      scrolledPastHero: false
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
    this.setState({
      scrolled: window.scrollY > 0
    });
  }

  MarketplaceLinks() {
    let marketplaceInfo = this.props.siteStore.marketplaceInfo || {};
    if(!marketplaceInfo.marketplace_slug || marketplaceInfo.disable_marketplace) {
      return null;
    }

    const walletState = this.props.rootStore.currentWalletState || {};
    const currentPage = (walletState.location || {}).page;
    const walletOpen = walletState.visibility === "full";
    const hideGlobalNavigation = marketplaceInfo.hide_global_navigation;
    const l10n = this.props.siteStore.l10n;

    let loginButton, walletButton;
    if(this.props.rootStore.walletLoggedIn) {
      walletButton = (
        <button
          onClick={() => {
            this.props.rootStore.SetWalletPanelVisibility({
              visibility: "full",
              location: {
                page: hideGlobalNavigation ? "marketplaceWallet" : "wallet",
                params: {
                  tenantSlug: marketplaceInfo.tenant_slug,
                  marketplaceSlug: marketplaceInfo.marketplace_slug
                }
              }
            });
          }}
          className={`header__link header__link-wallet ${walletOpen && ["wallet", "marketplaceWallet"].includes(currentPage) ? "header__link-active" : ""}`}
        >
          <div className="header__link__icon">
            <ImageIcon icon={WalletIcon} title="My Wallet" className="header__link__image"/>
          </div>
          { l10n.header.my_wallet }
        </button>
      );
    } else if(this.props.rootStore.currentWalletState.visibility === "hidden") {
      loginButton = (
        <button
          onClick={() => {
            const postLogin = this.props.siteStore.currentSiteInfo.event_info?.post_login || {};
            let path;
            if(postLogin.action === "marketplace") {
              path = UrlJoin("/", this.props.siteStore.tenantSlug || "", this.props.siteStore.siteSlug, "marketplace");

              if(postLogin.sku) {
                path = UrlJoin(path, "store", postLogin.sku);

                if(postLogin.sku) {
                  path = UrlJoin(path, "store", postLogin.sku);
                  if(postLogin.sku && postLogin.redirect_to_owned_item) {
                    path = path + "?redirect=owned";
                  }
                }
              }
            }

            this.props.rootStore.LogIn(path);
          }}
          className="header__link"
        >
          <div className="header__link__icon">
            <ImageIcon icon={WalletIcon} title="Wallet" className="header__link__image"/>
          </div>
          { l10n.header.sign_in }
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
          { l10n.header.event }
        </NavLink>
      );
    }

    const storeButton = <StoreDropdown walletOpen currentPage />;

    let marketplacesButton;
    if(!hideGlobalNavigation) {
      marketplacesButton = (
        <button
          onClick={() => {
            this.props.rootStore.SetWalletPanelVisibility({
              visibility: "full",
              location: {
                page: "marketplaces"
              }
            });
          }}
          className={`header__link header__link--no-mobile ${walletOpen && currentPage === "marketplaces" ? "header__link-active" : ""}`}
        >
          <div className="header__link__icon header__link__icon-marketplace">
            <ImageIcon icon={DiscoverIcon} title="Marketplaces" className="header__link__image"/>
          </div>
          { l10n.header.discover_projects }
        </button>
      );
    }


    // if(!this.props.rootStore.frameClient || !this.props.rootStore.walletLoaded) {
    //   return null;
    // }

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
    const redeemAvailable = false;
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
              className={({isActive}) => `header__link header__link--no-wallet ${isActive ? "header__link-active" : ""}`}
            >
              Redeem Coupon
            </NavLink> : null
        }
        {
          !this.props.siteStore.currentDropEvent && redeemAvailable ?
            <NavLink
              to={this.props.siteStore.SitePath("code")}
              onClick={() => this.props.rootStore.SetWalletPanelVisibility(this.props.rootStore.defaultWalletState)}
              className={({isActive}) => `header__link header__link--no-wallet ${isActive ? "header__link-active" : ""}`}
            >
              { this.props.siteStore.l10n.header.redeem_code }
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
    if(!this.props.siteStore.currentSite || this.props.siteStore.marketplaceOnly) { return null; }

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
        ${this.props.mainPage ? "header-main" : ""}
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

export default inject("rootStore")(inject("siteStore")(inject("cartStore")(observer(Header))));
