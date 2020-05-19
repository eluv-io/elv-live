import "./static/stylesheets/app.scss";

import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";

import {ImageIcon, LoadingElement} from "elv-components-js";

import * as Stores from "./stores";

import Logo from "./static/images/Logo.png";
import GithubIcon from "./static/icons/github.svg";
import Site from "./components/Site";
import ContentSelector from "./components/ContentSelector";

@inject("rootStore")
@inject("siteStore")
@observer
class App extends React.Component {
  SourceLink() {
    const sourceUrl = "https://github.com/eluv-io/elv-site-sample";
    return (
      <a className="source-link" href={sourceUrl} target="_blank">
        <ImageIcon className="github-icon" icon={GithubIcon} />
        Source available on GitHub
      </a>
    );
  }

  App() {
    if(!this.props.rootStore.client) {
      return <LoadingElement loading={true} fullPage={true}/>;
    }

    if(this.props.siteStore.currentSite) {
      return <Site key={`site-${this.props.siteStore.siteId}`} />;
    } else {
      return (
        <LoadingElement loading={this.props.siteStore.loading}>
          <ContentSelector />
        </LoadingElement>
      );
    }
  }

  render() {
    return (
      <div className="app-container">
        <header>
          <ImageIcon className="logo" icon={Logo} label="Eluvio" onClick={this.props.rootStore.ReturnToApps}/>

          { this.SourceLink() }
        </header>
        <main>
          { this.props.rootStore.error ? <h3 className="error-message">{ this.props.rootStore.error }</h3> : null }
          { this.App() }
        </main>
      </div>
    );
  }
}

render(
  (
    <React.Fragment>
      <Provider {...Stores}>
        <App />
      </Provider>
      <div className="app-version">{EluvioConfiguration.version}</div>
    </React.Fragment>
  ),
  document.getElementById("app")
);
