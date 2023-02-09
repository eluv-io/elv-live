import React, {useState} from "react";
import {observer} from "mobx-react";
import {ButtonWithLoader} from "./Actions";

import {SendIcon} from "../static/icons/Icons";

export const ValidEmail = email => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(email);
};

const ContactForm = observer(({dark=false}) => {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [message, setMessage] = useState("");
  const [messageValid, setMessageValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={`contact-form-container ${dark ? "dark" : "light"}`}>
      <div className="contact-form padded-block">
        <div className="contact-form__copy">
          <h3 className="contact-form__copy-header">
            Inspired to create with us?
          </h3>
          <div className="contact-form__copy-message">
            Send us a message to get started, we're excited to hear from you.
          </div>
        </div>
        <form
          onSubmit={event => {
            event.preventDefault();
          }}
          className="contact-form__form"
        >
          <input
            required
            disabled={submitted}
            type="email"
            value={email}
            placeholder="Your Email"
            onChange={event => setEmail(event.target.value)}
            onFocus={() => setEmailValid(true)}
            onBlur={() => setEmailValid(ValidEmail(email))}
            className={`contact-form__input ${emailValid ? "" : "invalid"}`}
          />
          <div className="contact-form__separator" />
          <textarea
            disabled={submitted}
            required
            value={message}
            placeholder="Message"
            onChange={event => setMessage(event.target.value)}
            onFocus={() => setMessageValid(true)}
            onBlur={() => setMessageValid(!!message)}
            className={`contact-form__message ${messageValid ? "" : "invalid"}`}
          />
          <ButtonWithLoader
            disabled={!emailValid || !messageValid || submitted}
            icon={SendIcon}
            onClick={async event => {
              event.preventDefault();

              let valid = true;
              if(!message) {
                setMessageValid(false);
                valid = false;
              }

              if(!ValidEmail(email)) {
                setEmailValid(false);
                valid = false;
              }

              if(!valid) { return; }

              await new Promise(resolve => setTimeout(resolve, 2000));
              setSubmitted(true);
            }}
            className="light primary extra-small contact-form__submit"
          >
            { submitted ? "Sent!" : "Send" }
          </ButtonWithLoader>
        </form>
      </div>
    </div>
  );
});

export default ContactForm;
