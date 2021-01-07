import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Switch, withRouter} from "react-router";
import {BrowserRouter, Route} from "react-router-dom";
import * as Stores from "Stores";

import Support from "Support/Support";
import CodeAccess from "Code/CodeAccess";
import Concert from "Event/Event";
import Stream from "Stream/Stream";
import Success from "Confirmation/Success";
import Calendar from "Confirmation/Calendar";

import AsyncComponent from "Common/AsyncComponent";

import "Styles/main.scss";


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

