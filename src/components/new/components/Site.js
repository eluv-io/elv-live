import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon, LoadingElement} from "elv-components-js";
import SwiperGrid from "./SwiperGrid";
import ViewTitle from "./ViewTitle";
import HeroView from "./HeroView";
import Modal from "./modal/Modal";
import NewSearchBar from "./NewSearchBar";
import Logo from "../../../static/images/Logo.png";
import SearchGrid from "./SearchGrid";
import {Redirect} from "react-router";
import AsyncComponent from "../../AsyncComponent";
import HeroGrid from "./HeroGrid";
import MoviePremiere from "./premiere/MoviePremiere";

@inject("rootStore")
@inject("siteStore")
@observer
class Site extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      toggle: false
    };

    this.PlayTitle = this.PlayTitle.bind(this);
    this.TurnOnToggle = this.TurnOnToggle.bind(this);
    this.TurnOffToggle = this.TurnOffToggle.bind(this);
    this.ShowTitle = this.ShowTitle.bind(this);
    this.Content = this.Content.bind(this);
    this.ViewModal = this.ViewModal.bind(this);
  }

  async PlayTitle(title) {
    try {
      this.setState({loading: true});

      // Clicked 'title' is actually a collection
      if(["site", "series", "season"].includes(title.title_type)) {
        this.props.siteStore.LoadSite(title.objectId);
      } else {
        await this.props.siteStore.SetActiveTitle(title);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load title:");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      this.setState({loading: false});
    }
  }

  TurnOnToggle(title) {
    try {
      this.props.siteStore.SetModalTitle(title);
      this.setState({toggle: true});
    } catch (error) {
      console.error("Failed to change title:");
      console.error(error);
    }
  }

  TurnOffToggle() {
    try {
      this.props.siteStore.SetModalTitle(null);
      this.setState({toggle: false});
    } catch (error) {
      console.error("Failed to change title:");
      console.error(error);
    }
  }

  ShowTitle() {
    return <ViewTitle key={`active-title-${this.props.siteStore.activeTitle.titleId}`} />;
  }

  MoviePremiere() {
    return <MoviePremiere title={this.props.siteStore.siteInfo.assets.titles[4]} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle}/>;
  }

  Content() {
    const featuredTitle = this.props.siteStore.siteInfo.assets.titles[4]; //Hardcoded a feature title
    // console.log('series:');
    // console.log(this.props.siteStore.siteInfo.assets.series);

    if(this.props.siteStore.searchQuery) {
      return (
        <LoadingElement className="loader" loading={this.props.siteStore.searching}>
          <SearchGrid
            noTitlesMessage="No results found"
            name="Search Results"
            titles={this.props.siteStore.searchResults}
            modalClose={this.TurnOffToggle}
            modalOpen={this.TurnOnToggle}
            playTitle={this.PlayTitle}
            trailers={false}
            shouldPlay={false}
            isEpisode={false}
          />
        </LoadingElement>
      );
    }

    return (
      <React.Fragment>
        <HeroView title={featuredTitle} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle}/>
        {/* <HeroGrid titles={this.props.siteStore.siteInfo.assets.titles} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle}/> */}
        { this.props.siteStore.siteInfo.playlists.map(playlist =>
          <SwiperGrid
            key={`title-reel-playlist-${playlist.playlistId}`}
            name={playlist.name}
            titles={playlist.titles}
            modalClose={this.TurnOffToggle}
            modalOpen={this.TurnOnToggle}
            playTitle={this.PlayTitle}
            trailers={false}
            shouldPlay={false}
            isEpisode={false}
          />
        )}
      
        <SwiperGrid name="All Titles" titles={this.props.siteStore.siteInfo.assets.titles} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle} trailers={false} shouldPlay={false} isEpisode={false}/>
        <SwiperGrid name="Series" titles={this.props.siteStore.siteInfo.assets.series} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle} trailers={false} shouldPlay={false} isEpisode={false}/>
        <SwiperGrid name="Channels" titles={this.props.siteStore.siteInfo.assets.channels} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle} trailers={false} shouldPlay={false} isEpisode={false}/>
      </React.Fragment>
    );
  }

  ViewModal(activeTitle) {
    return <Modal title={activeTitle} toggle={this.state.toggle} modalClose={this.TurnOffToggle} playTitle={this.PlayTitle}/>;
  }

  ViewHeader() {
    return (
      <header className="header">
        <ImageIcon className="header__logo" icon={Logo} label="Eluvio" onClick={this.props.rootStore.ReturnToApps}/>
        { this.props.siteStore.showPremiere ? null : <NewSearchBar key={`search-bar-${this.props.siteStore.searchQuery}`} />}
      </header>
    );
  }

  render() {
    if(this.props.match.params.siteSelectorId && !this.props.rootStore.accessCode) {
      return <Redirect to={`/code/${this.props.match.params.siteSelectorId}`} />;
    }
    // This determines whether it's a single movie premiere or library
    this.props.siteStore.setPremiere();

    return (
      <AsyncComponent
        Load={() => this.props.siteStore.LoadSite(this.props.match.params.siteId, this.props.match.params.writeToken)}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }

          return (
            <div className="site" id="site">
              { this.props.siteStore.activeTitle ? null : this.ViewHeader()}
              <LoadingElement loading={this.props.siteStore.loading}>
                { this.props.siteStore.activeTitle ? this.ShowTitle() : (this.props.siteStore.showPremiere ? this.MoviePremiere() : this.Content())}
                { this.props.siteStore.modalTitle ? this.ViewModal(this.props.siteStore.modalTitle) : null }
              </LoadingElement>
            </div>
          );
        }}
      />
    );
  }
}

export default Site;
