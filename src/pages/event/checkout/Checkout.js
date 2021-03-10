import React from "react";
import {inject, observer} from "mobx-react";

import BagIcon from "Icons/cart.svg";
import ImageIcon from "Common/ImageIcon";
import MerchandiseItem from "Event/checkout/MerchandiseItem";
import FeaturedTicket from "Event/checkout/FeaturedTicket";
import Modal from "Common/Modal";
import EmailInput from "Common/EmailInput";
import {FormatDateString, ValidEmail} from "Utils/Misc";
import StripeLogo from "Images/logo/logo-stripe";
import {FUNDING, PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import {Redirect} from "react-router";

@inject("cartStore")
@inject("siteStore")
@observer
class Checkout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    };
  }

  componentDidMount() {
    this.props.cartStore.ToggleCartOverlay(false);
  }

  Donations() {
    const donationItems = this.props.siteStore.DonationItems();

    if(!donationItems || donationItems.length === 0) { return; }

    return (
      <div className="checkout-page-section">
        <h2 className="checkout-section-header">
          Add Donation
        </h2>
        { donationItems.map(item =>
          <MerchandiseItem
            key={`featured-item-${item.uuid}`}
            item={item}
            view="donation"
            checked={!!this.props.cartStore.featuredDonations[item.uuid]}
            UpdateItem={(item, optionIndex, quantity) => {
              this.props.cartStore.AddFeaturedItem({
                itemType: "donations",
                uuid: item.uuid,
                item,
                optionIndex,
                quantity,
              });
            }}
            RemoveItem={() => this.props.cartStore.RemoveFeaturedItem({
              itemType: "donations",
              uuid: item.uuid
            })}
          />
        )}
        <div className="bottom-border" />
      </div>
    );
  }

  FeaturedMerchandise() {
    const items = this.props.siteStore.FeaturedMerchandise()
      .filter(item => !this.props.cartStore.merchandise.find(cartItem => cartItem.uuid === item.uuid));

    if(!items || items.length === 0) { return; }

    return (
      <div className="checkout-page-section">
        <h2 className="checkout-section-header">Add Featured Merch</h2>
        { items.map(item => {
          const selectedItem = this.props.cartStore.featuredMerchandise[item.uuid] || {};

          return (
            <MerchandiseItem
              key={`featured-item-${item.uuid}`}
              item={item}
              view="featured"
              checked={!!this.props.cartStore.featuredMerchandise[item.uuid]}
              optionIndex={selectedItem.optionIndex}
              quantity={selectedItem.quantity}
              UpdateItem={(item, optionIndex, quantity) => {
                this.props.cartStore.AddFeaturedItem({
                  itemType: "merchandise",
                  uuid: item.uuid,
                  item,
                  optionIndex,
                  quantity,
                });
              }}
              RemoveItem={() => this.props.cartStore.RemoveFeaturedItem({
                itemType: "merchandise",
                uuid: item.uuid,
              })}
            />
          );
        })}
        <div className="bottom-border" />
      </div>
    );
  }

  FeaturedTickets() {
    if(this.props.cartStore.tickets.length > 0) { return; }

    return (
      <div className="checkout-page-section">
        <h2 className="checkout-section-header">Add Ticket</h2>
        <div className="featured-tickets">
          { this.props.siteStore.ticketClasses.map((ticketClass, index) =>
            <FeaturedTicket
              key={`featured-ticket-${index}`}
              ticketClass={ticketClass}
            />
          )}
        </div>
        <div className="bottom-border" />
      </div>
    );
  }

  Ticket(ticket, index) {
    const { ticketClass, ticketSku } = this.props.siteStore.TicketItem(ticket.uuid);

    // Mobile view
    if(window.innerWidth < 900) {
      return (
        <div className="cart-item">
          <div className="ticket-item-mobile">
            <h2>
              <div className="ticket-item-header">
                <div className="ticket-item-header-item">{ ticketClass.name }</div>
                <div className="ticket-item-header-item">{ ticketSku.label }</div>
              </div>
              <div className="ticket-item-price">
                { this.props.cartStore.FormatPriceString({[this.props.cartStore.currency]: this.props.cartStore.ItemPrice(ticketSku) * ticket.quantity}, true) }
              </div>
            </h2>
            <div className="ticket-item">
              <div className="ticket-item-image">
                <img src={ticketClass.image_url} alt={ticketClass.name} />
              </div>
              <div className="ticket-item-details">
                <div className="ticket-item-detail">{ ticketSku.label }</div>
                <div className="ticket-item-detail">{ FormatDateString(ticketSku.start_time, true) }</div>
                <div className="ticket-item-detail">{ FormatDateString(ticketSku.start_time, false, true) }</div>

                <div className="select-wrapper item-quantity-wrapper">
                  <select
                    className="item-quantity"
                    value={ticket.quantity}
                    onChange={event => this.props.cartStore.UpdateItem({
                      itemType: "tickets",
                      index,
                      quantity: parseInt(event.target.value)
                    })}
                  >
                    {
                      [...new Array(9).keys()].map(index =>
                        <option key={`quantity-option-${index}`} value={index + 1}>{ index + 1 }</option>
                      )
                    }
                  </select>
                </div>

                <div className="ticket-item-description">
                  { this.props.siteStore.eventInfo.description }
                </div>

                <button
                  className="remove-item"
                  onClick={() => this.props.cartStore.RemoveItem({itemType: "tickets", index})}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Desktop view
    return (
      <div className="cart-item" key={`cart-item-${index}`}>
        <div className="cart-item-cell cart-item-info">
          <h3 className="item-name">{ ticketClass.name }</h3>
          <div className="ticket-item">
            <div className="ticket-item-image">
              <img src={ticketClass.image_url} alt={ticketClass.name} />
            </div>
            <div className="ticket-item-details">
              <div className="ticket-item-detail">{ ticketSku.label }</div>
              <div className="ticket-item-detail">{ FormatDateString(ticketSku.start_time, true) }</div>
              <div className="ticket-item-detail">{ FormatDateString(ticketSku.start_time, false, true) }</div>

              <div className="ticket-item-description">
                { this.props.siteStore.eventInfo.description }
              </div>
            </div>
          </div>
        </div>
        <div className="cart-item-cell cart-item-price">{ this.props.cartStore.FormatPriceString(ticketSku.price, true) }</div>
        <div className="cart-item-cell cart-item-quantity">
          <div className="select-wrapper item-quantity-wrapper">
            <select
              className="item-quantity"
              value={ticket.quantity}
              onChange={event => this.props.cartStore.UpdateItem({
                itemType: "tickets",
                index,
                quantity: parseInt(event.target.value)
              })}
            >
              {
                [...new Array(9).keys()].map(index =>
                  <option key={`quantity-option-${index}`} value={index + 1}>{ index + 1 }</option>
                )
              }
            </select>
          </div>
        </div>
        <div className="cart-item-cell cart-item-total">
          { this.props.cartStore.FormatPriceString({[this.props.cartStore.currency]: this.props.cartStore.ItemPrice(ticketSku) * ticket.quantity}) }
        </div>
        <button
          className="remove-item"
          onClick={() => this.props.cartStore.RemoveItem({itemType: "tickets", index})}
        >
          Remove
        </button>
        <div className="bottom-border" />
      </div>
    );
  }

  Item(item, index) {
    const baseItem = this.props.siteStore.MerchandiseItem(item.uuid);

    return (
      <div className="cart-item" key={`cart-item-${index}`}>
        <div className="cart-item-cell cart-item-info">
          <h3 className="item-name no-mobile">{ baseItem.name }</h3>
          <MerchandiseItem
            item={baseItem}
            quantity={item.quantity}
            optionIndex={item.optionIndex}
            view="cart"
            UpdateItem={(item, optionIndex, quantity) => {
              this.props.cartStore.UpdateItem({itemType: "merchandise", index, optionIndex, quantity});
            }}
            RemoveItem={() => this.props.cartStore.RemoveItem({itemType: "merchandise", index})}
          />
        </div>
        <div className="cart-item-cell cart-item-price no-mobile">{ this.props.cartStore.FormatPriceString(baseItem.price) }</div>
        <div className="cart-item-cell cart-item-quantity no-mobile">
          <div className="select-wrapper item-quantity-wrapper">
            <select
              className="item-quantity"
              value={item.quantity}
              onChange={event => this.props.cartStore.UpdateItem({
                itemType: "merchandise",
                index,
                quantity: parseInt(event.target.value)
              })}
            >
              {
                [...new Array(9).keys()].map(index =>
                  <option key={`quantity-option-${index}`} value={index + 1}>{ index + 1 }</option>
                )
              }
            </select>
          </div>
        </div>
        <div className="cart-item-cell cart-item-total no-mobile">
          { this.props.cartStore.FormatPriceString({[this.props.cartStore.currency]: this.props.cartStore.ItemPrice(baseItem) * item.quantity}, true) }
        </div>
        <button
          className="remove-item no-mobile"
          onClick={() => this.props.cartStore.RemoveItem({itemType: "merchandise", index})}
        >
          Remove
        </button>
        <div className="bottom-border" />
      </div>
    );
  }

  Cart() {
    const tickets = this.props.cartStore.tickets;
    const merchandise = this.props.cartStore.merchandise;

    if(tickets.length === 0 && merchandise.length === 0) {
      return (
        <div className="checkout-page-section cart-section empty">
          <h2 className="checkout-section-header">
            <ImageIcon
              className="bag-icon"
              label="Shopping cart icon"
              icon={BagIcon}
            />
            Shopping Cart
          </h2>

          Your cart is empty

          <div className="bottom-border" />
        </div>
      );
    }

    return (
      <div className="checkout-page-section cart-section">
        <h2 className="checkout-section-header">
          <ImageIcon
            className="bag-icon"
            label="Shopping cart icon"
            icon={BagIcon}
          />
          Shopping Cart
        </h2>

        <div className="cart-item cart-header no-mobile">
          <div className="cart-header-column long">Item</div>
          <div className="cart-header-column">Price</div>
          <div className="cart-header-column">Quantity</div>
          <div className="cart-header-column">Total</div>
        </div>

        { this.props.cartStore.tickets.map((ticket, index) => this.Ticket(ticket, index))}
        { this.props.cartStore.merchandise.map((item, index) => this.Item(item, index))}
      </div>
    );
  }

  OrderSummary() {
    const cartDetails = this.props.cartStore.CartDetails();

    return (
      <div className="checkout-page-section no-border">
        <h2 className="checkout-section-header">Order Summary</h2>
        <div className="order-summary">
          <label>Subtotal</label>
          <div className="order-value">
            { cartDetails.totalFormatted }
          </div>
          <label>Shipping</label>
          <div className="order-value">TBD</div>
          <label>Estimated Tax</label>
          <div className="order-value">TBD</div>
          <label>Total</label>
          <div className="order-value">
            { cartDetails.totalFormatted }
          </div>
        </div>

        <EmailInput />

        { this.PaymentActions() }
      </div>
    );
  }

  PaymentActions() {
    if(!ValidEmail(this.props.cartStore.email)) {
      return;
    }

    if(this.state.redirect) {
      return (
        <Redirect
          to={this.props.siteStore.SitePath("success", this.props.cartStore.email, this.props.cartStore.confirmationId)}
        />
      );
    }

    return (
      <div className="payment-actions">
        <button className="checkout-button" role="link" onClick={this.props.cartStore.StripeSubmit}>
          Pay with Card
          <img className="stripe-checkout-logo" src={StripeLogo} alt="Stripe Logo"/>
        </button>
        <div className="paypal-button">
          <PayPalScriptProvider
            options={{
              "client-id": this.props.siteStore.paymentConfigurations.paypal_client_id,
              currency: this.props.cartStore.currency
            }}
          >
            <PayPalButtons
              createOrder={this.props.cartStore.PaypalSubmit}
              onApprove={() => this.setState({redirect: true})}
              onError={() => this.props.cartStore.PaymentSubmitError("There was an error with Paypal Checkout. Please try again.")}
              style={{
                color:  "gold",
                shape:  "rect",
                label:  "paypal",
                layout: "horizontal",
                tagline: false,
                height: 50
              }}
              fundingSource={FUNDING.PAYPAL}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    );
  }

  render() {
    if(!this.props.cartStore.showCheckoutOverlay) { return null; }

    return (
      <Modal
        Toggle={this.props.cartStore.ToggleCheckoutOverlay}
        content={
          <div className="checkout">
            { this.Cart() }
            { this.FeaturedTickets() }
            { this.Donations() }
            { this.FeaturedMerchandise() }
            { this.OrderSummary() }
          </div>
        }
      />
    );
  }
}

export default Checkout;
