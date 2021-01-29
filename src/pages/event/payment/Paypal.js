import React from "react";
import { Redirect } from "react-router-dom";
import {inject, observer} from "mobx-react";
import UrlJoin from "url-join";
import {ValidEmail} from "Utils/Misc";

import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js";

@inject("rootStore")
@inject("siteStore")
@observer
class Paypal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectStatus: false
    };

    this.createOrder = this.createOrder.bind(this);
    this.onApprove = this.onApprove.bind(this);
    this.onError = this.onError.bind(this);
  }

  createOrder(data, actions) {
    if(!ValidEmail(this.props.email)) {
      this.props.handleError("Enter a valid email to continue to payment.");
    }

    const { ticketClass, skuIndex } = this.props.siteStore.selectedTicket;
    const ticketSku = ticketClass.skus[skuIndex];

    let checkoutCart = [{
      name: ticketClass.name,
      unit_amount: {value: ticketSku.price.amount, currency_code: ticketSku.price.currency},
      quantity: this.props.ticketQuantity,
      sku: ticketSku.otp_id
    }];

    let price = this.props.ticketQuantity * ticketSku.price.amount;

    /* TODO: Merch and donations
    if(this.props.merchChecked) {
      let merchPrice = this.props.checkoutMerch / 100;
      checkoutCart.push({
        name: "Merch",
        unit_amount: {value: `${merchPrice}`, currency_code: "USD"},
        quantity: "1",
      });
      price += merchPrice;
    }

    if(this.props.donationChecked) {
      let donationPrice = this.props.checkoutDonation/ 100;
      checkoutCart.push({
        name: "Donation",
        unit_amount: {value: `${donationPrice}`, currency_code: "USD"},
        quantity: "1",
      });
      price += donationPrice;
    }

     */

    return actions.order.create({
      purchase_units: [
        {
          reference_id: this.props.email,
          custom_id: ticketSku.otp_id,
          amount: {
            value: price,
            currency_code: ticketSku.price.currency,
            breakdown: {
              item_total: {
                value: price,
                currency_code: ticketSku.price.currency
              }
            }
          },
          items: checkoutCart,
        }]
    });
  }

  onApprove(data, actions) {
    this.setState({redirectStatus: true});

    return actions.order.capture().then(function(details)  {
      alert("Transaction completed by " + details.payer.name.given_name);
    });
  }

  onError(err) {
    if(!ValidEmail(this.props.email))  {
      this.props.handleError("Please enter a valid email");
    } else {
      console.log(err);
      this.props.handleError("There was an error with Paypal Checkout. Please try again.");
    }
  }

  render() {
    const { ticketClass, skuIndex } = this.props.siteStore.selectedTicket;
    const ticketSku = ticketClass.skus[skuIndex];

    if(this.state.redirectStatus) {
      this.props.siteStore.CloseCheckoutModal();
      let checkoutId = this.props.siteStore.generateConfirmationId(ticketSku.otp_id, this.props.email);

      return <Redirect to={UrlJoin(this.props.siteStore.basePath, this.props.siteStore.siteSlug, "success", this.props.email, checkoutId)}/>;
    }

    return (
      <div className="paypal-button">
        <PayPalScriptProvider
          options={{
            "client-id": this.props.siteStore.paymentConfigurations.paypal_client_id,
            currency: ticketSku.price.currency
          }}
        >
          <PayPalButtons
            createOrder={this.createOrder}
            onApprove={this.onApprove}
            onError={this.onError}
            style={{
              color:  "gold",
              shape:  "rect",
              label:  "paypal",
              layout: "horizontal",
              tagline: false,
              height: 50
            }}
          />
        </PayPalScriptProvider>
      </div>
    );
  }
}

export default Paypal;
