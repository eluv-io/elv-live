import React from "react";
import {inject, observer} from "mobx-react";
import Logo from "../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";
import styled from "styled-components";

import background from "../../static/images/livestream/liam-event.png";
import artist1 from "../../static/images/livestream/artist1.png";


import AsyncComponent from "../AsyncComponent";

import {
  Link
} from "react-router-dom";

@inject("rootStore")
@inject("siteStore")
@observer
class Event extends React.Component {
  componentWillMount() {
    window.scrollTo(0,0);
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  componentDidUpdate() {
    window.scrollTo(0,0);
  }

  render() {
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
                <button type="button" className="btn2 btn2--white btn3 btn3--white" onClick={() => this.props.siteStore.SetArtist(artist, event)}>Buy Ticket</button>
              </Link>
            </div>
          </div>
        </div>
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