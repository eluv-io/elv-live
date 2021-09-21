import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class WalletFrame extends React.Component {
  render() {
    if(!this.props.siteStore.currentSiteInfo || !this.props.siteStore.siteId) { return null; }

    return (
      <div className="wallet-panel" id="wallet-panel">
        <div
          className="wallet-target"
          ref={element => this.props.rootStore.InitializeWalletClient({
            target: element,
            eventId: this.props.siteStore.siteId,
            darkMode: this.props.siteStore.darkMode
          })}
        >
        </div>
      </div>
    );
  }
}

export default WalletFrame;
