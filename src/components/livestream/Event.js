import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import styled from "styled-components";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";

import Logo from "../../static/images/Logo.png";

@inject("rootStore")
@inject("siteStore")
@observer
class Event extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    if (!this.props.siteStore.eventAssets.has(this.props.match.params.artist)) {
      return <Redirect to='/'/>;
    }
    
    let eventInfo = this.props.siteStore.eventAssets.get(this.props.match.params.artist);

    const BackgroundStyleContainer = styled.div`
      background-size: cover;
      background-image: url(${eventInfo.eventImg});
      height: 87.5vh;
      background-position: top;
        @media only screen and (max-width: 750px) {
          height: 65vh;
        }
      }
    `;

    return (
      <div className="event-container">
        <div className="event-nav">
          <ImageIcon className="event-nav__container--logo" icon={this.props.siteStore.logoUrl ? this.props.siteStore.logoUrl : Logo} label="Eluvio" />
        </div>

        <BackgroundStyleContainer />

        <div className="event-container__info">
          <div className="event-container__info__title">
            {eventInfo.name} - Schedule
          </div>
          <div className="event-container__info__schedule">
            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">{eventInfo.date} </h4>
              <h4 className="event-container__info__schedule__post__detail">{eventInfo.description} </h4>
              <Link to={{
                pathname: `/payment/${this.props.match.params.artist}`,
                state: {
                  name: eventInfo.name,
                  icon: eventInfo.icon
                }
              }}>
                <button type="button" className="btn2 btn2--white btn3 btn3--white">Buy Ticket</button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="live-footer">
          <h3 className="live-footer__title">
            Copyright © Eluvio 2020 
          </h3>
        </div>
      </div>
    );
  }
}

export default Event;