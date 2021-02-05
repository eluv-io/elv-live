import React from "react";
import {inject, observer} from "mobx-react";

import { FaRegCalendarAlt } from "react-icons/fa";
import { IconContext } from "react-icons";
import Select from "react-select";
import {FormatDateString, FormatPriceString} from "Utils/Misc";

@inject("rootStore")
@inject("siteStore")
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

  TicketOptions() {
    return this.props.ticketClass.skus.map(({label, price, start_time}, index) => ({
      label: (
        <div className="space-between">
          <div>{ label }</div>
          <IconContext.Provider value={{ className: "ticket-icon" }}>
            <div className="ticket-bottom-date">
              <FaRegCalendarAlt />
              { FormatDateString(start_time) }
            </div>
          </IconContext.Provider>
          <div>{ FormatPriceString(price) }</div>
        </div>
      ),
      value: index,
      price,
      date: start_time
    }));
  }

  TicketTags() {
    return (
      <div className="ticket-top-labels">
        {
          (this.props.ticketClass.tags || []).map((tag, index) =>
            <span className="ticket-label" key={`ticket-tag-${index}`}>
              { tag}
            </span>
          )
        }
      </div>
    );
  }

  render() {
    return (
      <div className="ticket-event">
        <div className="ticket-image">
          <img src={this.props.ticketClass.image_url} className="ticket-image-img"/>
        </div>
        <div className="ticket-detail">
          { this.TicketTags() }
          <div className="ticket-top">

            <h3 className="ticket-top-title">
              { this.props.ticketClass.name }
            </h3>
            <p className="ticket-top-description">
              { this.props.ticketClass.description }
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
              onClick={() => this.props.siteStore.ShowCheckoutModal({
                ticketClass: this.props.ticketClass,
                sku: this.state.selectedOffering
              })}
            >
              Purchase
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Ticket;
