import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Redirect, Switch, withRouter} from "react-router";
import {BrowserRouter, Route} from "react-router-dom";
import * as Stores from "./stores";

import ContactForm from "./components/home/ContactForm";
import Support from "./components/home/Support";

import CodeAccess from "./components/livestream/CodeAccess";
import Concert from "./components/event/concert/Concert";
import Stream from "./components/livestream/stream/StreamPage";
import Success from "./components/livestream/payment/Success";

// import AsyncComponent from "./components/support/AsyncComponent";
// import FilmRelease from "./components/event/film/FilmRelease";
// import Series from "./components/event/series/Series";
// import Home from "./components/home/Home";

import "./static/stylesheets/main.scss";

@inject("rootStore")
@inject("siteStore")
@observer
@withRouter
class Routes extends React.Component {

  render() {
    return (
      <Switch>
        <Route path = "/d457a576/stream/:siteId" component={Stream} />
        <Route path = "/d457a576/success/:id" component={Success} />
        <Route path = "/d457a576/code" forceRefresh={true} component={CodeAccess} />
        <Route path = "/d457a576/contact" component={ContactForm} />
        <Route path = "/d457a576/support" component={Support} />
        <Route path = "/d457a576/:name" forceRefresh={true} component={Concert} />
        {/* <Route>
          <Redirect to="/" />
        </Route> */}
      </Switch>
    );
  };
};

@inject("rootStore")
@inject("siteStore")
@observer
class App extends React.Component {
  render() {
    // if(!this.props.siteStore.client) { return null; }

    return (
      <div className="app">
        <main>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </main>
      </div>
    );
  }
}

render(
  (
    <Provider {...Stores}>
      <App />
    </Provider>
  ),
  document.getElementById("app")
);
