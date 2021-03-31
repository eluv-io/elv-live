import {inject, observer} from "mobx-react";
import React from "react";
import {FormatDateString} from "Utils/Misc";

@inject("cartStore")
@observer
class FeaturedTicket extends React.Component {
  constructor(props) {
    super(props);

    const selected = props.cartStore.featuredTickets[props.ticketClass.uuid];

    this.state = {
      selected: !!selected,
      selectedSku: selected ? selected.optionIndex : 0,
      quantity: selected ? selected.quantity : 1
    };

    this.Update = this.Update.bind(this);
  }

  Update() {
    if(this.state.selected) {
      this.props.cartStore.AddFeaturedItem({
        itemType: "tickets",
        uuid: this.props.ticketClass.uuid,
        optionIndex: this.state.selectedSku,
        quantity: this.state.quantity
      });
    } else {
      this.props.cartStore.RemoveFeaturedItem({
        itemType: "tickets",
        uuid: this.props.ticketClass.uuid
      });
    }
  }

  render() {
    const isExternal = this.props.ticketClass.skus.find(sku => sku.external_url);

    if(isExternal) { return null; }

    const ticketSku = this.props.ticketClass.skus[this.state.selectedSku];

    return (
      <div className="featured-ticket">
        <h2 className="featured-ticket-header">
          <input
            type="checkbox"
            checked={this.state.selected}
            onChange={event => this.setState({selected: event.target.checked}, this.Update)}
            className="featured-ticket-selection"
          />
          { this.props.ticketClass.name }
          <div className="featured-ticket-price">{ this.props.cartStore.FormatPriceString(ticketSku.price, true) }</div>
        </h2>
        <div className="featured-ticket-details">
          <div className="ticket-item-detail">{ ticketSku.label }</div>
          <div className="separator">·</div>
          <div className="ticket-item-detail">{ FormatDateString(ticketSku.start_time, true) }</div>
          <div className="separator">·</div>
          <div className="ticket-item-detail">{ FormatDateString(ticketSku.start_time, false, true) }</div>
        </div>
        <div className="featured-ticket-options">
          <div className="select-wrapper ticket-sku-wrapper">
            <select
              className="ticket-sku"
              value={this.state.selectedSku}
              onChange={event => this.setState({selectedSku: parseInt(event.target.value)}, this.Update)}
            >
              { this.props.ticketClass.skus.map((sku, index) =>
                <option key={`featured-ticket-sku-${index}`} value={index}>{ sku.label }</option>
              )}
            </select>
          </div>
          <div className="select-wrapper item-quantity-wrapper">
            <select
              className="item-quantity"
              value={this.state.quantity}
              onChange={event => this.setState({quantity: parseInt(event.target.value)}, this.Update)}
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
    );
  }
}

export default FeaturedTicket;
