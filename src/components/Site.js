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

  PageContent() {
    return (
      <div className="site" id="site">
        <h2 className="site-name">{ this.props.siteStore.siteInfo.name }</h2>
        <ActiveTitle />
        { <TitleReel /> }
        { this.props.siteStore.playlists.map(playlist =>
          <TitleReel
            key={`title-reel-playlist-${playlist.playlistIndex}`}
            playlistIndex={playlist.playlistIndex}
          />
        )}
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
