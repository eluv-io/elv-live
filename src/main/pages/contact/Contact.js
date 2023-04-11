import React from "react";
import {observer} from "mobx-react";
import {Action} from "../../components/Actions";
import {mainStore} from "../../stores/Main";

import {MailIcon, MapIcon, SocialIcons} from "../../static/icons/Icons";

const Contact = observer(() => {
  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>{ mainStore.l10n.contact.title }</h1>
      </div>
      <div className="contact">
        <div className="page__header-container">
          <h3 className="left-align">{ mainStore.l10n.contact.header }</h3>
        </div>
        <p className="page__copy contact__text">
          { mainStore.l10n.contact.text }
        </p>

        <div className="contact__connect">
          <h4>{ mainStore.l10n.contact.connect }</h4>
          <div className="contact__link-container">
            <Action className="light contact__link" to="mailto:contact@eluv.io" icon={MailIcon}>
              contact@eluv.io
            </Action>
          </div>
          <div className="contact__link-container">
            <Action className="light contact__link" to="https://goo.gl/maps/GG4NJnv4DLGHN1yk6" icon={MapIcon}>
              { mainStore.l10n.contact.address }
            </Action>
          </div>

          <div className="contact__link-container">
            <Action className="light contact__link" to="https://www.instagram.com/eluvioinc" icon={SocialIcons.InstagramIcon}>Instagram</Action>
            <Action className="light contact__link" to="https://twitter.com/eluvioinc" icon={SocialIcons.TwitterIcon}>Twitter</Action>
            <Action className="light contact__link" to="https://www.facebook.com/EluvioInc" icon={SocialIcons.FacebookIcon}>Facebook</Action>
            <Action className="light contact__link" to="https://www.linkedin.com/company/eluv-io" icon={SocialIcons.LinkedInIcon}>LinkedIn</Action>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Contact;
