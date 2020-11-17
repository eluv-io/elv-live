import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import {Link} from "react-router-dom";
import poster from "../../../static/images/livePOSTER.jpg";
import concertPoster from "../../../static/images/ritaora/ro3.jpg";
import Tickets from "../../livestream/Payment/Tickets";

@inject("rootStore")
@inject("siteStore")
@observer
class RitaOverview extends React.Component {

  render() {
    // let eventInfo = this.props.siteStore.eventAssets.get(this.props.title);
    // const featuredTitle = eventInfo.title;
    const title = this.props.title;
    const titleInfo = title.info || {};
    let eventInfo = this.props.siteStore.eventAssets.get(this.props.name);

    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={"event-container"}>
        {/* <ImageIcon 
          icon={title.portraitUrl || title.imageUrl || title.landscapeUrl } 
          className="premiereTabs__container__poster" 
          title="Poster" 
        /> */}
        <div className="event-container__eventInfo">
          <div className="event-container__info">
            <div className="event-container__info__h1Props">
              <div>RO3 World Tour</div>
              <div className="event-container__info__h1Props__desc">{`Live Virtual Concert`}</div>
            </div>

            <div className="event-container__info__synopsis">
              { eventInfo.name } will be making history on January 28th with a global live stream from the legendary Paris landmark, the Eiffel Tower, to celebrate the release of her third studio album: RO3. Tickets and VIP packages for this historic streaming event are on sale now. 
            </div>
            <div className="event-container__info__synopsis">
              The stream will feature a full production complete with a visual feast of lights and pyrotechnics, a stacked set list featuring all tracks from RO3, her top hits, a handful of covers, and a guest performance. A special pre-show will kick-off 1 hour before the event featuring exclusive interviews and behind-the-scenes footage.
            </div>
          </div>

          <div className="event-container__photoGroup">
            <img
              src={concertPoster}
              className= "event-container__photoGroup__singlePhoto"
            />     
          </div>
        </div>
        
        <Tickets />
      </div>
    );
  }
}

export default RitaOverview;