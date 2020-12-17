import React from "react";
import { Link } from "react-router-dom";
import {ImageIcon} from "elv-components-js";
import {inject, observer} from "mobx-react";
import Logo from "../../../static/images/Logo.png";
import axios from "axios";
import AsyncComponent from "../../support/AsyncComponent";
import Navigation from "../../home/Navigation";
import AddToCalendar from 'react-add-to-calendar';

@inject("rootStore")
@inject("siteStore")
@observer
class Success extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      sessionId: ""
    };
  }

  render() {
    if (!this.props.match.params.id) {
      return null;
    }

    let calendarEvent = {
      title: 'Rita Ora - Live From The Eiffel Tower',
      description: 'Rita Ora will be making history on February 28th with a global live stream from the legendary Paris landmark, the Eiffel Tower, to celebrate the release of her third studio album: RO3.',
      location: 'Paris, France (Virtual)',
      startTime: '2021-02-28T20:15:00-04:00',
      endTime: '2021-02-28T21:45:00-04:00'
  };
    
    return (
        <AsyncComponent
            Load={async () => {
              const sessionId = this.props.match.params.id;
              const response = await axios.get(
                `https://rocky-peak-15236.herokuapp.com/stripe-retrieve-session/${sessionId}`
              );
              this.setState({data: response.data});
            }}
            render={() => {
              let price = "$" + parseFloat(this.state.data.productPrice)/100;

              return (
                <div className="success-container">
                  <Navigation/>
          
                  <div className="success-root">
                    <div className="summary">
                      <div className="payment-overview">
                        <h1 className="payment-overview-title">Thanks for your order!</h1>
                        <h2 className="payment-overview-p">We've received your order and are proccessing your payment! Your digital ticket will be sent to <b className="boldText">{this.state.data.customerEmail}</b> shortly. </h2>
                      </div>

                      <div className="header">
                        <h1>Order Summary</h1>
                        <div className="line-item confirm">
                          <p className="confirm-label">Confirmation #</p>
                          <p className="confirm-price">{this.state.data.confirmationNum}</p>
                        </div>
                      </div>
                      <div className="order-items">
                        <div className="line-item">
                          <img className="line-image" src={this.state.data.productImage}/>
                          <div className="line-label"> 
                            <p className="product">{this.state.data.productName} </p> 
                            <p className="sku">{this.state.data.productDescription} </p> 
                          </div>
                          <p className="price"> {this.state.data.prodQty} x {price} </p> 
                        </div>
                      </div>
                      <div className="order-total">

                        <div className="line-item total">
                          <p className="total-label">Total</p>
                          <p className="total-price">{price} </p>
                        </div>
                      </div>

                      <div className="back-btn-container">
                        {/* <Link to="/d457a576/rita-ora" className="eventBTN">Back to Event</Link> */}
                        <AddToCalendar event={calendarEvent}/>
                      </div>

                    </div>
                  </div>
                </div>
              );
              }
            }
            
          />
    );
  }
}


export default Success;
