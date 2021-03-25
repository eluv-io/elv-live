import React from "react";
import {render} from "react-dom";
import {inject, observer} from "mobx-react";
import ReactMarkdown from "react-markdown";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";

import ImageIcon from "Common/ImageIcon";

import PressReleasePart1 from "Assets/documents/news/Press Release - March 12/Part1.md";
import PressReleasePart2 from "Assets/documents/news/Press Release - March 12/Part2.md";

import Logo from "Assets/images/logo/whiteEluvioLiveLogo.svg";
import HeaderLine from "Assets/images/logo/HeaderLine.png";

@inject("mainStore")
@observer
class News extends React.Component {
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
                network: EluvioPlayerParameters.networks.DEMO,
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

  NewsItem(header, content) {
    return (
      <div className="news-page__item">
        <ImageIcon icon={Logo} label="Eluvio Live" className="news-page__item__logo"/>
        <img src={HeaderLine} alt="Header Underline" className="news-page__item__header-underline" />
        <h2>{ header }</h2>
        { content }
      </div>
    );
  }

  render() {
    return (
      <div className="page-content news-page">
        {
          this.NewsItem(
            <div>
              <a href="https://live.eluv.io" target="_blank">Eluvio LIVE </a>
              Provides Artists with Novel Blockchain-Based Streaming and Ticketing Platform
            </div>,
            <div className="news-page__item__content">
              { this.Markdown(PressReleasePart1) }
              { this.Video({objectId: "iq__4Bxoe3DEAAdQ2YyC5AcGtZqvupWo"}) }
              { this.Markdown(PressReleasePart2) }
            </div>
          )
        }
      </div>
    );
  }
}

export default News;
