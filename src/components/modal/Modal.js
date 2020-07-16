import React from "react";
import {inject, observer} from "mobx-react";
import ModalOverview from "./ModalOverview";
import ModalTrailers from "./ModalTrailers";
import ModalDetails from "./ModalDetails";
import ModalEpisodes from "./ModalEpisodes";
import ModalChannel from "./ModalChannel";
import BackButton from "../BackButton";

@inject("rootStore")
@inject("siteStore")
@observer
class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      activeTab: "Overview",
      tabs: ["Overview", "Trailers", "Details"],
      showPlay: true,
    };
  }

  componentDidMount() {
    if(["series", "season"].includes(this.props.title.title_type)) {
      this.setState({tabs: ["Overview", "Trailers", "Episodes", "Details"]});
      this.setState({showPlay: false});
    } else if(["channel"].includes(this.props.title.title_type)) {
      this.setState({tabs: ["Overview", "Live Schedule", "Details"]});
    }

    if (this.props.siteStore.premiere) {
      this.setState({showPlay: false});
    }
  }

  Tabs() {
    return (
      <nav className="modal__tabs">
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
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    
    const thumbnail = this.props.siteStore.CreateLink(
      featuredTitle.landscapeUrl || featuredTitle.imageUrl,
      "",
      { height: Math.max(150, Math.min(Math.floor(vh), Math.floor(vw))) }
    );

    const backgroundStyle = {
      backgroundSize: "100% 100%",
      backgroundImage: `url(${thumbnail})`
    };

    return (
      <React.Fragment>
        <div onClick={this.props.siteStore.OffModalTitle} className="backdrop" />
        <div
          style={backgroundStyle}
          className="modal show"
        >
          { this.Tabs() }
          <BackButton />
          <ModalOverview title={featuredTitle} showTab={this.state.activeTab}   showPlay={this.state.showPlay}/>
          <ModalTrailers title={featuredTitle} showTab={this.state.activeTab}  />
          <ModalEpisodes title={featuredTitle} showTab={this.state.activeTab}  />
          <ModalDetails title={featuredTitle} showTab={this.state.activeTab}  />
          <ModalChannel title={featuredTitle} showTab={this.state.activeTab}  />
        </div>
      </React.Fragment>
    );
  }
}

export default Modal;