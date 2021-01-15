import React from "react";
import {inject, observer} from "mobx-react";
import Ticket from "Event/payment/Ticket";
import { FaDesktop, FaYoutube, FaInstagram,FaTwitter,FaFacebookSquare,FaSoundcloud, FaApple, FaSpotify} from "react-icons/fa";
import { IconContext } from "react-icons";

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
      artistInfo: this.props.siteStore.eventSites[this.props.name]["artist_info"][0],

    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    let eventPoster = await this.props.siteStore.client.LinkUrl({...this.props.siteStore.siteParams, linkPath: `public/sites/${this.props.name}/images/event_poster/default`});
    this.setState({eventPoster: eventPoster});
  }

  render() {
    let {eventInfo, eventPoster, products, artistInfo } = this.state;
    let testMode = this.props.siteStore.stripeTestMode;

    return (
      <div className={"overview-container"}>
        {/* <div className="overview-container__eventInfo">
          <div className="overview-container__info">
            <div className="overview-container__info__title">
              <div>{eventInfo["event_header"]}</div>
              <div className="overview-container__info__title__desc">{eventInfo["location"]}</div>
            </div>
            <div className="overview-container__info__synopsis" >
              {eventInfo["description"]}          
            </div>
          </div>

          <div className="overview-container__photoGroup">
            <img
              src={eventPoster}
              className= "overview-container__photoGroup__singlePhoto"
            />     
          </div>
        </div> */}
        <div className="overview-social-box">
        <a
              href={artistInfo["social_media_links"][0]["spotify"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider
                value={{ className: "social-icon",
                color: "black",

                color: "#1DB954" 
              }}
              >
                <div>
                  <FaSpotify />
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social_media_links"][0]["soundcloud"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider
                value={{ className: "social-icon", 
                color: "black",

                color: "#ff7700" 
              }}
              >
                <div>
                  <FaSoundcloud />
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social_media_links"][0]["applemusic"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider
                value={{ className: "social-icon social-icon-apple" }}
              >
                <div>
                  <FaApple />
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social_media_links"][0]["youtube"]}
              target="_blank"
              className="info-social-link__first"
            >
              <IconContext.Provider
                value={{
                  className: "social-icon social-icon-yt",
                  color: " #c4302b",
                  // color: "black",

                }}
              >
                <div>
                  <FaYoutube />
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social_media_links"][0]["instagram"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider
                value={{
                  className: "social-icon social-icon-insta",
                  color: " #c4302b",             
                      //  color: "black",

                }}
              >
                <div>
                  <FaInstagram />
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social_media_links"][0]["twitter"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider
                value={{ className: "social-icon",
                // color: "black",
                color: "#1DA1F2"
               }}
              >
                <div>
                  <FaTwitter />
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social_media_links"][0]["facebook"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider
                value={{ className: "social-icon", 
                // color: "black",

                color: "#4267B2" 
              }}
              >
                <div>
                  <FaFacebookSquare />
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social_media_links"][0]["website"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider value={{ className: "social-icon" }}>
                <div>
                  <FaDesktop />
                </div>
              </IconContext.Provider>
            </a>

          

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