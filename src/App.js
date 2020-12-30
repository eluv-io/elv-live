import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Redirect, Switch, withRouter} from "react-router";
import {BrowserRouter, Route} from "react-router-dom";
import * as Stores from "./stores";

import Support from "./components/home/Support";
// import Test from "./components/home/Test";

import CodeAccess from "./components/livestream/CodeAccess";
import Concert from "./components/event/concert/Concert";
import Stream from "./components/livestream/stream/StreamPage";
import Success from "./components/livestream/payment/Success";
import Calendar from "./components/livestream/payment/Calendar";
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
        <Route path = "/code" forceRefresh={true} component={CodeAccess} />
        <Route path = "/support" component={Support} />
        <Route path = "/:name" forceRefresh={true} component={Concert} />
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
          }
        }
        
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
