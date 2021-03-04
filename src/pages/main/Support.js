import React from "react";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class Support extends React.Component {
  render() {
    return (
      <div className="page-content support-page">
        Support
      </div>
    );
  }
}

export default Support;
