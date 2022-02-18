import React, { useState, useEffect } from "react";
import {render} from "react-dom";
import { Loader } from "Components/common/Loaders";
import {inject, observer} from "mobx-react";
import { useAuth0 } from "@auth0/auth0-react";
import UrlJoin from "url-join";
import ImageIcon from "Components/common/ImageIcon";

import Logo from "Assets/images/logo/logo.svg";
import Modal from "Components/common/Modal";
import ReactMarkdown from "react-markdown";
import SanitizeHTML from "sanitize-html";
import {Redirect} from "react-router";

const TermsModal = inject("siteStore")(observer(({siteStore, Toggle}) => {
  return (
    <Modal className={`login-page__terms-modal ${siteStore.loginCustomization.terms_html ? "login-page__terms-modal-frame" : ""}`} Toggle={Toggle}>
      {
        siteStore.loginCustomization.terms_html ?
          <iframe
            className="login-page__terms-modal__terms"
            src={siteStore.loginCustomization.terms_html.url}
          />:
          <div
            className="login-page__terms-modal__terms"
            ref={element => {
              if(!element) { return; }

              render(
                <ReactMarkdown linkTarget="_blank" allowDangerousHtml >
                  { SanitizeHTML(siteStore.loginCustomization.terms) }
                </ReactMarkdown>,
                element
              );
            }}
          />
      }
    </Modal>
  );
}));

