import React from "react";
import {inject, observer} from "mobx-react";
// import { Link } from "react-router-dom";
// import {ImageIcon} from "elv-components-js";
// import axios from "axios";
// import AsyncComponent from "../../support/AsyncComponent";

@inject("rootStore")
@inject("siteStore")
@observer
class PaymentOverview extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      sessionId: ""
    };
  }

  render() {

    
    return (
      <div className="payment-container">

      </div>
    );
  }
}


export default PaymentOverview;
