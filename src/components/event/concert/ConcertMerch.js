import React from "react";
import { merchInfo } from "../../../assets/data/event";

class Merch extends React.Component {
  render() {
    return (
        <div className={"merch-container"}>
          {merchInfo.map((obj, index) =>
            <a href={obj["url"]} target="_blank" className="merch-item" key={index}>
              <img className="merch-image" src={obj["front-img"]} label="merchFront" onMouseOver={e => (e.currentTarget.src = obj["back-img"])} onMouseOut={e => (e.currentTarget.src =obj["front-img"])}/>
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