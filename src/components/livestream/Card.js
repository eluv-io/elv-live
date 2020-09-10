import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import artist1 from "../../static/images/livestream/artist1.png";
import artist2 from "../../static/images/livestream/artist2.png";
import artist3 from "../../static/images/livestream/artist3.png";
import artist4 from "../../static/images/livestream/artist4.png";
import artist5 from "../../static/images/livestream/artist5.png";
import artist6 from "../../static/images/livestream/artist6.png";
import {
  Link
} from "react-router-dom";

@inject("rootStore")
@inject("siteStore")
@observer
class Card extends React.Component {

  render() {

    return (
      <div className="live-content__container">
        <div className="card">
          <div className="card__side card__side--front">

            <ImageIcon className="card__picture" icon={artist1} label="artist" />

            <h4 className="card__heading">
              <span className="card__heading-span card__heading-span--4">Liam Payne</span>
            </h4>
          </div>

          <div className="card__side card__side--back card__side--back-4">
            <div className="card__cta">
              <div className="card__price-box">
                <h4 className="card__price-detail">Sep 8 · 7:00 PM PDT</h4>
                <h4 className="card__price-detail">Liam Payne Live At Bill Graham in San Francisco </h4>
              </div>
              <Link to="/event" className="btn2 btn2--white">Buy Tickets</Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__side card__side--front">
            <ImageIcon className="card__picture" icon={artist2} label="artist" />

            <h4 className="card__heading">
              <span className="card__heading-span card__heading-span--4">Brandi Carlile</span>
            </h4>
          </div>

          <div className="card__side card__side--back card__side--back-4">
            <div className="card__cta">
              <div className="card__price-box">
                <h4 className="card__price-detail">Sep 12 · 4:00 PM PDT</h4>
                <h4 className="card__price-detail">Brandi Carlile Live At The Cornerstone in Berkeley</h4>
              </div>

              <Link to="/event" className="btn2 btn2--white">Buy Tickets</Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__side card__side--front">
            <ImageIcon className="card__picture" icon={artist3} label="artist" />

            <h4 className="card__heading">
              <span className="card__heading-span card__heading-span--4">Perfume Genius</span>
            </h4>
          </div>

          <div className="card__side card__side--back card__side--back-4">
            <div className="card__cta">
              <div className="card__price-box">
                <h4 className="card__price-detail">Sep 24 · 7:00 PM PDT</h4>
                <h4 className="card__price-detail">Perfume Genius Live At Harvelle's in Chicago</h4>
              </div>
              <Link to="/event" className="btn2 btn2--white">Buy Tickets</Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__side card__side--front">
            <ImageIcon className="card__picture" icon={artist4} label="artist" />

            <h4 className="card__heading">
              <span className="card__heading-span card__heading-span--4">Kota the Friend</span>
            </h4>
          </div>

          <div className="card__side card__side--back card__side--back-4">
            <div className="card__cta">
              <div className="card__price-box">
                <h4 className="card__price-detail">Sep 4 · 10:00 PM PDT</h4>
                <h4 className="card__price-detail">Kota the Friend Live At King Fish in Oakland</h4>
              </div>
              <Link to="/event" className="btn2 btn2--white">Buy Tickets</Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__side card__side--front">
            <ImageIcon className="card__picture" icon={artist5} label="artist" />

            <h4 className="card__heading">
              <span className="card__heading-span card__heading-span--4">Orianthi</span>
            </h4>
          </div>

          <div className="card__side card__side--back card__side--back-4">
            <div className="card__cta">
              <div className="card__price-box">
                <h4 className="card__price-detail">Sep 19 · 6:00 PM PDT</h4>
                <h4 className="card__price-detail">Orianthi Live At The Whisky in Hollywood </h4>
              </div>
              <Link to="/event" className="btn2 btn2--white">Buy Tickets</Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__side card__side--front">
            <ImageIcon className="card__picture" icon={artist6} label="artist" />

            <h4 className="card__heading">
              <span className="card__heading-span card__heading-span--4">Walk off the Earth</span>
            </h4>
          </div>

          <div className="card__side card__side--back card__side--back-4">
            <div className="card__cta">
              <div className="card__price-box">
                <h4 className="card__price-detail">Sep 23 · 9:00 PM PDT</h4>
                <h4 className="card__price-detail">Walk off the Earth Live At The Fillmore in San Francisco</h4>
              </div>
              <Link to="/event" className="btn2 btn2--white">Buy Tickets</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;