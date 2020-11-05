import React from "react";
import {inject, observer} from "mobx-react";
import back from "../../static/images/MERCH2.jpg";
@inject("rootStore")
@inject("siteStore")
@observer
class Merch extends React.Component {

  render() {
    console.log(this.props.name);
    if (this.props.name && this.props.name== "madison-beer") {
      return (
        <div className={`premiereTabs__container`}>
          <a href="https://store.madisonbeer.com/" target="_blank">
            <img
              src={back}
              className= "premiereTabs__container__merch"
            />  
          </a>
        </div>
      );
    } else {
      return (
        <div className={`premiereTabs__container`}>
          <h1 className="merch" > 
            Merchandise is currently unavailable.
          </h1>
        </div>
      );
    }
  }
}

export default Merch;