import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Switch, withRouter} from "react-router";
import {BrowserRouter, Route} from "react-router-dom";
import * as Stores from "Stores";

import Support from "Support/Support";
import CodeAccess from "Code/CodeAccess";
import Event from "Event/Event";
import Stream from "Stream/Stream";
import Success from "Confirmation/Success";
import Calendar from "Confirmation/Calendar";

import AsyncComponent from "Common/AsyncComponent";
import {EluvioConfiguration} from "./config";

import "Styles/main.scss";


@inject("rootStore")
@inject("siteStore")
@observer
@withRouter
class Routes extends React.Component {

  render() {
    return (
      <Switch>
        <Route exact path = {`${this.props.siteStore.basePath}/stream/:siteId`} component={Stream} />
        <Route exact path = {`${this.props.siteStore.basePath}/success/:email/:id`} component={Success} />
        <Route exact path = {`${this.props.siteStore.basePath}/calendar`} component={Calendar} />
        <Route exact path = {`${this.props.siteStore.basePath}/code`} component={CodeAccess} />
        <Route exact path = {`${this.props.siteStore.basePath}/support`} component={Support} />
        <Route exact path = {`${this.props.siteStore.basePath}/:name`} component={Event} />

        {/* <Route>
          <Redirect to="/" />
        </Route> */}
      </Switch>
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
      <AsyncComponent
        Load={async () => {
          await this.props.siteStore.LoadSite(EluvioConfiguration["library-id"],EluvioConfiguration["object-id"]);
        }}
        loadingSpin={false}
        render={() => {
          return (
            <div className="app">
              <main>
                <BrowserRouter>
                  <Routes />
                </BrowserRouter>
              </main>
            </div> 
          );
        }}
      />
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

