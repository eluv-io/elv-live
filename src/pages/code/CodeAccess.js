import React from "react";
import {inject, observer} from "mobx-react";
import {LoadingElement, onEnterPressed} from "elv-components-js";
import {Redirect} from "react-router";
import { parse } from "query-string";
import {Link} from "react-router-dom";

import Navigation from "Layout/Navigation";

@inject("siteStore")
@inject("rootStore")
@observer
class CodeAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      loading: false,
      access: false,
      code_placeholder: "Ticket Code",
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleEmailEvent = this.handleEmailEvent.bind(this);

  }

  async handleEmailEvent(passcode, access) {
    console.log(passcode, access);
    this.setState({code: passcode});

    if(access == "true") {
      this.setState({loading: true});
      const siteId = await this.props.rootStore.RedeemCode(
        passcode
      );
  
      if(siteId) {
        // let loadStreamResult = await this.props.siteStore.LoadStreamObject(siteId);
        // console.log(loadStreamResult);
        this.setState({siteId});
      } else {
        this.setState({loading: false});
      }    
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
      return <Redirect to={`${this.props.siteStore.basePath}/stream/${this.state.siteId}`} />;
    }

    const Submit = async () => {
      this.setState({loading: true});

      const siteId = await this.props.rootStore.RedeemCode(
        this.state.code
      );

      if(siteId) {
        this.setState({siteId});
      } else {
        this.setState({loading: false});
      }
    };

    const divStyle = {
      backgroundSize: "cover",
      background: "#E0DDD4",
      // backgroundImage: `linear-gradient(160deg, #0610a1 8%, #4553ff 30%, #07c2e7 50%, #05d5ff 70%, #d694c6 92%)`,
      height: "100vh",
      maxHeight: "100vh",
      minHeight: "100vh -webkit-fill-available",
      width: "100vw",
      backgroundPosition: "center",
      display: "flex"
    };

    try {
      // http://localhost:8086/d457a576/code?passcode%3D6rBhjy%26access%3Dtrue
      const parsed = parse(decodeURIComponent(this.props.location.search));

      if (parsed.passcode && parsed.access) {
        this.handleEmailEvent(parsed.passcode, parsed.access);
      }

    }catch(e) {
      console.log(e);
    }


    return (
      <div style={divStyle}>
        <Navigation />

        <div className = "code-entry">
          { this.props.rootStore.error ? <div className="error-message">{ this.props.rootStore.error }</div> : null }
          <div className="code-header">
            <h2 className="code-header-title">
              Redeem Ticket
            </h2>
            <Link to={`${this.props.siteStore.basePath}/${this.props.siteStore.eventSlug}`} className="code-header-p">
             Don't have a ticket yet? 
              <b className="code-header-bold"> Purchase here.</b>
            </Link>
          </div>
            <input
              onFocus={() => this.setState({code_placeholder: ""})}
              onBlur={() => this.setState({code_placeholder: "Ticket Code"})}
              placeholder={this.state.code_placeholder}
              value={this.state.code}
              onChange={this.handleCodeChange} 
              onKeyPress={onEnterPressed(Submit)}
            />
 <button onClick={Submit} title="Submit">
            {this.state.loading ? 
                <div className="code-entry-spin-container">
                  <div class="la-ball-clip-rotate la-sm">
                      <div></div>
                  </div>
                </div>
              :"Enter Event"            

            }
                 </button>


        </div>
        
      </div>
    );
  }
}

export default CodeAccess;
