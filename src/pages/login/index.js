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
import PreLogin from "Pages/login/PreLogin";

const baseUrl = new URL(UrlJoin(window.location.origin, "wallet"));

const callbackUrl = new URL(baseUrl.toString());
callbackUrl.pathname = "/wallet/callback";

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
  const [redirectPath, setRedirectPath] = useState((window.location.pathname === "/wallet/logout" && siteStore.loginCustomization.redirectPath) || "");

  const [loginData, setLoginData] = useState(siteStore.loginCustomization.loginData);
  const loginDataRequired = siteStore.loginCustomization.require_consent && !loginData;

  const extraLoginParams = {};
  if(siteStore.darkMode ) {
    extraLoginParams.darkMode = true;
  }

  if(siteStore.loginCustomization.disable_third_party) {
    extraLoginParams.disableThirdParty = true;
  }

  const SignIn = async () => {
    if(loading) { return; }

    try {
      const authInfo = rootStore.AuthInfo();

      if(authInfo) {
        setLoading(true);
        return;
      }

      if(typeof auth0 === "undefined") {
        return;
      }

      let idToken;

      let userData;
      if(auth0.isAuthenticated) {
        idToken = (await auth0.getIdTokenClaims()).__raw;

        userData = {
          name: auth0.user.name,
          email: auth0.user.email
        };
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

      if(siteStore.loginCustomization.loginData) {
        setLoginData(siteStore.loginCustomization.loginData);
      }

      if(siteStore.loginCustomization.redirectPath) {
        setRedirectPath(siteStore.loginCustomization.redirectPath);
      }
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authInfo = rootStore.AuthInfo();

    if(!loading && authInfo) {
      setLoading(true);

      return;
    }

    if(auth0.isAuthenticated) {
      SignIn();
    } else if(!auth0.isLoading) {
      setAuth0Loading(false);
    }

  }, [auth0.isAuthenticated, auth0.isLoading]);

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
  if(rootStore.loggingIn || loading || auth0Loading) {
    return (
      <div className={`page-container login-page ${largeLogoMode ? "login-page-large-logo-mode" : ""} ${customBackground ? "login-page-custom-background" : ""}`}>
        <div className="login-page__login-box">
          { logo }
          <Loader />
        </div>
      </div>
    );
  }

  if(loginDataRequired) {
    return (
      <div className={`page-container login-page ${largeLogoMode ? "login-page-large-logo-mode" : ""} ${customBackground ? "login-page-custom-background" : ""}`}>
        <div className="login-page__login-box">
          { logo }
          <PreLogin onComplete={({data}) => setLoginData(data)} />
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
        localStorage.setItem(
          "loginCustomization",
          JSON.stringify({
            loginData,
            redirectPath: window.location.pathname,
            ...siteStore.loginCustomization
          })
        );

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
        localStorage.setItem(
          "loginCustomization",
          JSON.stringify({
            loginData,
            redirectPath: window.location.pathname,
            ...siteStore.loginCustomization
          })
        );

        auth0.loginWithRedirect({
          redirectUri: callbackUrl.toString(),
          ...extraLoginParams
        });
      }}
    >
      Log In
    </button>
  );

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
        {
          siteStore.loginCustomization && siteStore.loginCustomization.terms ?
            <div
              className="login-page__terms"
              ref={element => {
                if(!element) {
                  return;
                }

                render(
                  <ReactMarkdown linkTarget="_blank" allowDangerousHtml>
                    {SanitizeHTML(siteStore.loginCustomization.terms)}
                  </ReactMarkdown>,
                  element
                );
              }}
            /> : null
        }
      </div>
    </div>
  );
})));

const LoginModal = inject("rootStore")(inject("siteStore")((observer(({rootStore, siteStore, callbackPage=false}) => {
  return (
    <div
      className={`login-modal ${siteStore.darkMode ? "dark" : ""}`}
      ref={element => {
        if(!element) { return; }

        const Close = event => {
          const loginPage = (document.getElementsByClassName("login-page"))[0];

          if(window.location.pathname.startsWith("/wallet") || !loginPage || loginPage.contains(event.target)) { return; }

          rootStore.SetWalletPanelVisibility(rootStore.defaultWalletState);

          localStorage.removeItem("showPostLoginModal");

          document.body.removeEventListener("click", Close);
        };

        document.body.addEventListener("click", Close);
      }}
    >
      <Login callbackPage={callbackPage} />
    </div>
  );
}))));

export default LoginModal;
