import React, {useState} from "react";
import {render} from "react-dom";
import Modal from "Common/Modal";
import ReactMarkdown from "react-markdown";
import SanitizeHTML from "sanitize-html";

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

  const policy = {
    rich_text: "<h1>Rich Text</h1>",
    html: undefined
  };

  let link;
  if(policy.url) {
    link = (
      <a
        target="_blank"
        className="pre-login__privacy-link"
        rel="noopener"
        href={policy.url}
      >
        Privacy Policy
      </a>
    );
  } else if(policy.rich_text || policy.html) {
    link = (
      <button
        className="pre-login__privacy-link"
        onClick={() => {
          setPolicyModal(
            <Modal
              className="event-message-container"
              Toggle={() => setPolicyModal(null)}
            >
              {
                policy.rich_text ?
                  <div className="event-message">
                    <div className="event-message__content">
                      <div
                        className="event-message__content__message"
                        ref={element => {
                          if(!element) {
                            return;
                          }

                          render(
                            <ReactMarkdown linkTarget="_blank" allowDangerousHtml>
                              {SanitizeHTML(policy.rich_text)}
                            </ReactMarkdown>,
                            element
                          );
                        }}
                      />
                    </div>
                  </div> :
                  <iframe
                    className="event-message"
                    src={policy.html.url}
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
      { link }
    </>
  );
};

const PreLogin = ({onComplete}) => {
  const [consent, setConsent] = useState(true);

  return (
    <div className="pre-login">
      <div className="pre-login__text">
        <h2 className="pre-login__header">
          This is a consent form with custom text
        </h2>

        <div className="pre-login__consent">
          <input name="consent" type="checkbox" checked={consent} onChange={() => setConsent(!consent)} className="pre-login__consent-checkbox" />
          <label htmlFor="consent" className="pre-login__consent-label"  onClick={() => setConsent(!consent)}>
            By checking this box, I agree to share my email with Eluvio and its partners
          </label>
        </div>
      </div>

      <div className="pre-login__actions">
        <button className="login-page__login-button login-page__login-button-pre-login pre-login__button" onClick={() => onComplete({consent})}>
          Continue
        </button>
      </div>

      <div className="pre-login__privacy-policy">
        <PrivacyPolicy />
      </div>
    </div>
  );
};

export default PreLoginMS;
