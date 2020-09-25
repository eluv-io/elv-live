import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Redirect, Switch, withRouter} from "react-router";
import {HashRouter, Route} from "react-router-dom";
import * as Stores from "./stores";
// import Site from "./components/Site";
// import ContentSelector from "./components/ContentSelector";
import CodeAccess from "./components/CodeAccess";

import Home from "./components/livestream/Home";
import Event from "./components/livestream/Event";
import Stream from "./components/livestream/Stream";

import Checkout from "./components/livestream/Stripe/Checkout";
import Success from "./components/livestream/Stripe/Success";

import styled from "styled-components";

import "swiper/css/swiper.min.css";
import "./static/stylesheets/main.scss";


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
        <Route exact path="/" component={Home} />
        <Route exact path="/event/:artist" component={Event} />
        <Route exact path="/stream" component={Stream} />
        <Route path="/payment/:artist" component={Checkout} />
        <Route path="/success" component={Success} />
        <Route exact path="/code" component={CodeAccess} />
        
        {/* <Route
          exact
          path={[
            "/stream/:siteSelectorId/:siteId"
          ]}
          component={Stream}
        /> */}
        <Route
          exact
          path={[
            "/stream/:siteId"
          ]}
          component={Stream}
        />

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
  render() {
    const ContainerApp = styled.div`
      min-height: 100vh;    
      background: black;
      color: ${this.props.siteStore.primaryFontColor};
    }
    `;

    return (
      <ContainerApp>
        <main>
          { this.props.rootStore.error ? <h3 className="error-message">{ this.props.rootStore.error }</h3> : null }
          <HashRouter>
            <Routes />
          </HashRouter>
        </main>
      </ContainerApp>
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
