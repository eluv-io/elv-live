import React from "react";
import {inject, observer} from "mobx-react";
import {LoadingElement, onEnterPressed} from "elv-components-js";
import {Redirect} from "react-router";
import { parse } from 'query-string';

import Navigation from "../home/Navigation";
import { siteInfo } from "../../assets/data";

@inject("siteStore")
@inject("rootStore")
@observer
class CodeAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: "",
      name: "",
      loading: false,
      access: false,
      email_placeholder: "Email",
      code_placeholder: "Ticket Code",
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);

  }

  async componentDidMount() {
    const parsed = parse(decodeURIComponent(this.props.location.search));

    if (parsed.access == "true") {
      this.setState({loading: true});
      const siteId = await this.props.rootStore.RedeemCode(
        parsed.email,
        parsed.passcode
      );
  
      if(siteId) {
        this.setState({siteId});
      } else {
        this.setState({loading: false});
      }    
    }
    this.setState({code: parsed.passcode});
    this.setState({email: parsed.email}); 
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
      return <Redirect to={`/stream/${this.state.siteId}`} />;
    }

    const Submit = async () => {
      this.setState({loading: true});

      const siteId = await this.props.rootStore.RedeemCode(
        this.state.email,
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
      backgroundImage: `url(${this.props.siteStore.codeImage})`,
      height: "100vh",
      maxHeight: "100vh",
      minHeight: "100vh",
      minHeight: "-webkit-fill-available",
      width: "100vw",
      backgroundPosition: "center",
      opacity: .9,
      display: "flex"
    };

    return (
      <div style={divStyle}>
        <Navigation />

        <div className = "code-entry">
          { this.props.rootStore.error ? <div className="error-message">{ this.props.rootStore.error }</div> : null }

          <LoadingElement loading={this.state.loading}>
            <input
              onFocus={() => this.setState({email_placeholder: ""})}
              onBlur={() => this.setState({email_placeholder: "Email"})}
              placeholder={this.state.email_placeholder}
              value={this.state.email}
              onChange={this.handleEmailChange} 
              onKeyPress={onEnterPressed(Submit)}
            />
            <input
              onFocus={() => this.setState({code_placeholder: ""})}
              onBlur={() => this.setState({code_placeholder: "Ticket Code"})}
              placeholder={this.state.code_placeholder}
              value={this.state.code}
              onChange={this.handleCodeChange} 
              onKeyPress={onEnterPressed(Submit)}
            />
            <button onClick={Submit} title="Submit">NEXT</button>
          </LoadingElement>
        </div>
        
      </div>
    );
  }
}
// http://localhost:8086/d457a576/code?passcode%3DAcUe5b%26email%3Dalec.jo%40eluv.io%26access%3Dtrue
export default CodeAccess;
