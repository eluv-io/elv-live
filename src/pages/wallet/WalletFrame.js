import React, {useState} from "react";
import {observer} from "mobx-react";
import ImageIcon from "Common/ImageIcon";
import CloseIcon from "Icons/x";
import {PageLoader} from "Common/Loaders";
import {rootStore, siteStore} from "Stores";
import UrlJoin from "url-join";

const WalletFrame = observer(() => {
  const [frameLoaded, setFrameLoaded] = useState(false);
  const marketplaceRoute = window.location.pathname.includes("/marketplace");
  const alwaysVisible = siteStore.marketplaceOnly;
  const visibility = alwaysVisible ? "exclusive" : rootStore.currentWalletState.visibility;
  const loaded = rootStore.app === "main" ? siteStore.siteLoaded : siteStore.currentSite;

  return (
    <div className={`wallet-panel wallet-panel-${visibility}`} id="wallet-panel" key="wallet-panel">
      {
        alwaysVisible || (marketplaceRoute && !frameLoaded) ?
          <PageLoader className={`wallet-loader ${siteStore.marketplaceNavigated ? "" : "wallet-loader--visible"}`} /> :
          null
      }
      {
        visibility === "modal" ?
          <button
            className="wallet-panel__modal-close"
            onClick={rootStore.CloseWalletModal}
          >
            <ImageIcon
              icon={CloseIcon}
            />
          </button> :
          null
      }
      <div
        key={`wallet-frame-${rootStore.walletKey}-${loaded}`}
        className="wallet-target"
        ref={async element => {
          if(!loaded) { return; }

          let marketplaceHash, marketplaceInfo;

          if(rootStore.app === "site") {
            marketplaceInfo = siteStore.currentSiteInfo.marketplace_info;

            if(!marketplaceInfo) {
              marketplaceHash = siteStore.marketplaceHash || siteStore.currentSiteInfo.marketplaceHash;
            }
          }

          if(!element || rootStore.walletTarget === element || (rootStore.app === "site" && (!marketplaceInfo && !marketplaceHash))) { return; }

          await rootStore.InitializeFrameClient({
            target: element,
            tenantSlug: (marketplaceInfo || {}).tenant_slug,
            marketplaceSlug: (marketplaceInfo || {}).marketplace_slug,
            marketplaceHash,
            darkMode: siteStore.darkMode
          });

          if(marketplaceRoute) {
            const path = window.location.pathname.split("/marketplace")[1];

            if(path) {
              rootStore.frameClient.Navigate({
                path: UrlJoin("/marketplace", siteStore.marketplaceId, path)
              });
            }
          }

          setFrameLoaded(true);
        }}
      />
    </div>
  );
});


export default WalletFrame;
