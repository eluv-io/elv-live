import React from "react";
import AsyncComponent from "./AsyncComponent";
import {inject, observer} from "mobx-react";
import Title from "./Title";

@inject("siteStore")
@observer
class Site extends React.Component {
  constructor(props) {
    super(props);

    this.PageContent = this.PageContent.bind(this);
  }

  Titles() {
    const activeTitle =
      this.props.siteStore.activeTitle.titleIndex !== undefined &&
      this.props.siteStore.activeTitle.playlistIndex === undefined;

    return (
      <div className="site-titles">
        <h3>All Titles</h3>
        <div className={`title-container ${activeTitle ? "title-container-active" : ""}`}>
          { this.props.siteStore.titles.map(title => <Title title={title} key={`site-title-${title.titleIndex}`} />) }
        </div>
      </div>
    );
  }

  Playlists() {
    return (
      <div className="site-playlists">
        {
          this.props.siteStore.playlists.map(playlist => (
            <div className="site-playlist" key={`site-playlist-${playlist.name}`}>
              <h3>{playlist.name}</h3>
              <div
                className={`title-container ${this.props.siteStore.activeTitle.playlistIndex === playlist.playlistIndex ? "title-container-active" : ""}`}
              >
                { playlist.titles.map(title => <Title title={title} key={`site-title-${title.titleIndex}`} />) }
              </div>
            </div>
          ))
        }
      </div>
    );
  }

  PageContent() {
    return (
      <div className="site">
        <h2 className="site-name">{ this.props.siteStore.siteInfo.name }</h2>
        { this.Playlists() }
        { this.Titles() }
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
