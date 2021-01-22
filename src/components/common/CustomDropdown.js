import React, { Component } from "react";
import Select, { components } from "react-select";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IconContext } from "react-icons";


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

export default class CustomDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.options[0],
    };

    this.handleChange = this.handleChange.bind(this);

  }
  handleChange(value) {
    this.setState({selected: value});
  }

  render() {
    return (
      <Select
        className='react-select-container'  
        classNamePrefix="react-select"
        value={this.state.selected} 
        onChange={this.handleChange}
        options={this.props.options}
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
    );
  }
}
