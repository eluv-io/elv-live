import React, {Component} from "react";
import StripeCheckout from "react-stripe-checkout";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class SubscriptionPayment extends Component {
  navButton() {
    return (
      <button className="navigation__container__subscribe btnSubscribe">
        START YOUR SUBSCRIPTION 
      </button>
    );
  }

  normalButton() {
    return (
      <button className={ this.props.isFeature ? "btnPlay btnPlay__feature" : "btnPlay"}>
        Subscribe Now
      </button>
    );
  }

  render() {
    // let price = parseFloat(this.props.siteStore.premiere.price) * 100;
    // let description = "$" + this.props.siteStore.premiere.price + " to watch the premiere"; 
    let price = 999;
    let description = "$9.99/month"; 
  
    if (this.props.siteStore.boughtSubscription) {
      return null;
    }

    return (
      <StripeCheckout
        name = "Start Your Subscription"
        description = {description} 
        amount = {price}
        token = {() => this.props.siteStore.buySubscription()}
        stripeKey={"pk_test_51Gy1tWKgR5J3zPrLdO0DgqBKqES5Kmfe7qlKYspFxoiZbGizeQIqh8uXfYqa45wIZGfChMn2R3tLhEwonIsWZHok00k4BiqN3N"}
      >
        { this.props.isNav ? this.navButton() : this.normalButton()}

      </StripeCheckout>
    );
  }
}

export default SubscriptionPayment;