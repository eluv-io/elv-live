import React from "react";
import { render } from "react-dom";
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import LanguageCodes from "Assets/LanguageCodes";
import ReactMarkdown from "react-markdown";
import SanitizeHTML from "sanitize-html";
import Modal from "Common/Modal";
import UrlJoin from "url-join";
import ImageIcon from "Common/ImageIcon";
import EluvioLogo from "Images/logo/eluvio-logo";

@inject("rootStore")
@inject("siteStore")
@inject("cartStore")
@observer
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
        <a href={sponsor.link} target="_blank" rel="noopener" className={"sponsor-img-container-footer"} key={`footer-sponsor-${index}`} title={sponsor.name}>
          <img src={this.props.siteStore.darkMode ? sponsor.light_image_url || sponsor.image_url : sponsor.image_url} className="big-sponsor-img-footer" alt={sponsor.name} />
        </a>
      )
    );
  }

  FooterLinks() {
    const links = this.props.siteStore.currentSiteInfo.footer_links;

    if(!links || links.length === 0) {
      return (
        <>
          <Link to={this.props.siteStore.SitePath("support")} className="footer-item">
            Support FAQ
          </Link>
          <Link to={this.props.siteStore.SitePath("terms")} className="footer-item">
            Terms
          </Link>
          <Link to={this.props.siteStore.SitePath("privacy")} className="footer-item">
            Privacy Policy
          </Link>
        </>
      );
    }

    return (
      links.map(({text, url, content_rich_text, content_html}, index) => {
        if(url) {
          return <a target="_blank" key={`footer-link-${index}`} className="footer-item" rel="noopener" href={url}>{ text }</a>;
        } else if(content_rich_text || content_html) {
          return (
            <button
              key={`footer-link-${index}`}
              className="footer-item"
              onClick={() => {
                this.setState({
                  modal: (
                    <Modal
                      className="event-message-container"
                      Toggle={() => this.setState({modal: undefined})}
                    >
                      {
                        content_rich_text ?
                          <div className="event-message">
                            <div className="event-message__content">
                              <div
                                className="event-message__content__message"
                                ref={element => {
                                  if(!element) {
                                    return;
                                  }

                                  render(
                                    <ReactMarkdown linkTarget="_blank" allowDangerousHtml>
                                      {SanitizeHTML(content_rich_text)}
                                    </ReactMarkdown>,
                                    element
                                  );
                                }}
                              />
                            </div>
                          </div> :
                          <iframe
                            className="event-message"
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
      })
    );
  }

  render() {
    const hasSponsors = this.props.siteStore.sponsors && this.props.siteStore.sponsors.length > 0;
    const languagesAvailable = (this.props.siteStore.currentSiteInfo.localizations || []).length > 0;

    return (
      <div className="live-footer">
        { this.state.modal }
        <div className="footer-container">
          <div className="footer-info">
            { this.FooterLinks() }
            {
              languagesAvailable ?
                <select
                  className="footer-language-selection footer-item"
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
          <div className="sponsor-container-footer">
            { hasSponsors ? <div className="sponsor-message">Sponsored By</div> : null }
            <div className="sponsor-logos">
              { hasSponsors ? this.Sponsors() : null }
            </div>
          </div>
          <div className="footer-info footer__powered-by">
            <a href="https://live.eluv.io" target="_blank" className="footer-item footer__powered-by__tagline">
              Powered by <ImageIcon icon={EluvioLogo} className="footer__powered-by__logo" title="Eluv.io" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
