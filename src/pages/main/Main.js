import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "./copy/Copy.yaml";
import FeaturedEvents from "Pages/main/components/FeaturedEvents";
import Logo from "Assets/images/logo/coloredEluvioLiveLogo.png";
import FeatureBlock from "Pages/main/components/FeatureBlock";

@inject("siteStore")
@inject("mainStore")
@observer
class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentBlock: 0,
      blocks: [
        "featured-events",
        "logo",
        "beautiful_quality",
        "directly_to_fans",
        "retain_control",
        "push_boundaries",
        "remonetize_endlessly",
        "footer"
      ]
    };

    this.lastScroll = Date.now();

    this.Scroll = this.Scroll.bind(this);
  }

  componentDidMount() {
    if(window.innerWidth > 900) {
      document.addEventListener("wheel", this.Scroll);
      document.body.style.overflowY = "hidden";
    }
  }

  componentWillUnmount() {
    document.removeEventListener("wheel", this.Scroll);
    document.body.style.overflowY = "auto";
  }

  Scroll(event) {
    console.log(event);

    if(window.innerWidth <= 900) {
      document.body.style.overflowY = "auto";
      return;
    } else {
      document.body.style.overflowY = "hidden";
    }

    // Don't scroll if modal active
    if(this.props.mainStore.featureBlockModalActive) {
      return;
    }

    // Debounce
    if(Date.now() - this.lastScroll < 1000) {
      return;
    }

    this.lastScroll = Date.now();

    const delta = event.deltaY > 0 ? 1 : -1;
    const nextBlock = Math.min(this.state.blocks.length - 1, Math.max(0, this.state.currentBlock + delta));

    this.setState({
      currentBlock: nextBlock
    }, () => {
      const id = this.state.blocks[this.state.currentBlock] === "footer" ? "footer" : `scroll-block-${this.state.blocks[this.state.currentBlock]}`;
      const element = document.getElementById(id);
      window.scrollTo({
        top: element.getBoundingClientRect().top + (window.pageYOffset || element.scrollTop),
        behavior: "smooth"
      });
    });
  }

  render() {
    return (
      <div className="page-content main-page">
        <FeaturedEvents />
        <div className="main-page__logo-block scroll-block" id="scroll-block-logo">
          <div className="main-page__logo-container">
            <img src={Logo} alt="Eluvio Live" className="main-page__logo" />
          </div>
          <h2 className="main-page__header">
            { Copy.main.header }
          </h2>
        </div>
        <div className="main-page__content-container">
          <FeatureBlock copyKey="beautiful_quality" />
          <FeatureBlock copyKey="directly_to_fans" />
          <FeatureBlock copyKey="retain_control" />
          <FeatureBlock copyKey="push_boundaries" />
          <FeatureBlock copyKey="remonetize_endlessly" />
        </div>
      </div>
    );
  }
}

export default Main;
