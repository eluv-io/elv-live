import React from "react";
import {inject, observer} from "mobx-react";

import Timer from "Common/Timer";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IconContext } from "react-icons";
import Select from "react-select";


const offerings = [
  {
    value: "AF",
    label: "Afghanistan"
  },
  {
    value: "AX",
    label: "Åland Islands"
  },
  {
    value: "AL",
    label: "Albania"
  }   
];

@inject("rootStore")
@inject("siteStore")
@observer
class Ticket extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedOffering: offerings[0],
    };

    this.handleOfferingChange = this.handleOfferingChange.bind(this);

  }
  
  handleOfferingChange(value) {
    this.setState({selectedOffering: value});
  }


  render() {
    let {name, description, price, priceID, prodID, date, poster, otpID} = this.props;

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
           {/* <div className="ticket-bottom-info"> */}
                {/* <Select 
                  className='react-select-container' 
                  classNamePrefix="react-select" 
                  options={offerings} 
                  value={this.state.selectedOffering} 
                  onChange={this.handleOfferingChange}
                  theme={theme => ({
                    ...theme,
                    borderRadius: 15,
                    width: 600,
                    colors: {
                      ...theme.colors,
                      primary25: "rgba(230, 212, 165,.4)",
                      primary: "#cfb46b",
                    },
                    valueContainer: base => ({
                      ...base,
                      background: "#F2EEEA",
                      color: 'black',
                      width: '100%',
                    }),
                  })}
                /> */}
            {/* </div> */}
            <div className="ticket-bottom-info">
            <div className="ticket-bottom-location">
                {`North America`}
              </div>


              <IconContext.Provider value={{ className: "ticket-icon" }}>
                <div className="ticket-bottom-date">
                  <FaRegCalendarAlt />
                  <span className="ticket-bottom-date">
                    {date}
                  </span>
                </div>
              </IconContext.Provider>
              
              <div className="ticket-bottom-icon">
                {"."}
              </div>

            </div>
            <div className="ticket-bottom-price">
                {`$${price / 100} USD`}
              </div>
            <button className="ticket-bottom-button" role="link" onClick={() => this.props.siteStore.turnOnModal( name, description, price, priceID, prodID, otpID)}>
              Buy Ticket
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Ticket;