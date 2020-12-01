import React from "react";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";

@inject("rootStore")
@inject("siteStore")
@observer
class ConcertSchedule extends React.Component {
  render() {

    let eventInfo = this.props.siteStore.eventAssets.get("rita-ora");;

    return (
      <div className="event-container">
        <div className="event-container__info">
          <div className="event-container__info__title">
            Upcoming Schedule
          </div>
          <div className="event-container__info__schedule">

            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">August 26, 2021 · 5:00 PM PST  </h4>
              <h4 className="event-container__info__schedule__post__info"> Reading Festival </h4>
              <Link to={{
                pathname: `/payment/${this.props.name}`,
                state: {
                  name: eventInfo.name,
                  icon: eventInfo.icon
                }
              }}>
                <button type="button" className="btn2 btn2--white btn3 btn3--white">Buy Tickets</button>
              </Link>
            </div>
            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">August 28, 2021 · 9:00 PM PST</h4>
              <h4 className="event-container__info__schedule__post__info">Leads Festival</h4>
              <Link to={{
                pathname: `/payment/${this.props.name}`,
                state: {
                  name: eventInfo.name,
                  icon: eventInfo.icon
                }
              }}>
                <button type="button" className="btn2 btn2--white btn3 btn3--white">Buy Tickets</button>
              </Link>
            </div>
            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">September 28, 2021 · 3:30 PM PST</h4>
              <h4 className="event-container__info__schedule__post__info">Coachella Valley and Arts Festival</h4>
              <Link to={{
                pathname: `/payment/${this.props.name}`,
                state: {
                  name: eventInfo.name,
                  icon: eventInfo.icon
                }
              }}>
                <button type="button" className="btn2 btn2--white btn3 btn3--white">Buy Tickets</button>
              </Link>
            </div>
          </div>
          
        
        </div>
      </div>
    );
  }
}

export default ConcertSchedule;