import React, {Suspense} from "react";
import {inject, observer} from "mobx-react";
import {withRouter} from "react-router";
import {PageLoader} from "Common/Loaders";
import AsyncComponent from "Common/AsyncComponent";
import {Link, NavLink} from "react-router-dom";
import UrlJoin from "url-join";
import ImageIcon from "Common/ImageIcon";
import EluvioLogo from "Images/logo/whiteEluvioLogo";
import TermsLink from "Pages/collections/TermsLink";

@inject("siteStore")
@inject("collectionStore")
@withRouter
@observer
class Collections extends React.Component {
  constructor(props) {
    super(props);

    this.Content = this.Content.bind(this);
  }

  Content() {
    const tenantSlug = this.props.match.params.tenantSlug;
    const tenant = this.props.siteStore.tenants[tenantSlug];
    const collections = this.props.collectionStore.collections[tenantSlug];

    return (
      <div className="collections page-container tenant">
        <div className="collections__top">
          <img className="collections__top__logo" src={tenant.logoUrl} alt={`${tenant.info.name} Logo`} />
          <h1 className="collections__top__header">
            {tenant.info.name} NFT Collection
          </h1>
          <h2 className="collections__top__subheader">
            Each series contains a set of unique NFTs
          </h2>
          <h2 className="collections__top__subheader collections__top__subheader-bold">
            To view your NFT, select your designated series and enter your access code.
          </h2>
        </div>
        <div className="collections__list">
          {
            Object.keys(collections).map(collectionSlug => {
              const collection = collections[collectionSlug];
              return (
                <div className="collections__list__collection" key={`collection-${collectionSlug}`}>
                  <img className="collections__list__collection__image" src={collection.image} alt={collection.info.public_title} />
                  <div className="collections__list__collection__details">
                    <h3 className="collections__list__collection__details__header">{ collection.info.public_title }</h3>
                    <div className="collections__list__collection__details__text">{ collection.info.public_description }</div>
                    <NavLink className="collections__list__collection__details__link" to={UrlJoin("/", tenantSlug, "collections", collectionSlug)}>
                      Enter {collection.info.public_title}
                    </NavLink>
                  </div>
                </div>
              );
            })
          }
        </div>
        <div className="tenant__footer">
          <div className="tenant__footer__border" />
          <div className="tenant__footer__message">
            Powered By
            <Link to="/" target="_blank" className="tenant__footer__message__image">
              <ImageIcon icon={EluvioLogo} label="ELUV.IO" />
            </Link>
          </div>
          <div className="tenant__footer__links">
            <div className="tenant__footer__links__copyright">{ tenant.info.copyright }</div>
            <TermsLink className="tenant__footer__link tenant__footer__links__privacy-policy" linkText="Privacy Policy" content={tenant.info.privacy_policy} contentUrl={tenant.privacyPolicyUrl} />
            <TermsLink className="tenant__footer__link tenant__footer__links__terms" linkText="Terms and Conditions" content={tenant.info.terms} contentUrl={tenant.termsUrl} />
            <a className="tenant__footer__link" onClick={() => zE.activate()}>Support</a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const tenantSlug = this.props.match.params.tenantSlug;

    return (
      <Suspense fallback={<PageLoader />}>
        <AsyncComponent
          key={`site-page-${this.props.match.url}`}
          _errorBoundaryClassname="page-container error-page-container"
          Load={async () => {
            await this.props.siteStore.LoadTenant(tenantSlug);

            if(!this.props.siteStore.tenants[tenantSlug] || !this.props.siteStore.tenants[tenantSlug]) {
              return;
            }

            await this.props.collectionStore.LoadCollections(tenantSlug);
          }}
          render={this.Content}
        />
      </Suspense>
    );
  }
}

export default Collections;
