import React from "react";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class About extends React.Component {
  render() {
    return (
      <div className="page-content__about">
        About
      </div>
    );
  }
}

export default About;
