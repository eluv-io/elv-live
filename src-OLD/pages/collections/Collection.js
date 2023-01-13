import React, {Suspense, useState} from "react";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";
import {PageLoader} from "Common/Loaders";
import AsyncComponent from "Common/AsyncComponent";
import {inject, observer} from "mobx-react";
import {Redirect, withRouter} from "react-router";
import UrlJoin from "url-join";
import ImageIcon from "Common/ImageIcon";
import Modal from "Common/Modal";
import CardModal from "Pages/main/components/CardModal";

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton
} from "react-share";

import {
  FaTwitter,
  FaFacebookSquare,
  FaLinkedin
} from "react-icons/fa";

import {Copy} from "Utils/Misc";
import {Link} from "react-router-dom";
import TermsLink from "Pages/collections/TermsLink";

import EluvioLogo from "Assets/images/logo/whiteEluvioLogo.svg";
import DetailsIcon from "Assets/icons/view details.svg";
import LinkIcon from "Assets/icons/link.svg";
import DropdownIcon from "Assets/icons/drop-down-arrow.svg";

const ItemDetails = ({item}) => {
  const [showDetails, setShowDetails] = useState(false);

  const Get = (name => (((item.nftInfo || {}).properties || {})[name] || {})[name] || "");

  let copyright = Get("copyright");
  if(copyright && !copyright.includes("©")) {
    copyright = `© ${copyright}`;
  }

  let details = null;
  if(showDetails) {
    details = (
      <div className="collection__item__details__full-details">
        <div className="collection__item__details__description">{ Get("description") }</div>
        <div className="collection__item__details__field">
          <b>Title:</b>
          { (item.nftInfo || {}).title }
        </div>
        <div className="collection__item__details__field">
          <b>Studio:</b>
          { Get("studio") }
        </div>
        <div className="collection__item__details__field">
          <b>Creative Director:</b>
          { Get("creative_director") }
        </div>
        <div className="collection__item__details__field">
          <b>Artists:</b>
          { Get("artists") }
        </div>
        <div className="collection__item__details__field">
          { copyright }
        </div>
        <br />
        <div className="collection__item__details__field collection__item__details__field-hash">
          <b>Eluvio Content Fabric Hash:</b>
          { item["."].source }
        </div>
        <div className="collection__item__details__field collection__item__details__field-hash">
          <b>Eluvio Contract Address:</b>
          { (item.nftInfo || {}).address }
        </div>
      </div>
    );
  }

  return (
    <div className="collection__item__details">
      <button className="collection__item__details__button" onClick={() => setShowDetails(!showDetails)}>
        <ImageIcon icon={DetailsIcon} className="collection__item__details__icon" alt="Details" />
      </button>
      <div className="collection__item__details__details">
        <h3 className="collection__item__details__header" onClick={() => setShowDetails(!showDetails)}>
          Details
          <ImageIcon
            icon={DropdownIcon}
            className={`collection__item__details__dropdown 
            ${showDetails ? "collection__item__details__dropdown-inverted" : ""}`}
          />
        </h3>
        { details }
      </div>
    </div>
  );
};

const Item = ({client, item, socialDetails={}}) => {
  const [player, setPlayer] = useState(undefined);

  return (
    <div className="collection__item">
      <div className="collection__item__aspect-ratio">
        <div
          className="collection__item__player-target"
          ref={element => {
            if(!element || player) { return; }

            setPlayer(
              new EluvioPlayer(
                element,
                {
                  clientOptions: {
                    client
                  },
                  sourceOptions: {
                    playoutParameters: {
                      versionHash: item["."].source
                    }
                  },
                  playerOptions: {
                    muted: EluvioPlayerParameters.muted.OFF,
                    autoplay: EluvioPlayerParameters.autoplay.OFF,
                    controls: EluvioPlayerParameters.controls.AUTO_HIDE
                  }
                }
              )
            );
          }}
        />
      </div>
      <div className="collection__item__footer">
        <ItemDetails item={item} />
        <div className="collection__item__footer__social-buttons">
          <div className="collection__item__footer__social-buttons__button" onClick={() => Copy(item.embedUrl)}>
            <ImageIcon icon={LinkIcon} title="Copy Link to NFT" />
          </div>
          <FacebookShareButton url={item.embedUrl} title={socialDetails.title} description={socialDetails.description} className="collection__item__footer__social-buttons__button"><FaFacebookSquare/></FacebookShareButton>
          <TwitterShareButton url={item.embedUrl} title={socialDetails.title} description={socialDetails.description} className="collection__item__footer__social-buttons__button"><FaTwitter/></TwitterShareButton>
          <LinkedinShareButton url={item.embedUrl} title={socialDetails.title} description={socialDetails.description} className="collection__item__footer__social-buttons__button"><FaLinkedin/></LinkedinShareButton>
        </div>
      </div>
    </div>
  );
};

