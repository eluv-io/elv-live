import React from "react";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import { parse } from "query-string";
import {Link} from "react-router-dom";
import Navigation from "Layout/Navigation";
import {EluvioConfiguration} from "EluvioConfiguration";
import {onEnterPressed} from "Utils/Misc";

@inject("siteStore")
@inject("rootStore")
@observer
class CodeAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      loading: false,
      code_placeholder: "Ticket Code",
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleRedeemCode = this.handleRedeemCode.bind(this);
  }

  async componentDidMount() {
    try {
      const parsed = parse(decodeURIComponent(this.props.location.search));
      this.setState({code: parsed.passcode});

      if(parsed.passcode && parsed.access) {
        this.handleRedeemCode(parsed.passcode);
      }

    } catch (e) {
      console.log(e);
    }
  }

  handleRedeemCode = async (code) => {
    this.setState({loading: true});

    let generalId = await this.props.rootStore.RedeemCode(code, EluvioConfiguration["ga-ntpId"], EluvioConfiguration["tenantId"]);
    let vipId = await this.props.rootStore.RedeemCode(code, EluvioConfiguration["ga-ntpId"], EluvioConfiguration["tenantId"]);

    let siteId = generalId || vipId;

    if(siteId) {
      this.setState({siteId});
    } else {
      this.setState({loading: false});
      this.props.rootStore.SetError("Invalid Code");
    }
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handleCodeChange(event) {
    this.setState({code: event.target.value});
  }

  render() {
    if(!this.props.siteStore.client) { return null; }

    if(this.state.siteId) {
      return <Redirect to={`${this.props.siteStore.basePath}/${this.props.siteStore.siteSlug}/stream`} />;
    }

    return (
      <div className="code-entry-background">
        <Navigation />

        <div className="code-entry">
          { this.props.rootStore.error ? <div className="error-message"> {this.props.rootStore.error} </div> : null }
          <div className="code-header">
            <h2 className="code-header-title">
              Redeem Ticket
            </h2>
            <Link to={`${this.props.siteStore.basePath}/${this.props.siteStore.siteSlug}`} className="code-header-p">
              Don't have a ticket yet? <b className="code-header-bold"> Purchase here.</b>
            </Link>
          </div>

          <input
            onFocus={() => this.setState({code_placeholder: ""})}
            onBlur={() => this.setState({code_placeholder: "Ticket Code"})}
            placeholder={this.state.code_placeholder}
            value={this.state.code}
            onChange={this.handleCodeChange}
            onKeyPress={onEnterPressed(() => this.handleRedeemCode(this.state.code))}
          />

          <button onClick={() => this.handleRedeemCode(this.state.code)} title="Submit">
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
