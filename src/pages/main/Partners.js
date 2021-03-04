// Boilerplate for new class

import React from "react";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class Partners extends React.Component {
  render() {
    return (
      <div className="page-content partners-page">
        Partners
      </div>
    );
  }
}

export default Partners;
