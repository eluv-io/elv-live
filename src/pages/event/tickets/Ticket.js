import React from "react";
import {inject, observer} from "mobx-react";

import { FaRegCalendarAlt } from "react-icons/fa";
import { IconContext } from "react-icons";
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
      selectedOffering: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({value}) {
    this.setState({selectedOffering: value});
  }

  TicketClass() {
    return this.props.siteStore.ticketClasses[this.props.ticketClassIndex];
  }

  TicketOptions() {
    return this.TicketClass().skus.map((ticketSku, index) => ({
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
    return (
      <React.Fragment>
        <div className="ticket-event">
          <div className="ticket-image">
            <img src={this.TicketClass().image_url} className="ticket-image-img"/>
          </div>
          <div className="ticket-detail">
            {
              // this.TicketTags()
            }
            <div className="ticket-top">

              <h3 className="ticket-top-title">
                { this.TicketClass().name }
                <div className="ticket-title-price mobile-only">{ this.props.cartStore.FormatPriceString(this.TicketClass().skus[this.state.selectedOffering].price, true) }</div>
              </h3>
              <p className="ticket-top-description">
                { this.TicketClass().description }
              </p>

            </div>
            <div className="ticket-bottom">
              <div className="ticket-bottom-dropdown-container">
                <Select
                  className='react-select-container'
                  classNamePrefix="react-select"
                  value={this.TicketOptions()[this.state.selectedOffering]}
                  onChange={({value}) => this.setState({selectedOffering: parseInt(value)})}
                  options={this.TicketOptions()}
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
                { this.props.cartStore.FormatPriceString(this.TicketClass().skus[this.state.selectedOffering].price, true) }
              </div>
              <button
                className="ticket-bottom-button"
                role="link"
                onClick={() => this.props.cartStore.ToggleTicketOverlay(
                  true,
                  {
                    ticketClassIndex: this.props.ticketClassIndex,
                    selectedSku: this.state.selectedOffering
                  }
                )}
              >
                Buy
              </button>
            </div>
          </div>
        </div>

        {
          this.props.cartStore.showTicketOverlay &&
          this.props.ticketClassIndex === this.props.cartStore.ticketOverlayOptions.ticketClassIndex ?
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
