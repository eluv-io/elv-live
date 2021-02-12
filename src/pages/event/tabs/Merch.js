import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class Merch extends React.Component {

  render() {

    return (
      <div className={"merch-container"}>
        {this.props.siteStore.merchTab.map((obj, index) =>
          <a href={obj["url"]} target="_blank" className="merch-item" key={index}>
            <img className="merch-image" src={obj["front_image"]} label="merchFront" onMouseOver={e => (e.currentTarget.src = obj["back_image"])} onMouseOut={e => (e.currentTarget.src =obj["front_image"])}/>
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
