import React from "react";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import {inject, observer} from "mobx-react";

const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

@inject("rootStore")
@inject("siteStore")
@observer
class Paypal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectStatus: false,
      validateStatus: false,
      checkoutMerch: this.props.siteStore.currentSite["checkout_merch"][0],
      donation: this.props.siteStore.currentSite["checkout_donate"][0],
    };
    this.onInit = this.onInit.bind(this);
  }

  onInit(data, actions) {
    // Disable the buttons
    actions.disable();

    // Listen for changes to the checkbox
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    document.querySelector("#email-check").addEventListener("change", function(event)  {
      console.log(event.target.value);
      // Enable or disable the button when it is checked or unchecked
      if(regexp.test(event.target.value))  {
        event.target.checked = true;
        actions.enable();
        document.querySelector("#checkout-id").textContent = "";

      } else  {
        event.target.checked = false;
        actions.disable();
      }
    });
  }

  onClick() {
    if(!document.querySelector("#email-check").checked) {
      document.querySelector("#checkout-id").textContent = "Enter a valid email to continue to Payment.";
    } else {
      document.querySelector("#checkout-id").textContent = "";
    }

  }


  createOrder(data, actions) {

    let checkoutCart = [
      {
        name: this.props.product.name,
        unit_amount: {value: `${(this.props.product.price / 100)}`, currency_code: "USD"},
        quantity: `${this.props.ticketQty}`,
        sku: this.props.siteStore.currentProduct.otpId
      }
    ];
    let price = this.props.ticketQty * (this.props.product.price / 100);
    console.log(price);

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

    return actions.order.create({
      purchase_units: [
        {
          reference_id: this.props.email,
          custom_id: this.props.siteStore.currentProduct.otpId,
          amount: {
            value: `${price}`,
            currency_code: "USD",
            breakdown: {
              item_total: {value: `${price}`, currency_code: "USD"}
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
    if(!this.props.validateEmail(this.props.email))  {
      this.props.handleError("Invalid Email");

    } else {
      console.log(err);
      this.props.handleError("There was an error with Paypal Checkout. Please try again.");
    }
  }

  render() {
    if(this.state.redirectStatus) {
      this.props.siteStore.CloseCheckoutModal();
      let checkoutId = this.props.siteStore.generateConfirmationId(this.props.siteStore.currentProduct.otpId, this.props.email);
      let redirectURL = `${this.props.siteStore.basePath}/${this.props.siteStore.siteSlug}/success/${this.props.email}/${checkoutId}`;
      return <Redirect to={redirectURL}/>;
    }

    let buttonStyle = {
      color:  "gold",
      shape:  "rect",
      label:  "paypal",
      size: "responsive",
      height: 50,
    };

    return (
      <div className="paypal-button">
        <PayPalButton
          onInit={(data, actions) => this.onInit(data, actions)}
          onClick={() => this.onClick()}
          createOrder={(data, actions) => this.createOrder(data, actions)}
          onApprove={(data, actions) => this.onApprove(data, actions)}
          onError={(err) => this.onError(err)}
          style={buttonStyle}
        />

      </div>

    );
  }
}

export default Paypal;
