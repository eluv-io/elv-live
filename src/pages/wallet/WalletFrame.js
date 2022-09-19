import React from "react";
import {inject, observer} from "mobx-react";
import ImageIcon from "Common/ImageIcon";
import CloseIcon from "Icons/x";
import {PageLoader} from "Common/Loaders";

@inject("rootStore")
@inject("siteStore")
@observer
class WalletFrame extends React.Component {
  render() {
    const alwaysVisible = this.props.siteStore.marketplaceOnly;
    const visibility = alwaysVisible ? "exclusive" : this.props.rootStore.currentWalletState.visibility;

    return (
      <div className={`wallet-panel wallet-panel-${visibility}`} id="wallet-panel" key="wallet-panel">
        { alwaysVisible ? <PageLoader className={`wallet-loader ${this.props.siteStore.marketplaceNavigated ? "" : "wallet-loader--visible"}`} /> : null }
        {
          visibility === "modal" ?
            <button
              className="wallet-panel__modal-close"
              onClick={this.props.rootStore.CloseWalletModal}
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
            let marketplaceHash, marketplaceInfo;

            if(this.props.rootStore.app === "site") {
              marketplaceInfo = this.props.siteStore.currentSiteInfo.marketplace_info;

              if(!marketplaceInfo) {
                marketplaceHash = this.props.siteStore.marketplaceHash || this.props.siteStore.currentSiteInfo.marketplaceHash;
              }
            }

            if(!element || this.props.rootStore.walletTarget === element || (this.props.rootStore.app === "site" && (!marketplaceInfo && !marketplaceHash))) { return; }

            this.props.rootStore.InitializeFrameClient({
              target: element,
              tenantSlug: (marketplaceInfo || {}).tenant_slug,
              marketplaceSlug: (marketplaceInfo || {}).marketplace_slug,
              marketplaceHash,
              darkMode: this.props.siteStore.darkMode
            });
          }}
        />
      </div>
    );
  }
}

export default WalletFrame;
