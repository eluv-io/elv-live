import React, {useState} from "react";
import {observer} from "mobx-react";
import {uiStore, mainStore} from "../../stores/Main";
import {ButtonWithLoader} from "../../components/Actions";
import {ValidEmail} from "../../components/ContactForm";

import Logo from "../../static/images/logos/eluvio-logo-color.png";
import Background from "../../static/images/register/background.jpg";
import BackgroundMobile from "../../static/images/register/background_mobile.jpg";


const HUBSPOT_PORTAL_ID = "6230377";
const HUBSPOT_FORM_ID = "87880b02-fca8-4863-8cc5-9a5ac41f3eba";

const RegisterInput = ({name, label, type, placeholder, formState, setFormState}) => {
  return (
    <div className="register__input">
      <label htmlFor={name} className="register__input__label">
        { label }
      </label>
      <input
        name={name}
        value={formState[name]}
        type={type || "text"}
        placeholder={placeholder}
        onChange={event => setFormState({...formState, [name]: event.target.value})}
        required
      />
    </div>
  );
};

const RegisterForm = observer(() => {
  const [formState, setFormState] = useState({
    firstname: "",
    lastname: "",
    company: "",
    jobtitle: "",
    email: ""
  });

  const [consent, setConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const valid =
    formState.firstname &&
    formState.lastname &&
    formState.company &&
    formState.jobtitle &&
    formState.email &&
    ValidEmail(formState.email);

  const l10n = mainStore.l10n.register.form;

  if(submitted) {
    return (
      <div className="register__form register__form--submitted">
        <h3 className="fade-in register__form_submitted-message">
          {l10n.complete}
        </h3>
      </div>
    );
  }
  return (
    <form className="register__form">
      <h1 className="register__form__header">
        { l10n.header }
      </h1>
      <div className="register__form__group">
        <RegisterInput name="firstname" formState={formState} setFormState={setFormState} {...l10n.first_name} />
        <RegisterInput name="lastname" formState={formState} setFormState={setFormState} {...l10n.last_name} />
      </div>
      <RegisterInput name="company" formState={formState} setFormState={setFormState} {...l10n.company} />
      <RegisterInput name="jobtitle" formState={formState} setFormState={setFormState} {...l10n.role} />
      <RegisterInput name="email" type="email" formState={formState} setFormState={setFormState} {...l10n.email} />
      <button type="button" className="register__checkbox" onClick={() => setConsent(!consent)}>
        <input
          name="consent"
          type="checkbox"
          className="register__checkbox__label"
          checked={consent}
          onChange={() => setConsent(!consent)}
        />
        <label htmlFor="consent" className="register__checkbox__label">
          {l10n.consent}
        </label>
      </button>
      <div className="register__form__privacy-policy" dangerouslySetInnerHTML={{__html: l10n.policy}} />
      <ButtonWithLoader
        className="light primary register__form__submit"
        type="submit"
        disabled={!valid}
        onClick={async event => {
          event.preventDefault();
          event.stopPropagation();

          await mainStore.SubmitHubspotForm({
            portalId: HUBSPOT_PORTAL_ID,
            formId: HUBSPOT_FORM_ID,
            data: formState,
            consent
          });

          await new Promise(resolve => setTimeout(resolve, 2000));

          setSubmitted(true);
        }}
      >
        { l10n.submit }
      </ButtonWithLoader>
      <div className="register__form__features">
        <a href="/features/details" target="_blank">
          { l10n.features }
        </a>
      </div>
    </form>
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
        <RegisterForm />
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
          <img alt="Eluvio" src={Logo} className="register__copy__logo" />
          <h1 className="register__copy__header">{ content_fabric }</h1>
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
