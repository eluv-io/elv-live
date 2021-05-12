import React, {Suspense, useState} from "react";
import UrlJoin from "url-join";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";
import {PageLoader} from "Common/Loaders";
import AsyncComponent from "Common/AsyncComponent";
import {inject, observer} from "mobx-react";
import {Redirect, withRouter} from "react-router";
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

import EluvioLogo from "Assets/images/logo/whiteEluvioLogo.svg";

const Item = ({client, item, socialDetails={}, className}) => {
  const [player, setPlayer] = useState(undefined);

  return (
    <div className={className}>
      <h2 className={`${className}__header`}>{ item.display_title || item.title }</h2>
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
      <div className={`${className}__social-buttons`}>
        <div className={`${className}__social-buttons__text`}>Share NFT on Social</div>
        <FacebookShareButton url={window.location.href.toString()} title={socialDetails.title} description={socialDetails.description} className={`${className}__social-buttons__button`}><FaFacebookSquare/></FacebookShareButton>
        <TwitterShareButton url={window.location.href.toString()} title={socialDetails.title} description={socialDetails.description} className={`${className}__social-buttons__button`}><FaTwitter/></TwitterShareButton>
        <LinkedinShareButton url={window.location.href.toString()} title={socialDetails.title} description={socialDetails.description} className={`${className}__social-buttons__button`}><FaLinkedin/></LinkedinShareButton>
      </div>
    </div>
  );
};

const TransferForm = ({className}) => {
  const [address, setAddress] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  if(showTerms) {
    return (
      <div className={`${className}__transfer-terms ${className}__transfer-form`}>
        <h2 className={`${className}__transfer-terms__header`}>Transfer Terms</h2>
        <pre className={`${className}__transfer-terms__terms`}>
          {
            `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nibh sit amet commodo nulla facilisi nullam vehicula ipsum a. Non blandit massa enim nec dui. Quis ipsum suspendisse ultrices gravida. Sit amet cursus sit amet dictum sit amet justo donec. Odio eu feugiat pretium nibh ipsum consequat nisl vel. Mi tempus imperdiet nulla malesuada pellentesque elit. Auctor elit sed vulputate mi sit amet. Pellentesque massa placerat duis ultricies lacus sed turpis. Sapien faucibus et molestie ac. Porttitor leo a diam sollicitudin tempor id.

Tellus integer feugiat scelerisque varius morbi enim. Magna fringilla urna porttitor rhoncus dolor purus non enim. Sed id semper risus in. Porttitor lacus luctus accumsan tortor posuere ac. Placerat in egestas erat imperdiet. Imperdiet sed euismod nisi porta lorem mollis aliquam ut porttitor. At ultrices mi tempus imperdiet nulla malesuada. Id aliquet risus feugiat in ante. Commodo ullamcorper a lacus vestibulum. Lectus vestibulum mattis ullamcorper velit sed. Sapien faucibus et molestie ac feugiat sed lectus vestibulum. 
            `
          }
        </pre>
      </div>
    );
  }

  return (
    <form className={`${className}__transfer-form`} onSubmit={event => { event.preventDefault(); }}>
      <h2 className={`${className}__transfer-form__header`}>Transfer your NFT</h2>
      <div className={`${className}__transfer-form__text`}>Copy and paste your mainnet address.</div>
      <input
        placeholder="Ethereum MainNet address (e.g. 0x1234...)"
        className={`${className}__transfer-form__input`}
        value={address}
        onChange={event => setAddress(event.target.value)}
      />
      <div className={`${className}__transfer-form__text`}>Clicking the button below will initiate the transfer of ownership to this address. Transaction gas fees are sponsored by FOX.</div>
      <div className={`${className}__transfer-form__checkbox-container`}>
        <input name="sendEmail" className={`${className}__transfer-form__checkbox-container__checkbox`} type="checkbox" checked={sendEmail} onChange={event => setSendEmail(event.target.checked)} />
        <label htmlFor="sendEmail" onClick={() => setSendEmail(!sendEmail)} className={`${className}__transfer-form__checkbox-container__label`}>
          Email me when transfer is complete
        </label>
      </div>
      {
        !sendEmail ? null :
          <input placeholder="Email Address (optional)" className={`${className}__transfer-form__input`} value={email} onChange={event => setEmail(event.target.value)} />
      }
      <button className={`${className}__transfer-form__submit collection__button`} type="submit">Transfer</button>
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

    this.state = {
      code: "",
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

  async LoadItems() {
    const itemMetadata = await this.state.client.ContentObjectMetadata({
      versionHash: this.state.versionHash,
      metadataSubtree: UrlJoin(this.state.params.linkPath || "public/asset_metadata", "items"),
      resolveLinks: true,
      resolveIncludeSource: true
    });

    this.setState({
      items: (itemMetadata.map(item => {
        if(!item || !item["."] || !item["."].source) { return; }

        return {
          versionHash: item["."].source,
          display_title: item.display_title,
          title: item.title
        };
      })).filter(item => item)
    });
  }

  async RedeemCode(event) {
    event.preventDefault();

    try {
      this.setState({redeeming: true, redeemError: ""});

      await new Promise(resolve => setTimeout(resolve, 2000));

      /*
      await this.state.client.RedeemCode({
        tenantId: this.state.params.tenantId,
        ntpId: this.state.params.ntpId,
        email: this.state.params.ticketSubject,
        code: this.state.code
      });


       */

      await this.props.collectionStore.LoadCollectionItems(this.props.match.params.tenantSlug, this.props.match.params.collectionSlug);

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
        <form className="collection__redeem__form" onSubmit={event => this.RedeemCode(event)}>
          <div className="collection__redeem__form__text">
            Enter your code
          </div>
          <div className="collection__redeem__form__error-text">
            {this.state.redeemError || ""}
          </div>
          <input
            className="collection__redeem__form__input"
            ref={element => element && element.focus()}
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
                <CardModal copyKey="collections" images={{collections: [{url: "", title: "Wallet"}]}} />
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
                <TransferForm className="collection" />
              </Modal>
            )}
          >
            Transfer my NFT to Ethereum MainNet
          </button>
        </div>
        <div className="collection__content__footer">
          <div className="collection__content__footer__border" />
          <div className="collection__content__footer__message">
            Powered By <ImageIcon icon={EluvioLogo} label="ELUV.IO" className="collection__content__footer__message__image" />
          </div>
          <div className="collection__content__footer__links">
            <a href="/" target="_blank" className="collection__content__footer__link">Contact Us</a>
            <a href="/" target="_blank" className="collection__content__footer__link">Support</a>
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
