import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Redirect, Switch, withRouter} from "react-router";
import {HashRouter, Route} from "react-router-dom";

import {ImageIcon, LoadingElement} from "elv-components-js";

import * as Stores from "../../stores";
import Site from "./components/Site";
import ContentSelector from "../ContentSelector";
import CodeAccess from "../CodeAccess";

import "swiper/css/swiper.min.css";
import "../../static/stylesheets/new/main.scss";

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
    console.log(this.props);
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
  render() {
    return (
      <div className="app-container">
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
