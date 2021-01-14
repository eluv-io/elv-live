import React from "react";
import {inject, observer} from "mobx-react";
import Ticket from "Event/payment/Ticket";

@inject("rootStore")
@inject("siteStore")
@observer
class ConcertOverview extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      eventPoster: undefined,
      eventInfo: this.props.siteStore.eventSites[this.props.name]["event_info"][0],
      products: this.props.siteStore.eventSites[this.props.name]["products"],
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    let eventPoster = await this.props.siteStore.client.LinkUrl({...this.props.siteStore.siteParams, linkPath: `public/sites/${this.props.name}/images/event_poster/default`});
    this.setState({eventPoster: eventPoster});
  }

  render() {
    let {eventInfo, eventPoster, products } = this.state;
    let testMode = this.props.siteStore.stripeTestMode;

    return (
      <div className={"overview-container"}>
        <div className="overview-container__eventInfo">
          <div className="overview-container__info">
            <div className="overview-container__info__title">
              <div>{eventInfo["event_header"]}</div>
              <div className="overview-container__info__title__desc">{eventInfo["location"]}</div>
            </div>
            {/* {eventInfo["description"].map((description, index) => */}
            <div className="overview-container__info__synopsis" >
              {eventInfo["description"]}          
            </div>
            {/* // )} */}
          </div>

          <div className="overview-container__photoGroup">
            <img
              src={eventPoster}
              className= "overview-container__photoGroup__singlePhoto"
            />     
          </div>
        </div>
        
        <div className="ticket-group">
          {products.map((obj, index) => (
            <Ticket
              name={obj["name"]}
              description={obj["description"]}
              price={obj["price"][0]["amount"]}
              priceID={testMode ? obj["payment_ids"][0]["stripe_test"][0]["price_id"]: obj["payment_ids"][0]["stripe"][0]["price_id"]}
              prodID = {testMode ? obj["payment_ids"][0]["stripe_test"][0]["prod_id"]: obj["payment_ids"][0]["stripe"][0]["prod_id"]}
              date ={eventInfo["date"]}
              poster={eventPoster}
              key={index}
              otpID={obj["otp_id"]}
              refProp={index == 1 ? this.props.refProp: null}
            />
          ))}

        </div>
      </div>
    );
  }
}

export default ConcertOverview;