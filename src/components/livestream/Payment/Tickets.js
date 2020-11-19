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

@inject("rootStore")
@inject("siteStore")
@observer
class Tickets extends React.Component {
  
  handleSubmit = async (event) => {
    event.preventDefault();
    const stripe = await loadStripe("pk_test_51Gy1tWKgR5J3zPrLdO0DgqBKqES5Kmfe7qlKYspFxoiZbGizeQIqh8uXfYqa45wIZGfChMn2R3tLhEwonIsWZHok00k4BiqN3N");
    const { error } = await stripe.redirectToCheckout({
      sessionId: "cs_test_a1TivnMlmYfP6jgwTBLMl5JP1NTBJLOJ9L2uKE7e0zKfdelqSVMeJZEFu4"
      
    });
    if (error) {
      console.error("Failed to handleSubmit for Stripe:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  handleSubmitVIP = async (event) => {
    event.preventDefault();
    const stripe = await loadStripe("pk_test_51Gy1tWKgR5J3zPrLdO0DgqBKqES5Kmfe7qlKYspFxoiZbGizeQIqh8uXfYqa45wIZGfChMn2R3tLhEwonIsWZHok00k4BiqN3N");
    const { error } = await stripe.redirectToCheckout({
      sessionId: "cs_test_a1h0Zazc0d6CRmma8R72ZrIsddVBnOfYjPwkKLKFp1rF25rTnHvrIJ9BpX"
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
                    $15
                  </div>
                  <div className="ticket-bottom-date">
                    January 28th, 8:00 PM – 10:00 PM PST
                  </div>
                  <div className="ticket-bottom-countdown">
                    <Timer/>
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
                  <div className="ticket-bottom-date">
                    January 28th, 8:00 PM – 10:00 PM PST
                  </div>
                  <div className="ticket-bottom-countdown">
                    <Timer/>
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