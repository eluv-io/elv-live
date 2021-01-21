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
    this.handleRedeemCode = this.handleRedeemCode.bind(this);

  }

  async componentDidMount() {
    try {
      // http://localhost:8086/d457a576/code?passcode%3D6rBhjy%26access%3Dtrue
      const parsed = parse(decodeURIComponent(this.props.location.search));

      if (parsed.passcode && parsed.access) {
        this.setState({code: parsed.passcode});
        this.handleRedeemCode(parsed.passcode);
      }

    }catch(e) {
      console.log(e);
    }
  }

  handleRedeemCode = async (code) => {
    this.setState({loading: true});
    // console.log("this.state.code", this.state.code);
    // console.log("code", code);

    const siteId = await this.props.rootStore.RedeemCode(code);

    if(siteId) {
      this.setState({siteId});
    } else {
      this.setState({loading: false});
    }    
  }

  // Submit = async () => {
  //   this.setState({loading: true});

  //   const siteId = await this.props.rootStore.RedeemCode(
  //     this.state.code
  //   );

  //   if(siteId) {
  //     this.setState({siteId});
  //   } else {
  //     this.setState({loading: false});
  //   }
  // };

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

    // const Submit = async () => {
    //   this.setState({loading: true});

    //   const siteId = await this.props.rootStore.RedeemCode(
    //     this.state.code
    //   );

    //   if(siteId) {
    //     this.setState({siteId});
    //   } else {
    //     this.setState({loading: false});
    //   }
    // };

    const divStyle = {
      backgroundSize: "cover",
      background: "#E0DDD4",
      height: "100vh",
      maxHeight: "100vh",
      minHeight: "100vh -webkit-fill-available",
      width: "100vw",
      backgroundPosition: "center",
      display: "flex"
    };




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
              onKeyPress={() => this.handleRedeemCode(this.state.code)}

            />
          <button onClick={() => this.handleRedeemCode(this.state.code)} title="Submit">
            {this.state.loading ? 
                <div className="code-entry-spin-container">
                  <div className="la-ball-clip-rotate la-sm">
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
