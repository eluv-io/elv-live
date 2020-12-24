import React from "react";
import {inject, observer} from "mobx-react";
// import concertPoster from "../../../assets/images/ritaora/ro3.jpg";
// import concertPoster2 from "../../../assets/images/ritaora/sponsorRO3.png";
import Ticket from "../../livestream/Payment/Ticket";
import { eventInfo, ticketInfo } from "../../../assets/data/event";

@inject("rootStore")
@inject("siteStore")
@observer
class ConcertOverview extends React.Component {

  render() {
    // let eventInfo = this.props.siteStore.eventAssets.get(this.props.title);
    // const featuredTitle = eventInfo.title;
    // let eventInfo = this.props.siteStore.eventAssets.get("rita-ora");;

    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={"overview-container"}>
        <div className="overview-container__eventInfo">
          <div className="overview-container__info">
            <div className="overview-container__info__title">
              <div>{eventInfo["event-header"]}</div>
              <div className="overview-container__info__title__desc">{eventInfo["location"]}</div>
            </div>
            {eventInfo["description"].map((description, index) =>
              <div className="overview-container__info__synopsis" key={index}>
                {description}          
              </div>
            )}
          </div>

          <div className="overview-container__photoGroup">
            <img
              src={eventInfo["event-poster"]}
              className= "overview-container__photoGroup__singlePhoto"
            />     
          </div>
        </div>
        
        <div className="ticket-group">
          {ticketInfo.map((obj, index) => (
            <Ticket
              name={obj["name"]}
              description={obj["description"]}
              price={obj["price"]}
              priceID={obj["stripe-priceID"]}
              prodID = {obj["stripe-prodID"]}
              date ={obj["date"]}
              poster={eventInfo["event-poster"]}
              key={index}
              refProp={index == 1 ? this.props.refProp: null}
            />
          ))}

        </div>
      </div>
    );
  }
}

export default ConcertOverview;