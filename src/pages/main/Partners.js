// Boilerplate for new class

import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "./copy/Copy.yaml";
import PartnerForm from "Pages/main/components/PartnerForm";

@inject("mainStore")
@observer
class Partners extends React.Component {

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

  render() {
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

        <PartnerForm />
      </div>
    );
  }
}

export default Partners;
