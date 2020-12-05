import React from "react";
import { Link } from "react-router-dom";
import {ImageIcon} from "elv-components-js";
import {inject, observer} from "mobx-react";
import { parse } from 'query-string';
import Logo from "../../../static/images/Logo.png";
import axios from "axios";
import AsyncComponent from "../../support/AsyncComponent";

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
                  <div className="live-nav">
                    <ImageIcon className="live-nav--logo" icon={Logo} label="Eluvio" />
                  </div>
          
                  <div className="success-root">
                    <div className="summary">
                      <div className="payment-overview">
                        <h1 className="payment-overview-title">Thanks for your order!</h1>
                        <h2 className="payment-overview-p">We've received your order and are proccessing your payment! Your digital ticket will be sent to <b className="boldText">{this.state.data.customerEmail}</b> shortly. </h2>
                      </div>

                      <div className="back-btn-container">
                        <Link to="/rita-ora/d457a576" className="eventBTN">Back to Event</Link>
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
