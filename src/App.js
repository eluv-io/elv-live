import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Switch, withRouter} from "react-router";
import {BrowserRouter, Route} from "react-router-dom";
import * as Stores from "./stores";

import Support from "./pages/support/Support";
import CodeAccess from "./pages/code/CodeAccess";
import Concert from "./pages/event/Event";
import Stream from "./pages/stream/Stream";
import Success from "./pages/confirmation/Success";
import Calendar from "./pages/confirmation/Calendar";

import AsyncComponent from "./components/utils/AsyncComponent";

import "./assets/styles/main.scss";


@inject("rootStore")
@inject("siteStore")
@observer
@withRouter
class Routes extends React.Component {

  render() {
    return (
      <Switch>
        <Route path = "/stream/:siteId" component={Stream} />
        <Route path = "/success/:email/:id" component={Success} />
        <Route path = "/calendar" component={Calendar} />
        <Route path = "/code" component={CodeAccess} />
        <Route path = "/support" component={Support} />
        <Route path = "/:name" component={Concert} />

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
    if(!this.props.siteStore.client) { return null; }

    return (
      <AsyncComponent
        Load={async () => {
          await this.props.siteStore.LoadSite("ilib2bLJtRJG3LW9yScSNStbjkSqF2hH","iq__4PrRspxi3n5t3diS9PuCJMCAY6Rv");
        }}
        loadingSpin={false}
        render={() => {
          return (
            <div className="app">
              <main>
                <BrowserRouter basename={this.props.siteStore.basePath}>
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
