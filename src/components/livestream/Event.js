import React from "react";
import {inject, observer} from "mobx-react";
import Logo from "../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";

@inject("rootStore")
@inject("siteStore")
@observer
class Event extends React.Component {

  render() {

    return (
      <div className="event-container">
        <div className="event-nav">
          <ImageIcon className="event-nav__container--logo" icon={Logo} label="Eluvio" />
        </div>

        <div className="event-container__view">
          Event Photo
        </div>

        <div className="event-container__info">
          Event Info
        </div>

      </div>
    );
  }
}

export default Event;