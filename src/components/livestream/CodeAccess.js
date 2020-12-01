import React from "react";
import {inject, observer} from "mobx-react";
import {LoadingElement, onEnterPressed} from "elv-components-js";
import {Redirect} from "react-router";
import styled from "styled-components";
import {ImageIcon} from "elv-components-js";
import { parse } from 'query-string';

import AsyncComponent from "../support/AsyncComponent";
import Logo from "../../static/images/Logo-Small.png";
import default_background from "../../static/images/codeAccess/concert.jpg";

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
      loading2: false,
      email_placeholder: "Enter Your Email",
      code_placeholder: "Ticket Code",
      name_placeholder: "Enter Your Chat Name"
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);

  }
  componentDidMount() {
    const parsed = parse(this.props.location.search);
    this.setState({code: parsed.passcode});
    this.setState({email: parsed.email});
  }
  handleNameChange(event) {
    this.setState({name: event.target.value});
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
        this.state.code,
        this.state.name
      );

      if(siteId) {
        this.setState({siteId});
      } else {
        this.setState({loading: false});
      }
    };

    const BackgroundStyleContainer = styled.div`
      background-size: cover;
      background-image: url(${default_background});
      height: 100vh;
      background-position: center;
      opacity: .9;
      }
    `;

    return (
      <div className="code-entry-container">
        <BackgroundStyleContainer />

        <div className = "code-entry">
          { this.props.rootStore.error ? <div className="error-message">{ this.props.rootStore.error }</div> : null }

          <LoadingElement loading={this.state.loading}>
            <ImageIcon className="code-entry--logo" icon={Logo} label="logo"/>
            <input
              onFocus={() => this.setState({name_placeholder: ""})}
              onBlur={() => this.setState({name_placeholder: "Enter Your Chat Name"})}
              placeholder={this.state.name_placeholder}
              value={this.state.name}
              onChange={this.handleNameChange} 
              onKeyPress={onEnterPressed(Submit)}
            />
            <input
              onFocus={() => this.setState({email_placeholder: ""})}
              onBlur={() => this.setState({email_placeholder: "Enter Your Email"})}
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
        {/* <div className="pTicket">
          Don't have a ticket? Click here to purchase 
        </div> */}
      </div>
    );
  }
}

export default CodeAccess;
