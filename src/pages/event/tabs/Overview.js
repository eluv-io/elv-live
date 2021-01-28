import React from "react";
import {inject, observer} from "mobx-react";
import Ticket from "Event/payment/Ticket";
import SocialMediaBar from "Event/tabs/SocialMediaBar";


@inject("rootStore")
@inject("siteStore")
@observer
class ConcertOverview extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      eventInfo: this.props.siteStore.currentSite["event_info"][0],
      products: this.props.siteStore.currentSite["products"],
    };
  }

  render() {
    let {eventInfo, products } = this.state;
    let testMode = this.props.siteStore.stripeTestMode;

    return (
      <div className={"overview-container"}>
        <SocialMediaBar />

        <div className="ticket-group">
          {products.map((obj, index) => (
            <Ticket
              name={obj["name"]}
              description={obj["description"]}
              price={obj["price"][0]["amount"]}
              priceId={testMode ? obj["payment_ids"][0]["stripe_test"][0]["price_id"]: obj["payment_ids"][0]["stripe"][0]["price_id"]}
              prodId={testMode ? obj["payment_ids"][0]["stripe_test"][0]["prod_id"]: obj["payment_ids"][0]["stripe"][0]["prod_id"]}
              date={eventInfo["date"]}
              poster={this.props.siteStore.eventPoster}
              key={index}
              otpId={obj["otp_id"]}
              refProp={index === 1 ? this.props.refProp: null}
            />
          ))}

        </div>
      </div>
    );
  }
}

export default ConcertOverview;
