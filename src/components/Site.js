import React from "react";
import AsyncComponent from "./AsyncComponent";
import {inject, observer} from "mobx-react";
import ActiveTitle from "./titles/ActiveTitle";
import TitleReel from "./titles/TitleReel";
import {ImageIcon, LoadingElement} from "elv-components-js";
import TitleGrid from "./titles/TitleGrid";
import SearchBar from "./SearchBar";

import BackIcon from "../static/icons/back.svg";
import CloseIcon from "../static/icons/x.svg";

@inject("rootStore")
@inject("siteStore")
@observer
class Site extends React.Component {
  constructor(props) {
    super(props);

    this.PageContent = this.PageContent.bind(this);
  }

  ActiveTitle() {
    return <ActiveTitle key={`active-title-${this.props.siteStore.activeTitle.titleId}`} />;
  }

  Content() {
    if(this.props.siteStore.searchQuery) {
      return (
        <LoadingElement loading={this.props.siteStore.searching} loadingClassname="loading-indicator">
          <TitleGrid
            noTitlesMessage="No results found"
            name="Search Results"
            titles={this.props.siteStore.searchResults}
          />
        </LoadingElement>
      );
    }

    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  BackButton() {
    let backAction, backText, backIcon;
    if(this.props.siteStore.activeTitle) {
      backIcon = CloseIcon;
      backText = "Back to Content";
      backAction = this.props.siteStore.ClearActiveTitle;
    } else if(this.props.siteStore.searchQuery) {
      backIcon = BackIcon;
      backText = "Back to All Content";
      backAction = this.props.siteStore.ClearSearch;
    } else {
      backIcon = BackIcon;
      backText = "Back to Site Selection";
      backAction = () => this.props.rootStore.PopSiteId();
    }

    return (
      <ImageIcon
        key={`back-icon-${backText}`}
        className="back-button"
        title={backText}
        icon={backIcon}
        onClick={backAction}
      />
    );
  }

  PageContent() {
    return (
      <div className="site" id="site">
        <h2 className="site-header" hidden={false}>
          { this.BackButton() }
          { this.props.siteStore.siteInfo.name }
          <SearchBar key={`search-bar-${this.props.siteStore.searchQuery}`} />
        </h2>

        { this.props.siteStore.activeTitle ? this.ActiveTitle() : this.Content() }
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
