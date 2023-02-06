import React from "react";
import {observer} from "mobx-react";
import {Action} from "../../components/Actions";

import {MailIcon, MapIcon, SocialIcons} from "../../static/icons/Icons";

const Contact = observer(() => {
  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>Contact Us</h1>
      </div>
      <div className="contact">
        <div className="page__header-container">
          <h3 className="left-align">Inspired to utilize the Content Fabric?</h3>
        </div>
        <p className="page__copy">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
        </p>

        <div className="contact__connect">
          <h4>Ways to connect</h4>
          <div className="contact__link-container">
            <Action className="light contact__link" to="mailto:events@live.eluv.io" icon={MailIcon}>events@live.eluv.io</Action>
          </div>
          <div className="contact__link-container">
            <Action className="light contact__link" to="https://goo.gl/maps/GG4NJnv4DLGHN1yk6" icon={MapIcon}>Eluvio, Inc. - HQ at 918 Parker Street Berkeley, CA 94710</Action>
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
