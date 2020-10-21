import React from "react";
import {inject, observer} from "mobx-react";
import {LoadingElement, onEnterPressed} from "elv-components-js";
import {Redirect} from "react-router";
import styled from "styled-components";
import default_background from "../../static/images/codeAccess/concert.jpg";

import {ImageIcon} from "elv-components-js";

@inject("siteStore")
@inject("rootStore")
@observer
class CodeAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: this.props.rootStore.OTPCode,
      email: "",
      name: "",
      loading: false,
      email_placeholder: "enter your email",
      code_placeholder: "ticket code",
      name_placeholder: "enter your Chat name"
    };
  }

  render() {
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

    let backgroundImage = default_background;

    const BackgroundStyleContainer = styled.div`
      background-size: cover;
      background-image: url(${backgroundImage});
      height: 100vh;
      background-position: center;
      opacity: .5;
      }
    `;


    return (
      <div className="code-entry-container">
        <BackgroundStyleContainer />

        <div className = "code-entry">
          { this.props.rootStore.error ? <div className="error-message">{ this.props.rootStore.error }</div> : null }

          <LoadingElement loading={this.state.loading}>
            <ImageIcon className="code-entry--logo" icon={this.props.siteStore.darkLogo} label="logo"/>
            <input
              onFocus={() => this.setState({name_placeholder: ""})}
              onBlur={() => this.setState({name_placeholder: "Enter your Chat Name"})}
              placeholder={this.state.name_placeholder}
              value={this.state.name}
              onChange={event => this.setState({name: event.target.value})}
              onKeyPress={onEnterPressed(Submit)}
            />
            <input
              onFocus={() => this.setState({email_placeholder: ""})}
              onBlur={() => this.setState({email_placeholder: "enter your Email"})}
              placeholder={this.state.email_placeholder}
              value={this.state.email}
              onChange={event => this.setState({email: event.target.value})}
              onKeyPress={onEnterPressed(Submit)}
            />
            <input
              onFocus={() => this.setState({code_placeholder: ""})}
              onBlur={() => this.setState({code_placeholder: "Ticket Code"})}
              placeholder={this.state.code_placeholder}
              value={this.state.code}
              onChange={event => this.setState({code: event.target.value})}
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
