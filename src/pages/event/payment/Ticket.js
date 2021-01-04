import React from "react";
import {inject, observer} from "mobx-react";

import Timer from "../../../components/utils/Timer";
import { FaRegCalendarAlt, FaRegClock} from "react-icons/fa";
import { IconContext } from "react-icons";

@inject("rootStore")
@inject("siteStore")
@observer
class Ticket extends React.Component {

  render() {
    let {name, description, price, priceID, prodID, date, poster} = this.props;

    return (
      <div className="ticket-event" id={name} ref={this.props.refProp} >
        <div className="ticket-image">
          <img src={poster} className="ticket-image-img"/>
        </div>
        <div className="ticket-detail">
          <div className="ticket-top">
            <div className="ticket-top-labels"> 
              <span className="ticket-label-loc">
                Global
              </span>
              <span className="ticket-label-available">
                LIMITED TICKETS AVAILABLE
              </span>

            </div>
            <h3 className="ticket-top-title">
              {name}
            </h3>
            <p className="ticket-top-description">
              {description}
            </p>

          </div>
          <div className="ticket-bottom">
            <div className="ticket-bottom-info">
              <div className="ticket-bottom-price">
                {price}
              </div>

              <IconContext.Provider value={{ className: 'ticket-icon' }}>
                <div className="ticket-bottom-date">
                  <FaRegCalendarAlt />
                  <span className="ticket-bottom-date">
                    {date}
                  </span>
                </div>
              </IconContext.Provider>
              
              <div className="ticket-bottom-countdown">
              <Timer classProp="ticket-icon" premiereTime="January 28, 2021 20:00:00"/>
              </div>
            </div>
            <button className="ticket-bottom-button" role="link" onClick={() => this.props.siteStore.turnOnModal(priceID, prodID, name)}>
              Buy Ticket
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Ticket;