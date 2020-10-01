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
    let name = this.props.location.name || "Artist";
    let eventImg = this.props.location.eventImg || background;
    let description = this.props.location.description || "Artist Description";
    let iconImg = this.props.location.icon || artist1;
    let date =  this.props.location.date || "Sep 28 · 7:00 PM PDT";

    const BackgroundStyleContainer = styled.div`
      background-size: cover;
      background-image: url(${eventImg});
      height: 83.5vh;
      background-position: top;
      @media only screen and (max-width: 750px) {
        height: 65vh;
      }
      }
    `;

    return (
      <AsyncComponent
      Load={async () => {
        await this.props.rootStore.CreateCharge(name, description);
      }}
      render={() => {
        if(!this.props.rootStore.redirectCB) { return null; }
        console.log(this.props.rootStore.redirectCB);

        return (
          <div className="event-container">
            <div className="event-nav">
              <ImageIcon className="event-nav__container--logo" icon={Logo} label="Eluvio" />
            </div>

            <BackgroundStyleContainer />


            <div className="event-container__info">
              <div className="event-container__info__title">
                {name} - Schedule
              </div>

              <div className="event-container__info__schedule">
                <div className="event-container__info__schedule__post">
                  <h4 className="event-container__info__schedule__post__detail">{date} </h4>

                  <h4 className="event-container__info__schedule__post__detail">{description} </h4>

                  <Link to={{
                    pathname: `/payment/${this.props.match.params.artist}`,
                    state: {
                      url: this.props.rootStore.redirectCB,
                      name: name,
                      icon: iconImg
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
        }}
      />
    );
  }
}

export default Event;