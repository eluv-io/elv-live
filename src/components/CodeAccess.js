import React from "react";
import {inject, observer} from "mobx-react";
import {LoadingElement, onEnterPressed} from "elv-components-js";
import {Redirect} from "react-router";
import styled from "styled-components";
// import default_background from "../static/images/codeAccess/cinema-background.jpg";
import default_background from "../static/images/codeAccess/bill-ted-background.jpg";

import {ImageIcon} from "elv-components-js";
import Logo from "../static/images/codeAccess/mgm-logo.png";

@inject("siteStore")
@inject("rootStore")
@observer
class CodeAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: "",
      loading: false,
      email_placeholder: "Enter your email",
      code_placeholder: "Enter your access code"
    };
  }

  render() {
    if(this.state.siteId) {
      return <Redirect to={`/code/${this.props.match.params.siteSelectorId}/${this.state.siteId}`} />;
    }

    const Submit = async () => {
      this.setState({loading: true});

      const siteId = await this.props.rootStore.RedeemCode(
        this.props.match.params.siteSelectorId,
        this.state.email,
        this.state.code
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
          <LoadingElement loading={this.state.loading}>
            <ImageIcon className="code-entry--logo" icon={Logo} label="logo"/>
            <input
              onFocus={() => this.setState({email_placeholder: ""})}
              onBlur={() => this.setState({email_placeholder: "Enter your email"})}
              placeholder={this.state.email_placeholder}
              value={this.state.email}
              onChange={event => this.setState({email: event.target.value})}
              onKeyPress={onEnterPressed(Submit)}
            />
            <input
              onFocus={() => this.setState({code_placeholder: ""})}
              onBlur={() => this.setState({code_placeholder: "Enter your access code"})}
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