import React from "react";
import {inject, observer} from "mobx-react";
import LoginModal from "Pages/login";
import ImageIcon from "Common/ImageIcon";
import CloseIcon from "Icons/x";

@inject("rootStore")
@inject("siteStore")
@observer
class WalletFrame extends React.Component {
  render() {
    if(!this.props.siteStore.currentSiteInfo || !this.props.siteStore.siteId) { return null; }

    const visibility = !this.props.rootStore.walletLoggedIn ? "hidden" : this.props.rootStore.currentWalletState.visibility;
    return (
      <>
        {
          !this.props.rootStore.walletLoggedIn &&
          this.props.rootStore.currentWalletState.visibility !== "hidden" &&
          !window.location.pathname.startsWith("/wallet")
            ?
            <LoginModal />
            : null
        }
        <div className={`wallet-panel wallet-panel-${visibility}`} id="wallet-panel" key="wallet-panel">
          {
            visibility === "modal" ?
              <button
                className="wallet-panel__modal-close"
                onClick={rootStore.CloseWalletModal}
              >
                <ImageIcon
                  icon={CloseIcon}
                />
              </button> : null
          }
          <div
            key={`wallet-frame-${this.props.rootStore.walletKey}`}
            className="wallet-target"
            ref={element => {
              if(!element || this.props.rootStore.walletTarget === element) { return; }

              this.props.rootStore.InitializeWalletClient({
                target: element,
                marketplaceHash: this.props.siteStore.marketplaceHash || this.props.siteStore.currentSiteInfo.marketplaceHash,
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
