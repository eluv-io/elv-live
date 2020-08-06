import React from "react";
import {inject, observer} from "mobx-react";
import PremiereOverview from "./PremiereOverview";

@inject("rootStore")
@inject("siteStore")
@observer
class PremiereTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      activeTab: "Title Overview",
      tabs: ["Title Overview"],
      // tabs: ["Title Overview", "Trailers", "Details"],
      showPlay: true,
    };
  }

  componentDidMount() {
    if(["series", "season"].includes(this.props.title.title_type) && this.props.siteStore.boughtSubscription){
      this.setState({tabs: ["Overview", "Trailers", "Episodes", "Details"]});
      this.setState({showPlay: false});
    } else if(["channel"].includes(this.props.title.title_type)) {
      this.setState({tabs: ["Overview", "Live Schedule", "Details"]});
    }

    if(this.props.siteStore.premiere) {
      this.setState({showPlay: false});
    }
  }

  Tabs() {
    return (
      <nav className="premiereTabs__tabs">
        {
          this.state.tabs.map(tab =>
            <button
              key={`active-title-tab-${tab}`}
              className={tab === this.state.activeTab ? "active-tab" : ""}
              onClick={() => {
                this.setState({activeTab: tab});
              }}
            >
              { tab }
            </button>
          )
        }
      </nav>
    );
  }

  render() {
    const featuredTitle = this.props.title;
    
    return (
      <div
        className="premiereTabs"
      >
        { this.Tabs() }
        <PremiereOverview title={featuredTitle} showTab={this.state.activeTab} />
        {/* <ModalTrailers title={featuredTitle} showTab={this.state.activeTab}  />
        {(["series", "season"].includes(this.props.title.title_type)) ? <ModalEpisodes title={featuredTitle} showTab={this.state.activeTab}  /> : null}
        <ModalDetails title={featuredTitle} showTab={this.state.activeTab}  />
        <ModalChannel title={featuredTitle} showTab={this.state.activeTab}  /> */}
      </div>
    );
  }
}

export default PremiereTabs;