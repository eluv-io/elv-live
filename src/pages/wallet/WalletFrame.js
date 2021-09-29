import React from "react";
import {inject, observer} from "mobx-react";
import Login from "Pages/login";

@inject("rootStore")
@inject("siteStore")
@observer
class WalletFrame extends React.Component {
  render() {
    if(!this.props.siteStore.currentSiteInfo || !this.props.siteStore.siteId) { return null; }

    const visibility = !this.props.rootStore.walletLoggedIn ? "hidden" : this.props.rootStore.currentWalletState.visibility;
    return (
      <>
        { !this.props.rootStore.walletLoggedIn && this.props.rootStore.currentWalletState.visibility !== "hidden" && !window.location.pathname.startsWith("/wallet") ? <Login /> : null }
        <div className={`wallet-panel wallet-panel-${visibility}`} id="wallet-panel" key="wallet-panel">
          <div
            className="wallet-target"
            ref={element => {
              if(!element || this.props.rootStore.walletTarget === element) { return; }

              this.props.rootStore.InitializeWalletClient({
                target: element,
                marketplaceId: this.props.siteStore.marketplaceId || this.props.siteStore.currentSiteInfo.marketplaceId,
                darkMode: this.props.siteStore.darkMode
              });
            }}
          />
        </div>
      </>
    );
  }
}

export default WalletFrame;
