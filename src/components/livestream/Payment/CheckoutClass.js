import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {inject, observer} from "mobx-react";

import "./normalize.css";
import "./global.css";
// import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';
import {Redirect} from "react-router";

import Logo from "../../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";

@inject("rootStore")
@inject("siteStore")
@observer
class CheckoutForm extends React.Component {
  
  handleSubmit = async (event) => {
    event.preventDefault();
    const stripe = await loadStripe("pk_test_51Gy1tWKgR5J3zPrLdO0DgqBKqES5Kmfe7qlKYspFxoiZbGizeQIqh8uXfYqa45wIZGfChMn2R3tLhEwonIsWZHok00k4BiqN3N");
    let URL = window.location.href;
    let shortURL = URL.substring(0, URL.lastIndexOf("#") + 2);
    const { error } = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [{ price: "price_1HPbPYKgR5J3zPrLcOd9Vz2u", quantity: 1 }],
      successUrl: `${shortURL}success`,
      cancelUrl: `${shortURL}`,
    });
    if (error) {
      console.error("Failed to handleSubmit for Stripe:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  

  render() {
    if (!this.props.siteStore.eventAssets.has(this.props.match.params.artist)) {
      return <Redirect to='/'/>;
    }
    let eventInfo = this.props.siteStore.eventAssets.get(this.props.match.params.artist);

    return (
      <div className="new-live-container">
        <div className="live-nav">
          <ImageIcon className="live-nav--logo" icon={this.props.siteStore.logoUrl ? this.props.siteStore.logoUrl : Logo} label="Eluvio" />
        </div>
        <div className="sr-root">
          <div className="sr-main">
            <section className="container">
              <div>
                <h1>Purchase a Ticket</h1>
                <h4>{eventInfo.name} Live At Bill Graham </h4>
                <div className="pasha-image">
                  <img
                    alt="Random asset from Picsum"
                    src={eventInfo.icon}
                    width="310"
                    height="280"
                  />
                </div>
              </div>
              <button role="link" onClick={this.handleSubmit} className="payment-button">
                Buy with Credit Card
              </button>
              <button className="payment-button">
                <a className="payment-button coinbase buy-with-crypto" data-cache-disabled="true"
                  href="https://commerce.coinbase.com/checkout/86096eab-9719-4817-a813-ac57ba18b022">
                  Buy with Crypto
                </a>
              </button>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutForm;