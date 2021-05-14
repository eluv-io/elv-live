import React, {Suspense, useState} from "react";
import {render} from "react-dom";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";
import {PageLoader} from "Common/Loaders";
import AsyncComponent from "Common/AsyncComponent";
import {inject, observer} from "mobx-react";
import {Redirect, withRouter} from "react-router";
import ImageIcon from "Common/ImageIcon";
import Modal from "Common/Modal";
import CardModal from "Pages/main/components/CardModal";

import LinkIcon from "Assets/icons/link.svg";

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

import EluvioLogo from "Assets/images/logo/whiteEluvioLogo.svg";
import {Copy} from "Utils/Misc";
import {Link} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import SanitizeHTML from "sanitize-html";

const Item = ({client, item, socialDetails={}, className}) => {
  const [player, setPlayer] = useState(undefined);

  return (
    <div className={className}>
      <h2 className={`${className}__header`}>{ item.display_title || item.title }</h2>
      <div className={`${className}__aspect-ratio`}>
        <div
          className={`${className}__player-target`}
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
                    watermark: EluvioPlayerParameters.watermark.OFF,
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
      <div className={`${className}__social-buttons`}>
        <div className={`${className}__social-buttons__text`}>Share NFT on Social</div>
        <div className={`${className}__social-buttons__button`} onClick={() => Copy(item.embedUrl)}>
          <ImageIcon icon={LinkIcon} title="Copy Link to NFT" />
        </div>
        <FacebookShareButton url={item.embedUrl} title={socialDetails.title} description={socialDetails.description} className={`${className}__social-buttons__button`}><FaFacebookSquare/></FacebookShareButton>
        <TwitterShareButton url={item.embedUrl} title={socialDetails.title} description={socialDetails.description} className={`${className}__social-buttons__button`}><FaTwitter/></TwitterShareButton>
        <LinkedinShareButton url={item.embedUrl} title={socialDetails.title} description={socialDetails.description} className={`${className}__social-buttons__button`}><FaLinkedin/></LinkedinShareButton>
      </div>
    </div>
  );
};

const TransferForm = ({
  message,
  terms,
  className,
  Submit
}) => {
  const [address, setAddress] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [confirmation, setConfirmation] = useState(undefined);
  const [error, setError] = useState(undefined);

  if(confirmation) {
    return (
      <div className={`${className}__transfer-confirmation ${className}__transfer-form`}>
        <h2 className={`${className}__transfer-confirmation__header ${className}__transfer-form__header`}>
          Transfer Request Confirmed!
        </h2>
        <div className={`${className}__transfer-confirmation__message`}>
          If you requested email notification you will receive a message when your transaction completes.
        </div>
        <div className={`${className}__transfer-confirmation__confirmation`}>
          Confirmation: { confirmation }
        </div>
      </div>
    );
  }

  if(showTerms) {
    return (
      <div className={`${className}__transfer-terms ${className}__transfer-form`}>
        <h2 className={`${className}__transfer-terms__header`}>Transfer Terms</h2>
        <div
          className={`${className}__transfer-terms__terms`}
          ref={element => {
            if(!element) { return; }

            render(
              <ReactMarkdown linkTarget="_blank" allowDangerousHtml >
                { SanitizeHTML(terms) }
              </ReactMarkdown>,
              element
            );
          }}
        >
        </div>
      </div>
    );
  }

  return (
    <form
      className={`${className}__transfer-form`}
      onSubmit={async event => {
        event.preventDefault();
        setError(undefined);
        try {
          const { uuid } = await Submit({ethereumAddress: address, email: sendEmail ? email : ""});
          setConfirmation(uuid);
        } catch(error) {
          console.error(error);
          setError(error);
        }
      }}
    >
      { error ? <div className={`${className}__transfer-form__error`}>Transfer Failed</div> : null }
      <h2 className={`${className}__transfer-form__header`}>Transfer your NFT</h2>
      <div className={`${className}__transfer-form__text`}>Copy and paste your mainnet address.</div>
      <input
        placeholder="Ethereum MainNet address (e.g. 0x1234...)"
        className={`${className}__transfer-form__input`}
        value={address}
        onChange={event => setAddress(event.target.value)}
      />
      <div className={`${className}__transfer-form__text`}>{ message }</div>
      <div className={`${className}__transfer-form__checkbox-container`}>
        <input name="sendEmail" className={`${className}__transfer-form__checkbox-container__checkbox`} type="checkbox" checked={sendEmail} onChange={event => setSendEmail(event.target.checked)} />
        <label htmlFor="sendEmail" onClick={() => setSendEmail(!sendEmail)} className={`${className}__transfer-form__checkbox-container__label`}>
          Email me when transfer is complete
        </label>
      </div>
      {
        !sendEmail ? null :
          <input placeholder="Email Address" className={`${className}__transfer-form__input`} value={email} onChange={event => setEmail(event.target.value)} />
      }
      <button
        className={`${className}__transfer-form__submit collection__button`}
        type="submit"
        disabled={!address || sendEmail && !email}
      >
        Transfer
      </button>
      <button className={`${className}__transfer-form__terms-button`} onClick={() => setShowTerms(true)}>Transfer Terms</button>
    </form>
  );
};

@inject("siteStore")
@inject("collectionStore")
@withRouter
@observer
class Collection extends React.Component {
  constructor(props) {
    super(props);

    const urlParams = new URLSearchParams(window.location.search);

    this.state = {
      initialSubject: urlParams.has("sbj"),
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
    return (
      <div className="collection__redeem">
        <form className="collection__redeem__form" onSubmit={event => { event.preventDefault() ; this.RedeemCode(); }}>
          <div className="collection__redeem__form__text collection__redeem__form__error-text">
            {this.state.redeemError || ""}
          </div>
          <div className="collection__redeem__form__text">
            Enter your code
          </div>
          {
            this.state.initialSubject ? null :
              <input
                placeholder="subject"
                className="collection__redeem__form__input"
                value={this.state.subject}
                onChange={event => this.setState({subject: event.target.value})}
              />
          }
          <input
            placeholder={this.state.initialSubject ? undefined : "code"}
            className="collection__redeem__form__input"
            value={this.state.code}
            onChange={event => this.setState({code: event.target.value})}
          />
          <button type="submit" disabled={this.state.redeeming} className="collection__redeem__form__submit">
            {this.state.redeeming ? <div className="la-ball-clip-rotate la-sm"><div /></div> : "Submit"}
          </button>
        </form>
      </div>
    );
  }

  Content() {
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
              className="collection__content__item"
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
                <CardModal copyKey="collections" />
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
                  message={collection.info.transfer.transfer_message}
                  terms={collection.info.transfer.transfer_terms}
                  className="collection"
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
            Transfer my NFT to Ethereum MainNet
          </button>
        </div>
        <div className="collection__content__footer">
          <div className="collection__content__footer__border" />
          <div className="collection__content__footer__message">
            Powered By
            <Link to="/" target="_blank" className="collection__content__footer__message__image">
              <ImageIcon icon={EluvioLogo} label="ELUV.IO" />
            </Link>
          </div>
          <div className="collection__content__footer__links">
            <Link to="/contact" target="_blank" className="collection__content__footer__link">Contact Us</Link>
            <a className="collection__content__footer__link" onClick={() => zE.activate()}>Support</a>
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
            await this.props.siteStore.LoadTenant(tenantSlug);

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
              <Redirect to="/" />
          }
        </AsyncComponent>
      </Suspense>
    );
  }
}

export default Collection;
