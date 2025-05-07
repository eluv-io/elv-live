import React from "react";
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import LanguageCodes from "Assets/LanguageCodes";
import Modal from "Common/Modal";
import UrlJoin from "url-join";
import ImageIcon from "Common/ImageIcon";
import EluvioLogo from "Images/logo/eluvio-logo";
import CookieBanner from "Common/CookieBanner";
import {RichText} from "Common/Components";

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: undefined
    };
  }


  Sponsors() {
    return (
      this.props.siteStore.sponsors.map((sponsor, index) =>
        <a href={sponsor.link} target="_blank" rel="noopener noreferrer" className="footer__sponsors__link" key={`footer-sponsor-${index}`} title={sponsor.name}>
          <img src={this.props.siteStore.darkMode ? sponsor.light_image_url || sponsor.image_url : sponsor.image_url} className="footer__sponsors__link__image" alt={sponsor.name} />
        </a>
      )
    );
  }

  FooterLinks() {
    const links = (this.props.siteStore.currentSiteInfo.footer_links || []).map(({text, url, image, image_alt_text, content_rich_text, content_html}, index) => {
      if(url) {
        return <a target="_blank" key={`footer-link-${index}`} className="footer__item" rel="noopener noreferrer" href={url}>{ text }</a>;
      } else if(content_rich_text || content_html || image) {
        return (
          <button
            key={`footer-link-${index}`}
            className="footer__item"
            onClick={() => {
              this.setState({
                modal: (
                  <Modal
                    className={`event-message-container footer__modal ${content_rich_text ? "footer__modal-rich-text" : "footer__modal-frame"}`}
                    Toggle={() => this.setState({modal: undefined})}
                  >
                    {
                      image ?
                        <img src={image?.url} className="event-message__content__image" alt={image_alt_text} /> :
                        content_rich_text ?
                          <div className="event-message">
                            <div className="event-message__content">
                              <RichText
                                richText={content_rich_text}
                                className="event-message__content__message markdown-document"
                              />
                            </div>
                          </div> :
                          <iframe
                            className="event-message event-message--frame"
                            src={this.props.siteStore.SiteUrl(UrlJoin("info", "footer_links", index.toString(), "content_html"))}
                          />
                    }
                  </Modal>
                )
              });
            }}
          >
            { text }
          </button>
        );
      }
    });

    return (
      <>
        {
          this.props.siteStore.currentSiteInfo.show_faq ?
            <Link to={this.props.siteStore.SitePath("support")} className="footer__item">
              { this.props.siteStore.l10n.footer.support_faq }
            </Link> : null
        }
        {
          links && links.length > 0 ?
            links :
            <>
              <a href="/privacy" className="footer__item" rel="noopener" target="_blank">
                { this.props.siteStore.l10n.footer.privacy_policy }
              </a>
              <a href="/terms" className="footer__item" rel="noopener" target="_blank">
                { this.props.siteStore.l10n.footer.terms }
              </a>
            </>
        }
      </>
    );
  }

  render() {
    const hasSponsors = this.props.siteStore.sponsors && this.props.siteStore.sponsors.length > 0;
    const languagesAvailable = (this.props.siteStore.currentSiteInfo.localizations || []).length > 0;

    return (
      <div className="footer">
        { this.state.modal }
        {
          hasSponsors && !this.props.noSponsors ?
            <div className="footer__sponsors">
              <div className="footer__sponsors__tagline">
                { this.props.siteStore.currentSiteInfo.sponsor_tagline }
              </div>
              <div className="footer__sponsors__links">
                { this.Sponsors() }
              </div>
            </div> : null
        }
        <div className="footer__block">
          { this.FooterLinks() }
          <CookieBanner />
          {
            languagesAvailable ?
              <select
                className="footer__item footer__language-selection"
                value={this.props.siteStore.language}
                onChange={event => this.props.siteStore.SetLanguage(event.target.value)}
              >
                <option value="en">English</option>
                {
                  this.props.siteStore.currentSiteInfo.localizations.map(code =>
                    <option key={`footer-language-${code}`} value={code}>{ LanguageCodes[code] || code }</option>
                  )
                }
              </select> : null
          }
        </div>
        <div className="footer__border" />
        {
          this.props.siteStore.currentSiteInfo.footer_text ?
            <RichText
              richText={this.props.siteStore.currentSiteInfo.footer_text}
              className="markdown-document footer__block footer__copyright"
            /> : null
        }
        {
          this.props.siteStore.eventInfo.copyright ?
            <RichText
              richText={this.props.siteStore.eventInfo.copyright}
              className="footer__block footer__copyright"
            /> : null
        }
        <div className="footer__block footer__powered-by">
          <a href="https://live.eluv.io" target="_blank" className="footer__item footer__powered-by__tagline" rel="noreferrer">
            { this.props.siteStore.l10n.footer.powered_by }
            <ImageIcon icon={EluvioLogo} className="footer__powered-by__logo" title="Eluv.io" />
          </a>
        </div>
      </div>
    );
  }
}

export default inject("rootStore")(inject("siteStore")(inject("cartStore")(observer(Footer))));
