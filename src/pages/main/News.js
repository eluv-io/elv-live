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

  NewsItem(date, header, content, anchor, logo=false) {
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
            this.NewsItem(
              "August 23rd, 2021",
              <div>
                Rita Ora in partnership with Melrose Media announce performance from the legendary Eiffel Tower, as part of upcoming music series “Iconic People in Iconic Places” presented at Paris Fashion Week with custom looks designed exclusively by Prada, Miu Miu, Lanvin and Fendi; A portion of the proceeds will go towards soccer aid for UNICEF
              </div>,
              <div className="news-page__item__content">
                { this.Markdown(RitaOra) }
              </div>,
              "2021-8-23",
              true
            )
          }
          {
            this.NewsItem(
              "March 18th, 2021",
              <div>
                <a href="https://live.eluv.io" target="_blank">Eluvio LIVE </a>
                Provides Artists with Novel Blockchain-Based Streaming and Ticketing Platform
              </div>,
              <div className="news-page__item__content">
                { this.Markdown(PressReleasePart1) }
                { this.Video({objectId: "iq__4Bxoe3DEAAdQ2YyC5AcGtZqvupWo"}) }
                { this.Markdown(PressReleasePart2) }
              </div>,
              "2021-3-18"
            )
          }
        </div>
        { this.Navigation() }
      </div>
    );
  }
}

export default News;
