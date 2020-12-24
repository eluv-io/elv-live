import React from "react";
import {inject, observer} from "mobx-react";
// import { Link } from "react-router-dom";
// import {ImageIcon} from "elv-components-js";
// import axios from "axios";
// import AsyncComponent from "../../support/AsyncComponent";
import {LoadingElement, onEnterPressed} from "elv-components-js";
import { loadStripe } from "@stripe/stripe-js";

// import concertPoster2 from "../../../assets/images/ritaora/sponsorRO3.png";

import unicefImg from "../../../assets/images/ritaora/unicef.png";
import merchImg from "../../../assets/images/ritaora/merchFront.jpg";
import loreal from "../../../assets/images/sponsor/loreal.png";
import Select from 'react-select';

// import { sizeOptions, countryOptions, qtyOptions } from "../../../assets/data/checkout";
import { checkout,event } from "../../../assets/data";

@inject("rootStore")
@inject("siteStore")
@observer
class PaymentOverview extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      email_placeholder: "Email",
      donationChecked: false,
      merchChecked: false,
      merchSize: false,
      selectedCountry: checkout.countryOptions[235],
      selectedQty: checkout.qtyOptions[0],
      selectedSize: checkout.sizeOptions[0],
    };
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleQtyChange = this.handleQtyChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
  }


  handleCountryChange(value) {
    this.setState({selectedCountry: value});
  };
  handleQtyChange(value) {
    this.setState({selectedQty: value});
  };
  handleSizeChange(value) {
    this.setState({selectedSize: value});
  };


  render() {
    const handleEmailChange = (event) => {
      this.setState({email: event.target.value});
    }
    const handledDonationChange = () => {
      this.setState({donationChecked: !(this.state.donationChecked)})
    }
    const handledMerchChange = () => {
      this.setState({merchChecked: !(this.state.merchChecked)})
    }
    const handleSubmit = (priceID, prodID) => async event => {
      event.preventDefault();
      const stripe = await loadStripe("pk_test_51HpRJ7E0yLQ1pYr6m8Di1EfiigEZUSIt3ruOmtXukoEe0goAs7ZMfNoYQO3ormdETjY6FqlkziErPYWVWGnKL5e800UYf7aGp6");
      
      let totalItems = [
        { price: priceID, quantity: this.state.selectedQty.value}
      ];
      if (this.state.merchChecked) {
        totalItems.push({ price: this.state.selectedSize.value, quantity: 1 });
      }
      if (this.state.donationChecked) {
        totalItems.push({ price: "price_1HyngME0yLQ1pYr6U9C3Vr8K", quantity: 1 });
      }

      let stripeParams = {
        mode: "payment",
        lineItems: totalItems,
        successUrl: `${window.location.origin}/d457a576/success/${this.state.email}/{CHECKOUT_SESSION_ID}`, 
        cancelUrl: `${window.location.origin}/d457a576/rita-ora`, 
        clientReferenceId: prodID,
        customerEmail: this.state.email
      };

      if (this.state.merchChecked) {
        stripeParams.shippingAddressCollection = {
          allowedCountries: [this.state.selectedCountry.value],
        }
      } 

      const { error } = await stripe.redirectToCheckout(stripeParams);

      if (error) {
        console.error("Failed to handleSubmit for Stripe:");
        console.error(error);
      }
    }
    
    return (


        <div className="payment-container">
          <div className="payment-info">
            <div className="payment-info-img-container">
              <img src={event.eventInfo["event-poster"]} className="payment-info-img" />
            </div>
            <span className="payment-info-artist">
              {event.eventInfo["artist"]} Presents
            </span>
            <h3 className="payment-info-event">
              {event.eventInfo["event-header"]} -  {event.eventInfo["location"]} 
            </h3>
            <p className="payment-info-date">
            {event.eventInfo["date"]} 
            </p>
            <p className="payment-info-description">
              {event.eventInfo["description"][0]}                 
            </p>
            <div className="sponsor-container"> 
              <img src={loreal} className="big-sponsor-img" />
            </div>
          </div>
              

          <div className="payment-checkout">

            {/* Currency and Quantity Selector */}
            <div className="checkout-section">
              <div className="checkout-checkbox-label">
                <h5 className="checkout-checkbox-heading">
                  {this.props.siteStore.prodName}
                </h5>  
              </div>
              <div className="currency-quantity-container">
                <div className="currency-select">
                   <Select 
                    className='react-select-container' 
                    classNamePrefix="react-select" 
                    options={checkout.countryOptions} 
                    value={this.state.selectedCountry} 
                    onChange={this.handleCountryChange}
                    theme={theme => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: 'rgba(230, 212, 165,.4)',
                        primary: '#cfb46b',
                      },
                    })}
                    />
                </div>
                <div className="quantity-select">
                  <Select className='react-select-container'  classNamePrefix="react-select" options={checkout.qtyOptions} value={this.state.selectedQty} onChange={this.handleQtyChange}
                  theme={theme => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: 'rgba(230, 212, 165,.4)',
                      primary: '#cfb46b',
                    },
                  })}
                  />
                </div>
              </div>
            </div>

            {/* Donation Selector */}
            <div className="checkout-section">

              <div className="checkout-checkbox-container">
               <input
                    checked={this.state.donationChecked}
                    onChange={handledDonationChange}
                    className="checkout-checkbox-input"
                    id={`checkbox-merch`}
                    type="checkbox"
                  />
                <div className="checkout-checkbox-label">
                  <h5 className="checkout-checkbox-heading">
                    {checkout.checkoutAddOns[0]["name"]}
                  </h5>  
                  <span>
                  {checkout.checkoutAddOns[0]["price"]}
                  </span>
                </div>
              </div>

              <div className="checkout-checkbox-bundle">
                <img src={checkout.checkoutAddOns[0]["img"]} className="checkout-checkbox-bundle-img" />
                <div className="checkout-checkbox-bundle-info">
                  <span className="checkout-checkbox-bundle-name">
                  {checkout.checkoutAddOns[0]["heading"]}
                  </span>  
                  <p className="checkout-checkbox-bundle-description">
                  {checkout.checkoutAddOns[0]["description"]}
                  </p>  
                </div>
              </div>
            </div>

            {/* Merch Selector */}
            <div className="checkout-section">
              <div className="checkout-checkbox-container">
                <input
                    checked={this.state.merchChecked}
                    onChange={handledMerchChange}
                    className="checkout-checkbox-input"
                    id={`checkbox-merch`}
                    type="checkbox"
                  />
                <div className="checkout-checkbox-label">
                  <h5 className="checkout-checkbox-heading">
                  {checkout.checkoutAddOns[1]["name"]}
                  </h5>  
                  <span>
                  {checkout.checkoutAddOns[1]["price"]}
                  </span>
                </div>
              </div>

              <div className="checkout-checkbox-bundle">
                <img src={checkout.checkoutAddOns[1]["img"]} className="checkout-checkbox-bundle-img" />
                <div className="checkout-checkbox-bundle-info">
                 <div className="checkout-checkbox-bundle-size">
                   <span className="checkout-checkbox-bundle-name">
                   {checkout.checkoutAddOns[1]["header"]}
                    </span>  
                    <Select className='react-select-container' classNamePrefix="react-select" options={checkout.sizeOptions} value={this.state.selectedSize} onChange={this.handleSizeChange}
                    theme={theme => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: 'rgba(230, 212, 165,.4)',
                        primary: '#cfb46b',
                      },
                    })}
                    />
                  </div>  
         
                  <p className="checkout-checkbox-bundle-description">
                  {checkout.checkoutAddOns[1]["description"]}
                  </p>  
                  
                </div>
              </div>
            </div>

            {/* Email Form*/}
            <div className="checkout-section">
                <div className="checkout-email-form">
                  <input
                    onFocus={() => this.setState({email_placeholder: ""})}
                    onBlur={() => this.setState({email_placeholder: "Email"})}
                    placeholder={this.state.email_placeholder}
                    value={this.state.email}
                    onChange={handleEmailChange} 
                    // onKeyPress={onEnterPressed(Submit)}
                  />
                </div>
                <p className="checkout-email-info">
                  Please make sure that you entered your email address correctly as it will be used to send the digital ticket.
                </p>
            </div>

            {/* Stripe Checkout Redirect Button*/}
            <button className="checkout-button" role="link" onClick={handleSubmit(this.props.siteStore.priceId, this.props.siteStore.prodId)}>
              Continue to Payment
            </button>

          </div>
        </div>

      
    );
  }
}


export default PaymentOverview;
