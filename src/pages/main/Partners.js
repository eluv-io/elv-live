// Boilerplate for new class

import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "Assets/copy/Main.yaml";
import AsyncComponent from "Common/AsyncComponent";
import {LoadHubspotForm} from "Utils/Misc";

@inject("mainStore")
@observer
class Partners extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formInitialized: false
    };
  }

  componentDidMount() {
    document.title = " Our Partners: Production and Merchandise | Eluvio LIVE";
    document
      .getElementsByTagName("meta")
      .namedItem("description")
      .setAttribute("content", Copy.seo.page_descriptions.partners);
    document
      .getElementsByTagName("meta")
      .namedItem("robots")
      .setAttribute("content", "");
  }

  PartnerBlock(partner) {
    return (
      <div className="partner-block" key={`partner-block-${partner.name}`}>
        <div className="partner-block__image-container">
          <img src={partner.imageUrl} alt={partner.name} className="partner-block__image" />
        </div>
        <div className="partner-block__text-block">
          <h3 className="partner-block__header">{ partner.name }</h3>
          <pre className="partner-block__text">{ partner.text }</pre>
        </div>
      </div>
    );
  }

  Content() {
    return (
      <div className="page-content partners-page">
        <h1 className="partners-page__header">Our Partners</h1>
        <pre className="partners-page__header-text">{ Copy.partners.header }</pre>

        <div className="partners-page__partner-blocks">
          <h2 className="partners-page__section-header">Production Partners</h2>
          { this.props.mainStore.partners.production.map(partner => this.PartnerBlock(partner)) }
        </div>

        <div className="partners-page__partner-blocks">
          <h2 className="partners-page__section-header">Merchandise Partners</h2>
          { this.props.mainStore.partners.merchandise.map(partner => this.PartnerBlock(partner)) }
        </div>

        <div className="hs-form-container">
          <div className="hs-form-container__header">
            Partner with Eluv.io Live
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
                formId: "eab9dddc-68c5-4b4b-87de-d5acd1b45a99",
                target: "#form-target"
              });
            }}
          />
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

export default Partners;
