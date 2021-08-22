import React from "react";
import {render} from "react-dom";
import {inject, observer} from "mobx-react";
import ReactMarkdown from "react-markdown";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";
import Copy from "Assets/copy/Main.yaml";

import ImageIcon from "Common/ImageIcon";

import PressReleasePart1 from "Assets/documents/news/Press Release - March 12/Part1.md";
import PressReleasePart2 from "Assets/documents/news/Press Release - March 12/Part2.md";

import RitaOra from "Assets/documents/news/Rita Ora - August 23rd/index.md";
import RitaOraImage1 from "Assets/documents/news/Rita Ora - August 23rd/rita-news.jpg";
import RitaOraImage2 from "Assets/documents/news/Rita Ora - August 23rd/Rita-News-photo.jpg";

import Logo from "Assets/images/logo/fixed-eluvio-live-logo-light.svg";
import HeaderLine from "Assets/images/logo/HeaderLine.png";

@inject("mainStore")
@observer
class News extends React.Component {
  componentDidMount() {
    document.title = "News and Information | Eluvio LIVE";
    document
      .getElementsByTagName("meta")
      .namedItem("description")
      .setAttribute("content", Copy.seo.page_descriptions.news);
    document
      .getElementsByTagName("meta")
      .namedItem("robots")
      .setAttribute("content", "");
  }

  Navigation() {
    return (
      <div className="news-page__navigation">
        <a
          href="#2021-8-23"
          className="news-page__navigation-button"
        >
          <div className="news-page__navigation-button__subheader">
            August 23rd, 2021
          </div>
          <div className="news-page__navigation-button__header">
            Rita Ora in partnership with Melrose Media announce performance from the legendary Eiffel Tower
          </div>
        </a>
        <a
          href="#2021-3-18"
          className="news-page__navigation-button"
        >
          <div className="news-page__navigation-button__subheader">
            March 18th, 2021
          </div>
          <div className="news-page__navigation-button__header">
            Eluvio LIVE provides artists with novel blockchain-based streaming and ticketing platform
          </div>
        </a>
      </div>
    );
  }

  Image(image, alt, credit) {
    return (
      <div className="news-page__item__image">
        <img src={image} alt={alt} className="news-page__item__image__image" />
        {credit ?
          <div className="news-page__item__image__credit">
            {credit}
          </div> : null
        }
      </div>
    );
  }

  Markdown(content) {
    return (
      <div
        className="news-page__item__document markdown-document"
        ref={element => {
          if(!element) { return; }

          render(
            <ReactMarkdown linkTarget="_blank">
              { content }
            </ReactMarkdown>,
            element
          );
        }}
      >
      </div>
    );
  }

  Video(playoutParameters) {
    return (
      <div
        className="news-page__item__video"
        ref={element => {
          if(!element) { return; }

          new EluvioPlayer(
            element,
            {
              clientOptions: {
                client: this.props.mainStore.rootStore.client
              },
              sourceOptions: {
                playoutParameters
              },
              playerOptions: {
                watermark: EluvioPlayerParameters.watermark.ON,
                muted: EluvioPlayerParameters.muted.OFF,
                autoplay: EluvioPlayerParameters.autoplay.OFF,
                controls: EluvioPlayerParameters.controls.DEFAULT
              }
            }
          );
        }}
      />
    );
  }

  NewsItem({date, header, content, anchor, logo=false}) {
    return (
      <div className="news-page__item" id={anchor}>
        { logo ? <ImageIcon icon={Logo} label="Eluvio Live" className="news-page__item__logo"/> : null }
        { logo ? <img src={HeaderLine} alt="Header Underline" className="news-page__item__header-underline" /> : null }
        <h3 className="news-page__item__date">{ date }</h3>
        <h2>{ header }</h2>
        { content }
        <img src={HeaderLine} alt="Header Underline" className="news-page__item__header-underline" />
      </div>
    );
  }

  render() {
    return (
      <div className="page-content news-page">
        <div className="news-page__content">
          {
            this.NewsItem({
              date: "August 23rd, 2021",
              header:
                <div>
                  <div>
                    RITA ORA IN PARTNERSHIP WITH MELROSE MEDIA ANNOUNCE PERFORMANCE FROM THE LEGENDARY EIFFEL TOWER
                  </div>
                  <br/>
                  <div>
                    PERFORMANCE FEATURES AS PART OF THE UPCOMING MUSIC SERIES <i>“ICONIC PEOPLE IN ICONIC PLACES”</i>
                  </div>
                  <br/>
                  <div>
                    PRESENTED AT PARIS FASHION WEEK WITH CUSTOM LOOKS DESIGNED EXCLUSIVELY BY FENDI, MIU MIU, LANVIN AND
                    ALEXANDRE VAUTHIER
                  </div>
                  <br/>
                  <div>
                    PORTION OF THE PROCEEDS WILL GO TOWARDS SOCCER AID FOR UNICEF
                  </div>
                </div>,
              content:
                <div className="news-page__item__content">
                  {this.Image(RitaOraImage1, "Rita Ora Live Show - Iconic People in Iconic Places")}
                  {this.Markdown(RitaOra)}
                  {this.Image(RitaOraImage2, "Rita Ora", "Photo Credit: Frederic Monceau")}
                </div>,
              anchor: "2021-8-23",
              logo: true
            })
          }
          {
            this.NewsItem({
              date: "March 18th, 2021",
              header: <div>
                <a href="https://live.eluv.io" target="_blank">Eluvio LIVE </a>
                Provides Artists with Novel Blockchain-Based Streaming and Ticketing Platform
              </div>,
              content: <div className="news-page__item__content">
                {this.Markdown(PressReleasePart1)}
                {this.Video({objectId: "iq__4Bxoe3DEAAdQ2YyC5AcGtZqvupWo"})}
                {this.Markdown(PressReleasePart2)}
              </div>,
              anchor: "2021-3-18"
            })
          }
        </div>
        { this.Navigation() }
      </div>
    );
  }
}

export default News;
