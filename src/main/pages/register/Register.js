import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {uiStore, mainStore} from "../../stores/Main";

import Logo from "../../static/images/register/register-fabric-logo";
import Background from "../../static/images/register/background.jpg";
import BackgroundMobile from "../../static/images/register/background_mobile.jpg";
import {Box, Flex, Title} from "@mantine/core";


const HUBSPOT_PORTAL_ID = "6230377";
const HUBSPOT_FORM_ID = "87880b02-fca8-4863-8cc5-9a5ac41f3eba";

const FORM_CSS = `
  body {
    font-family: 'Montserrat', sans-serif;
    background: #fff;
    color: #000;
  }

  .hs-form-field {
    margin-bottom: 15px;
  }

  .hs-form-field label {
    color: #a9a9a9;
    font-size: 12px;
    font-weight: 300;
    display: block;
    margin-bottom: 4px;
  }

  .hs-form-required {
    color: #c07cff;
  }

  .hs-input {
    border: 1px solid #a9a9a9;
    border-radius: 7px;
    font-size: 14px;
    height: 50px;
    padding: 0 15px;
    box-sizing: border-box;
    background: #fff;
    color: #000;
    outline: none;
  }

  .hs-input:focus {
    border-color: #c07cff;
    box-shadow: 0 0 3px rgba(155, 81, 224, 0.5);
  }

  textarea.hs-input {
    height: auto;
    padding: 10px 15px;
    resize: vertical;
  }

  select.hs-input {
    appearance: auto;
  }

  input[type="checkbox"].hs-input,
  input[type="radio"].hs-input {
    height: auto;
    width: auto;
    border: revert;
    border-radius: 0;
    padding: 0;
    background: revert;
  }

  .hs-form-field .hs-error-msgs {
    list-style: none;
    margin: 4px 0 0;
    padding: 0;
  }

  .hs-form-field .hs-error-msgs li label {
    color: #c0392b;
    font-size: 12px;
  }

  .hs-submit {
    margin-top: 20px;
  }

  .hs-button {
    background: #c07cff;
    border: none;
    border-radius: 7px;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    height: 40px;
    letter-spacing: 0.05em;
    width: 100%;
  }

  .hs-button:hover {
    background: #791cd0;
  }

  .hs-button:disabled {
    background: #a9a9a9;
    cursor: default;
  }

  .legal-consent-container {
    color: #a9a9a9;
    font-size: 12px;
    font-weight: 300;
    margin: 10px 0 20px;
  }

  .legal-consent-container a {
    color: #791cd0;
    text-decoration: underline;
  }

  .hs-form-checkbox label,
  .hs-form-radio label {
    color: #a9a9a9;
    font-size: 12px;
    font-weight: 300;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .submitted-message {
    color: #000;
    font-size: 14px;
    text-align: center;
  }
`;

const RegisterForm = observer(() => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js.hsforms.net/forms/embed/v2.js";
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: "na1",
          portalId: HUBSPOT_PORTAL_ID,
          formId: HUBSPOT_FORM_ID,
          target: "#registerHubspotForm",
          css: FORM_CSS
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Flex direction="column" align="center" justify="center" p={{base: 0, md: "0 200px 0 100px"}}>
      <Title c="neutral.1" mb={25} fz={{base: 26, md: 34}}>Register to Evaluate</Title>
      <div id="registerHubspotForm" />
      {/*<Action href="https://share.hsforms.com/1h4gLAvyoSGOMxZpaxB8-ug3pje1" target="_blank" className="light contact__link">Registration Link</Action>*/}
    </Flex>
  );
});


const Register = observer(() => {
  const mobile = uiStore.pageWidth < 1000;

  const {copy } = mainStore.l10n.register;

  if(mobile) {
    return (
      <div className="register register--mobile">
        <div className="register__mobile-header" style={{backgroundImage: `url(${Background})`}}>
          <img alt="Eluvio" src={Logo} className="register__copy__logo" />
        </div>
        <Box bg="var(--background-light-2)" p={"20px 30px"}>
          <RegisterForm />
        </Box>
        <div className="register__mobile-footer" style={{backgroundImage: `url(${BackgroundMobile})`}}>
          {
            copy.map((text, i) =>
              <p className="register__copy__copy" key={`copy-${i}`}>{text}</p>
            )
          }
        </div>
      </div>
    );
  }

  return (
    <div className="register">
      <div className="register__copy-container" style={{backgroundImage: `url(${Background})`}}>
        <div className="register__copy">
          <div className="register__copy__header-container">
            <img alt="Eluvio" src={Logo} className="register__copy__logo" />
          </div>
          {
            copy.map((text, i) =>
              <p className="register__copy__copy" key={`copy-${i}`}>{text}</p>
            )
          }
        </div>
      </div>
      <div className="register__form-container">
        <RegisterForm />
      </div>
    </div>
  );
});

export default Register;
