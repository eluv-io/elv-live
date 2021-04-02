import React from "react";
import {inject, observer} from "mobx-react";
import Select from "react-select";
import {FormatDateString} from "Utils/Misc";
import TicketDetails from "Event/tickets/TicketDetails";
import Modal from "Common/Modal";

@inject("rootStore")
@inject("siteStore")
@inject("cartStore")
@observer
class Ticket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSku: 0,
      quantity: 1
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({value}) {
    this.setState({selectedSku: value});
  }

  TicketOptions() {
    const ticketClass = this.props.siteStore.TicketClassItem(this.props.ticketClassUUID);
    return ticketClass.skus.map((ticketSku, index) => ({
      label: (
        <div className={`ticket-option ${ticketSku.external_url ? "ticket-option-external" : ""}`}>
          { ticketSku.external_url ? null : <div className="ticket-option-detail no-mobile">{this.props.cartStore.FormatPriceString(ticketSku.price, true)}</div> }
          <div className="ticket-option-detail">{ ticketSku.label }</div>
          <div className="ticket-option-detail">{ FormatDateString(ticketSku.start_time)}</div>
        </div>
      ),
      value: index
    }));
  }

  Controls(ticketClass, ticketSku) {
    const released = !ticketClass.release_date || Date.now() > ticketClass.release_date;

    if(ticketSku.external_url) {
      return released ?
        <a href={ticketSku.external_url} target="_blank" className="ticket-bottom-button">Buy</a> :
        <a className="ticket-bottom-button unreleased">Available {FormatDateString(ticketClass.release_date, false, false, true)}</a>;
    }

    return (
      <>
        <Select
          className='ticket-quantity'
          classNamePrefix="react-select"
          value={{label: this.state.quantity, value: this.state.quantity}}
          onChange={({value}) => this.setState({quantity: parseInt(value)})}
          options={[...new Array(9).keys()].map(i => ({label: i+1, value: i+1}))}
          inputProps={{readOnly:true}}
          isSearchable={false}
          theme={theme => ({
            ...theme,
            borderRadius: 5,
            colors: {
              ...theme.colors,
              primary25: "rgba(230, 212, 165,.4)",
              primary: "#cfb46b",
            },
          })}
        />
        {
          !released ?
            <a className="ticket-bottom-button unreleased">Available {FormatDateString(ticketClass.release_date, false, false, true)}</a> :
            <button
              className="ticket-bottom-button"
              role="link"
              onClick={() => {
                this.props.cartStore.AddItem({
                  itemType: "tickets",
                  uuid: ticketSku.uuid,
                  quantity: this.state.quantity
                });

                this.props.cartStore.ToggleCartOverlay(true, `${this.state.quantity} ${this.state.quantity > 1 ? "items" : "item"} added to your cart`);
              }}
            >
              Add to Cart
            </button>
        }
      </>
    );
  }

  render() {
    const ticketClass = this.props.siteStore.TicketClassItem(this.props.ticketClassUUID);
    const ticketSku = ticketClass.skus[this.state.selectedSku];

    return (
      <React.Fragment>
        <div className="ticket-event">
          <div className="ticket-image">
            <img src={ticketClass.image_url} className="ticket-image-img"/>
          </div>
          <div className="ticket-detail">
            <div className="ticket-top">

              <h3 className="ticket-top-title">
                { ticketClass.name }
                <div className="ticket-title-price mobile-only">{ this.props.cartStore.FormatPriceString(ticketSku.price, true, ticketSku) }</div>
              </h3>
              <p className="ticket-top-description">
                { ticketClass.description }
              </p>

            </div>
            <div className="ticket-bottom">
              <div className="ticket-bottom-dropdown-container">
                <Select
                  className='react-select-container'
                  classNamePrefix="react-select"
                  value={this.TicketOptions()[this.state.selectedSku]}
                  onChange={({value}) => this.setState({selectedSku: parseInt(value)})}
                  options={this.TicketOptions()}
                  inputProps={{readOnly:true}}
                  isSearchable={false}
                  theme={theme => ({
                    ...theme,
                    borderRadius: 5,
                    colors: {
                      ...theme.colors,
                      primary25: "rgba(230, 212, 165,.4)",
                      primary: "#cfb46b",
                    },
                  })}
                />
              </div>
              { this.Controls(ticketClass, ticketSku) }
            </div>
          </div>
        </div>
        {
          this.props.cartStore.showTicketOverlay &&
          this.props.ticketClassUUID === this.props.cartStore.ticketOverlayOptions.ticketClassUUID ?
            <Modal
              Toggle={this.props.cartStore.ToggleTicketOverlay}
              content={<TicketDetails />}
            /> : null
        }

      </React.Fragment>
    );
  }
}

export default Ticket;
