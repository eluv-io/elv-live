import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@observer
class WalletPage extends React.Component {
  componentDidMount() {
    this.props.rootStore.walletClient.Navigate({page: "wallet"});
    this.props.rootStore.walletClient.ToggleNavigation(true);
    this.props.rootStore.SetWalletPanelVisibility("full");
  }

  componentWillUnmount() {
    this.props.rootStore.SetWalletPanelVisibility("hidden");
  }

  render() {
    return <div className="page-container" /> ;
  }
}

export default WalletPage;