const TransferForm = ({
  message,
  terms,
  termsUrl,
  privacyPolicy,
  privacyPolicyUrl,
  Submit
}) => {
  const [address, setAddress] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState(undefined);
  const [error, setError] = useState(undefined);

  if(confirmation) {
    return (
      <div className="collection__transfer-confirmation collection__transfer-form">
        <h2 className="collection__transfer-confirmation__header collection__transfer-form__header">
          Transfer Request Confirmed!
        </h2>
        <div className="collection__transfer-confirmation__message">
          If you requested email notification you will receive a message when your transaction completes.
        </div>
        <div className="collection__transfer-confirmation__confirmation">
          Confirmation: { confirmation }
        </div>
      </div>
    );
  }

  return (
    <form
      className="collection__transfer-form"
      onSubmit={async event => {
        event.preventDefault();
        setError(undefined);
        try {
          const { uuid } = await Submit({ethereumAddress: address, email: sendEmail ? email : ""});
          setConfirmation(uuid);
        } catch(error) {
          // eslint-disable-next-line no-console
          console.error(error);
          setError(error);
        }
      }}
    >
      { error ? <div className="collection__transfer-form__error">Transfer Failed</div> : null }
      <h2 className="collection__transfer-form__header">Transfer your NFT</h2>
      <div className="collection__transfer-form__text">Copy and paste your Ethereum address.</div>
      <input
        placeholder="Ethereum address (e.g. 0x1234...)"
        className="collection__transfer-form__input"
        value={address}
        onChange={event => setAddress(event.target.value)}
      />
      <div className="collection__transfer-form__text">
        Clicking the Transfer button below will initiate the transfer of your NFT on the Eluvio Content Fabric blockchain to the Ethereum blockchain at the address you specify. You should enter a valid Ethereum address that you wish to be the owner of the NFT.
      </div>
      <div className="collection__transfer-form__text">{ message }</div>
      <div className="collection__transfer-form__checkbox-container">
        <input name="sendEmail" className="collection__transfer-form__checkbox-container__checkbox" type="checkbox" checked={sendEmail} onChange={event => setSendEmail(event.target.checked)} />
        <label htmlFor="sendEmail" onClick={() => setSendEmail(!sendEmail)} className="collection__transfer-form__checkbox-container__label">
          Email me when transfer is complete
        </label>
      </div>
      {
        !sendEmail ? null :
          <input placeholder="Email Address" className="collection__transfer-form__input" value={email} onChange={event => setEmail(event.target.value)} />
      }
      <div className="collection__transfer-form__terms-message">
        By clicking on the Transfer button, I acknowledge that I have read and agree to the
        <TermsLink content={terms} contentUrl={termsUrl} linkText="Terms and Conditions" /> and
        <TermsLink content={privacyPolicy} contentUrl={privacyPolicyUrl} linkText="Privacy Policy"/>.
      </div>
      <button
        className="collection__transfer-form__submit collection__button"
        type="submit"
        disabled={!address || sendEmail && !email}
      >
        Transfer
      </button>
    </form>
  );
};

class Collection extends React.Component {
  constructor(props) {
    super(props);

    const urlParams = new URLSearchParams(window.location.search);

    this.state = {
      subject: urlParams.get("sbj") || "",
      code: urlParams.get("code") || "",
      redeemError: "",
      codeRedeemed: false,
      redeeming: false,
      modal: null
    };
  }

  Collection() {
    const tenantSlug = this.props.match.params.tenantSlug;
    const collectionSlug = this.props.match.params.collectionSlug;

    return this.props.collectionStore.collections[tenantSlug][collectionSlug];
  }

  ToggleModal(modal) {
    this.setState({modal});
  }

  async RedeemCode() {
    try {
      this.setState({redeeming: true, redeemError: ""});

      await this.props.collectionStore.RedeemCode({
        tenantSlug: this.props.match.params.tenantSlug,
        collectionSlug: this.props.match.params.collectionSlug,
        subject: this.state.subject,
        code: this.state.code
      });

      this.setState({
        codeRedeemed: true,
        redeeming: false
      });
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Failed to redeem code:");
      // eslint-disable-next-line no-console
      console.error(error);
      this.setState({redeeming: false, redeemError: "Invalid Code"});
    }
  }

