// Boilerplate for new class

import React from "react";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class Technology extends React.Component {
  render() {
    return (
      <div className="page-content__technology">
        Tech
      </div>
    );
  }
}

export default Technology;
