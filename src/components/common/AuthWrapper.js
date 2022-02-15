import React, {useEffect} from "react";
import EluvioConfiguration from "EluvioConfiguration";
import {inject, observer} from "mobx-react";
import {PageLoader} from "Common/Loaders";
import LoginModal from "Pages/login";
import {Auth0Provider, useAuth0} from "@auth0/auth0-react";
import WalletFrame from "Pages/wallet/WalletFrame";

const baseUrl = new URL(window.location.origin);

export const LoginPage = inject("rootStore")(inject("siteStore")((observer(({rootStore, siteStore, openWallet, closeWallet}) => {
  useEffect(() => {
    if(openWallet) {
      sessionStorage.setItem("wallet-visibility", "full");
    } else if(closeWallet) {
      sessionStorage.removeItem("wallet-visibility");
      rootStore.SetWalletPanelVisibility({visibility: "hidden"});
    }
  }, []);

  if(!rootStore.client) { return <PageLoader />; }

  return (
    <div className={`page-container login-route ${siteStore.loginCustomization.darkMode ? "login-route-dark" : "login-page"}`}>
      <LoginModal callbackPage />
    </div>
  );
}))));

const LogOutHandler = inject("rootStore")((observer(({rootStore}) => {
  const auth0 = useAuth0();
  const logOutUrl = new URL(baseUrl.toString());
  logOutUrl.pathname = "/wallet/logout";

  if(rootStore.loggedOut) {
    localStorage.setItem("redirectPath", window.location.pathname);

    auth0.logout({
      returnTo: logOutUrl.toString()
    });
  }

  return null;
})));


const AuthWrapper = inject("siteStore")(observer(({siteStore, children}) => {
  const callbackUrl = new URL(baseUrl.toString());
  callbackUrl.pathname = "/wallet/callback";

  return (
    <Auth0Provider
      domain={EluvioConfiguration["auth0-domain"] || "auth.contentfabric.io"}
      clientId={EluvioConfiguration["auth0-configuration-id"] || "ONyubP9rFI5BHzmYglQKBZ1bBbiyoB3S"}
      redirectUri={callbackUrl.toString()}
      useRefreshTokens
      darkMode={siteStore.loginCustomization.darkMode}
    >
      { children }
      <LogOutHandler />
      <WalletFrame />
    </Auth0Provider>
  );
}));

export default AuthWrapper;
