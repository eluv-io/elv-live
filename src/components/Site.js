import React from "react";
import AsyncComponent from "./AsyncComponent";
import {inject, observer} from "mobx-react";
import ActiveTitle from "./titles/ActiveTitle";
import TitleReel from "./titles/TitleReel";
import BackIcon from "../static/icons/back.svg";
import {ImageIcon, LoadingElement} from "elv-components-js";
import TitleGrid from "./titles/TitleGrid";
import SearchBar from "./SearchBar";

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

    const key = `active-title-${this.props.siteStore.activeTitle.titleId}`;

    return <ActiveTitle key={key} />;
  }

  PageContent() {
    return (
      <div className="site" id="site">
        { this.ActiveTitle() }

        <h2 className="site-header" hidden={false}>
          <ImageIcon
            className="back-button"
            title="Back to Site Selection"
            icon={BackIcon}
            onClick={() => this.props.rootStore.PopSiteId(undefined)}
          />

          { this.props.siteStore.siteInfo.name }

          <SearchBar />
        </h2>

        <LoadingElement loading={this.props.siteStore.searching} loadingClassname="loading-indicator">
          { this.props.siteStore.playlists.map(playlist =>
            <TitleReel
              key={`title-reel-playlist-${playlist.playlistId}`}
              name={playlist.name}
              titles={playlist.titles}
            />
          )}

          <TitleReel name="Channels" titles={this.props.siteStore.channels} />

          <TitleGrid name="Series" titles={this.props.siteStore.series} />
          <TitleGrid name="Seasons" titles={this.props.siteStore.seasons} />

          <TitleGrid name="Episodes" titles={this.props.siteStore.episodes} />

          <TitleGrid name="All Titles" titles={this.props.siteStore.titles} />
        </LoadingElement>
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
