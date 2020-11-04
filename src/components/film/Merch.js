import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class Merch extends React.Component {

  render() {
    return (
      <div className={`premiereTabs__container`}>
        <h1 className="merch" > 
          Merchandise is currently unavailable.
        </h1>
      </div>
    );
  }
}

export default Merch;