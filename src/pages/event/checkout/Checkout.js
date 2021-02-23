import React from "react";
import {inject, observer} from "mobx-react";

import BagIcon from "Icons/cart.svg";
import ImageIcon from "Common/ImageIcon";
import MerchandiseItem from "Event/checkout/MerchandiseItem";
import {root} from "rxjs/internal-compatibility";
import {observable} from "mobx";
import CloseIcon from "Icons/x";
import Modal from "Common/Modal";
import EmailInput from "Common/EmailInput";
import {FormatDateString} from "Utils/Misc";


@inject("cartStore")
@inject("siteStore")
@observer
class Checkout extends React.Component {
  componentDidMount() {
    this.props.cartStore.ToggleCartOverlay(false);
    document.body.style.overflow = "hidden";
  }

  componentWillUnmount() {
    document.body.style.overflow = "auto";
  }

  Ticket(ticket, index) {
    const ticketClass = this.props.siteStore.ticketClasses[ticket.baseItemIndex];
    const ticketSku = ticketClass.skus[ticket.optionIndex];

    return (
      <React.Fragment key={`cart-item-${index}`}>
        <div className="cart-item">
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
          <div className="cart-item-cell cart-item-price">{ this.props.cartStore.FormatPriceString(ticketSku.price) }</div>
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
        </div>
        <div className="bottom-border" />
      </React.Fragment>
    );
  }

  Item(item, index) {
    const baseItem = this.props.siteStore.Merchandise()[item.baseItemIndex];

    return (
      <React.Fragment key={`cart-item-${index}`}>
        <div className="cart-item">
          <div className="cart-item-cell cart-item-info">
            <h3 className="item-name">{ baseItem.name }</h3>
            <MerchandiseItem
              item={baseItem}
              quantity={item.quantity}
              optionIndex={item.optionIndex}
              limited
              UpdateItem={({options}) => this.props.cartStore.UpdateItem({
                itemType: "merchandise",
                index,
                options
              })}
            />
          </div>
          <div className="cart-item-cell cart-item-price">{ this.props.cartStore.FormatPriceString(baseItem.price) }</div>
          <div className="cart-item-cell cart-item-quantity">
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
          <div className="cart-item-cell cart-item-total">
            { this.props.cartStore.FormatPriceString({[this.props.cartStore.currency]: this.props.cartStore.ItemPrice(baseItem) * item.quantity}) }
          </div>
          <button
            className="remove-item"
            onClick={() => this.props.cartStore.RemoveItem({itemType: "merchandise", index})}
          >
            Remove
          </button>
        </div>
        <div className="bottom-border" />
      </React.Fragment>
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
              label="Shopping bag icon"
              icon={BagIcon}
            />
            Shopping Bag
          </h2>

          Your bag is empty

          <div className="bottom-border" />
        </div>
      );
    }

    return (
      <div className="checkout-page-section cart-section">
        <h2 className="checkout-section-header">
          <ImageIcon
            className="bag-icon"
            label="Shopping bag icon"
            icon={BagIcon}
          />
          Shopping Bag
        </h2>

        <div className="cart-item cart-header">
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
    const merchPrice = this.props.cartStore.merchandise
      .map(item => this.props.cartStore.ItemPrice(this.props.siteStore.Merchandise()[item.baseItemIndex]) * item.quantity)
      .reduce((acc, price) => acc + price, 0);

    return (
      <div className="checkout-page-section">
        <h2 className="checkout-section-header">Order Summary</h2>
        <div className="order-summary">
          <label>Subtotal</label>
          <div className="order-value">
            { this.props.cartStore.FormatPriceString({[this.props.cartStore.currency]: merchPrice}) }
          </div>
          <label>Shipping</label>
          <div className="order-value">TBD</div>
          <label>Estimated Tax</label>
          <div className="order-value">TBD</div>
          <label>Total</label>
          <div className="order-value">
            { this.props.cartStore.FormatPriceString({[this.props.cartStore.currency]: merchPrice}) }
          </div>
        </div>

        <EmailInput />
      </div>
    );
  }

  render() {
    return (
      <Modal
        Toggle={this.props.cartStore.ToggleCheckoutOverlay}
        content={
          <div className="checkout">
            { this.Cart() }
            { this.OrderSummary() }
          </div>
        }
      />
    );
  }
}

export default Checkout;
