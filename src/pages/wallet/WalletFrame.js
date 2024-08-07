import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import ImageIcon from "Common/ImageIcon";
import CloseIcon from "Icons/x";
import {PageLoader} from "Common/Loaders";
import {rootStore, siteStore} from "Stores";
import UrlJoin from "url-join";

const WalletFrame = observer(() => {
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [storefrontAnalyticsFired, setStorefrontAnalyticsFired] = useState(false);
  const marketplaceRoute = window.location.pathname.includes("/marketplace");
  const walletRoute = window.location.pathname.includes("/wallet");
  const alwaysVisible = siteStore.marketplaceOnly;
  const visibility = alwaysVisible ? "exclusive" : rootStore.currentWalletState.visibility;
  const loaded = rootStore.app === "main" ? siteStore.siteLoaded : siteStore.currentSite;

  useEffect(() => {
    if(!loaded || !walletRoute) { return; }

    if(!rootStore.walletLoggedIn) {
      rootStore.LogIn();
    }
  }, [walletRoute, loaded]);

  useEffect(() => {
    if(
      storefrontAnalyticsFired ||
      !siteStore.analyticsInitialized ||
      !(rootStore.currentWalletState.visibility === "full" || siteStore.marketplaceOnly) ||
      !(rootStore.currentWalletState.route || "").startsWith("/marketplace/")
    ) {
      return;
    }

    siteStore.AddAnalyticsEvent({
      analytics: siteStore.currentSiteInfo.marketplace_page_view_analytics,
      eventName: "Marketplace Page View"
    });

    setStorefrontAnalyticsFired(true);
  }, [siteStore.analyticsInitialized, rootStore.currentWalletState]);

  return (
    <div className={`wallet-panel wallet-panel-${visibility}`} id="wallet-panel" key="wallet-panel">
      {
        alwaysVisible || ((marketplaceRoute || walletRoute) && !frameLoaded) ?
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
            const path = window.location.pathname.split("/marketplace")[1] + window.location.search;

            if(path) {
              rootStore.frameClient.Navigate({
                path: UrlJoin("/marketplace", siteStore.marketplaceId, path)
              });
            }

            window.history.replaceState(undefined, undefined, window.location.href.replace(/\/marketplace\/.+/, ""));
          } else if(walletRoute && rootStore.walletLoggedIn) {
            const path = window.location.pathname.split("/wallet")[1] + window.location.search;

            if(path) {
              rootStore.frameClient.Navigate({path});
            }

            window.history.replaceState(undefined, undefined, window.location.href.replace(/\/wallet\/.+/, ""));
          }

          setFrameLoaded(true);
        }}
      />
    </div>
  );
});


export default WalletFrame;
