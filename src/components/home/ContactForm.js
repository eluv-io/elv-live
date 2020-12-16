import React from "react";
import { Link } from "react-router-dom";
import {ImageIcon} from "elv-components-js";
import {inject, observer} from "mobx-react";
import Logo from "../../static/images/Logo.png";

@inject("rootStore")
@inject("siteStore")
@observer
class ContactForm extends React.Component {

  render() {
    
    return (
        <div className="contact-page">
          <div className="main-nav">
            <ImageIcon className="main-nav--logo" icon={Logo} label="Eluvio" />
          </div>
  
          <div className="contact-container">
            <div className="contact-overview">
              <h1 className="contact-overview-title">Contact Form</h1>
              <h2 className="contact-overview-p">Welcome artists, producers, writers, musicians, and all creatives. To host your iconic event on Eluvio Live please complete the form below, and our team will get back to you usually within 24 hours to get you started. </h2>
            </div>
          </div>
        </div>

    );
  }
}


export default ContactForm;
