import React, {useState} from "react";
import {render} from "react-dom";
import Modal from "Common/Modal";
import ReactMarkdown from "react-markdown";
import SanitizeHTML from "sanitize-html";
import {siteStore} from "Stores";

const PreLoginMS = ({onComplete}) => {
  const [country, setCountry] = useState("United States");

  return (
    <div className="pre-login">
      <h2 className="pre-login__header">
        The Windows 11 NFT is a one-of-a-kind cryptographic token that lives in your digital wallet and unlocks valuable experiences and rewards
      </h2>

      <div className="pre-login__select-container">
        <label htmlFor="country" className="pre-login__select-label">Country</label>
        <select
          name="country"
          onChange={event => setCountry(event.target.value)}
          className="pre-login__select"
        >
          <option value="United States">United States</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {
        country === "United States" ?
          <div className="pre-login__note">
            I will receive information, tips, and offers about NFTs for Windows and Surface Devices and other Microsoft products and services.
            <a href="https://go.microsoft.com/fwlink/?LinkId=521839" target="_blank" rel="noopener">Privacy Statement</a>
          </div> : null
      }

      <div className="pre-login__actions">
        <button className="login-page__login-button login-page__login-button-pre-login pre-login__button" onClick={() => onComplete({data: { country }})}>
          Continue
        </button>
      </div>
    </div>
  );
};

const PrivacyPolicy = () => {
  const [policyModal, setPolicyModal] = useState(null);

  let { link, rich_text, html } = siteStore.loginCustomization.privacy_policy || {};

  let policyLink;
  if(link) {
    policyLink = (
      <a
        target="_blank"
        className="pre-login__privacy-link"
        rel="noopener"
        href={link}
      >
        Privacy Policy
      </a>
    );
  } else if(rich_text || html) {
    policyLink = (
      <button
        className="pre-login__privacy-link"
        onClick={() => {
          setPolicyModal(
            <Modal
              className="pre-login__privacy-modal"
              Toggle={() => setPolicyModal(null)}
            >
              {
                rich_text ?
                  <div className="pre-login__privacy-modal__content">
                    <div
                      className="markdown-document event-message__content__message"
                      ref={element => {
                        if(!element) {
                          return;
                        }

                        render(
                          <ReactMarkdown linkTarget="_blank" allowDangerousHtml>
                            {SanitizeHTML(rich_text)}
                          </ReactMarkdown>,
                          element
                        );
                      }}
                    />
                  </div> :
                  <iframe
                    className="pre-login__privacy-frame"
                    src={html.url}
                  />
              }
            </Modal>
          );
        }}
      >
        Privacy Policy
      </button>
    );
  } else {
    return null;
  }

  return (
    <>
      { policyModal }
      { policyLink }
    </>
  );
};

const PreLogin = ({onComplete}) => {
  const [consent, setConsent] = useState(true);

  if(siteStore.siteSlug === "ms") {
    return <PreLoginMS />;
  }

  return (
    <div className="pre-login">
      <div className="pre-login__text">
        <div
          className="markdown-document pre-login__header"
          ref={element => {
            if(!element) {
              return;
            }

            render(
              <ReactMarkdown linkTarget="_blank" allowDangerousHtml>
                {SanitizeHTML(siteStore.loginCustomization.consent_form_text)}
              </ReactMarkdown>,
              element
            );
          }}
        />

        <div className="pre-login__consent">
          <input name="consent" type="checkbox" checked={consent} onChange={() => setConsent(!consent)} className="pre-login__consent-checkbox" />
          <label htmlFor="consent" className="pre-login__consent-label"  onClick={() => setConsent(!consent)}>
            By checking this box, I agree to share my email with Eluvio and its partners
          </label>
        </div>
      </div>

      <div className="pre-login__privacy-policy">
        <PrivacyPolicy />
      </div>

      <div className="pre-login__actions">
        <button className="login-page__login-button login-page__login-button-pre-login pre-login__button" onClick={() => onComplete({data: { share_email: consent }})}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default PreLogin;
