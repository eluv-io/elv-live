import React, {useState, useEffect} from "react";
import EluvioConfiguration from "EluvioConfiguration";
import {inject, observer} from "mobx-react";
import {PageLoader} from "Common/Loaders";
import Login from "../../login/Login";
import {Auth0Provider, useAuth0} from "@auth0/auth0-react";
import WalletFrame from "Pages/wallet/WalletFrame";
import Modal from "Common/Modal";
import {Redirect} from "react-router";

export const LoginModal = inject("rootStore")(inject("siteStore")(observer(({rootStore, siteStore}) => {
  if(rootStore.walletLoggedIn || !rootStore.client || rootStore.loggedOut || (rootStore.app === "site" && !siteStore.marketplaceHash)) {
    return null;
  }

  if(!rootStore.showLogin) { return null; }

  sessionStorage.setItem("redirectPath", window.location.pathname);

  const callbackUrl = new URL(window.location.origin);
  callbackUrl.pathname = "/wallet/callback";

  return (
    <Modal className="login-modal" Toggle={() => rootStore.HideLogin()}>
      <Login
        darkMode={rootStore.app === "site" ? siteStore.darkMode : true}
        callbackUrl={callbackUrl.toString()}
        Loaded={() => rootStore.SetLoginLoaded()}
        LoadCustomizationOptions={async () => await siteStore.LoadLoginCustomization()}
        SignIn={params => rootStore.SetAuthInfo(params)}
        Close={() => rootStore.HideLogin()}
      />
    </Modal>
  );
})));

export const LoggedOutRedirect = () => {
  const redirectUrl = sessionStorage.getItem("redirectPath") || "/";

  return <Redirect to={redirectUrl} />;
};

export const LogOutHandler = inject("rootStore")((observer(({rootStore}) => {
  const auth0 = useAuth0();

  useEffect(() => {
    if(!rootStore.loggedOut) { return; }

    sessionStorage.setItem("redirectPath", window.location.pathname);

    const logOutUrl = new URL(window.location.origin);
    logOutUrl.pathname = "/wallet/logout";

    auth0.logout({
      returnTo: logOutUrl.toString()
    });
  }, [rootStore.loggedOut]);

  return null;
})));

export const LogInHandler = inject("rootStore")(inject("siteStore")(observer(({rootStore, siteStore}) => {
  const [redirect, setRedirect] = useState(false);

  const redirectPath = sessionStorage.getItem("redirectPath");

  if(redirect) {
    return <Redirect to={redirectPath} />;
  }

  return (
    <>
      <PageLoader />
      <Login
        silent
        Loaded={() => rootStore.SetLoginLoaded()}
        LoadCustomizationOptions={async () => await siteStore.LoadLoginCustomization()}
        SignIn={async params => {
          try {
            await rootStore.SetAuthInfo(params);
          } catch(error) {
            // eslint-disable-next-line no-console
            console.error("Error logging in:", error);
          } finally {
            setRedirect(true);
          }
        }}
      />
    </>
  );
})));


const AuthWrapper = inject("siteStore")(observer(({siteStore, children}) => {
  const callbackUrl = new URL(window.location.origin);
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
      <LoginModal />
      <LogOutHandler />
      <WalletFrame />
    </Auth0Provider>
  );
}));

export default AuthWrapper;
