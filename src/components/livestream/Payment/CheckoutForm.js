import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import {ImageIcon} from "elv-components-js";

import Logo from "../../../static/images/Logo.png";
import AsyncComponent from "../../support/AsyncComponent";

import "../../../static/stylesheets/base/paymentGlobal.css";

@inject("rootStore")
@inject("siteStore")
@observer
class CheckoutForm extends React.Component {
  
  handleSubmit = async (event) => {
    event.preventDefault();
    const stripe = await loadStripe("pk_test_51Gy1tWKgR5J3zPrLdO0DgqBKqES5Kmfe7qlKYspFxoiZbGizeQIqh8uXfYqa45wIZGfChMn2R3tLhEwonIsWZHok00k4BiqN3N");
    const { error } = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [{ price: "price_1HnBMFKgR5J3zPrLR96KsCCk", quantity: 1 }],
      metadata: {"tenantId": "iten3Ag8TH7xwjyjkvTRqThtsUSSP1pN", "ntpId": "QOTPM59kMU5trgj"},
      successUrl: `${window.location.href.substring(0, window.location.href.lastIndexOf("#") + 2)}success`,
      cancelUrl: `${window.location.href.substring(0, window.location.href.lastIndexOf("#") + 2)}`,
    });
    if (error) {
      console.error("Failed to handleSubmit for Stripe:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  render() {
    if (!this.props.siteStore.eventAssets.has(this.props.match.params.name)) {
      return <Redirect to='/'/>;
    }

    let eventInfo = this.props.siteStore.eventAssets.get("rita-ora");
    return (
      <AsyncComponent
        Load={
          async () => {
            await this.props.rootStore.CreateCharge(eventInfo.name, eventInfo.description, eventInfo.price);
          } 
        }

        render={() => {
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
                      <h4>{eventInfo.name} Live </h4>
                      <div className="pasha-image">
                        <img
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
                        href={this.props.rootStore.redirectCB}>
                        Buy with Crypto
                      </a>
                    </button>
                  </section>
                </div>
              </div>
            </div>
          );
        }}
      />
    );
  }
}

export default CheckoutForm;