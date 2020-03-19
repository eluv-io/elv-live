import React from "react";
import AsyncComponent from "./AsyncComponent";
import {inject, observer} from "mobx-react";
import ActiveTitle from "./ActiveTitle";
import TitleReel from "./TitleReel";
import BackIcon from "../static/icons/back.svg";
import {ImageIcon} from "elv-components-js";

@inject("rootStore")
@inject("siteStore")
@observer
class Site extends React.Component {
  constructor(props) {
    super(props);

    this.PageContent = this.PageContent.bind(this);
  }

  ActiveTitle() {
    if(!this.props.siteStore.activeTitle) { return null; }

    const key = `active-title-${this.props.siteStore.activeTitle.titleIndex}`;

    return <ActiveTitle key={key} />;
  }

  PageContent() {
    return (
      <div className="site" id="site">
        <h2 className="site-name" hidden={!!this.props.siteStore.activeTitle}>
          <ImageIcon
            className="back-button"
            title="Back to Site Selection"
            icon={BackIcon}
            onClick={() => this.props.rootStore.SetSiteId(undefined)}
          />
          { this.props.siteStore.siteInfo.name }
        </h2>
        { this.ActiveTitle() }

        { this.props.siteStore.playlists.map(playlist =>
          <TitleReel
            key={`title-reel-playlist-${playlist.playlistIndex}`}
            playlistIndex={playlist.playlistIndex}
          />
        )}

        <TitleReel />
        <TitleReel channels />
      </div>
    );
  }

  render() {
    return (
      <AsyncComponent
        Load={
          async () => {
            await this.props.siteStore.LoadSite(this.props.objectId);
          }
        }
        render={this.PageContent}
      />
    );
  }
}

export default Site;