export const Login = inject("rootStore")(inject("siteStore")(observer(({rootStore, siteStore}) => {
  const auth0 = useAuth0();

  window.auth0 = auth0;
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auth0Loading, setAuth0Loading] = useState(true);
  const [showPrivateKeyForm, setShowPrivateKeyForm] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [redirectPath, setRedirectPath] = useState((window.location.pathname === "/wallet/logout" && localStorage.getItem("redirectPath")) || "");
  const [loginData, setLoginData] = useState({ share_email: true });

  const loginDataRequired = siteStore.loginCustomization.require_consent && !loginData;

  const SaveLoginData = (data) => {
    setLoginData(data);
    sessionStorage.setItem("login-data", JSON.stringify(data));
  };

  const darkMode = rootStore.app === "main" ? true : siteStore.loginCustomization.darkMode;
  const baseUrl = new URL(UrlJoin(window.location.origin, "wallet"));

  const callbackUrl = new URL(baseUrl.toString());
  callbackUrl.pathname = "/wallet/callback";

  const extraLoginParams = {};
  if(darkMode) {
    extraLoginParams.darkMode = true;
  }

  if(siteStore.loginCustomization.disable_third_party) {
    extraLoginParams.disableThirdParty = true;
  }

  const SignIn = async () => {
    if(loading) { return; }

    try {
      setLoading(true);

      const authInfo = rootStore.AuthInfo();

      if(authInfo) {
        if(!rootStore.walletLoggedIn) {
          rootStore.SetAuthInfo({
            ...rootStore.AuthInfo()
          });
        }
        return;
      }

      if(typeof auth0 === "undefined") {
        return;
      }

      let idToken;

      let userData;
      if(auth0.isAuthenticated) {
        try {
          idToken = (await auth0.getIdTokenClaims()).__raw;

          userData = {
            name: auth0.user.name,
            email: auth0.user.email
          };
        } catch(error) {
          // eslint-disable-next-line no-console
          console.error("Failed to get Auth0 ID Token:");
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }

      if(!idToken) {
        return;
      }

      setLoading(true);

      await rootStore.SetAuthInfo({
        tenantId: siteStore.loginCustomization.tenant_id,
        idToken,
        user: userData,
        loginData
      });

      if(localStorage.getItem("redirectPath")) {
        setRedirectPath(localStorage.getItem("redirectPath"));
      }
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      if(sessionStorage.getItem("login-data")) {
        SaveLoginData(JSON.parse(sessionStorage.getItem("login-data")));
      } else {
        SaveLoginData({ share_email: true });
      }
      // eslint-disable-next-line no-empty
    } catch(error) {}

    let interval;
    interval = setInterval(() => {
      if(!auth0.isLoading) {
        setAuth0Loading(false);
        clearInterval(interval);
      }
    }, 500);
  }, []);

  useEffect(() => {
    if(!auth0.isLoading && auth0.isAuthenticated && (!loginDataRequired || loginData)) {
      SignIn();
    }

  }, [auth0Loading, loginData, auth0.isAuthenticated]);

  const customizationOptions = siteStore.loginCustomization || {};
  let logo = <ImageIcon icon={Logo} className="login-page__logo" title="Eluv.io" />;
  let logInButtonStyle, signUpButtonStyle;
  if(siteStore.loginCustomization) {
    // Don't show logo if customization meta has not yet loaded

    if(customizationOptions.logo) {
      logo = (
        <div className="login-page__logo-container">
          <ImageIcon
            icon={customizationOptions.logo.url}
            alternateIcon={Logo}
            className="login-page__logo"
            title="Logo"
          />
          <h2 className="login-page__tagline">
            Powered by <ImageIcon icon={Logo} className="login-page__tagline__image" title="Eluv.io" />
          </h2>
        </div>
      );
    } else {
      logo = <ImageIcon icon={Logo} className="login-page__logo" title="Eluv.io" />;
    }

    if(customizationOptions.log_in_button) {
      logInButtonStyle = {
        color: customizationOptions.log_in_button.text_color.color,
        backgroundColor: customizationOptions.log_in_button.background_color.color,
        border: `0.75px solid ${customizationOptions.log_in_button.border_color.color}`
      };
    }

    if(customizationOptions.sign_up_button) {
      signUpButtonStyle = {
        color: customizationOptions.sign_up_button.text_color.color,
        backgroundColor: customizationOptions.sign_up_button.background_color.color,
        border: `0.75px solid ${customizationOptions.sign_up_button.border_color.color}`
      };
    }
  }

  if(redirectPath) {
    return <Redirect to={redirectPath} />;
  }

  const largeLogoMode = customizationOptions.large_logo_mode;
  const customBackground = customizationOptions.background || customizationOptions.background_mobile;
  if(rootStore.walletLoggedIn || rootStore.loggingIn || loading || auth0Loading) {
    return (
      <div className={`page-container login-page ${largeLogoMode ? "login-page-large-logo-mode" : ""} ${customBackground ? "login-page-custom-background" : ""}`}>
        <div className="login-page__login-box">
          { logo }
          <Loader />
        </div>
      </div>
    );
  }

  if(showPrivateKeyForm) {
    return (
      <div className={`page-container login-page ${largeLogoMode ? "login-page-large-logo-mode" : ""} ${customBackground ? "login-page-custom-background" : ""}`}>
        <div className="login-page__login-box">
          { logo }
          <h1>Enter your Private Key</h1>

          <form
            className="login-page__private-key-form"
            onSubmit={async event => {
              event.preventDefault();
              try {
                setLoading(true);

                rootStore.SetAuthInfo({
                  tenantId: siteStore.loginCustomization.tenant_id,
                  privateKey
                });
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="labelled-field">
              <label htmlFor="privateKey">Private Key</label>
              <input name="privateKey" type="text" value={privateKey} onChange={event => setPrivateKey(event.target.value)}/>
            </div>

            <div className="login-page__private-key-form__actions">
              <button
                onClick={() => setShowPrivateKeyForm(false)}
                className="login-page__private-key-form__button login-page__private-key-form__button-cancel login-page__login-button-cancel"
              >
                Cancel
              </button>
              <button type="submit" className="login-page__private-key-form__button login-page__private-key-form__button-submit" style={logInButtonStyle}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const loginButtonActive = !!localStorage.getItem("hasLoggedIn");
  const SignUpButton = () => (
    <button
      className="login-page__login-button login-page__login-button-create login-page__login-button-auth0"
      style={signUpButtonStyle}
      autoFocus={!loginButtonActive}
      onClick={() => {
        localStorage.setItem("redirectPath", window.location.pathname);

        auth0.loginWithRedirect({
          redirectUri: callbackUrl.toString(),
          initialScreen: "signUp",
          ...extraLoginParams
        });
      }}
    >
      Sign Up
    </button>
  );

  const LogInButton = () => (
    <button
      style={logInButtonStyle}
      autoFocus={loginButtonActive}
      className="login-page__login-button login-page__login-button-auth0"
      onClick={() => {
        localStorage.setItem("redirectPath", window.location.pathname);

        auth0.loginWithRedirect({
          redirectUri: callbackUrl.toString(),
          ...extraLoginParams
        });
      }}
    >
      Log In
    </button>
  );

  const tenantName = siteStore.loginCustomization.tenant_name;
  return (
    <div className={`page-container login-page ${largeLogoMode ? "login-page-large-logo-mode" : ""}  ${customBackground ? "login-page-custom-background" : ""}`}>
      { showTermsModal ? <TermsModal Toggle={show => setShowTermsModal(show)} /> : null }

      <div className="login-page__login-box">
        { logo }
        <div className="login-page__actions">
          {
            localStorage.getItem("hasLoggedIn") ?
              <>
                <LogInButton />
                <SignUpButton />
              </> :
              <>
                <SignUpButton />
                <LogInButton />
              </>
          }
          {
            siteStore.loginCustomization && siteStore.loginCustomization.disable_private_key ?
              null :
              <button
                className="login-page__login-button login-page__login-button-pk"
                onClick={() => setShowPrivateKeyForm(true)}
              >
                Or Sign In With Private Key
              </button>
          }
        </div>
        <div className="login-page__text-section">
          {
            siteStore.loginCustomization && siteStore.loginCustomization.terms ?
              <div
                className="login-page__terms"
                ref={element => {
                  if(!element) { return; }

                  render(
                    <ReactMarkdown linkTarget="_blank" allowDangerousHtml >
                      { SanitizeHTML(siteStore.loginCustomization.terms) }
                    </ReactMarkdown>,
                    element
                  );
                }}
              /> : null
          }

          <div className="login-page__terms login-page__eluvio-terms">
            By creating an account or signing in, I agree to the <a href="https://live.eluv.io/privacy" target="_blank">Eluvio Privacy Policy</a> and the <a href="https://live.eluv.io/terms" target="_blank">Eluvio Terms and Conditions</a>.
          </div>

          {
            siteStore.loginCustomization.require_consent ?
              <div className="login-page__consent">
                <input
                  name="consent"
                  type="checkbox"
                  checked={loginData && loginData.share_email}
                  onChange={event => SaveLoginData({share_email: event.target.checked})}
                  className="login-page__consent-checkbox"
                />
                <label
                  htmlFor="consent"
                  className="login-page__consent-label"
                  onClick={() => SaveLoginData({share_email: !(loginData || {}).share_email})}
                >
                  By checking this box, I give consent for my email address to be stored with my wallet address { tenantName ? ` and shared with ${tenantName}` : "" }
                </label>
              </div> : null
          }
        </div>
      </div>
    </div>
  );
})));

const LoginModal = inject("rootStore")(inject("siteStore")((observer(({rootStore, siteStore, callbackPage=false}) => {
  const darkMode = rootStore.app === "main" ? true : siteStore.loginCustomization.darkMode;

  const Close = event => {
    const loginPage = (document.getElementsByClassName("login-page"))[0];

    if(window.location.pathname.startsWith("/wallet") || !loginPage || loginPage.contains(event.target)) { return; }

    rootStore.SetWalletPanelVisibility(rootStore.defaultWalletState);

    localStorage.removeItem("showPostLoginModal");

    document.body.removeEventListener("click", Close);
  };

  return (
    <div
      className={`login-modal ${darkMode ? "login-dark" : ""}`}
      ref={element => {
        if(!element) { return; }

        document.body.addEventListener("click", Close);
      }}
    >
      <button className="login-modal__close-button" onClick={Close}>X</button>

      <Login callbackPage={callbackPage} />
    </div>
  );
}))));

export default LoginModal;
