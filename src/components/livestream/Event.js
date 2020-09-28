import React from "react";
import {inject, observer} from "mobx-react";
import Logo from "../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";
import background from "../../static/images/livestream/brand-ev.jpg";
import styled from "styled-components";

import liamE from "../../static/images/livestream/liam-event.png";
import brandE from "../../static/images/livestream/brand-ev.jpg";
import perfE from "../../static/images/livestream/perf-ev.jpg";
import kotaE from "../../static/images/livestream/kota-ev.jpg";
import oriE from "../../static/images/livestream/ori-ev.jpeg";
import walkE from "../../static/images/livestream/walk-new.jpg";

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
    let artist;
    let event;
    let description;

    switch(this.props.match.params.artist) {
      case "liampayne":
        artist = "Liam Payne";
        event = liamE;
        description = "Liam Payne Live At Bill Graham in San Francisco";
        break;
      case "brandicarlile":
        artist = "Brandi Carlile";
        event = brandE;
        description = "Brandi Carlile Live At The Cornerstone in Berkeley";
        break;
      case "kotathefriend":
        artist = "Kota the Friend";
        event = kotaE;
        description = "Kota the Friend Live At King Fish in Oakland";
        break;
      case "orianthi":
        artist = "Orianthi";
        event = oriE;
        description = "Orianthi Live At The Whisky in Hollywood";
        break;
      case "walkofftheearth":
        artist = "Walk off the Earth";
        event = walkE;
        description = "Walk off the Earth Live At The Fillmore in San Francisco";
        break;
      case "perfumegenius":
        artist = "Perfume Genius";
        event = perfE;
        description = "Perfume Genius Live At Harvelle's in Chicago";
        break;
      default:
        artist = "Artist";
        event = background;
        description = "Livestream";
    }

    const BackgroundStyleContainer = styled.div`
      background-size: cover;
      background-image: url(${event});
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
        await this.props.rootStore.CreateCharge(artist, description);
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
                {artist} - Schedule
              </div>

              <div className="event-container__info__schedule">
                <div className="event-container__info__schedule__post">
                  <h4 className="event-container__info__schedule__post__detail">Sep 28 · 7:00 PM PDT </h4>

                  <h4 className="event-container__info__schedule__post__detail">{description} </h4>

                  <Link to={{
                    pathname: `/payment/${this.props.match.params.artist}`,
                    state: {
                      url: this.props.rootStore.redirectCB
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