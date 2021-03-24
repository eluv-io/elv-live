import React from "react";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import { parse } from "query-string";
import {Link} from "react-router-dom";
import {onEnterPressed} from "Utils/Misc";

@inject("siteStore")
@inject("rootStore")
@observer
class CodeAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: "",
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
      this.setState({code: parsed.passcode || ""});

      if(parsed.passcode && parsed.access) {
        this.handleRedeemCode(parsed.passcode);
      }

    } catch(e) {
      console.log(e);
    }
  }

  async handleRedeemCode(code) {
    try {
      this.setState({error: "", loading: true});

      const siteId = await this.props.rootStore.RedeemCode(code);

      if(!siteId) {
        throw Error("Invalid code");
      }
    } catch(error) {
      this.setState({error: "Invalid code"});
    } finally {
      this.setState({loading: false});
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

    if(this.props.rootStore.streamAccess) {
      return <Redirect to={this.props.siteStore.SitePath("stream")} />;
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
