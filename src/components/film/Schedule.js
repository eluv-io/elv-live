import React from "react";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";

@inject("rootStore")
@inject("siteStore")
@observer
class Schedule extends React.Component {
  // componentDidMount() {
  //   window.scrollTo(0, 0);
  // }

  render() {
    // if (!this.props.siteStore.eventAssets.has(this.props.name)) {
    //   return <Redirect to='/'/>;
    // }
    
    let eventInfo = this.props.siteStore.eventAssets.get(this.props.name);

    return (
      <div className="event-container">
        <div className="event-container__info">
          <div className="event-container__info__title">
            {eventInfo.name} - Schedule
          </div>
          <div className="event-container__info__schedule">

            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">December 11, 2020 · 5:00 PM PST </h4>
              <h4 className="event-container__info__schedule__post__info">S4 E1 - The Season Premiere </h4>
              <Link to={{
                pathname: `/payment/${this.props.name}`,
                state: {
                  name: eventInfo.name,
                  icon: eventInfo.icon
                }
              }}>
                <button type="button" className="btn2 btn2--white btn3 btn3--white">Buy Episode</button>
              </Link>
            </div>
            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">December 14, 2020 · 5:00 PM PST </h4>
              <h4 className="event-container__info__schedule__post__info">S4 E2 - The Group B Premiere</h4>
              <Link to={{
                pathname: `/payment/${this.props.name}`,
                state: {
                  name: eventInfo.name,
                  icon: eventInfo.icon
                }
              }}>
                <button type="button" className="btn2 btn2--white btn3 btn3--white">Buy Episode</button>
              </Link>
            </div>
            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">December 17, 2020 · 5:00 PM PST </h4>
              <h4 className="event-container__info__schedule__post__info">S4 E3 - The Group A Playoffs</h4>
              <Link to={{
                pathname: `/payment/${this.props.name}`,
                state: {
                  name: eventInfo.name,
                  icon: eventInfo.icon
                }
              }}>
                <button type="button" className="btn2 btn2--white btn3 btn3--white">Buy Episode</button>
              </Link>
            </div>
            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">December 20, 2020 · 5:00 PM PST </h4>
              <h4 className="event-container__info__schedule__post__info">S4 E4 - The Group B Playoffs</h4>
              <Link to={{
                pathname: `/payment/${this.props.name}`,
                state: {
                  name: eventInfo.name,
                  icon: eventInfo.icon
                }
              }}>
                <button type="button" className="btn2 btn2--white btn3 btn3--white">Buy Episode</button>
              </Link>
            </div>
            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">December 23, 2020 · 5:00 PM PST </h4>
              <h4 className="event-container__info__schedule__post__info">S4 E5 - The Group C Premiere</h4>
              <Link to={{
                pathname: `/payment/${this.props.name}`,
                state: {
                  name: eventInfo.name,
                  icon: eventInfo.icon
                }
              }}>
                <button type="button" className="btn2 btn2--white btn3 btn3--white">Buy Episode</button>
              </Link>
            </div>
          </div>
        
        </div>
      </div>
    );
  }
}

export default Schedule;