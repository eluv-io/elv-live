import React from "react";
import {inject, observer} from "mobx-react";
import {Switch} from "react-router";
import {Route} from "react-router-dom";

import "Styles/main-app.scss";
import {PageLoader} from "Common/Loaders";
import Main from "Pages/main/Main";

@inject("rootStore")
@inject("siteStore")
@observer
class MainApp extends React.Component {
  async componentDidMount() {
    await this.props.rootStore.InitializeClient();
    await this.props.siteStore.LoadMainSite();
  }

  Header() {
    return (
      <header>

      </header>
    );
  }

  Routes() {
    if(!this.props.rootStore.client) {
      return <PageLoader />;
    }

    return (
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>
      </Switch>
    );
  }

  render() {
    return (
      <div className="main-app">
        { this.Header() }
        { this.Routes() }
      </div>
    );
  }
}

export default MainApp;
