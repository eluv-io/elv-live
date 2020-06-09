import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Redirect, Switch, withRouter} from "react-router";
import {HashRouter, Route} from "react-router-dom";

import {ImageIcon, LoadingElement} from "elv-components-js";

import * as Stores from "../../stores";

import Logo from "../../static/images/Logo.png";
import GithubIcon from "../../static/icons/github.svg";
import Site from "./Site";
import ContentSelector from "../ContentSelector";
import CodeAccess from "../CodeAccess";

@inject("rootStore")
@observer
@withRouter
class Routes extends React.Component {
  componentDidUpdate(prevProps) {
    if(this.props.location.pathname !== prevProps.location.pathname) {
      this.props.rootStore.UpdateRoute(this.props.location.pathname);
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={ContentSelector} />
        <Route exact path="/:siteId" component={Site} />
        <Route exact path="/code/:siteSelectorId" component={CodeAccess} />
        <Route exact path="/code/:siteSelectorId/:siteId" component={Site} />

        <Route exact path="/preview/:siteId" component={Site} />
        <Route exact path="/preview/:siteId/:writeToken" component={Site} />

        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    );
  }
}

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

  render() {
    return (
      <div className="app-container">
        <header>
          <ImageIcon className="logo" icon={Logo} label="Eluvio" onClick={this.props.rootStore.ReturnToApps}/>

          { this.SourceLink() }
        </header>
        <main>
          { this.props.rootStore.error ? <h3 className="error-message">{ this.props.rootStore.error }</h3> : null }
          <LoadingElement
            loading={!this.props.rootStore.client}
            render={() => (
              <HashRouter>
                <Routes />
              </HashRouter>
            )}
          />
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
