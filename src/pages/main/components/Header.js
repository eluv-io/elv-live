import React, {useState} from "react";
import {inject, observer} from "mobx-react";
import {NavLink, withRouter} from "react-router-dom";
import ImageIcon from "Common/ImageIcon";

import Logo from "Images/logo/EluvioLogoShadow.png";
import ELogo from "Images/logo/EGrayscale.png";
import CloseIcon from "Icons/arrow-left-circle";
import MenuIcon from "Icons/menu.svg";
import Modal from "Common/Modal";

const MobileNavigationMenu = inject("rootStore")(observer(({rootStore, Close}) => {
  const walletState = rootStore.currentWalletState || {};
  const loggedIn = rootStore.walletLoggedIn;
  const walletOpen = walletState.visibility === "full";

  const CloseWallet = () => {
    rootStore.SetWalletPanelVisibility(rootStore.defaultWalletState);
    Close();
  };

  return (
    <nav className="mobile-navigation__menu">
      <NavLink to="/contact" className="mobile-navigation__link" onClick={CloseWallet}>Go Live</NavLink>
      <NavLink to="/partners" className="mobile-navigation__link" onClick={CloseWallet}>Partners</NavLink>
      <NavLink to="/technology" className="mobile-navigation__link" onClick={CloseWallet}>Technology</NavLink>
      <NavLink to="/blockchain" className="mobile-navigation__link" onClick={CloseWallet}>Blockchain</NavLink>
      <NavLink to="/news" className="mobile-navigation__link" onClick={CloseWallet}>News</NavLink>
      <button
        className={`mobile-navigation__link ${loggedIn && walletOpen ? "active" : ""}`}
        onClick={() => {
          rootStore.SetWalletPanelVisibility({
            visibility: "full",
            location: {
              page: "marketplaces"
            }
          });

          Close();
        }}
      >
        Discover Marketplaces
      </button>
    </nav>
  );
}));

const MobileNavigation = ({marketplace}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="mobile-navigation">
        <button onClick={() => setShowMenu(!showMenu)} className="mobile-navigation__menu-button">
          <ImageIcon
            icon={MenuIcon}
            title={showMenu ? "Hide Navigation" : "Show Navigation"}
          />
        </button>
      </div>
      {
        showMenu ?
          <Modal className="mobile-navigation__modal" Toggle={() => setShowMenu(false)}>
            <MobileNavigationMenu marketplace={marketplace} Close={() => setShowMenu(false)} />
          </Modal> : null
      }
    </>
  );
};

@inject("rootStore")
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
    this.setState({scrolled: window.scrollY > fadePoint});
  }

  render() {
    const mainPage = this.props.location.pathname === "/" || this.props.location.pathname.startsWith("/wallet");
    const walletState = this.props.rootStore.currentWalletState || {};
    const loggedIn = this.props.rootStore.walletLoggedIn;
    const walletOpen = walletState.visibility === "full";
    const matchingPage = walletState.route === this.props.rootStore.currentWalletRoute;

    const CloseWallet = () => this.props.rootStore.SetWalletPanelVisibility(this.props.rootStore.defaultWalletState);

    if(window.location.pathname.startsWith("/wallet")) {
      return null;
    }

    return (
      <header className={`
        main-header 
        ${mainPage ? "header-main" : ""} 
        ${this.state.scrolled ? "header-scrolled" : ""}
        ${walletOpen ? "header-wallet" : ""}
      `}>
        {
          this.props.rootStore.currentWalletState.visibility === "full" ?
            <button
              className="main-header__wallet-close-button"
              onClick={() => this.props.rootStore.SetWalletPanelVisibility(this.props.rootStore.defaultWalletState)}
            >
              <ImageIcon
                icon={CloseIcon}
                title="Close Wallet"
              />
            </button> :
            <NavLink to="/" className="main-header__logo">
              <ImageIcon icon={Logo} label="Eluvio Live" />
            </NavLink>
        }

        <div className="main-header__links">
          <NavLink to="/contact" className="main-header__link" onClick={CloseWallet}>Go Live</NavLink>
          <NavLink to="/partners" className="main-header__link" onClick={CloseWallet}>Partners</NavLink>
          <NavLink to="/technology" className="main-header__link" onClick={CloseWallet}>Technology</NavLink>
          <NavLink to="/blockchain" className="main-header__link" onClick={CloseWallet}>Blockchain</NavLink>
          <NavLink to="/news" className="main-header__link" onClick={CloseWallet}>News</NavLink>
          <button
            className={`main-header__link main-header__wallet-button ${loggedIn && walletOpen ? "active" : ""} ${this.props.rootStore.walletClient ? "" : "invisible"}`}
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
          >
            <ImageIcon icon={ELogo} label="Eluvio"/>
            Discover Marketplaces
          </button>
        </div>
        <MobileNavigation />
      </header>
    );
  }
}

export default Header;
