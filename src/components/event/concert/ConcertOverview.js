import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";

@inject("rootStore")
@inject("siteStore")
@observer
class ConcertOverview extends React.Component {

  render() {
    // let eventInfo = this.props.siteStore.eventAssets.get(this.props.title);
    // const featuredTitle = eventInfo.title;
    const title = this.props.title;
    const titleInfo = title.info || {};
    let eventInfo = this.props.siteStore.eventAssets.get(this.props.name);

    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={`event-container`}>
        {/* <ImageIcon 
          icon={title.portraitUrl || title.imageUrl || title.landscapeUrl } 
          className="premiereTabs__container__poster" 
          title="Poster" 
        /> */}

        <div className="event-container__info">
          <h1 className="event-container__info__h1Props">{ eventInfo.description }</h1>

          <div className="event-container__info__synopsis">
            MADISON BEER WILL BE MAKING HISTORY ON DECEMBER 17TH WITH A GLOBAL LIVE STREAM FROM THE LEGENDARY LOS ANGELES VENUE, THE STAPLE CENTER, TO CELEBRATE THE RELEASE OF HER DEBUT SOLO ALBUM: LIFE SUPPORT. TICKETS AND VIP PACKAGES FOR THIS HISTORIC STREAMING EVENT ARE ON SALE NOW.
          </div>
          <div className="event-container__info__synopsis">
            THE STREAM, TITLED FORUM OR AGAINST 'EM, WILL FEATURE A FULL ARENA PRODUCTION COMPLETE WITH A VISUAL FEAST OF PYROTECHNICS, A STACKED SET LIST FEATURING ALL TRACKS FROM CMFT, SELECT CUTS FROM SLIPKNOT AND STONE SOUR, A HANDFUL OF COVERS AND A GUEST PERFORMANCE FROM THE CHERRY BOMBS. A SPECIAL PRE-SHOW WILL KICK-OFF 1 HOUR BEFORE THE EVENT FEATURING EXCLUSIVE INTERVIEWS AND BEHIND-THE-SCENES FOOTAGE.
          </div>
          <div className="event-container__info__ticketDetail">
          Livestream Ticket Includes:
          <ul className="event-container__info__ticketDetail">
            <li className="event-container__info__ticketDetail">- Entry into Live Stream Concert</li>
          </ul>  
          </div>
          <div className="event-container__info__ticketDetail">
          VIP Package Includes:
          <ul className="event-container__info__ticketDetail">
            <li className="event-container__info__ticketDetail">- Entry into Live Stream Concert</li>
            <li className="event-container__info__ticketDetail">- Special Access to Live Chat, Virtual Fan Wall, and more during the Livestream</li>
            <li className="event-container__info__ticketDetail">- Exclusive Virtual Meet and Greet with Madison Beer</li>
          </ul>      
          </div>
        </div>
      </div>
    );
  }
}

export default ConcertOverview;