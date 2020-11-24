import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Redirect, Switch, withRouter} from "react-router";
import {HashRouter, Route} from "react-router-dom";
import * as Stores from "./stores";

import Site from "./components/Site";
import CodeAccess from "./components/livestream/CodeAccess";

import Concert from "./components/event/concert/Concert";
import FilmRelease from "./components/event/film/FilmRelease";
import Series from "./components/event/series/Series";

import Stream from "./components/livestream/stream/StreamPage";

import Success from "./components/livestream/payment/Success";
import AsyncComponent from "./components/support/AsyncComponent";

import "./static/stylesheets/main.scss";

@inject("rootStore")
@inject("siteStore")
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
      <AsyncComponent
        Load={
          async () => {
            await this.props.siteStore.LoadSite("iq__x4HLAH3VbZCcD5ggMTiGF4yrMBg", "");
          } 
        }

        render={() => {
          if(!this.props.siteStore.client) { return null; }

          return (
            <Switch>
              <Route exact path = "/test" component={Success} />

              <Route exact path = "/d457a576" component={Site} />

              <Route exact path = "/:name/d457a576" component={Concert} />
              <Route exact path = "/d457a576/success" component={Success} />
              <Route exact path = "/code" component={CodeAccess} />
              <Route exact path = "/stream/:siteId" component={Stream} />

              {/* <Route>
                <Redirect to="/" />
              </Route> */}
            </Switch>
          );
        }}
      />
    );
  }
}

@inject("rootStore")
@inject("siteStore")
@observer
class App extends React.Component {
  render() {
    if(!this.props.siteStore.client) { return null; }

    return (
      <div className="app">
        <main>
          <HashRouter>
            <Routes />
          </HashRouter>
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
