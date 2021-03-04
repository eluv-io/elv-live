import React from "react";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class Terms extends React.Component {
  render() {
    return (
      <div className="page-content__terms">
        Terms
      </div>
    );
  }
}

export default Terms;
