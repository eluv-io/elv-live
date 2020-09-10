import React from "react";
import {inject, observer} from "mobx-react";
import Logo from "../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";
import background from "../../static/images/livestream/liam-event.png";
import styled from "styled-components";
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
    const BackgroundStyleContainer = styled.div`
      background-size: cover;
      background-image: url(${background});
      height: 85vh;
      background-position: center;
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
            Liam Payne Schedule
          </div>

          <div className="event-container__info__schedule">
            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">Sep 6 · 7:00 PM PDT </h4>

              <h4 className="event-container__info__schedule__post__detail">Liam Payne Live At Bill Graham in San Francisco </h4>
              <Link to="/payment" className="btn2 btn2--white btn3 btn3--white">Buy Tickets</Link>
            </div>

            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">Sep 7 · 9:00 PM PDT </h4>

              <h4 className="event-container__info__schedule__post__detail">Liam Payne Live At Bill Graham in San Francisco </h4>
              <Link to="/payment" className="btn2 btn2--white btn3 btn3--white">Buy Tickets</Link>
            </div>

            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">Sep 9 · 9:00 PM PDT </h4>

              <h4 className="event-container__info__schedule__post__detail">Liam Payne Live At Red Rocks Amp. in Colorado </h4>
              <Link to="/payment" className="btn2 btn2--white btn3 btn3--white">Buy Tickets</Link>
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