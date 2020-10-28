import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Redirect, Switch, withRouter} from "react-router";
import {HashRouter, Route} from "react-router-dom";
import * as Stores from "./stores";

import Site from "./components/Site";
import CodeAccess from "./components/livestream/CodeAccess";
import Event from "./components/livestream/Event";
import Stream from "./components/livestream/stream/StreamPage";
import CheckoutForm from "./components/livestream/Payment/CheckoutForm";
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
            await this.props.siteStore.LoadSite("iq__b2Qah6AMaP8ToZbouDh8nSEKARe", "");
          } 
        }

        render={() => {
          if(!this.props.siteStore.client) { return null; }

          return (
            <Switch>
              <Route exact path = "/" component={Site} />
              <Route exact path = "/event/:artist" component={Event} />
              <Route exact path = "/payment/:artist" component={CheckoutForm} />
              <Route exact path = "/success" component={Success} />
              <Route exact path = "/code" component={CodeAccess} />
              <Route exact path = "/stream/:siteId" component={Stream} />

              <Route>
                <Redirect to="/" />
              </Route>
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
