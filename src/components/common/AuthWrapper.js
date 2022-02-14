import React from "react";
import EluvioConfiguration from "EluvioConfiguration";
import {inject, observer} from "mobx-react";
import {PageLoader} from "Common/Loaders";
import LoginModal from "Pages/login";
import {Auth0Provider, useAuth0} from "@auth0/auth0-react";
import WalletFrame from "Pages/wallet/WalletFrame";

const baseUrl = new URL(window.location.origin);

const callbackUrl = new URL(baseUrl.toString());
callbackUrl.pathname = "/wallet/callback";

const logOutUrl = new URL(baseUrl.toString());
logOutUrl.pathname = "/wallet/logout";

export const LoginPage = inject("rootStore")(inject("siteStore")((observer(({rootStore, siteStore}) => {
  if(!rootStore.client) { return <PageLoader />; }

  return (
    <div className={`page-container login-route ${siteStore.loginCustomization.darkMode ? "login-route-dark" : "login-page"}`}>
      <LoginModal callbackPage />
    </div>
  );
}))));

const LogOutHandler = inject("rootStore")(inject("siteStore")((observer(({rootStore, siteStore}) => {
  const auth0 = useAuth0();

  if(rootStore.loggedOut) {
    localStorage.setItem(
      "loginCustomization",
      JSON.stringify({
        redirectPath: window.location.pathname,
        ...siteStore.loginCustomization
      })
    );

    auth0.logout({
      returnTo: logOutUrl.toString()
    });
  }

  return null;
}))));


const AuthWrapper = inject("siteStore")(observer(({siteStore, children}) => {
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
