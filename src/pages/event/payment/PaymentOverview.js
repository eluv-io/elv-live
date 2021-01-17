import React from "react";
import {inject, observer} from "mobx-react";
import { loadStripe } from "@stripe/stripe-js";

import Select from "react-select";
import { checkout } from "Data";
import {retryRequest} from "Utils/retryRequest";
// import PaypalButton from "./PaypalButton";
import Paypal from "./Paypal";
import Timer from "Common/Timer";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IconContext } from "react-icons";
import StripeLogo from "Images/logo/logo-stripe.png";

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
      donation: this.props.siteStore.eventSites[this.props.name]["checkout_donate"][0],
      sponsorInfo: this.props.siteStore.eventSites[this.props.name]["sponsor"][0],
      retryCheckout: false
    };

    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleQtyChange = this.handleQtyChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleError = this.handleError.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.handleStripeSubmit = this.handleStripeSubmit.bind(this);
    this.createOrder = this.createOrder.bind(this);

  }

  async componentDidMount() {
    let donationImage = await this.props.siteStore.client.LinkUrl({...this.props.siteStore.siteParams, linkPath: `public/sites/${this.props.name}/images/checkout_donation/default`});
    let merchImage = await this.props.siteStore.client.LinkUrl({...this.props.siteStore.siteParams, linkPath: `public/sites/${this.props.name}/images/checkout_merch/default`});
    let eventPoster = await this.props.siteStore.client.LinkUrl({...this.props.siteStore.siteParams, linkPath: `public/sites/${this.props.name}/images/event_poster/default`});
    this.setState({eventPoster: eventPoster});
    this.setState({donationImage: donationImage});
    this.setState({merchImage: merchImage});
  }

  validateEmail (email) {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
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
  handleError(value) {
    this.setState({error: value});
  }
  
  handleStripeSubmit = (priceID, prodID) => async event => {
    if (!this.validateEmail(this.state.email)) {
      this.setState({error: "Enter a valid email to continue to Payment!"});
      return;
    }
    const stripe = await loadStripe(this.props.siteStore.stripePublicKey);
    
    let checkoutCart = [
      { price: priceID, quantity: this.state.selectedQty.value}
    ];
    let merchInd = 1
    let donateInd = "stripe_price_id";
    if (this.props.siteStore.stripeTestMode) {
      merchInd = 0;
      donateInd = "stripe_test_price_id";
    }

    if(this.state.merchChecked) {
      checkoutCart.push({ price: this.state.checkoutMerch["stripe_sku_sizes"][merchInd][this.state.selectedSize.value], quantity: 1 });
    }
    if(this.state.donationChecked) {
      checkoutCart.push({ price: this.state.donation[donateInd], quantity: 1 });
    }
    let checkoutID = this.props.siteStore.generateCheckoutID(this.props.siteStore.currentProduct.otpID, this.state.email); 

    let stripeParams = {
      mode: "payment",
      lineItems: checkoutCart,
      successUrl: `${window.location.origin}${this.props.siteStore.basePath}/success/${this.state.email}/${checkoutID}`, 
      cancelUrl: `${window.location.origin}${this.props.siteStore.basePath}/${this.props.name}`, 
      clientReferenceId: prodID,
      customerEmail: this.state.email
    };

    if(this.state.merchChecked) {
      stripeParams.shippingAddressCollection = {
        allowedCountries: [this.state.selectedCountry.value],
      };
    } 

    try {
      await stripe.redirectToCheckout(stripeParams);

    } catch (error) {

        console.log("redirectToCheckout Error. Error.name: ", error.name, ", Error.message:", error.message);

        this.setState({retryCheckout: true});
        let retryResponse; 
        try {
          console.log("RETRY START: Retrying redirectToCheckout");

          retryResponse = await retryRequest(stripe.redirectToCheckout, stripeParams);
          console.log("RETRY END (SUCCESS). Response:", retryResponse);

        } catch(error) {
          this.setState({retryCheckout: false, error: "Sorry, this payment option is currently experiencing too many requests. Please try again in a few minutes or use Paypal to complete your purchase."});
          console.log("RETRY END (FAILURE). Response:", retryResponse, ", Error:", error);
        }
        this.setState({retryCheckout: false});
    }
  };

  createOrder(data, actions) {

    let checkoutCart = [
      {
        name: this.props.product.name,
        unit_amount: {value: `${this.props.product.price / 100}`, currency_code: 'USD'},
        quantity: '1',
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

    return actions.order.create({
      purchase_units: [{
        amount: {
            value: `${totalPrice / 100}`,
            currency_code: 'USD',
        },
        items: checkoutCart
      }],
      payer: {
        email_address: this.props.email
      }
      });
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
            {eventInfo["event_header"]}
          </h3>
          <h3 className="payment-info-location">
          {eventInfo["location"]} 
          </h3>
          {/* <h3 className="payment-info-date">
            {eventInfo["date"]} 
          </h3> */}
          <p className="payment-info-description">
            {/* {eventInfo["description"]}         */}
            Rita Ora will be making history on January 28th with a global live stream from the legendary Paris landmark, the Eiffel Tower, to celebrate the release of her third studio album: RO3. 
         
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
                {this.props.siteStore.currentProduct.name}
              </h5>
              {/* <span>
                  {`${this.props.siteStore.currentProduct.offering["price"]}`}

                </span>   */}
                              <span>
                  {`$${this.props.siteStore.currentProduct.price / 100}.00`}

                </span>  

                </div>
                <div className="checkout-checkbox-details">
                 <div className="">
                    {`${this.props.siteStore.currentProduct.offering["label"]} · ${this.props.siteStore.currentProduct.offering["date"]}`}                
                  </div>


    
  
                  
                  {/* <div className="ticket-bottom-countdown">
                    <Timer classProp="ticket-icon" premiereTime="January 28, 2021 20:00:00"/>
                  </div> */}

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
                <Select className='react-select-container'  classNamePrefix="react-select" options={checkout.qtyOptions} value={this.state.selectedQty} onChange={this.handleQtyChange}
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
                      color: 'black',
                      width: '100%',
                      padding: "10px"
                    })
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
                <h5 className="checkout-checkbox-heading2">
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
                <h5 className="checkout-checkbox-heading2">
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
                  {/* <Select className='react-select-container' classNamePrefix="react-select" options={checkout.sizeOptions} value={this.state.selectedSize} onChange={this.handleSizeChange}
                    theme={theme => ({
                      ...theme,
                      borderRadius: 10,
                      colors: {
                        ...theme.colors,
                        primary25: "rgba(230, 212, 165,.4)",
                        primary: "#cfb46b",
                      },
                      
                    })}
                  /> */}
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
                id="email-check" 
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
          <div className="checkout-button-container" >
          <button className="checkout-button" role="link" onClick={this.handleStripeSubmit(this.props.siteStore.currentProduct.priceId, this.props.siteStore.currentProduct.prodId)}>
              {this.state.retryCheckout ? 
                <div className="spin-checkout-container">
                  <div class="la-ball-clip-rotate la-sm">
                      <div></div>
                  </div>
                </div>
              : <div className="stripe-checkout-button">
             {"Pay with Card"}
             <img className="stripe-checkout-logo"src={StripeLogo}/>
          </div>}
            
          </button>
            <Paypal
              // createOrder={this.createOrder} 
              product={this.props.siteStore.currentProduct} 
              merchChecked={this.state.merchChecked} 
              donationChecked={this.state.donationChecked} 
              email={this.state.email} 
              handleError={this.handleError} 
              turnOffModal={this.props.siteStore.turnOffModal}
              validateEmail={this.validateEmail}
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
