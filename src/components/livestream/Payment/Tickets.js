import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import {ImageIcon} from "elv-components-js";

import Logo from "../../../static/images/Logo.png";
import AsyncComponent from "../../support/AsyncComponent";
import ScheduleIcon from '@material-ui/icons/Schedule';

import "../../../static/stylesheets/base/paymentGlobal.css";
import concertPoster from "../../../static/images/ritaora/ro3.jpg";
import Timer from "./Timer";
import { FaRegCalendarAlt, FaRegClock} from "react-icons/fa";
import { IconContext } from "react-icons";

@inject("rootStore")
@inject("siteStore")
@observer
class Tickets extends React.Component {
  
  handleSubmit = async (event) => {
    event.preventDefault();
    const stripe = await loadStripe("pk_test_51HpRJ7E0yLQ1pYr6m8Di1EfiigEZUSIt3ruOmtXukoEe0goAs7ZMfNoYQO3ormdETjY6FqlkziErPYWVWGnKL5e800UYf7aGp6");
    const { error } = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [{ price: "price_1HpS6pE0yLQ1pYr6CuBre5I4", quantity: 1 }],
      successUrl: `${window.location.href.substring(0, window.location.href.lastIndexOf("#") + 2)}d457a576/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.href.substring(0, window.location.href.lastIndexOf("#") + 2)}`,
      clientReferenceId: "prod_IQIiC3jywpIUKu"
    });
    if (error) {
      console.error("Failed to handleSubmit for Stripe:");
      console.error(error);
    }
  };

  handleSubmitVIP = async (event) => {
    event.preventDefault();
    const stripe = await loadStripe("pk_test_51HpRJ7E0yLQ1pYr6m8Di1EfiigEZUSIt3ruOmtXukoEe0goAs7ZMfNoYQO3ormdETjY6FqlkziErPYWVWGnKL5e800UYf7aGp6");
    let URL = window.location.href;
    let shortURL = URL.substring(0, URL.lastIndexOf("#") + 2);
    const { error } = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [{ price: "price_1HpS77E0yLQ1pYr6bmC8griX", quantity: 1 }],
      successUrl: `${window.location.href.substring(0, window.location.href.lastIndexOf("#") + 2)}d457a576/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.href.substring(0, window.location.href.lastIndexOf("#") + 2)}`,
      clientReferenceId: "prod_IQIiMc4NHvH3DF"
    });
    if (error) {
      console.error("Failed to handleSubmit for Stripe:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  render() {

    return (
        <div className="ticket-group">
          <div className="ticket-event">
            <div className="ticket-image">
              <img src={concertPoster} className="ticket-image"/>
            </div>
            <div className="ticket-detail">
              <div className="ticket-top">
                <div className="ticket-top-labels"> 
                  <span className="ticket-label-available">
                    LIMITED TICKETS AVAILABLE
                  </span>
                  <span className="ticket-label-loc">
                    Global
                  </span>
                </div>
                <h3 className="ticket-top-title">
                  General Admission
                </h3>
                <p className="ticket-top-description">
                  General Admission includes one (1) Virtual Ticket to the Live Stream Concert. Ticket can be redeemed on these platforms: WATCH ONLINE: You can watch the show online through Eluvio site. WATCH ON THE APP: The Eluvio app is available on all smartphones. WATCH ON TV: The Eluvio app is available on Apple TV and Roku.
                </p>

              </div>
              <div className="ticket-bottom">
                <div className="ticket-bottom-info">
                  <div className="ticket-bottom-price">
                    $30
                  </div>
                  <IconContext.Provider value={{ className: 'ticket-icon' }}>
                  <div>
                    <FaRegCalendarAlt />
                    <span className="ticket-bottom-date">
                    January 28th, 8:00 PM – 10:00 PM PST
                  </span>
                  </div>
                </IconContext.Provider>
                  
                  <div className="ticket-bottom-countdown">
                  <Timer classProp="ticket-icon"/>
                  </div>
                </div>
                <button className="ticket-bottom-button" role="link" onClick={this.handleSubmit}>
                  Buy Ticket
                </button>
              </div>
            </div>
          </div>
          
          <div className="ticket-event">
            <div className="ticket-image">
              <img src={concertPoster} className="ticket-image"/>
            </div>
            <div className="ticket-detail">
              <div className="ticket-top">
                <div className="ticket-top-labels"> 
                  <span className="ticket-label-available">
                    LIMITED TICKETS AVAILABLE
                  </span>
                  <span className="ticket-label-loc">
                    Global
                  </span>
                </div>
                <h3 className="ticket-top-title">
                  VIP Package
                </h3>
                <p className="ticket-top-description">
                  VIP Package includes one (1) Virtual Ticket to the Live Stream Concert, Special Access to Live Chat and Virtual Fan Wall, and an Exclusive Virtual Meet and Greet with Rita Ora. Ticket can be redeemed on these platforms: WATCH ONLINE: You can watch the show online through Eluvio site. WATCH ON THE APP: The Eluvio app is available on all smartphones. WATCH ON TV: The Eluvio app is available on Apple TV and Roku.
                </p>

              </div>
              <div className="ticket-bottom">
                <div className="ticket-bottom-info">
                  <div className="ticket-bottom-price">
                    $50
                  </div>
                  <IconContext.Provider value={{ className: 'ticket-icon' }}>
                  <div>
                    <FaRegCalendarAlt />
                    <span className="ticket-bottom-date">
                      January 28th, 8:00 PM – 10:00 PM PST
                    </span>
                  </div>
                </IconContext.Provider>
                  <div className="ticket-bottom-countdown">
                    <Timer classProp="ticket-icon" divProp =""/>
                  </div>
                </div>
                <button className="ticket-bottom-button" role="link" onClick={this.handleSubmitVIP}>
                  Buy Ticket
                </button>
              </div>
            </div>
          </div>
        </div>

    );
  }
}

export default Tickets;