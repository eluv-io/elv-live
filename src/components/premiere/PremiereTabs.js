import React from "react";
import {inject, observer} from "mobx-react";
import PremiereOverview from "./PremiereOverview";
import PremiereEpisodes from "./PremiereEpisodes";

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
      showPlay: true
    };
  }

  componentDidMount() {
    if(["series", "season"].includes(this.props.title.title_type)){
      this.setState({tabs: ["Title Overview", "Episodes"]});
    } else if(["channel"].includes(this.props.title.title_type)) {
      this.setState({tabs: ["Title Overview", "Live Schedule"]});
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
        {(["series", "season"].includes(this.props.title.title_type)) ? <PremiereEpisodes title={featuredTitle} showTab={this.state.activeTab} /> : null}
        <PremiereOverview title={featuredTitle} showTab={this.state.activeTab} />
      </div>
    );
  }
}

export default PremiereTabs;