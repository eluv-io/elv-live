import React from "react";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import InfoIcon from "@material-ui/icons/Info";

import ConcertOverview from "./Overview";
import {inject, observer} from "mobx-react";
import Merch from "Event/tabs/Merch";
import SocialMediaBar from "Event/tabs/SocialMediaBar";

@inject("siteStore")
@observer
class EventTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: "event"
    };
  }

  Content() {
    switch (this.state.tab) {
      case "event":
        return <ConcertOverview />;
      case "merch":
        return <Merch />;
      default:
        return null;
    }
  }

  Tab(name, icon) {
    return (
      <button
        onClick={() => this.setState({tab: name})}
        className={`tab ${this.state.tab === name ? "active" : ""}`}
      >
        { icon }
        <div className="tab-name">{ name }</div>
      </button>
    );
  }

  Tabs() {
    if(this.props.siteStore.Merchandise().length === 0) { return; }

    return (
      <div className="event-tabs">
        { this.Tab("event", <InfoIcon />) }
        { this.Tab("merch", <ShoppingCartIcon />) }
      </div>
    );
  }

  render() {
    return (
      <div className="event-tabs-container" id="tabs">
        { this.Tabs() }

        <SocialMediaBar />

        { this.Content() }
      </div>
    );
  }
}

export default EventTabs;
