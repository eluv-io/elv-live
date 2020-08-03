import React from "react";
import {inject, observer} from "mobx-react";
import {LoadingElement, onEnterPressed} from "elv-components-js";
import {Redirect} from "react-router";
// import CinemaBackground from '../static/images/codeAccess/cinema.jpg';
// import SkyfallBackground from '../static/images/codeAccess/skyfall';
import styled from "styled-components";

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

    // const codeEntry = styled.div`
    //   background-size: cover;
    //   background-image: ${CinemaBackground};
    //   height: 100vh;
    //   background-position: center;

    //   align-items: center;
    //   display: flex;
    //   height: 100vh;
    //   justify-content: center;
    //   width: 100%;
    //   flex-direction: column;
    
    // `;

    // const BackgroundStyleContainer = styled.div`
    //   align-items: center;
    //   display: flex;
    //   height: 100vh;
    //   justify-content: center;
    //   width: 100%;
    //   flex-direction: column;
    //   }
    // `;

    return (
      <div className = "code-entry">
        <LoadingElement loading={this.state.loading}>
          <input
            onFocus={() => this.setState({email_placeholder: ""})}
            onBlur={() => this.setState({email_placeholder: "Enter your email"})}
            placeholder={this.state.email_placeholder}
            value={this.state.email}
            onChange={event => this.setState({email: event.target.value})}
            onKeyPress={onEnterPressed(Submit)}
            autoFocus
          />
          <input
            onFocus={() => this.setState({code_placeholder: ""})}
            onBlur={() => this.setState({code_placeholder: "Enter your access code"})}
            placeholder={this.state.code_placeholder}
            value={this.state.code}
            onChange={event => this.setState({code: event.target.value})}
            onKeyPress={onEnterPressed(Submit)}
            autoFocus
          />
          <button onClick={Submit} title="Submit">Submit</button>
        </LoadingElement>
      </div>
    );
  }
}

export default CodeAccess;
