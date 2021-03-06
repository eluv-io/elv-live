import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "./copy/Copy.yaml";
import ContactForm from "Pages/main/components/ContactForm";

@inject("siteStore")
@observer
class Contact extends React.Component {
  render() {
    return (
      <div className="page-content contact-page">
        <h1 className="contact-page__header">
          { Copy.contact.header }
        </h1>
        <ContactForm />
      </div>
    );
  }
}

export default Contact;
