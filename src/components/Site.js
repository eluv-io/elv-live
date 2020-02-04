import React from "react";
import AsyncComponent from "./AsyncComponent";
import {inject, observer} from "mobx-react";
import ActiveTitle from "./ActiveTitle";
import TitleReel from "./TitleReel";

@inject("siteStore")
@observer
class Site extends React.Component {
  constructor(props) {
    super(props);

    this.PageContent = this.PageContent.bind(this);
  }

  ActiveTitle() {
    if(!this.props.siteStore.activeTitle) { return null; }

    const key = `active-title-${this.props.siteStore.activeTitleIndices.playlistIndex}-${this.props.siteStore.activeTitleIndices.titleIndex}`;

    return <ActiveTitle key={key} />;
  }

  PageContent() {
    return (
      <div className="site" id="site">
        <h2 className="site-name">{ this.props.siteStore.siteInfo.name }</h2>
        { this.ActiveTitle() }

        { this.props.siteStore.playlists.map(playlist =>
          <TitleReel
            key={`title-reel-playlist-${playlist.playlistIndex}`}
            playlistIndex={playlist.playlistIndex}
          />
        )}

        <TitleReel />
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
