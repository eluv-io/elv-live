import React from "react";
import ReactDOM from "react-dom"
import { Redirect } from 'react-router-dom'
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
      checkoutMerch: this.props.siteStore.eventSites[this.props.siteStore.eventSlug]["checkout_merch"][0],
      donation: this.props.siteStore.eventSites[this.props.siteStore.eventSlug]["checkout_donate"][0],
    };
    this.onInit = this.onInit.bind(this);
    

  }


  onInit(data, actions) {

    // Disable the buttons
    actions.disable();

    // Listen for changes to the checkbox
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    document.querySelector('#email-check').addEventListener('change', function(event)  {
      console.log(event.target.value);
          // Enable or disable the button when it is checked or unchecked
          if (regexp.test(event.target.value))  {
            event.target.checked = true;
            console.log("enabled");
            actions.enable();
            document.querySelector('#checkout-id').textContent = "";

           } else  {
            event.target.checked = false;

            console.log("disabled");

            actions.disable();

           }
         });


      
   }

   onClick() {
    if (!document.querySelector('#email-check').checked) {
      document.querySelector('#checkout-id').textContent = "Enter a valid email to continue to Payment.";
    } else {
      document.querySelector('#checkout-id').textContent = "";
    }

    }


  createOrder(data, actions) {
    console.log("CREATE ORDER");

    let checkoutCart = [
      {
        name: this.props.product.name,
        unit_amount: {value: `${this.props.product.price / 100}`, currency_code: 'USD'},
        quantity: '1',
        sku: this.props.siteStore.currentProduct.otpID
      }
    ];
    let totalPrice = this.props.product.price;

    if(this.props.merchChecked) {
      let merchPrice = 2500; //this.state.checkoutMerch["price"];
      checkoutCart.push({
        name: 'Merch',
        unit_amount: {value: `${merchPrice / 100}`, currency_code: 'USD'},
        quantity: '1',
      });
      totalPrice += merchPrice;
    }

    if(this.props.donationChecked) {
      let donationPrice = 1000; //this.state.donation["price"]
      checkoutCart.push({
        name: 'Donation',
        unit_amount: {value: `${donationPrice / 100}`, currency_code: 'USD'},
        quantity: '1',
      });
      totalPrice += donationPrice;
    }

    console.log("this.props.siteStore.currentProduct.otpID", this.props.siteStore.currentProduct.otpID);

    return actions.order.create({
      purchase_units: [
        {
          reference_id: this.props.siteStore.generateCheckoutID(this.props.siteStore.currentProduct.otpID, this.props.email),
          custom_id: this.props.siteStore.currentProduct.otpID,
        amount: {
            value: `${totalPrice / 100}`,
            currency_code: 'USD',
            breakdown: {
              item_total: {value: `${totalPrice / 100}`, currency_code: 'USD'}
          }
        },
        items: checkoutCart
      }],
      payer: {
        email_address: this.props.email
      },

      });
  }

  onApprove(data, actions) {
    // return actions.order.capture().then(function(details) {
    //   // This function shows a transaction success message to your buyer.
    //   alert('Transaction completed by ' + details.payer.name.given_name);
    // });
    this.setState({redirectStatus: true});
    return actions.order.capture().then(function(details)  {
      // This function shows a transaction success message to your buyer.
      alert('Transaction completed by ' + details.payer.name.given_name);
     });
  }

  onError(err) {
    if (!this.props.validateEmail(this.props.email))  {
      this.props.handleError("Invalid Email")

    } else {
    // For example, redirect to a specific error page
    console.log(err);
    this.props.handleError("There was an error with Paypal Checkout. Please try again.")
    }
  }

  render() {


    if(this.state.redirectStatus) {
      this.props.turnOffModal();
      console.log("REDIRECT this.props.siteStore.currentProduct.otpID", this.props.siteStore.currentProduct.otpID);

      let checkoutID = this.props.siteStore.generateCheckoutID(this.props.siteStore.currentProduct.otpID, this.props.email); 

      let redirectURL = `${this.props.siteStore.basePath}/success/${this.props.email}/${checkoutID}`;
      return <Redirect to={redirectURL}/>;
    }

    let buttonStyle = {
      color:  'gold',
      shape:  'pill',
      label:  'paypal',
      size: 'responsive',
      height: 45
    };

    return (
      <PayPalButton
        onInit={(data, actions) => this.onInit(data, actions)}
        onClick={() => this.onClick()}
        createOrder={(data, actions) => this.createOrder(data, actions)}
        onApprove={(data, actions) => this.onApprove(data, actions)}
        onError={(err) => this.onError(err)}
        style={buttonStyle}
      />
    );
  }
}

export default Paypal;

