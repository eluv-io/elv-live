import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {uiStore, mainStore} from "../../stores/Main";
import {Action} from "../../components/Actions";

import Logo from "../../static/images/logos/eluvio-logo-color.png";
import Background from "../../static/images/register/background.jpg";
import BackgroundMobile from "../../static/images/register/background_mobile.jpg";
import {Box} from "@mantine/core";


const HUBSPOT_PORTAL_ID = "6230377";
const HUBSPOT_FORM_ID = "87880b02-fca8-4863-8cc5-9a5ac41f3eba";

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
          target: "#registerHubspotForm"
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div id="registerHubspotForm" />
      <Action href="https://share.hsforms.com/1h4gLAvyoSGOMxZpaxB8-ug3pje1" target="_blank" className="light contact__link">Registration Link</Action>
    </>
  );
});


const Register = observer(() => {
  const mobile = uiStore.pageWidth < 1000;

  const { content_fabric, copy } = mainStore.l10n.register;

  if(mobile) {
    return (
      <div className="register register--mobile">
        <div className="register__mobile-header" style={{backgroundImage: `url(${Background})`}}>
          <img alt="Eluvio" src={Logo} className="register__copy__logo" />
          <h1 className="register__copy__header">{ content_fabric }</h1>
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
            <h3 className="register__copy__header">{ content_fabric }</h3>
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
