import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@observer
class WalletFrame extends React.Component {
  render() {
    return (
      <div className="wallet-panel" id="wallet-panel">
        <div
          className="wallet-target"
          ref={element => this.props.rootStore.InitializeWalletClient(element)}
        >
        </div>
      </div>
    );
  }
}

export default WalletFrame;
