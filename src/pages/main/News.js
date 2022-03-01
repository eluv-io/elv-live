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
import RitaOraImage1 from "Assets/documents/news/Rita Ora - August 23rd/rita_poster.jpg";
import RitaOraImage2 from "Assets/documents/news/Rita Ora - August 23rd/Rita-News-photo.jpg";

import FoxRelease from "Assets/documents/news/Fox - August 25th/index.md";

import SundanceRelease from "Assets/documents/news/Sundance - January 5th 2022/index.md";

import DollyRelease from "Assets/documents/news/Dolly - March 1/index.md";

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

    if(window.location.hash) {
      const item = document.getElementById(window.location.hash.replace("#", ""));

      if(item) {
        setTimeout(() => item.scrollIntoView(), 500);
      }
    }
  }

  Navigation() {
    return (
      <div className="news-page__navigation">
        <a
          href="#2022-3-1"
          className="news-page__navigation-button"
        >
          <div className="news-page__navigation-button__subheader">
            March 1st, 2022
          </div>
          <div className="news-page__navigation-button__header">
            Dolly Parton to live stream first-ever South by Southwest performance on the blockchain
          </div>
        </a>
        <a
          href="https://variety.com/2022/digital/news/the-walking-dead-nft-orange-comet-1235169700"
          rel="noopener"
          target="_blank"
          className="news-page__navigation-button"
        >
          <div className="news-page__navigation-button__subheader">
            February 2nd, 2022
          </div>
          <div className="news-page__navigation-button__header">
            'The Walking Dead' Is Unleashing a Swarm of NFTs for Final Season
          </div>
        </a>
        <a
          href="#2022-1-5"
          className="news-page__navigation-button"
        >
          <div className="news-page__navigation-button__subheader">
            January 5th, 2022
          </div>
          <div className="news-page__navigation-button__header">
            Liquid Media Launches Blockchain Framework during 2022 Sundance Film Festival
          </div>
        </a>
        <a
          href="#2021-8-25"
          className="news-page__navigation-button"
        >
          <div className="news-page__navigation-button__subheader">
            August 25th, 2021
          </div>
          <div className="news-page__navigation-button__header">
            Fox Corporation makes strategic investment in Eluvio
          </div>
        </a>
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
              date: "March 1st, 2022",
              header:
                <div>
                  <div>
                    DOLLY PARTON TO LIVE STREAM FIRST-EVER SOUTH BY SOUTHWEST PERFORMANCE ON THE BLOCKCHAIN, TIMED TO RELEASE OF NEW NOVEL RUN, ROSE, RUN, CO-WRITTEN WITH JAMES PATTERSON, AND COMPANION ALBUM SHE WROTE AND PRODUCED
                  </div>
                </div>,
              content:
                <div className="news-page__item__content">
                  {this.Markdown(DollyRelease)}
                </div>,
              anchor: "2022-3-1"
            })
          }
          {
            this.NewsItem({
              date: "January 5th, 2022",
              header:
                <div>
                  <div>
                    Liquid Media Launches Blockchain Framework during 2022 Sundance Film Festival
                  </div>
                </div>,
              content:
                <div className="news-page__item__content">
                  {this.Markdown(SundanceRelease)}
                </div>,
              anchor: "2022-1-5"
            })
          }
          {
            this.NewsItem({
              date: "August 25th, 2021",
              header:
                <div>
                  <div>
                    FOX CORPORATION MAKES STRATEGIC INVESTMENT IN ELUVIO AND SELECTS ELUVIO AS PLATFORM FOR FOX ENTERTAINMENT’S AND BENTO BOX ENTERTAINMENT’S RECENTLY LAUNCHED NFT BUSINESS BLOCKCHAIN CREATIVE LABS
                  </div>
                  <br />
                  <div>
                    Paul Cheesbrough, Chief Technology Officer and President of Digital for Fox Corporation, to join Eluvio’s Board of Directors and Collaborate on Blockchain-Based Innovation across FOX
                  </div>
                </div>,
              content:
                <div className="news-page__item__content">
                  {this.Markdown(FoxRelease)}
                </div>,
              anchor: "2021-8-25",
              logo: true
            })
          }
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
