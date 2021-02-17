import React from "react";
import {inject, observer} from "mobx-react";
import {FormatPriceString} from "Utils/Misc";
import UrlJoin from "url-join";
import {NavLink} from "react-router-dom";
import CloseIcon from "Icons/x";
import ImageIcon from "Common/ImageIcon";

@inject("siteStore")
@inject("cartStore")
@observer
class CartOverlay extends React.Component {
  Item({item, options, quantity}, index) {
    return (
      <div className="cart-overlay-item" key={`item-${item.name}-${index}`}>
        <div className="item-image">
          <img alt={item.name} src={item.image_urls[0]} />
        </div>
        <div className="item-details">
          <div className="item-name">{ item.name }</div>
          <div className="item-price">{ FormatPriceString(item.skus[0].price) }</div>
          <div className="item-size">Size: { options.size.label }</div>
          <div className="item-color">Color: { options.color.label }</div>
          <div className="item-quantity">Quantity: { quantity }</div>
        </div>
      </div>
    );
  }

  render() {
    if(!this.props.cartStore.showCartOverlay) { return null; }

    const tickets = this.props.cartStore.tickets;
    const merchandise = this.props.cartStore.merchandise;
    const donations = this.props.cartStore.donations;

    if(tickets.length === 0 && merchandise.length === 0 && donations.length === 0) {
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
              this.Item(this.props.cartStore.lastAdded, 0) :
              <>
                { tickets.map(this.Item) }
                { merchandise.map(this.Item) }
                { donations.map(this.Item) }
              </>
          }

          <NavLink to={UrlJoin(this.props.siteStore.baseSitePath, "checkout")} className="cart-overlay-checkout-button">
            Checkout
          </NavLink>
        </div>
      </div>
    );
  }
}

export default CartOverlay;
