import React from "react";
import {inject, observer} from "mobx-react";
import { loadStripe } from "@stripe/stripe-js";

import Select from "react-select";
import { checkout } from "../../../assets/data";

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
      error: "",
      eventPoster: undefined,
      donationImage: undefined,
      merchImage: undefined,
      eventInfo: this.props.siteStore.eventSites[this.props.name]["event_info"][0],
      checkoutMerch: this.props.siteStore.eventSites[this.props.name]["checkout_merch"][0],
      donation: this.props.siteStore.eventSites[this.props.name]["donation"][0],
      sponsorInfo: this.props.siteStore.eventSites[this.props.name]["sponsor"][0],

    };

    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleQtyChange = this.handleQtyChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
  }

  async componentDidMount() {
    let donationImage = await this.props.siteStore.client.LinkUrl({...this.props.siteStore.siteParams, linkPath: `public/sites/${this.props.name}/images/checkout_donation/default`});
    let merchImage = await this.props.siteStore.client.LinkUrl({...this.props.siteStore.siteParams, linkPath: `public/sites/${this.props.name}/images/checkout_merch/default`});
    let eventPoster = await this.props.siteStore.client.LinkUrl({...this.props.siteStore.siteParams, linkPath: `public/sites/${this.props.name}/images/event_poster/default`});
    this.setState({eventPoster: eventPoster});
    this.setState({donationImage: donationImage});
    this.setState({merchImage: merchImage});
  }


  handleCountryChange(value) {
    this.setState({selectedCountry: value});
  }
  handleQtyChange(value) {
    this.setState({selectedQty: value});
  }
  handleSizeChange(value) {
    this.setState({selectedSize: value});
  }

  render() {
    let {donationImage, merchImage, checkoutMerch, donation, eventInfo, eventPoster, sponsorInfo} = this.state;



    const handleEmailChange = (event) => {
      this.setState({email: event.target.value});
    };
    const handledDonationChange = () => {
      this.setState({donationChecked: !(this.state.donationChecked)});
    };
    const handledMerchChange = () => {
      this.setState({merchChecked: !(this.state.merchChecked)});
    };


    const handleSubmit = (priceID, prodID) => async event => {
      try {
        event.preventDefault();
        const stripe = await loadStripe("pk_test_51HpRJ7E0yLQ1pYr6m8Di1EfiigEZUSIt3ruOmtXukoEe0goAs7ZMfNoYQO3ormdETjY6FqlkziErPYWVWGnKL5e800UYf7aGp6");
        
        let checkoutCart = [
          { price: priceID, quantity: this.state.selectedQty.value}
        ];

        if(this.state.merchChecked) {
          checkoutCart.push({ price: checkoutMerch["stripe_sku_sizes"][0][this.state.selectedSize.value], quantity: 1 });
        }
        if(this.state.donationChecked) {
          checkoutCart.push({ price: donation["stripe_price_id"], quantity: 1 });
        }
  
        let stripeParams = {
          mode: "payment",
          lineItems: checkoutCart,
          successUrl: `${window.location.origin}${this.props.siteStore.basePath}/success/${this.state.email}/{CHECKOUT_SESSION_ID}`, 
          cancelUrl: `${window.location.origin}${this.props.siteStore.basePath}/${this.props.name}`, 
          clientReferenceId: prodID,
          customerEmail: this.state.email
        };
  
        if(this.state.merchChecked) {
          stripeParams.shippingAddressCollection = {
            allowedCountries: [this.state.selectedCountry.value],
          };
        } 
        const { error } = await stripe.redirectToCheckout(stripeParams);
        if(error) {
          this.setState({error: "Error with Stripe"});
        }
        
      } catch (error) {
        this.setState({error: "Enter a valid email to continue to Payment."});
        
        let errorTimeout = setTimeout(() => {
          runInAction(() => this.setState({error: ""}));
        }, 8000);
    
        clearTimeout(errorTimeout);

        console.error("Failed to handleSubmit for Stripe:");
        console.error(error);
      }
    };
    
    return (
      <div className="payment-container">
        <div className="payment-info">
          <div className="payment-info-img-container">
            <img src={eventPoster} className="payment-info-img" />
          </div>
          <span className="payment-info-artist">
            {eventInfo["artist"]} Presents
          </span>
          <h3 className="payment-info-event">
            {eventInfo["event_header"]} -  {eventInfo["location"]} 
          </h3>
          <p className="payment-info-date">
            {eventInfo["date"]} 
          </p>
          <p className="payment-info-description">
            {eventInfo["description"]}                 
          </p>
          <div className="sponsor-container"> 
            <img src={this.props.siteStore.sponsorImage} className="big-sponsor-img" />
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
                      primary25: "rgba(230, 212, 165,.4)",
                      primary: "#cfb46b",
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
                      primary25: "rgba(230, 212, 165,.4)",
                      primary: "#cfb46b",
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
                id={"checkbox-merch"}
                type="checkbox"
              />
              <div className="checkout-checkbox-label">
                <h5 className="checkout-checkbox-heading">
                  {donation["name"]}
                </h5>  
                <span>
                  {donation["price"]}
                </span>
              </div>
            </div>

            <div className="checkout-checkbox-bundle">
              <img src={donationImage} className="checkout-checkbox-bundle-img" />
              <div className="checkout-checkbox-bundle-info">
                <span className="checkout-checkbox-bundle-name">
                  {donation["heading"]}
                </span>  
                <p className="checkout-checkbox-bundle-description">
                  {donation["description"]}
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
                id={"checkbox-merch"}
                type="checkbox"
              />
              <div className="checkout-checkbox-label">
                <h5 className="checkout-checkbox-heading">
                  {checkoutMerch["name"]}
                </h5>  
                <span>
                  {checkoutMerch["price"]}
                </span>
              </div>
            </div>

            <div className="checkout-checkbox-bundle">
              <img src={merchImage} className="checkout-checkbox-bundle-img" />
              <div className="checkout-checkbox-bundle-info">
                <div className="checkout-checkbox-bundle-size">
                  <span className="checkout-checkbox-bundle-name">
                    {checkoutMerch["heading"]}
                  </span>  
                  <Select className='react-select-container' classNamePrefix="react-select" options={checkout.sizeOptions} value={this.state.selectedSize} onChange={this.handleSizeChange}
                    theme={theme => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: "rgba(230, 212, 165,.4)",
                        primary: "#cfb46b",
                      },
                    })}
                  />
                </div>  
         
                <p className="checkout-checkbox-bundle-description">
                  {checkoutMerch["description"]}
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
          <div className="checkout-error">
            {this.state.error}
          </div>


        </div>
      </div>

      
    );
  }
}


export default PaymentOverview;
