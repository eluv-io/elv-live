import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import {ElvWalletFrameClient} from "@eluvio/elv-wallet-frame-client";
import {Utils} from "@eluvio/elv-client-js";

import EluvioConfiguration from "EluvioConfiguration";

let walletAppUrl;
if(window.location.hostname.startsWith("192.") || window.location.hostname.startsWith("elv-test.io")) {
  walletAppUrl = `https://${window.location.hostname}:8090`;
} else if(window.location.hostname.startsWith("live-stg")) {
  walletAppUrl = EluvioConfiguration.network === "main" ?
    "https://wallet.preview.contentfabric.io" :
    "https://wallet.demov3.contentfabric.io";
} else {
  // Prod
  walletAppUrl = EluvioConfiguration.network === "main" ?
    "https://wallet.contentfabric.io" :
    "https://wallet.demov3.contentfabric.io";
}

const InitializeFrame = async (target) => {
  const frameClient = await ElvWalletFrameClient.InitializeFrame({
    target,
    darkMode: true,
    requestor: "Eluvio Live",
    walletAppUrl,
    captureLogin: true
  });

  frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.LOADED, async () => {
    const frameAddress = (await frameClient.UserProfile())?.address;

    if(frameAddress && !Utils.EqualAddress(frameAddress, mainStore.walletClient.UserAddress())) {
      // eslint-disable-next-line no-console
      //console.error("Frame logged in with wrong account");

      // If account in frame is not the same as wallet client, or if frame is logged in but wallet client is not, log out of frame
      // Don't think we need this for the main site
      // frameClient.LogOut();
    } else if(!frameAddress && mainStore.walletClient.ClientAuthToken()) {
      await frameClient.LogIn({clientAuthToken: mainStore.walletClient.ClientAuthToken()});
    }
  });

  frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.CLOSE, async () => {
    setTimeout(async () => InitializeFrame(target), 2000);
  });

  frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.LOG_IN_REQUESTED, async () => {
    if(mainStore.walletClient.loggedIn) { return; }

    mainStore.walletClient.LogIn({
      method: "redirect",
      callbackUrl: window.location.href,
      clearLogin: true
    });
  });

  frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.LOG_OUT, () => {
    mainStore.walletClient.LogOut();
  });

  if(window.location.hash) {
    await frameClient.Navigate({
      path: window.location.hash.replace("#/", "/")
    });
  }

  frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.ROUTE_CHANGE, event =>
    window.location.hash = event.data
  );

  return frameClient;
};

const Wallet = observer(() => {
  const [frameClient, setFrameClient] = useState(undefined);

  useEffect(() => {
    mainStore.InitializeWalletClient();

    window.scrollTo(0, 0);

    // Disable body scroll so only wallet app can scroll
    document.body.classList.add("wallet");

    return () => document.body.classList.remove("wallet");
  }, []);

  useEffect(() => {
    if(!frameClient) { return; }

    const HandleWalletPathChange = async () => {
      const currentPath = await frameClient.CurrentPath();
      const hashPath = window.location.hash.replace("#/", "/");

      if(currentPath === hashPath) {
        return;
      }

      frameClient.Navigate({
        path: hashPath
      });
    };

    window.addEventListener("hashchange", HandleWalletPathChange);

    return () => window.removeEventListener("hashchange", HandleWalletPathChange);
  }, [frameClient]);

  return (
    <div
      key={`wallet-${!!mainStore.walletClient}`}
      className="page dark no-padding wallet"
      ref={async element =>
        element &&
        !frameClient &&
        mainStore.walletClient &&
        setFrameClient(await InitializeFrame(element))
      }
    />
  );
});

export default Wallet;
