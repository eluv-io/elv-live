import React from "react";
import {inject, observer} from "mobx-react";

@inject("mainStore")
@observer
class Terms extends React.Component {
  render() {
    return (
      <div className="page-content terms-page">
        <h1 className="terms-page__header">Terms</h1>
      </div>
    );
  }
}

export default Terms;
