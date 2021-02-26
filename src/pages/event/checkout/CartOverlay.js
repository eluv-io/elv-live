import React from "react";
import {inject, observer} from "mobx-react";
import CloseIcon from "Icons/x";
import ImageIcon from "Common/ImageIcon";

@inject("siteStore")
@inject("cartStore")
@observer
class CartOverlay extends React.Component {
  TicketItem({baseItemIndex, optionIndex, quantity}, index) {
    const ticket = this.props.siteStore.ticketClasses[baseItemIndex];

    return (
      <div className="cart-overlay-item" key={`ticket-item-${ticket.name}-${index}`}>
        <div className="item-image">
          <img alt={ticket.name} src={ticket.image_url} />
        </div>
        <div className="item-details">
          <div className="item-name">{ ticket.name }</div>
          <div className="item-price">{ this.props.cartStore.FormatPriceString(ticket.skus[optionIndex].price) }</div>
          <div className="item-quantity">Quantity: { quantity }</div>
          <button
            className="remove-item"
            onClick={() => this.props.cartStore.RemoveItem({itemType: "tickets", index})}
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  MerchandiseItem({baseItemIndex, optionIndex, quantity}, index) {
    const item = this.props.siteStore.MerchandiseItem(baseItemIndex);
    const selectedOptions = item.product_options[optionIndex] || {};

    return (
      <div className="cart-overlay-item" key={`merchandise-item-${item.name}-${index}`}>
        <div className="item-image">
          <img alt={item.name} src={item.image_urls[0]} />
        </div>
        <div className="item-details">
          <div className="item-name">{ item.name }</div>
          <div className="item-price">{ this.props.cartStore.FormatPriceString(item.price) }</div>

          {
            item.option_fields.map((field, index) =>
              <div className="item-option" key={`item-option-${index}`}>
                {field.name}: { typeof selectedOptions[field.name] === "object" ? selectedOptions[field.name].label : selectedOptions[field.name] }
              </div>
            )
          }

          <div className="item-quantity">Quantity: { quantity }</div>
          <button
            className="remove-item"
            onClick={() => this.props.cartStore.RemoveItem({itemType: "merchandise", index})}
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  render() {
    if(!this.props.cartStore.showCartOverlay) { return null; }

    const tickets = this.props.cartStore.tickets;
    const merchandise = this.props.cartStore.merchandise;

    if(tickets.length === 0 && merchandise.length === 0) {
      return (
        <div className="cart-overlay-scroll-container">
          <div className="cart-overlay empty">
            Your cart is empty
          </div>
        </div>
      );
    }

    return (
      <div className="cart-overlay-scroll-container">
        <div className="cart-overlay">
          <button
            className="cart-overlay-close-button"
            title={"Close Modal"}
            onClick={() => this.props.cartStore.ToggleCartOverlay(false)}
          >
            <ImageIcon
              icon={CloseIcon}
            />
          </button>
          <div className="cart-overlay-message">{ this.props.cartStore.cartOverlayMessage }</div>

          {
            this.props.cartStore.lastAdded ?
              this.MerchandiseItem(this.props.cartStore.lastAdded, 0) :
              <>
                { tickets.map((item, index) => this.TicketItem(item, index)) }
                { merchandise.map((item, index) => this.MerchandiseItem(item, index)) }
              </>
          }

          <button
            className="cart-overlay-checkout-button"
            onClick={() => this.props.cartStore.ToggleCheckoutOverlay(true)}
          >
            Check Out
          </button>
        </div>
      </div>
    );
  }
}

export default CartOverlay;
