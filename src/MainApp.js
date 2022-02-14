import React from "react";
import {inject, observer} from "mobx-react";
import {Switch} from "react-router";
import {BrowserRouter, Route} from "react-router-dom";

import "Styles/main-app.scss";
import {PageLoader} from "Common/Loaders";

import ScrollToTop from "Common/ScrollToTop";

import Main from "Pages/main/Main";
import Header from "Pages/main/components/Header";
import Footer from "Pages/main/components/Footer";
import Partners from "Pages/main/Partners";
import Technology from "Pages/main/Technology";
import Blockchain from "Pages/main/Blockchain";
import News from "Pages/main/News";
import Next from "Pages/main/Next";
import Contact from "Pages/main/Contact";
import Terms from "Pages/main/Terms";
import Privacy from "Pages/main/Privacy";
import AuthWrapper, {LoginPage} from "Common/AuthWrapper";

@inject("rootStore")
@inject("siteStore")
@observer
class MainApp extends React.Component {
  async componentDidMount() {
    const baseKey = this.props.rootStore.baseKey;

    await this.props.rootStore.InitializeClient();
    await this.props.siteStore.LoadMainSite();

    // Redirected
    if(baseKey === this.props.rootStore.baseKey) {
      await this.props.siteStore.LoadFeaturedSites();
    }
  }

  Routes() {
    return (
      <Switch>
        <Route exact path="/wallet/callback" component={LoginPage} />
        <Route exact path="/wallet/logout" component={LoginPage} />

        <Route exact path="/"> <Main /> </Route>
        <Route exact path="/partners"> <Partners /> </Route>
        <Route exact path="/technology"> <Technology /> </Route>
        <Route exact path="/blockchain"> <Blockchain /> </Route>
        <Route exact path="/next"> <Next /> </Route>
        <Route exact path="/privacy"> <Privacy /> </Route>
        <Route exact path="/contact"> <Contact /> </Route>
        <Route exact path="/terms"> <Terms /> </Route>
        <Route exact path="/news"> <News /> </Route>
      </Switch>
    );
  }

  Content() {
    if(!this.props.siteStore.siteLoaded) {
      return <PageLoader />;
    }

    return (
      <ScrollToTop>
        <Header />
        { this.Routes() }
        <Footer />
      </ScrollToTop>
    );
  }

  render() {
    return (
      <div className="main-app">
        <BrowserRouter>
          <AuthWrapper>
            { this.Content() }
          </AuthWrapper>
        </BrowserRouter>
      </div>
    );
  }
}

export default MainApp;
