import React from "react";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class Support extends React.Component {
  render() {
    return (
      <div className="page-content support-page">
        <h1 className="support-page__header">NO REFUNDS</h1>
      </div>
    );
  }
}

export default Support;
