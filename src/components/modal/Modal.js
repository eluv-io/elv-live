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
      showPlay: true
    };
  }

  componentDidMount() {
    if(["series", "season"].includes(this.props.title.title_type)) {
      this.setState({tabs: ["Overview", "Trailers", "Episodes", "Details"]});
      this.setState({showPlay: false});
    } else if(["channel"].includes(this.props.title.title_type)) {
      this.setState({tabs: ["Overview", "Live Schedule", "Details"]});
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
    const thumbnail = this.props.siteStore.CreateLink(
      featuredTitle.landscapeUrl || featuredTitle.imageUrl,
      "",
      { height: Math.max(150, Math.floor(vh / 3)) }
    );

    const backgroundStyle = {
      backgroundSize: "cover",
      backgroundImage: `url(${thumbnail})`
    };

    return (
      <React.Fragment>
        {this.props.toggle ? (<div onClick={this.props.modalClose} className="backdrop"></div>) : null}
        <div
          style={backgroundStyle}
          className={this.props.toggle ? "modal show" : "modal hide"}
        >
          { this.Tabs() }
          <BackButton modalClose={this.props.modalClose}/>
          <ModalOverview title={featuredTitle} showTab={this.state.activeTab} playTitle={this.props.playTitle} modalClose={this.props.modalClose} showPlay={this.state.showPlay}/>
          <ModalTrailers title={featuredTitle} showTab={this.state.activeTab} playTitle={this.props.playTitle} modalClose={this.props.modalClose}/>
          <ModalEpisodes title={featuredTitle} showTab={this.state.activeTab} playTitle={this.props.playTitle} modalClose={this.props.modalClose}/>
          <ModalDetails title={featuredTitle} showTab={this.state.activeTab} playTitle={this.props.playTitle} modalClose={this.props.modalClose}/>
          <ModalChannel title={featuredTitle} showTab={this.state.activeTab} playTitle={this.props.playTitle} modalClose={this.props.modalClose}/>
        </div>
      </React.Fragment>
    );
  }
}

export default Modal;