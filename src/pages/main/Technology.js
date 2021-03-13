import React from "react";
import {inject, observer} from "mobx-react";
import Image from "Assets/icons/computer-diagrams.svg";

import Copy from "./copy/Copy.yaml";
import ImageIcon from "Common/ImageIcon";

@inject("siteStore")
@observer
class Technology extends React.Component {
  render() {
    return (
      <div className="page-content technology-page">
        <div className="technology-page__image-container">
          <ImageIcon className="technology-page__image" icon={Image} title="Eluv.io Technology" />
        </div>
        <div className="technology-page__copy-block">
          <h2 className="technology-page__copy-header">Eluv.io Technology</h2>
          <pre className="technology-page__copy">{ Copy.technology.text }</pre>
        </div>
      </div>
    );
  }
}

export default Technology;
