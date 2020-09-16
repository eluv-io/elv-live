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
    let artist ;
    let event;
    switch(this.props.match.params.artist) {
      case "liampayne":
        artist = "Liam Payne";
        event = liamE;
        break;
      case "brandicarlile":
        artist = "Brandi Carlile";
        event = brandE;
        break;
      case "kotathefriend":
        artist = "Kota the Friend";
        event = kotaE;
        break;
      case "orianthi":
        artist = "Orianthi";
        event = oriE;
        break;
      case "walkofftheearth":
        artist = "Walk off the Earth";
        event = walkE;
        break;
      case "perfumegenius":
        artist = "Perfume Genius";
        event = perfE;
        break;
      default:
        artist = "Artist";
        event = background;
    }

    const BackgroundStyleContainer = styled.div`
      background-size: cover;
      background-image: url(${event});
      height: 87.5vh;
      background-position: top;
      }
    `;

    return (
      <div className="event-container">
        <div className="event-nav">
          <ImageIcon className="event-nav__container--logo" icon={Logo} label="Eluvio" />
        </div>

        <BackgroundStyleContainer />


        <div className="event-container__info">
          <div className="event-container__info__title">
            {artist} Schedule
          </div>

          <div className="event-container__info__schedule">
            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">Sep 6 · 7:00 PM PDT </h4>

              <h4 className="event-container__info__schedule__post__detail">Live At Bill Graham in San Francisco </h4>
              <Link 
                to={`/payment/${this.props.match.params.artist}`} 
                >
                <button type="button" className="btn2 btn2--white btn3 btn3--white" onClick={() => this.props.siteStore.SetArtist(artist, event)}>Buy Tickets</button>
              </Link>
            </div>

            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">Sep 7 · 9:00 PM PDT </h4>

              <h4 className="event-container__info__schedule__post__detail">Live At Bill Graham in San Francisco </h4>
              <Link 
                to={`/payment/${this.props.match.params.artist}`} 
                >
                <button type="button" className="btn2 btn2--white btn3 btn3--white" onClick={() => this.props.siteStore.SetArtist(artist, event)}>Buy Tickets</button>
              </Link>
            </div>

            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">Sep 9 · 9:00 PM PDT </h4>

              <h4 className="event-container__info__schedule__post__detail">Live At Red Rocks Amp. in Colorado </h4>
              <Link 
                to={`/payment/${this.props.match.params.artist}`} 
                >
                <button type="button" className="btn2 btn2--white btn3 btn3--white" onClick={() => this.props.siteStore.SetArtist(artist, event)}>Buy Tickets</button>
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