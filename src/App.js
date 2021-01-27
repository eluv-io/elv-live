import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Switch} from "react-router";
import {BrowserRouter, Route} from "react-router-dom";

import Support from "Support/Support";
import CodeAccess from "Code/CodeAccess";
import Event from "Event/Event";
import Stream from "Stream/Stream";
import Success from "Confirmation/Success";
import Calendar from "Confirmation/Calendar";
import AsyncComponent from "Common/AsyncComponent";

import {EluvioConfiguration} from "EluvioConfiguration";

import * as Stores from "Stores";

import "Styles/main.scss";
import SitePage from "Common/SitePage";


@inject("rootStore")
@inject("siteStore")
@observer
class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path = {`${this.props.siteStore.basePath}/:siteSlug/stream`} component={SitePage(Stream)} />
        <Route exact path = {`${this.props.siteStore.basePath}/:siteSlug/success/:email/:id`} component={SitePage(Success)} />
        <Route exact path = {`${this.props.siteStore.basePath}/:siteSlug/calendar`} component={SitePage(Calendar)} />
        <Route exact path = {`${this.props.siteStore.basePath}/:siteSlug/code`} component={SitePage(CodeAccess)} />
        <Route exact path = {`${this.props.siteStore.basePath}/:siteSlug/support`} component={SitePage(Support)} />
        <Route exact path = {`${this.props.siteStore.basePath}/:siteSlug`} component={SitePage(Event)} />

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
          await this.props.siteStore.LoadSiteSelector(EluvioConfiguration["object-id"]);
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

