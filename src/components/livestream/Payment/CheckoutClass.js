import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {inject, observer} from "mobx-react";

import "./normalize.css";
import "./global.css";
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';
import {Redirect} from "react-router";

import Logo from "../../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";

@inject("rootStore")
@inject("siteStore")
@observer
class CheckoutForm extends React.Component {

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     priceId: "price_1HPbPYKgR5J3zPrLcOd9Vz2u",
  //     basePrice: 999,
  //     currency: "usd",
  //     quantity: 1,
  //     price: formatPrice({
  //       amount: 999,
  //       currency: "usd",
  //       quantity: 1,
  //     }),
  //     loading: false,
  //     error: null,
  //   };
  // }
  
  handleSubmit = async (event) => {
    event.preventDefault();
    const stripe = await loadStripe("pk_test_51Gy1tWKgR5J3zPrLdO0DgqBKqES5Kmfe7qlKYspFxoiZbGizeQIqh8uXfYqa45wIZGfChMn2R3tLhEwonIsWZHok00k4BiqN3N");
    let URL = window.location.href;
    let shortURL = URL.substring(0, URL.lastIndexOf("#") + 2);
    const { error } = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [{ price: "price_1HPbPYKgR5J3zPrLcOd9Vz2u", quantity: 1 }],
      // successUrl: `https://core.test.contentfabric.io/prod/site-sample-live/#/success`,
      // cancelUrl: `https://core.test.contentfabric.io/prod/site-sample-live/#/`,
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
// "dependencies": {
//   "@eluvio/elv-client-js": "^3.1.5",
//   "@material-ui/core": "^4.11.0",
//   "@material-ui/icons": "^4.9.1",
//   "@stripe/stripe-js": "^1.3.2",
//   "@testing-library/react": "^9.3.2",
//   "@testing-library/user-event": "^7.1.2",
//   "bitmovin-player": "^8.22.0",
//   "coinbase-commerce-node": "^1.0.4",
//   "dashjs": "^3.0.3",
//   "dateformat": "^3.0.3",
//   "elv-components-js": "git+https://github.com/eluv-io/elv-components-js.git#645165da87ec42845a908a9ce0817db202523866",
//   "express": "^4.17.1",
//   "hls.js": "^0.12.4",
//   "luxon": "^1.22.0",
//   "mobx": "^5.13.0",
//   "mobx-react": "^6.1.3",
//   "pre-commit": "^1.2.2",
//   "prop-types": "^15.7.2",
//   "react": "^16.8.6",
//   "react-coinbase-commerce": "^1.4.4",
//   "react-dom": "^16.13.1",
//   "react-icons": "^3.10.0",
//   "react-router": "^5.2.0",
//   "react-router-dom": "^5.1.2",
//   "react-scripts": "^3.4.3",
//   "react-select": "^3.1.0",
//   "semantic-ui-react": "^0.88.2",
//   "stream-chat-react": "^2.2.2",
//   "styled-components": "^5.1.1",
//   "swiper": "^5.4.2",
//   "urijs": "^1.19.1",
//   "url-join": "^4.0.1",
//   "uuid": "^8.1.0"
// },
// "dependencies": {
//   "@eluvio/elv-client-js": "^3.1.5",
//   "@material-ui/core": "^4.11.0",
//   "@stripe/react-stripe-js": "^1.1.2",
//   "@stripe/stripe-js": "^1.3.2",
//   "@testing-library/jest-dom": "^4.2.4",
//   "@testing-library/react": "^9.3.2",
//   "@testing-library/user-event": "^7.1.2",
//   "@zoomus/websdk": "^1.8.1",
//   "bitmovin-player": "^8.22.0",
//   "chroma-js": "^2.1.0",
//   "coinbase-commerce-node": "^1.0.4",
//   "dashjs": "^3.0.3",
//   "dateformat": "^3.0.3",
//   "elv-components-js": "git+https://github.com/eluv-io/elv-components-js.git#645165da87ec42845a908a9ce0817db202523866",
//   "express": "^4.17.1",
//   "hls.js": "^0.12.4",
//   "luxon": "^1.22.0",
//   "mobx": "^5.13.0",
//   "mobx-react": "^6.1.3",
//   "mongoose": "^5.9.27",
//   "pre-commit": "^1.2.2",
//   "prop-types": "^15.7.2",
//   "react": "^16.8.6",
//   "react-coinbase-commerce": "^1.4.4",
//   "react-dom": "^16.13.1",
//   "react-icons": "^3.10.0",
//   "react-router": "^5.2.0",
//   "react-router-dom": "^5.1.2",
//   "react-scripts": "^3.4.3",
//   "react-select": "^3.1.0",
//   "react-slick": "^0.26.1",
//   "react-stripe-checkout": "^2.6.3",
//   "semantic-ui-react": "^0.88.2",
//   "stream-chat-react": "^2.2.2",
//   "styled-components": "^5.1.1",
//   "swiper": "^5.4.2",
//   "urijs": "^1.19.1",
//   "url-join": "^4.0.1",
//   "uuid": "^8.1.0"
// },