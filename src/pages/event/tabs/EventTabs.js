import React from "react";
import {inject, observer} from "mobx-react";
import EventDescriptions from "Event/descriptions/EventDescriptions";
import {ErrorBoundary} from "Common/ErrorBoundary";
import Ticket from "Event/tickets/Ticket";
import EventInfoButtons from "Event/EventInfoModal";

import EventIcon from "Assets/icons/info.svg";
import CartIcon from "Assets/icons/cart-icon.svg";
import ImageIcon from "Common/ImageIcon";

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
        if(["Ended", "Live Ended"].includes(this.props.siteStore.currentSiteInfo.state)) {
          return null;
        }

        return (
          <div className={"overview-container"} id="overview-container">
            {
              this.props.siteStore.currentSiteInfo.event_info_modals && this.props.siteStore.currentSiteInfo.event_info_modals.length > 0 ?
                <EventInfoButtons/> :
                <EventDescriptions/>
            }
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
    const ticketsAvailable = !["Ended", "Live Ended"].includes(this.props.siteStore.currentSiteInfo.state);
    const merchAvailable = this.props.siteStore.Merchandise().length > 0;

    if(!ticketsAvailable || !merchAvailable) { return <div className="event-tabs" />; }

    return (
      <div className="event-tabs">
        { ticketsAvailable ? this.Tab("event", <ImageIcon icon={EventIcon} label="Event" />) : null }
        { merchAvailable ? this.Tab("merch", <ImageIcon icon={CartIcon} label="Merchandise" />) : null }
      </div>
    );
  }

  render() {
    return (
      <ErrorBoundary>
        <div className="event-tabs-container" id="tabs">
          { this.Tabs() }
          { this.Content() }
        </div>
      </ErrorBoundary>
    );
  }
}

export default inject("siteStore")(observer(EventTabs));
