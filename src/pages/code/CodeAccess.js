import React from "react";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import { parse } from "query-string";
import {Link} from "react-router-dom";
import {onEnterPressed, ValidEmail} from "Utils/Misc";

@inject("siteStore")
@inject("rootStore")
@observer
class CodeAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: "",
      code: "",
      email: "",
      receiveEmails: false,
      loading: false,
    };

    this.handleRedeemCode = this.handleRedeemCode.bind(this);
  }

  async componentDidMount() {
    try {
      const parsed = parse(decodeURIComponent(this.props.location.search));
      this.setState({code: parsed.passcode || ""});

      if(parsed.passcode && parsed.access) {
        this.handleRedeemCode(parsed.passcode);
      }

    } catch(e) {
      console.log(e);
    }
  }

  async handleRedeemCode() {
    try {
      this.setState({error: "", loading: true});

      let siteId;
      if(this.props.siteStore.currentSiteInfo.coupon_mode) {
        if(!ValidEmail(this.state.email)) {
          this.setState({error: "Invalid email address"});
          return;
        }

        siteId = await this.props.rootStore.RedeemCouponCode(this.state.code, this.state.email, this.state.receiveEmails);
      } else {
        siteId = await this.props.rootStore.RedeemCode(this.state.code);
      }

      if(!siteId) {
        throw Error("Invalid code");
      }

      this.setState({redeemed: true});
    } catch(error) {
      this.setState({error: "Invalid code"});
    } finally {
      this.setState({loading: false});
    }
  }

  Sponsors() {
    if(this.props.siteStore.sponsors.length === 0) { return; }

    return (
      <div className="code-entry-sponsors">
        <h3 className="code-entry-sponsors-header">Brought to You by</h3>
        <div className="code-entry-sponsors-list">
          { this.props.siteStore.sponsors.map(sponsor =>
            <a className="code-entry-sponsor-link" rel="noopener" href={sponsor.link}>
              <img
                src={sponsor.image_url}
                alt={sponsor.name}
              />
            </a>
          )}
        </div>
      </div>
    );
  }

  render() {
    if(!this.props.siteStore.client) { return null; }

    if(this.state.redeemed) {
      return <Redirect to={this.props.siteStore.SitePath("event")} />;
    }

    if(this.props.siteStore.currentSiteInfo.coupon_mode) {
      return (
        <div className="page-container code-entry-page-container">
          <div className="main-content-container code-entry code-entry-coupon">
            { this.state.error ? <div className="error-message"> {this.state.error} </div> : null }
            <div className="code-header">
              <h2 className="code-header-title">
                Redeem Coupon
              </h2>
              <p className="code-header-p">
                Please enter your coupon code and email address below to receive your redemption confirmation and exlusive news.
              </p>
            </div>

            <input
              className="code-entry-code-input"
              placeholder="Coupon Code"
              value={this.state.code}
              onChange={event => this.setState({code: event.target.value})}
              onKeyPress={onEnterPressed(() => this.handleRedeemCode())}
            />

            <input
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={event => this.setState({email: event.target.value})}
              onKeyPress={onEnterPressed(() => this.handleRedeemCode())}
            />

            <div className="code-entry-checkbox">
              <input
                name="receiveEmails"
                type="checkbox"
                checked={this.state.receiveEmails}
                onChange={event => this.setState({receiveEmails: event.target.checked})}
              />
              <label htmlFor="receiveEmails" className="code-entry-checkbox-label" onClick={() => this.setState({receiveEmails: !this.state.receiveEmails})}>
                Yes, sign me up! By checking this box, I agree to recieve latest updates, promotions and marketing emails from the event sponsor.
              </label>
            </div>

            <button onClick={() => this.handleRedeemCode()} title="Submit">
              {this.state.loading ?
                <div className="code-entry-spin-container">
                  <div className="la-ball-clip-rotate la-sm">
                    <div></div>
                  </div>
                </div>
                : "Redeem"
              }
            </button>

            { this.Sponsors() }
          </div>
        </div>
      );
    }

    return (
      <div className="page-container code-entry-page-container">
        <div className="main-content-container code-entry">
          { this.state.error ? <div className="error-message"> {this.state.error} </div> : null }
          <div className="code-header">
            <h2 className="code-header-title">
              Redeem Ticket
            </h2>
            <Link to={this.props.siteStore.baseSitePath} className="code-header-p">
              Don't have a ticket yet? <b className="code-header-bold"> Purchase here.</b>
            </Link>
          </div>

          <input
            className="code-entry-code-input"
            placeholder="Ticket Code"
            value={this.state.code}
            onChange={event => this.setState({code: event.target.value})}
            onKeyPress={onEnterPressed(() => this.handleRedeemCode())}
          />

          <button onClick={() => this.handleRedeemCode()} title="Submit">
            {this.state.loading ?
              <div className="code-entry-spin-container">
                <div className="la-ball-clip-rotate la-sm">
                  <div></div>
                </div>
              </div>
              :
              "Enter Event"
            }
          </button>
        </div>
      </div>
    );
  }
}

export default CodeAccess;
