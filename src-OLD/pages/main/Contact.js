import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "Assets/copy/Main.yaml";
import AsyncComponent from "Common/AsyncComponent";
import {LoadHubspotForm} from "Utils/Misc";

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

  Content() {
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

        <div className="contact-page__contact">
          <h3 className="contact-page__contact-header">Contact</h3>
          <div className="contact-page__contact-details">
            <label>Email</label>
            <div className="contact-page__label-value">events@live.eluv.io</div>

            <label>HQ Address</label>
            <div className="contact-page__label-value">Eluvio, Inc. - HQ at 918 Parker Street Berkeley, CA 94710</div>

            <label>Instagram</label>
            <div className="contact-page__label-value"><a href="https://www.instagram.com/eluviolive" target="_blank"rel="noopener" >eluviolive</a></div>

            <label>Twitter</label>
            <div className="contact-page__label-value"><a href="https://twitter.com/EluvioLIVE" target="_blank"rel="noopener" >@EluvioLIVE</a></div>

            <label>Facebook</label>
            <div className="contact-page__label-value"><a href="https://www.facebook.com/EluvioLIVE" target="_blank"rel="noopener" >@EluvioLIVE</a></div>

            <label>LinkedIn</label>
            <div className="contact-page__label-value"><a href="https://www.linkedin.com/company/eluv-io" target="_blank"rel="noopener" >eluv-io</a></div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <AsyncComponent
        Load={LoadHubspotForm}
        render={() => this.Content()}
      />
    );
  }
}

export default inject("siteStore")(observer(Contact));
