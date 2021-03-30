import React from "react";
import {inject, observer} from "mobx-react";
import Ticket from "Event/tickets/Ticket";
import {ErrorBoundary} from "Common/ErrorBoundary";

@inject("rootStore")
@inject("siteStore")
@observer
class ConcertOverview extends React.Component {
  render() {
    return (
      <div className={"overview-container"} id="overview-container">
        <div className="ticket-group">
          {
            this.props.siteStore.ticketClasses.map(ticketClass =>
              <ErrorBoundary hideOnError>
                <Ticket ticketClassUUID={ticketClass.uuid} key={`ticket-class-${ticketClass.uuid}`} />
              </ErrorBoundary>
            )
          }
        </div>
      </div>
    );
  }
}

export default ConcertOverview;
