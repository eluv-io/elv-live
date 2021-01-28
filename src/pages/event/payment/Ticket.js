import React from "react";
import {inject, observer} from "mobx-react";

import { FaRegCalendarAlt } from "react-icons/fa";
import { IconContext } from "react-icons";
import Select from "react-select";

const SingleValue = ({
  cx,
  getStyles,
  selectProps,
  data,
  isDisabled,
  className,
  ...props
}) => {
  return (

    <div className="ticket-bottom-info">
      <div className="ticket-bottom-location">{selectProps.getOptionLabel(data)}</div>

      <IconContext.Provider value={{ className: "ticket-icon" }}>
        <div className="ticket-bottom-date">
          <FaRegCalendarAlt />
          {data.date}
        </div>
      </IconContext.Provider>

      <div className="ticket-bottom-price">{(data.price)}</div>
    </div>
  );
};

@inject("rootStore")
@inject("siteStore")
@observer
class Ticket extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedOffering: "",
      options: []
    };

    this.handleChange = this.handleChange.bind(this);

  }
  componentDidMount() {
    let {date, price} = this.props;

    let options = [
      { label: "North America", value: "North America", price: `$${price/100} USD`, date: date },
      { label: "Europe", value: "Europe", price: "€25 EUR", date:"March 15th, 2021 · 8:00 PM GMT"  },
      { label: "Asia", value: "Asia", price: "¥3000 YEN", date: "March 15th, 2021 · 8:00 PM JST" },
    ];
    this.setState({selectedOffering: options[0]});
    this.setState({options: options});
  }

  handleChange(value) {
    this.setState({selectedOffering: value});
  }


  render() {
    let {name, description, price, priceId, prodId, poster, otpId} = this.props;


    return (
      <div className="ticket-event" id={name} ref={this.props.refProp} >
        <div className="ticket-image">
          <img src={poster} className="ticket-image-img"/>
        </div>
        <div className="ticket-detail">
          <div className="ticket-top">
            <div className="ticket-top-labels">
              <span className="ticket-label-loc">
                Global
              </span>
              <span className="ticket-label-available">
                LIMITED TICKETS AVAILABLE
              </span>

            </div>
            <h3 className="ticket-top-title">
              {name}
            </h3>
            <p className="ticket-top-description">
              {description}
            </p>

          </div>
          <div className="ticket-bottom">
            <div className="ticket-bottom-dropdown-container">
              <Select
                className='react-select-container'
                classNamePrefix="react-select"
                value={this.state.selectedOffering}
                onChange={this.handleChange}
                options={this.state.options}
                components={{ SingleValue }}
                styles={{
                  singleValue: (provided, state) => ({
                    ...provided
                  })
                }}
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
                name,
                description,
                price,
                priceId,
                prodId,
                otpId,
                offering: this.state.selectedOffering
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
