import React from "react";
import {inject, observer} from "mobx-react";
import {LoadingElement, onEnterPressed} from "elv-components-js";
import {Redirect} from "react-router";
import CinemaBackground from '../static/images/codeAccess/cinema-background.jpg';
import styled from "styled-components";
import billBackground from '../static/images/codeAccess/bill-ted-background.jpg';
import Logo from '../static/images/codeAccess/mgm-logo.png';
import {ImageIcon} from "elv-components-js";
import {Link} from "react-router-dom";
import AsyncComponent from "./AsyncComponent";

@inject("siteStore")
@inject("rootStore")
@observer
class NewCodeAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: "",
      loading: false,
      email_placeholder: "Enter your email",
      code_placeholder: "Enter your access code",
      actual_link: ""
    };
  }

  afterSubscribe() {
    return (
      <button onClick={() => this.props.siteStore.PlayTitle(this.props.title)} className="btnPlay">
        Play Now
      </button>
    );
  }

  render() {
    if(this.state.siteId) {
      return <Redirect to={`/code/${this.props.match.params.siteSelectorId}/${this.state.siteId}`} />;
    }

    const Submit = () => {
      if (this.state.code === "eluvio") {
        return (
          <Link to={"/iq__SufWAMfhP6P2tTUSrmdTjRdPfUM"} key={`content-object-iq__SufWAMfhP6P2tTUSrmdTjRdPfUM`}>
            <button>NEXT</button>
          </Link>
        );
      } else if (this.state.code === "premiere"){
        return (
          <Link to={"/iq__thureaA7B7E86jhFL8XamZnVn2M"} key={`content-object-iq__thureaA7B7E86jhFL8XamZnVn2M`}>
            <button>NEXT</button>
          </Link>
        );
      } else {
        return (
          <button>NEXT</button>
         );
      }
    };
    

    const BackgroundStyleContainer = styled.div`
      background-size: cover;
      background-image: url(${billBackground});
      height: 100vh;
      background-position: center;
      opacity: .5;
      }
    `;


    return (
      <AsyncComponent
        Load={async () => await this.props.siteStore.LoadSite("iq__SufWAMfhP6P2tTUSrmdTjRdPfUM", "")}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }

          return (
            <div className="code-entry-container">
              <BackgroundStyleContainer />
              <div className = "code-entry">
                <LoadingElement loading={this.state.loading}>
                  <ImageIcon className="code-entry--logo" icon={ (this.props.siteStore.logoUrl ? this.props.siteStore.logoUrl : Logo)} label="logo"/>
                  <input
                    onFocus={() => this.setState({email_placeholder: ""})}
                    onBlur={() => this.setState({email_placeholder: "Enter your email"})}
                    placeholder={this.state.email_placeholder}
                    value={this.state.email}
                    onChange={event => this.setState({email: event.target.value})}
                    autoFocus
                  />
                  <input
                    onFocus={() => this.setState({code_placeholder: ""})}
                    onBlur={() => this.setState({code_placeholder: "Enter your access code"})}
                    placeholder={this.state.code_placeholder}
                    value={this.state.code}
                    onChange={event => this.setState({code: event.target.value})}
                    autoFocus
                  />
                  {Submit()}
                </LoadingElement>
              </div>
            </div>
          );
        }}
      />

      
      
    );
  }
}

export default NewCodeAccess;
