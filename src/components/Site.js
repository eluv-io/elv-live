import React from "react";
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
        { this.props.siteStore.currentSite.playlists.map(playlist =>
          <TitleReel
            key={`title-reel-playlist-${playlist.playlistId}`}
            name={playlist.name}
            titles={playlist.titles}
          />
        )}

        <TitleReel name="Channels" titles={this.props.siteStore.currentSite.channels} />

        <TitleGrid name="Series" titles={this.props.siteStore.currentSite.series} />
        <TitleGrid name="Seasons" titles={this.props.siteStore.currentSite.seasons} />

        <TitleGrid name="Episodes" titles={this.props.siteStore.currentSite.episodes} />

        <TitleGrid name="All Titles" titles={this.props.siteStore.currentSite.titles} />
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
    } else if(this.props.siteStore.sites.length > 1) {
      const previousSite = this.props.siteStore.sites[this.props.siteStore.sites.length - 2];
      backIcon = BackIcon;
      backText = `Back to ${previousSite.name}`;
      backAction = () => this.props.siteStore.PopSite();
    } else {
      backIcon = BackIcon;
      backText = "Back to Site Selection";
      backAction = () => this.props.siteStore.Reset();
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

  render() {
    if(!this.props.siteStore.currentSite) { return null; }

    const mainSiteName = this.props.siteStore.sites[0].name;
    const subHeader = this.props.siteStore.sites.slice(1).map(site => site.name).join(" - ");

    return (
      <div className="site" id="site">
        <h2 className={`site-header ${subHeader ? "with-subheader" : ""}`} hidden={false}>
          { this.BackButton() }
          { mainSiteName }
          <SearchBar key={`search-bar-${this.props.siteStore.searchQuery}`} />
        </h2>

        { subHeader ? <h3 className="site-subheader">{ subHeader }</h3> : null }

        <LoadingElement loading={this.props.siteStore.loading}>
          { this.props.siteStore.activeTitle ? this.ActiveTitle() : this.Content() }
        </LoadingElement>
      </div>
    );
  }
}

export default Site;
