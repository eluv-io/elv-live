import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import {Link} from "react-router-dom";

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
      <div className={"event-container"}>
        {/* <ImageIcon 
          icon={title.portraitUrl || title.imageUrl || title.landscapeUrl } 
          className="premiereTabs__container__poster" 
          title="Poster" 
        /> */}

        <div className="event-container__info">
          <div className="event-container__info__h1Props">
            <div>{ eventInfo.name }</div>
            <div className="event-container__info__h1Props__desc">{`"Life Support World Tour" Live Virtual Concert`}</div>
          </div>

          <div className="event-container__info__synopsis">
          { eventInfo.name } will be making history on December 17th with a global live stream from the legendary Los Angeles venue, the Staple Center, to celebrate the release of her debut solo album: Life Support. Tickets and VIP packages for this historic streaming event are on sale now.     </div>
          <div className="event-container__info__synopsis">
          The stream will feature a full arena production complete with a visual feast of lights and pyrotechnics, a stacked set list featuring all tracks from Life Support, her top hits, a handful of covers, and a guest performance from Halsey. A special pre-show will kick-off 1 hour before the event featuring exclusive interviews and behind-the-scenes footage.</div>
          <div className="event-container__info__ticketGroup">
          <div className="event-container__info__ticketDetail">
            <div className="event-container__info__ticketDetail2">
              General Admission
            </div>
            <ul className="event-container__info__ticketDetail3">
              <li className="event-container__info__ticketDetail4">- One Virtual Ticket to Live Stream Concert</li>
              
            </ul>
            <Link to={{
                pathname: `/payment/${this.props.name}`,
                state: {
                  name: eventInfo.name,
                  icon: eventInfo.icon
                }
              }}>
              <button type="button" className="btn2 btn2--white btn3 btn3--white event-container__info__ticketBTN">$15.00</button>
            </Link>          

          </div>

          <div className="event-container__info__ticketDetail">
            <div className="event-container__info__ticketDetail2">
              VIP Package
            </div>
            <ul className="event-container__info__ticketDetail3">
              <li className="event-container__info__ticketDetail4">- One Virtual Ticket to Live Stream Concert</li>
              <li className="event-container__info__ticketDetail4">- Special Access to Live Chat and Virtual Fan Wall</li>
              <li className="event-container__info__ticketDetail4">- Exclusive Virtual Meet and Greet with { eventInfo.name }</li>

            </ul>     
            <Link to={{
                pathname: `/payment/${this.props.name}`,
                state: {
                  name: eventInfo.name,
                  icon: eventInfo.icon
                }
              }}>
                <button type="button" className="btn2 btn2--white btn3 btn3--white event-container__info__ticketBTN">$40.00</button>
              </Link> 
          </div>

          </div>
          
        </div>
      </div>
    );
  }
}

export default ConcertOverview;