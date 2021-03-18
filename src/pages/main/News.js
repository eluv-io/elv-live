import React from "react";
import {render} from "react-dom";
import ReactMarkdown from "react-markdown";
import ImageIcon from "Common/ImageIcon";

import PressRelease from "Assets/documents/news/Press Release - March 12/index.md";

import Logo from "Assets/images/logo/whiteEluvioLiveLogo.svg";
import HeaderLine from "Assets/images/logo/HeaderLine.png";

class News extends React.Component {
  render() {
    return (
      <div className="page-content news-page">
        <div className="news-page__item">
          <ImageIcon icon={Logo} label="Eluvio Live" className="news-page__item__logo"/>
          <img src={HeaderLine} alt="Header Underline" className="news-page__item__header-underline" />
          <div
            className="news-page__item__document markdown-document"
            ref={element => {
              if(!element) { return; }

              render(
                <ReactMarkdown>
                  { PressRelease }
                </ReactMarkdown>,
                element
              );
            }}
          >
          </div>
        </div>
      </div>
    );
  }
}

export default News;
