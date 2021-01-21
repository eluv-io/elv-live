import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class Merch extends React.Component {
  
  render() {
    let checkoutMerch = this.props.siteStore.eventSites[this.props.name]["merch_tab"];

    return (
      <div className={"merch-container"}>
        {checkoutMerch.map((obj, index) =>
          <a href={obj["url"]} target="_blank" className="merch-item" key={index}>
            <img className="merch-image" src={this.props.siteStore.merchImage} label="merchFront" onMouseOver={e => (e.currentTarget.src = this.props.siteStore.merchBackImage)} onMouseOut={e => (e.currentTarget.src =this.props.siteStore.merchImage)}/>
            <div className="merch-detail">
              <span className="merch-name">{obj["name"]}</span>
              <span className="merch-price">{obj["price"]}</span>
            </div>
          </a>
        )}
      </div>
    );
  }
}

export default Merch;