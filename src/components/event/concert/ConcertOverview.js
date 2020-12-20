import React from "react";
import {inject, observer} from "mobx-react";
import concertPoster from "../../../assets/images/ritaora/ro3.jpg";
import concertPoster2 from "../../../assets/images/ritaora/sro3.png";

import Ticket from "../../livestream/Payment/Ticket";

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
              <div>RO3 World Tour</div>
              <div className="overview-container__info__title__desc">{`Live Virtual Concert`}</div>
            </div>

            <div className="overview-container__info__synopsis">
              Rita Ora will be making history on January 28th with a global live stream from the legendary Paris landmark, the Eiffel Tower, to celebrate the release of her third studio album: RO3. Tickets and VIP packages for this historic streaming event are on sale now. 
            </div>
            <div className="overview-container__info__synopsis">
              The stream will feature a full production complete with a visual feast of lights and pyrotechnics, a stacked set list featuring all tracks from RO3, her top hits, a handful of covers, and a guest performance. A special pre-show will kick-off 1 hour before the event featuring exclusive interviews and behind-the-scenes footage.
            </div>
          </div>

          <div className="overview-container__photoGroup">
            <img
              src={concertPoster2}
              className= "overview-container__photoGroup__singlePhoto"
            />     
          </div>
        </div>
        
        <div className="ticket-group">
          <Ticket 
            name="General Admission" 
            description="General Admission includes one (1) Virtual Ticket to the Live Stream Concert. Ticket can be redeemed on these platforms: WATCH ONLINE: You can watch the show online through Eluvio site. WATCH ON THE APP: The Eluvio app is available on all smartphones. WATCH ON TV: The Eluvio app is available on Apple TV and Roku."
            price="$30"
            priceID="price_1HpS6pE0yLQ1pYr6CuBre5I4"
            prodID = "prod_IQIiC3jywpIUKu"
            date ="February 28th, 8:00 PM PST"
          />
          <Ticket 
            name="VIP Package" 
            description="VIP Package includes one (1) Virtual Ticket to the Live Stream Concert, Special Access to Live Chat and Virtual Fan Wall, and an Exclusive Virtual Meet and Greet with Rita Ora. Ticket can be redeemed on these platforms: WATCH ONLINE: You can watch the show online through Eluvio site. WATCH ON THE APP: The Eluvio app is available on all smartphones. WATCH ON TV: The Eluvio app is available on Apple TV and Roku."
            price="$50"
            priceID="price_1HpS77E0yLQ1pYr6bmC8griX"
            prodID = "prod_IQIiMc4NHvH3DF"
            date ="February 28th, 8:00 PM PST"
            refProp={this.props.refProp}
          />
        </div>
      </div>
    );
  }
}

export default ConcertOverview;