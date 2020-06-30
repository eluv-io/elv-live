import React, {Component} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class Payments extends Component {

  render() {
    return (
      <StripeCheckout
        name = "Movie Premiere"
        description= "$9.99 to watch the premiere" 
        amount={999}
        token={() => this.props.siteStore.buyPremiere()}
        stripeKey={"pk_test_51Gy1tWKgR5J3zPrLdO0DgqBKqES5Kmfe7qlKYspFxoiZbGizeQIqh8uXfYqa45wIZGfChMn2R3tLhEwonIsWZHok00k4BiqN3N"}
      >
        <button className="btnPlay">
          Buy from $9.99
        </button>
      </StripeCheckout>
    );
  }
}

export default Payments;
