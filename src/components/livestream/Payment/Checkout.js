import React, { useReducer } from "react";
import { loadStripe } from "@stripe/stripe-js";

import "./normalize.css";
import "./global.css";
import CoinbaseCommerceButton from 'react-coinbase-commerce';
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';

import artist1 from "../../../static/images/livestream/artist1.png";
import artist2 from "../../../static/images/livestream/artist2.png";
import artist3 from "../../../static/images/livestream/artist3.png";
import artist4 from "../../../static/images/livestream/artist4.png";
import artist5 from "../../../static/images/livestream/artist5.png";
import artist6 from "../../../static/images/livestream/artist6.png";
import Logo from "../../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";

const stripePromise = loadStripe("pk_test_51Gy1tWKgR5J3zPrLdO0DgqBKqES5Kmfe7qlKYspFxoiZbGizeQIqh8uXfYqa45wIZGfChMn2R3tLhEwonIsWZHok00k4BiqN3N");

const formatPrice = ({ amount, currency, quantity }) => {
  const numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for(let part of parts) {
    if(part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  amount = zeroDecimalCurrency ? amount : amount / 100;
  const total = (quantity * amount).toFixed(2);
  return numberFormat.format(total);
};

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        quantity: state.quantity + 1,
        price: formatPrice({
          amount: state.basePrice,
          currency: state.currency,
          quantity: state.quantity + 1,
        }),
      };
    case "decrement":
      return {
        ...state,
        quantity: state.quantity - 1,
        price: formatPrice({
          amount: state.basePrice,
          currency: state.currency,
          quantity: state.quantity - 1,
        }),
      };
    case "setLoading":
      return { ...state, loading: action.payload.loading };
    case "setError":
      return { ...state, error: action.payload.error };
    default:
      throw new Error();
  }
}


const Checkout = (props) => {
  const [state, dispatch] = useReducer(reducer, {
    priceId: "price_1HPbPYKgR5J3zPrLcOd9Vz2u",
    basePrice: 999,
    currency: "usd",
    quantity: 1,
    price: formatPrice({
      amount: 999,
      currency: "usd",
      quantity: 1,
    }),
    loading: false,
    error: null,
  });

  const handleClick = async (event) => {
    // Call your backend to create the Checkout session.
    dispatch({ type: "setLoading", payload: { loading: true } });
    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [{ price: state.priceId, quantity: state.quantity }],
      successUrl: `https://core.test.contentfabric.io/prod/site-sample-live/#/success`,
      cancelUrl: `https://core.test.contentfabric.io/prod/site-sample-live/#/`,
      // successUrl: `${window.location.origin}/#/success`,
      // cancelUrl: `${window.location.origin}/#/`,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if(error) {
      dispatch({ type: "setError", payload: { error, event } });
      dispatch({ type: "setLoading", payload: { loading: false } });
    }
  };

  function renderSwitch(param) {
    switch(param) {
      case "liampayne":
        return "Liam Payne";

      case "brandicarlile":
        return "Brandi Carlile";

      case "kotathefriend":
        return "Kota the Friend";
      case "orianthi":
        return "Orianthi";

      case "walkofftheearth":
        return "Walk off the Earth";

      case "perfumegenius":
        return "Perfume Genius";
      default:
        return "Artist";
    }
  }
  function renderSwitchPhoto(param) {
    switch(param) {
      case "liampayne":
        return artist1;

      case "brandicarlile":
        return artist2;

      case "kotathefriend":
        return artist4;
      case "orianthi":
        return artist5;

      case "walkofftheearth":
        return artist6;

      case "perfumegenius":
        return artist3;
      default:
        return "Artist";
    }
  }

  return (
    <div className="new-live-container">
      <div className="live-nav">
        <ImageIcon className="live-nav--logo" icon={Logo} label="Eluvio" />
      </div>
      <div className="sr-root">
        <div className="sr-main">


          <section className="container">
            <div>
              <h1>Purchase a Ticket</h1>
              <h4>{renderSwitch(window.location.href.substring(window.location.href.lastIndexOf('/') + 1))} Live At Bill Graham </h4>
              <div className="pasha-image">
                <img
                  alt="Random asset from Picsum"
                  src={renderSwitchPhoto(window.location.href.substring(window.location.href.lastIndexOf('/') + 1))}
                  width="310"
                  height="280"
                />
              </div>
            </div>
            <div className="quantity-setter">
              {/* <button
                className="increment-btn"
                disabled={state.quantity === 1}
                onClick={() => dispatch({ type: "decrement" })}
              >
                -
              </button> */}
              {/* <input
                type="number"
                id="quantity-input"
                min="1"
                max="10"
                value={state.quantity}
                readOnly
              /> */}
              {/* <button
                className="increment-btn"
                disabled={state.quantity === 10}
                onClick={() => dispatch({ type: "increment" })}
              >
                +
              </button> */}
            </div>
            {/* <p className="sr-legal-text">Number of copies (max 10)</p> */}

 
            <button role="link" onClick={handleClick} disabled={state.loading} className="payment-button">
              {state.loading || !state.price
                ? "Loading..."
                : `Buy with Credit Card`}
            </button>
            <button className="payment-button">
              <a className="coinbase buy-with-crypto" data-cache-disabled="true"
                href={props.location.state ? props.location.state.url : 'https://commerce.coinbase.com/charges/WEBQ9QR6'}>
                Buy with Crypto
              </a>
            </button>
            {/* <div className="sr-field-error">{state.error?.message}</div> */}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