  RedeemForm() {
    const tenantSlug = this.props.match.params.tenantSlug;
    const tenant = this.props.siteStore.tenants[tenantSlug];

    return (
      <div className="collection__redeem">
        <form className="collection__redeem__form" onSubmit={event => { event.preventDefault() ; this.RedeemCode(); }}>
          <div className="collection__redeem__form__text collection__redeem__form__error-text">
            {this.state.redeemError || ""}
          </div>
          <div className="collection__redeem__form__text">
            Enter your code
          </div>
          <input
            className="collection__redeem__form__input"
            value={this.state.code}
            onChange={event => this.setState({code: event.target.value})}
          />
          <button type="submit" disabled={!this.state.code || this.state.redeeming} className="collection__redeem__form__submit">
            {this.state.redeeming ? <div className="la-ball-clip-rotate la-sm"><div /></div> : "Submit"}
          </button>
        </form>

        <div className="tenant__footer">
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

  Content() {
    const tenantSlug = this.props.match.params.tenantSlug;
    const tenant = this.props.siteStore.tenants[tenantSlug];
    const collection = this.Collection();

    return (
      <div className="collection__content" hidden={!this.state.codeRedeemed} key={`collection-page-${this.state.codeRedeemed}`}>
        {
          collection.logoImage ?
            <img src={collection.logoImage} alt="Logo" className="collection__content__logo" /> : null
        }
        <h1 className="collection__content__header">{ collection.info.header }</h1>
        <div className="collection__content__description">{ collection.info.description }</div>
        <div className="collection__content__items">
          {(collection.items || []).map((item, index) =>
            <Item
              key={`item-${index}`}
              client={this.props.collectionStore.client}
              socialDetails={{
                title: collection.info.header,
                description: collection.info.description
              }}
              item={item}
            />
          )}
        </div>
        <div className="collection__content__bottom-content">
          <div className="collection__content__bottom-content__text">
            { collection.info.footer_text }
          </div>
          <button
            className="collection__content__bottom-content__learn-more collection__button"
            onClick={() => this.ToggleModal(
              <Modal Toggle={() => this.ToggleModal(null)}>
                <CardModal copyKey="collections" small />
              </Modal>
            )}
          >
            Learn More
          </button>
        </div>
        <div className="collection__content__transfer">
          <button
            className="collection__content__transfer__button collection__button"
            onClick={() => this.ToggleModal(
              <Modal Toggle={() => this.ToggleModal(null)} className="collection__transfer-modal" >
                <TransferForm
                  message={collection.info.transfer_message}
                  terms={tenant.info.terms}
                  termsUrl={tenant.termsUrl}
                  privacyPolicy={tenant.info.privacy_policy}
                  privacyPolicyUrl={tenant.privacyPolicyUrl}
                  Submit={async ({ethereumAddress, email}) => await this.props.collectionStore.TransferNFT({
                    tenantSlug: this.props.match.params.tenantSlug,
                    collectionSlug: this.props.match.params.collectionSlug,
                    ethereumAddress,
                    email
                  })}
                />
              </Modal>
            )}
          >
            Transfer my NFT to Ethereum
          </button>
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

  Page() {
    const collection = this.Collection();

    return (
      <div
        className={`page-content collection ${this.state.codeRedeemed ? "collection-redeemed" : ""}`}
        style={{
          background: collection.backgroundImage ? `url(${collection.backgroundImage})` : ""
        }}
      >
        { this.state.codeRedeemed ? this.Content() : this.RedeemForm() }
        { this.state.modal }
      </div>
    );
  }

  render() {
    const tenantSlug = this.props.match.params.tenantSlug;
    const collectionSlug = this.props.match.params.collectionSlug;

    return (
      <Suspense fallback={<PageLoader />}>
        <AsyncComponent
          key={`site-page-${this.props.match.url}`}
          _errorBoundaryClassname="page-container error-page-container"
          Load={async () => {
            await this.props.siteStore.LoadTenant({slug: tenantSlug});

            if(!this.props.siteStore.tenants[tenantSlug] || !this.props.siteStore.tenants[tenantSlug].collections[collectionSlug]) {
              return;
            }

            await this.props.collectionStore.LoadCollection(tenantSlug, collectionSlug);

            if(this.state.code) {
              await this.RedeemCode();
            }
          }}
        >
          {
            (this.props.collectionStore.collections[tenantSlug] || {})[collectionSlug] ?
              this.Page() :
              <Redirect to={UrlJoin("/", tenantSlug, "collections")} />
          }
        </AsyncComponent>
      </Suspense>
    );
  }
}

export default inject("siteStore")(inject("collectionStore")(withRouter(observer(Collection))));
