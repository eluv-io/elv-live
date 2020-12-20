import React from "react";
import {inject, observer} from "mobx-react";
import {LoadingElement, onEnterPressed} from "elv-components-js";
import {Redirect} from "react-router";
import {ImageIcon} from "elv-components-js";
import { parse } from 'query-string';

import Navigation from "../home/Navigation";

import Logo from "../../assets/images/Logo-Small.png";
import default_background from "../../assets/images/codeAccess/concert.jpg";

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
      email_placeholder: "Email",
      code_placeholder: "Ticket Code",
      name_placeholder: "Chat Name"
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
  }

  componentDidMount() {
    const parsed = parse(decodeURIComponent(this.props.location.search));
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
      return <Redirect to={`/d457a576/stream/${this.state.siteId}`} />;
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

    const divStyle = {
      backgroundSize: "cover",
      backgroundImage: `url(${default_background})`,
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
            {/* <ImageIcon className="code-entry--logo" icon={Logo} label="logo"/> */}
            <h1 className="code-entry__title">Welcome</h1>

            <input
              onFocus={() => this.setState({name_placeholder: ""})}
              onBlur={() => this.setState({name_placeholder: "Chat Name"})}
              placeholder={this.state.name_placeholder}
              value={this.state.name}
              onChange={this.handleNameChange} 
              onKeyPress={onEnterPressed(Submit)}
            />
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

export default CodeAccess;
