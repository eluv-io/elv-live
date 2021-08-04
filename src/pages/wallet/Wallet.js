import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@observer
class Wallet extends React.Component {
  render() {
    return (
      <div className="page-container wallet-page-container">
        <div
          className="wallet-target"
          ref={element => this.props.rootStore.InitializeWalletClient(element)}
        >
        </div>
      </div>
    );
  }
}

export default Wallet;
