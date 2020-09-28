import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import {
  Link
} from "react-router-dom";

@inject("rootStore")
@inject("siteStore")
@observer
class Card extends React.Component {

  render() {

    return (
        <div className="card">
          <div className="card__side card__side--front">

            <ImageIcon className="card__picture" icon={this.props.icon} label="artist" />

            <h4 className="card__heading">
              <span className="card__heading-span">{this.props.artist}</span>
            </h4>
          </div>

          <div className="card__side card__side--back">
            <div className="card__cta">
              <div className="card__price-box">
                <h4 className="card__price-detail">{this.props.date}</h4>
                <h4 className="card__price-detail">{this.props.description}</h4>
              </div>
              <Link 
                to={`/event/${this.props.name}`} 
                >
                <button type="button" className="btn2 btn2--white">Buy Ticket</button>
              </Link>
            </div>
          </div>
        </div>
    );
  }
}

export default Card;