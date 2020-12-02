import React from "react";
import merchFront from "../../../static/images/ritaora/merchFront.jpg";
import merchBack from "../../../static/images/ritaora/merchBack.jpg";
import merchFront2 from "../../../static/images/ritaora/merchFront2.jpg";
import merchBack2 from "../../../static/images/ritaora/merchBack2.jpg";
import merchFront3 from "../../../static/images/ritaora/merchFront3.jpg";
import merchBack3 from "../../../static/images/ritaora/merchBack3.jpg";

class Merch extends React.Component {
  render() {
    return (
        <div className={"merch-container"}>
          <a href="https://store.ritaora.com/products/phoenix-tour-tee-black" target="_blank" className="merch-item">
            <img className="merch-image" src={merchFront} label="merchFront" onMouseOver={e => (e.currentTarget.src =merchBack)} onMouseOut={e => (e.currentTarget.src =merchFront)}/>
            <div className="merch-detail">
              <span className="merch-name">Phoenix Tour Tee - Black</span>
              <span className="merch-price">£30.00 GBP</span>
            </div>
          </a>

          <a href="https://store.ritaora.com/products/instagram-tee-white" target="_blank" className="merch-item">
            <img className="merch-image" src={merchFront2} label="merchFront2" onMouseOver={e => (e.currentTarget.src =merchBack2)} onMouseOut={e => (e.currentTarget.src =merchFront2)}/>
            <div className="merch-detail">
              <span className="merch-name">INSTAGRAM TEE - WHITE</span>
              <span className="merch-price">£30.00 GBP</span>
            </div>
          </a>
          <a href="https://store.ritaora.com/products/anywhere-longsleeve-pink" target="_blank" className="merch-item">
            <img className="merch-image" src={merchFront3} label="merchFront3" onMouseOver={e => (e.currentTarget.src =merchBack3)} onMouseOut={e => (e.currentTarget.src =merchFront3)}/>
            <div className="merch-detail">
              <span className="merch-name">TOUR LONGSLEEVE - PINK</span>
              <span className="merch-price">£40.00 GBP</span>
            </div>
          </a>
          <a href="https://store.ritaora.com/products/instagram-tee-white" target="_blank" className="merch-item">
            <img className="merch-image" src={merchFront2} label="merchFront2" onMouseOver={e => (e.currentTarget.src =merchBack2)} onMouseOut={e => (e.currentTarget.src =merchFront2)}/>
            <div className="merch-detail">
              <span className="merch-name">Phoenix Tour Tee - Black</span>
              <span className="merch-price">£30.00 GBP</span>
            </div>
          </a>
          <a href="https://store.ritaora.com/products/anywhere-longsleeve-pink" target="_blank" className="merch-item">
            <img className="merch-image" src={merchFront3} label="merchFront3" onMouseOver={e => (e.currentTarget.src =merchBack3)} onMouseOut={e => (e.currentTarget.src =merchFront3)}/>
            <div className="merch-detail">
              <span className="merch-name">TOUR LONGSLEEVE - PINK</span>
              <span className="merch-price">£40.00 GBP</span>
            </div>
          </a>
          <a href="https://store.ritaora.com/products/phoenix-tour-tee-black" target="_blank" className="merch-item">
            <img className="merch-image" src={merchFront} label="merchFront" onMouseOver={e => (e.currentTarget.src =merchBack)} onMouseOut={e => (e.currentTarget.src =merchFront)}/>
            <div className="merch-detail">
              <span className="merch-name">INSTAGRAM TEE - WHITE</span>
              <span className="merch-price">£30.00 GBP</span>
            </div>
          </a>
        </div>
    );
  }
}

export default Merch;