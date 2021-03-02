import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class Main extends React.Component {
  render() {
    return (
      <div className="main-page">
        Main Page
      </div>
    );
  }
}

export default Main;
