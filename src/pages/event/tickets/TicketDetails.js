import React from "react";
import {inject, observer} from "mobx-react";
import {FormatDateString} from "Utils/Misc";
import EmailInput from "Common/EmailInput";
import MerchandiseItem from "Event/checkout/MerchandiseItem";

@inject("rootStore")
@inject("siteStore")
@inject("cartStore")
@observer
class TicketDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSku: this.props.cartStore.ticketOverlayOptions.selectedSku,
      quantity: 1
    };
  }

  SelectedTicket() {
    const ticketClass = this.props.siteStore.ticketClasses[this.props.cartStore.ticketOverlayOptions.ticketClassIndex];

    return {
      ticketClass,
      ticketSku: ticketClass.skus[this.state.selectedSku]
    };
  }

  Sponsors() {
    return (
      <div className="ticket-details__sponsor-container">
        {
          this.props.siteStore.sponsors.map((sponsor, index) =>
            <div className="ticket-details__sponsor-image-container" key={`ticket-details-sponsor-${index}`}>
              <img src={sponsor.image_url} className="ticket-details__sponsor-image" alt={sponsor.name} />
            </div>
          )
        }
      </div>
    );
  }

  FeaturedMerchandise() {
    const items = this.props.siteStore.FeaturedMerchandise()
      .filter(item => !this.props.cartStore.merchandise.find(cartItem => cartItem.baseItemIndex === item.productIndex));

    if(!items || items.length === 0) { return; }

    return (
      items.map(item => {
        const selectedItem = this.props.cartStore.featuredMerchandise[item.productIndex] || {};

        return (
          <MerchandiseItem
            key={`featured-item-${item.productIndex}`}
            item={item}
            view="featured"
            checked={!!this.props.cartStore.featuredMerchandise[item.productIndex]}
            optionIndex={selectedItem.optionIndex}
            quantity={selectedItem.quantity}
            UpdateItem={(item, optionIndex, quantity) => {
              this.props.cartStore.AddFeaturedItem({
                productIndex: item.productIndex,
                item,
                optionIndex,
                quantity,
              });
            }}
            RemoveItem={() => this.props.cartStore.RemoveFeaturedItem(item.productIndex)}
          />
        );
      })
    );
  }

  Donations() {
    const donationItems = this.props.siteStore.DonationItems();

    if(!donationItems || donationItems.length === 0) { return; }

    return (
      donationItems.map(item =>
        <MerchandiseItem
          key={`featured-item-${item.productIndex}`}
          item={item}
          view="donation"
          checked={!!this.props.cartStore.donations[item.productIndex]}
          UpdateItem={(item, optionIndex, quantity) => {
            this.props.cartStore.AddDonation({
              productIndex: item.productIndex,
              item,
              optionIndex,
              quantity,
            });
          }}
          RemoveItem={() => this.props.cartStore.RemoveDonation(item.productIndex)}
        />
      )
    );
  }

  render() {
    const { ticketClass, ticketSku } = this.SelectedTicket();

    return (
      <div className="ticket-details">
        <div className="ticket-details__column">
          <div className="ticket-details__image-container">
            <img alt={ticketClass.name} src={ticketClass.image_url} className="ticket-details__img" />
          </div>

          {this.props.siteStore.eventLogo ?
            <div className="ticket-details__image-container ticket-details__logo-container">
              <img alt={ticketClass.name} className="ticket-logo" src={this.props.siteStore.eventLogo}/>
            </div>
            :  null
          }
          <h3 className="ticket-details__event">
            { this.props.siteStore.eventInfo.event_title }
          </h3>
          <h3 className="ticket-details__location">
            { this.props.siteStore.eventInfo.location }
          </h3>
          <h3 className="ticket-details__date">
            { FormatDateString(ticketSku.start_time) }
          </h3>
          <p className="ticket-details__description">
            { ticketClass.description }
          </p>
          { this.Sponsors() }
        </div>

        <div className="ticket-details__column ticket-details__options-column">
          <div className="ticket-details__ticket-info">
            <h2 className="ticket-details__header">
              { ticketClass.name }
              <div className="ticket-details__price">
                { this.props.cartStore.FormatPriceString(ticketSku.price, true) }
              </div>
            </h2>
            <div className="ticket-details__option-date">
              <div className="ticket-details__option-date-field">{ ticketSku.label }</div>
              <div className="separator">·</div>
              <div className="ticket-details__option-date-field">{ FormatDateString(ticketSku.start_time, true) }</div>
              <div className="separator">·</div>
              <div className="ticket-details__option-date-field">{ FormatDateString(ticketSku.start_time, false, true) }</div>
            </div>
            <div className="ticket-details__options">
              <div className="select-wrapper ticket-details__sku-selection">
                <select
                  className="ticket-sku"
                  value={this.state.selectedSku}
                  onChange={event => this.setState({selectedSku: parseInt(event.target.value)})}
                >
                  {
                    this.SelectedTicket().ticketClass.skus.map((sku, index) =>
                      <option key={`ticket-sku-${index}`} value={index}>{ sku.label }</option>
                    )
                  }
                </select>
              </div>
              <div className="select-wrapper ticket-details__quantity-selection">
                <select
                  className="item-quantity"
                  value={this.state.quantity}
                  onChange={event => this.setState({quantity: parseInt(event.target.value)})}
                >
                  {
                    [...new Array(9).keys()].map(index =>
                      <option key={`quantity-option-${index}`} value={index + 1}>{ index + 1 }</option>
                    )
                  }
                </select>
              </div>
            </div>
          </div>

          { this.FeaturedMerchandise() }
          { this.Donations() }

          <EmailInput />

          <div className="ticket-details__actions">
            <button
              className="btn checkout-button"
              onClick={() => {
                this.props.cartStore.AddItem({
                  itemType: "tickets",
                  baseItemIndex: this.props.cartStore.ticketOverlayOptions.ticketClassIndex,
                  optionIndex: this.state.selectedSku,
                  quantity: this.state.quantity
                });

                this.props.cartStore.ToggleCheckoutOverlay(true);
                this.props.cartStore.ToggleTicketOverlay(false);
              }}
            >
              Check Out
            </button>
          </div>
        </div>
      </div>
    );
  }
}


export default TicketDetails;
