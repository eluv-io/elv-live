import React, {Component} from "react";
import StripeCheckout from "react-stripe-checkout";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class Payments extends Component {

  render() {
    let price = parseFloat(this.props.siteStore.premiere.price) * 100;
    let description = "$" + this.props.siteStore.premiere.price + " to watch the premiere"; 

    return (
      <StripeCheckout
        name = "Movie Premiere"
        description = {description} 
        amount = {price}
        token = {() => this.props.siteStore.buyPremiere()}
        stripeKey={"pk_test_51Gy1tWKgR5J3zPrLdO0DgqBKqES5Kmfe7qlKYspFxoiZbGizeQIqh8uXfYqa45wIZGfChMn2R3tLhEwonIsWZHok00k4BiqN3N"}
      >
        <button className="btnPlay">
          Buy from ${this.props.siteStore.premiere.price}
        </button>
      </StripeCheckout>
    );
  }
}

export default Payments;
