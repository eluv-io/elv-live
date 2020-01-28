import "./static/stylesheets/app.scss";

import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";

import {IconLink, ImageIcon, LoadingElement} from "elv-components-js";

import * as Stores from "./stores";

import Logo from "./static/images/Logo.png";
import GithubIcon from "./static/icons/github.svg";
import Site from "./components/Site";

@inject("rootStore")
@observer
class App extends React.Component {
  constructor(props) {
    super(props);

    props.rootStore.SetSiteId(EluvioConfiguration["site-id"]);
  }

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

    return <Site />;
  }

  render() {
    return (
      <div className="app-container">
        <header>
          <IconLink href="https://eluv.io" className="logo" icon={Logo} label="Eluvio"/>
          <h1>
            Eluvio Site Sample
          </h1>
        </header>
        <main>
          { this.App() }
        </main>
        <footer>
          { this.SourceLink() }
        </footer>
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
