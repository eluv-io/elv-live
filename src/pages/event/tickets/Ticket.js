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
      selectedSku: 0
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
        <div className="ticket-option">
          <div className="ticket-item-detail">{ ticketSku.label }</div>
          <div className="ticket-item-detail no-mobile">{ FormatDateString(ticketSku.start_time, true) }</div>
          <div className="ticket-item-detail no-mobile">{ FormatDateString(ticketSku.start_time, false, true) }</div>
        </div>
      ),
      value: index
    }));
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
            {
              // this.TicketTags()
            }
            <div className="ticket-top">

              <h3 className="ticket-top-title">
                { ticketClass.name }
                <div className="ticket-title-price mobile-only">{ this.props.cartStore.FormatPriceString(ticketSku.price, true) }</div>
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
                    borderRadius: 10,
                    colors: {
                      ...theme.colors,
                      primary25: "rgba(230, 212, 165,.4)",
                      primary: "#cfb46b",
                    },
                  })}
                />
              </div>
              <div className="ticket-price no-mobile">
                { this.props.cartStore.FormatPriceString(ticketSku.price, true) }
              </div>

              {
                ticketSku.external_url ?
                  <a href={ticketSku.external_url} target="_blank" className="ticket-bottom-button">Buy</a> :
                  <button
                    className="ticket-bottom-button"
                    role="link"
                    onClick={() => this.props.cartStore.ToggleTicketOverlay(
                      true,
                      {
                        ticketClassUUID: this.props.ticketClassUUID,
                        ticketSkuUUID: ticketSku.uuid
                      }
                    )}
                  >
                    Buy
                  </button>
              }
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
