import React from "react";
import {inject, observer} from "mobx-react";
import { loadStripe } from "@stripe/stripe-js";

import Select from "react-select";
import { checkout } from "Data";
import {retryRequest} from "Utils/retryRequest";
import Paypal from "./Paypal";
import StripeLogo from "Images/logo/logo-stripe.png";
import UrlJoin from "url-join";
import {FormatDateString, FormatPriceString, ValidEmail} from "Utils/Misc";

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
      ticketQuantity: checkout.qtyOptions[0],
      selectedSize: checkout.sizeOptions[0],
      error: "",
      retryCheckout: false
    };

    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleQtyChange = this.handleQtyChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleStripeSubmit = this.handleStripeSubmit.bind(this);
  }

  handleCountryChange(value) {
    this.setState({selectedCountry: value});
  }
  handleQtyChange(value) {
    this.setState({ticketQuantity: value});
  }
  handleSizeChange(value) {
    this.setState({selectedSize: value});
  }
  handleError(value) {
    this.setState({error: value});
  }

  handleStripeSubmit = () => async () => {
    const { ticketSku } = this.SelectedTicket();
    const { price_id, product_id } = ticketSku.payment_ids.stripe;

    if(!ValidEmail(this.state.email)) {
      this.setState({error: "Enter a valid email to continue to Payment!"});
      return;
    }

    const checkoutId = this.props.siteStore.generateConfirmationId(ticketSku.otp_id, this.state.email);
    const baseUrl = UrlJoin(window.location.origin, this.props.siteStore.baseSitePath);

    let stripeParams = {
      mode: "payment",
      successUrl: UrlJoin(baseUrl, "success", this.state.email, checkoutId),
      cancelUrl: baseUrl,
      clientReferenceId: product_id,
      customerEmail: this.state.email,
    };

    let checkoutCart = [
      { price: price_id, quantity: this.state.ticketQuantity.value}
    ];

    /* TODO: Merchandise and donations
    if(this.state.merchChecked) {
      checkoutCart.push({
        price: this.state.checkoutMerch["stripe_sku_sizes"][merchInd][this.state.selectedSize.value],
        quantity: 1
      });
    }
    if(this.state.donationChecked) {
      checkoutCart.push({ price: this.state.donation[donateInd], quantity: 1 });
    }
    */

    stripeParams.lineItems = checkoutCart;


    if(this.state.merchChecked) {
      stripeParams.shippingAddressCollection = {
        allowedCountries: [this.state.selectedCountry.value],
      };
    }

    try {
      const stripe = await loadStripe(this.props.siteStore.paymentConfigurations.stripe_public_key);
      await stripe.redirectToCheckout(stripeParams);

    } catch (error) {
      this.setState({retryCheckout: true});

      let retryResponse;
      try {
        retryResponse = await retryRequest(stripe.redirectToCheckout, stripeParams);
      } catch (error) {
        this.setState({retryCheckout: false, error: "Sorry, this payment option is currently experiencing too many requests. Please try again in a few minutes or use Paypal to complete your purchase."});
        console.error(retryResponse);
      }
      this.setState({retryCheckout: false});
    }
  };

  SelectedTicket() {
    return {
      ticketClass: this.props.ticketClass,
      ticketSku: this.props.ticketClass.skus[this.props.skuIndex]
    };
  }

  DonationItems() {
    // TODO: This only supports one item
    const handledDonationChange = () => {
      this.setState({donationChecked: !(this.state.donationChecked)});
    };

    const { ticketSku } = this.SelectedTicket();
    const ticketCurrency = ticketSku.price.currency;

    return this.props.siteStore.DonationItems(ticketCurrency).map((donationItem, index) => {
      const price = donationItem.skus[0].price;

      if(!price) { return; }

      return (
        <div className="checkout-section" key={`donation-item-${index}`}>
          <div className="checkout-checkbox-container">
            <input
              checked={this.state.donationChecked}
              onChange={handledDonationChange}
              className="checkout-checkbox-input"
              id={"checkbox-donation"}
              type="checkbox"
            />
            <div className="checkout-checkbox-label">
              <h5 className="checkout-checkbox-heading2">
                { donationItem.name }
              </h5>
              <span>
                { FormatPriceString(price) }
              </span>
            </div>
          </div>

          <div className="checkout-checkbox-bundle">
            <img src={donationItem.image_urls[0]} className="checkout-checkbox-bundle-img" />
            <div className="checkout-checkbox-bundle-info">
              <span className="checkout-checkbox-bundle-name">
                { donationItem.heading }
              </span>
              <p className="checkout-checkbox-bundle-description">
                { donationItem.description }
              </p>
            </div>
          </div>
        </div>
      );
    });
  }

  Merchandise() {
    // TODO: This only supports one item
    const handledMerchChange = () => {
      this.setState({merchChecked: !(this.state.merchChecked)});
    };

    const { ticketSku } = this.SelectedTicket();
    const ticketCurrency = ticketSku.price.currency;

    return this.props.siteStore.Merchandise(ticketCurrency).map((item, index) => {
      const price = item.skus[0].price;

      if(!price) { return; }

      return (
        <div className="checkout-section" key={`merchandise-item-${index}`}>
          <div className="checkout-checkbox-container">
            <input
              checked={this.state.merchChecked}
              onChange={handledMerchChange}
              className="checkout-checkbox-input"
              id={"checkbox-merch"}
              type="checkbox"
            />
            <div className="checkout-checkbox-label">
              <h5 className="checkout-checkbox-heading2">
                { item.name }
              </h5>
              <span>
                { FormatPriceString(price) }
              </span>
            </div>
          </div>
          <div className="checkout-checkbox-bundle">
            <img src={item.image_urls[0]} className="checkout-checkbox-bundle-img" />
            <div className="checkout-checkbox-bundle-info">
              <div className="checkout-checkbox-bundle-size">
                <span className="checkout-checkbox-bundle-name">
                  { item.heading }
                </span>
              </div>
              <p className="checkout-checkbox-bundle-description">
                { item.description }
              </p>
            </div>
          </div>
        </div>
      );
    });
  }

  Sponsors() {
    return (
      <div className="sponsor-container">
        {
          this.props.siteStore.sponsors.map((sponsor, index) =>
            <img src={sponsor.image_url} className="big-sponsor-img" alt={sponsor.name} key={`checkout-sponsor-${index}`}/>
          )
        }
      </div>
    );
  }

  render() {
    const handleEmailChange = (event) => {
      this.setState({email: event.target.value});
    };

    const { ticketClass, ticketSku } = this.SelectedTicket();

    return (
      <div className="payment-container">
        <div className="payment-info">
          <div className="payment-info-img-container">
            <img src={ticketClass.image_url} className="payment-info-img" />
          </div>
          {this.props.siteStore.eventLogo ?
            <div className="ticket-logo-container">
              <img className="ticket-logo" src={this.props.siteStore.eventLogo}/>
            </div>
            :  null
            //<h1 className="payment-info-artist">{ this.props.siteStore.eventInfo.artist }</h1> }
          }
          <h3 className="payment-info-event">
            { this.props.siteStore.eventInfo.event_title }
          </h3>
          <h3 className="payment-info-location">
            { this.props.siteStore.eventInfo.location }
          </h3>
          <p className="payment-info-description">
            { ticketClass.description }
          </p>
          { this.Sponsors() }
        </div>

        <div className="payment-checkout">
          {/* Currency and Quantity Selector */}
          <div className="checkout-section">
            <div className="checkout-checkbox-label">
              <h5 className="checkout-checkbox-heading">
                { ticketClass.name }
              </h5>
              <span>
                { FormatPriceString(ticketSku.price) }
              </span>
            </div>
            <div className="checkout-checkbox-details">
              <div className="">
                { `${ticketSku.label} · ${FormatDateString(ticketSku.start_time)}` }
              </div>
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
                    borderRadius: 10,
                    colors: {
                      ...theme.colors,
                      primary25: "rgba(230, 212, 165,.4)",
                      primary: "#cfb46b",
                    },
                  })}
                />
              </div>
              <div className="quantity-select">
                <Select className='react-select-container'  classNamePrefix="react-select" options={checkout.qtyOptions} value={this.state.ticketQuantity} onChange={this.handleQtyChange}
                  theme={theme => ({
                    ...theme,
                    borderRadius: 10,
                    colors: {
                      ...theme.colors,
                      primary25: "rgba(230, 212, 165,.4)",
                      primary: "#cfb46b",
                    },
                    valueContainer: base => ({
                      ...base,
                      background: "#F2EEEA",
                      color: "black",
                      width: "100%",
                      padding: "10px"
                    })
                  })}
                />
              </div>
            </div>
          </div>

          { this.DonationItems() }

          { this.Merchandise() }

          {/* Email Form*/}
          <div className="checkout-section">
            <div className="checkout-email-form">
              <input
                id="email-check"
                onFocus={() => this.setState({email_placeholder: ""})}
                onBlur={() => this.setState({email_placeholder: "Email"})}
                placeholder={this.state.email_placeholder}
                value={this.state.email}
                onChange={handleEmailChange}
              />
            </div>
            <p className="checkout-email-info">
              Please make sure that you entered your email address correctly as it will be used to send the digital ticket.
            </p>
          </div>

          {/* Stripe Checkout Redirect Button*/}
          <div className="checkout-button-container" >

            <button className="checkout-button" role="link" onClick={this.handleStripeSubmit()}>
              {this.state.retryCheckout ?
                <div className="spin-checkout-container">
                  <div className="la-ball-clip-rotate la-sm">
                    <div />
                  </div>
                </div>
                : <div className="stripe-checkout-button">
                  Pay with Card
                  <img className="stripe-checkout-logo" src={StripeLogo} alt="Stripe Logo"/>
                </div>}
            </button>

            <Paypal
              // TODO: Replace with better "cart" info
              //checkoutMerch={checkoutMerch["price"]}
              //checkoutDonation={donation["price"]}
              //merchChecked={this.state.merchChecked}
              //donationChecked={this.state.donationChecked}
              ticketClass={ticketClass}
              ticketSku={ticketSku}
              email={this.state.email}
              handleError={this.handleError}
              ticketQuantity={this.state.ticketQuantity.value}
            />
            <div id="checkout-id" className="checkout-error">
              {this.state.error}
            </div>

          </div>
        </div>
      </div>
    );
  }
}


export default PaymentOverview;
