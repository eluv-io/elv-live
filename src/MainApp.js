import React from "react";
import {inject, observer} from "mobx-react";
import {Switch} from "react-router";
import {Route} from "react-router-dom";

import "Styles/main-app.scss";
import {PageLoader} from "Common/Loaders";

import Main from "Pages/main/Main";
import Header from "Pages/main/components/Header";
import Footer from "Pages/main/components/Footer";
import Partners from "Pages/main/Partners";
import Technology from "Pages/main/Technology";
import Support from "Pages/main/Support";
import Contact from "Pages/main/Contact";
import Terms from "Pages/main/Terms";

@inject("rootStore")
@inject("siteStore")
@observer
class MainApp extends React.Component {
  async componentDidMount() {
    await this.props.rootStore.InitializeClient();
    await this.props.siteStore.LoadMainSite();
    await this.props.siteStore.LoadFeaturedSites();
  }

  Routes() {
    if(!this.props.rootStore.client) {
      return <PageLoader />;
    }

    return (
      <Switch>
        <Route exact path="/"> <Main /> </Route>
        <Route exact path="/partners"> <Partners /> </Route>
        <Route exact path="/technology"> <Technology /> </Route>
        <Route exact path="/support"> <Support /> </Route>
        <Route exact path="/contact"> <Contact /> </Route>
        <Route exact path="/terms"> <Terms /> </Route>
      </Switch>
    );
  }

  render() {
    return (
      <div className="main-app">
        <Header />
        { this.Routes() }
        <Footer />
      </div>
    );
  }
}

export default MainApp;
