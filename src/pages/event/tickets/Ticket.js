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
      selectedOffering: 0,
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
    return this.TicketClass().skus.map(({label, price, start_time}, index) => ({
      label: (
        <div className="space-between">
          <div className="ticket-bottom-location">{ label }</div>
          <IconContext.Provider value={{ className: "ticket-icon" }}>
            <div className="ticket-bottom-date">
              <FaRegCalendarAlt />
              { FormatDateString(start_time) }
            </div>
          </IconContext.Provider>
          <div className="ticket-bottom-price">{ this.props.cartStore.FormatPriceString(price) }</div>
        </div>
      ),
      value: index,
      price,
      date: start_time
    }));
  }

  render() {
    // TODO: Make select same height/border radius as purchase button

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
                  onChange={this.handleChange}
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
                Purchase
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
