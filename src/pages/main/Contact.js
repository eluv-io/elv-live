import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "Assets/copy/Main.yaml";

@inject("siteStore")
@observer
class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formInitialized: false
    };
  }

  componentDidMount() {
    document.title = "Contact Us | Eluvio LIVE";
    document
      .getElementsByTagName("meta")
      .namedItem("description")
      .setAttribute("content", Copy.seo.page_descriptions.contact);
    document
      .getElementsByTagName("meta")
      .namedItem("robots")
      .setAttribute("content", "");
  }

  render() {
    return (
      <div className="page-content contact-page">
        <h1 className="contact-page__header">
          { Copy.contact.header }
        </h1>
        <h2 className="contact-page__subheader">
          { Copy.contact.subheader }
        </h2>
        <h2 className="contact-page__subheader">
          { Copy.contact.subheader2 }
        </h2>

        <div className="hs-form-container">
          <div className="hs-form-container__header">
            Go Live with Eluv.io
          </div>
          <div
            className="hs-form"
            id="form-target"
            ref={element => {
              if(!element || this.state.formInitialized) {
                return;
              }

              hbspt.forms.create({
                region: "na1",
                portalId: "6230377",
                formId: "91711afe-fd4b-411c-af44-5fced036375e",
                target: "#form-target"
              });
            }}
          />
        </div>
      </div>
    );
  }
}

export default Contact;
