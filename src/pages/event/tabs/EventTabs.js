import React from "react";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import InfoIcon from "@material-ui/icons/Info";

import {inject, observer} from "mobx-react";
import Merch from "Event/tabs/Merch";
import SocialMediaBar from "Event/tabs/SocialMediaBar";
import EventDescriptions from "Event/descriptions/EventDescriptions";
import {ErrorBoundary} from "Common/ErrorBoundary";
import Ticket from "Event/tickets/Ticket";

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
    switch(this.state.tab) {
      case "event":
        if(this.props.siteStore.currentSiteInfo.state === "Live Ended") {
          return null;
        }

        return (
          <div className={"overview-container"} id="overview-container">
            <EventDescriptions />
            <div className="ticket-group">
              {
                this.props.siteStore.ticketClasses
                  .filter(ticketClass => !ticketClass.hidden)
                  .map(ticketClass =>
                    <ErrorBoundary hideOnError key={`ticket-class-${ticketClass.uuid}`} >
                      <Ticket ticketClassUUID={ticketClass.uuid} />
                    </ErrorBoundary>
                  )
              }
            </div>
          </div>
        );
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
    const ticketsAvailable = this.props.siteStore.currentSiteInfo.state !== "Live Ended";
    const merchAvailable = this.props.siteStore.Merchandise().length > 0;

    return (
      <div className="event-tabs">
        { ticketsAvailable ? this.Tab("event", <InfoIcon />) : null }
        { merchAvailable ? this.Tab("merch", <ShoppingCartIcon />) : null }
      </div>
    );
  }

  render() {
    return (
      <ErrorBoundary>
        <div className="event-tabs-container" id="tabs">
          { this.Tabs() }
          <SocialMediaBar />

          { this.Content() }
        </div>
      </ErrorBoundary>
    );
  }
}

export default EventTabs;
