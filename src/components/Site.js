import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import SwiperGrid from "./grid/SwiperGrid";
import ViewTitle from "./ViewTitle";
import Modal from "./modal/Modal";
import SearchBar from "./SearchBar";
import Logo from "../static/images/Logo.png";
import SearchGrid from "./grid/SearchGrid";
import {Redirect} from "react-router";
import AsyncComponent from "./AsyncComponent";
import MoviePremiere from "./premiere/MoviePremiere";
import HeroGrid from "./hero/HeroGrid";
// import HeroView from "./hero/HeroView";

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
      // console.error("Failed to change title:");
      // console.error(error);
    }
  }

  TurnOffToggle() {
    try {
      this.props.siteStore.SetModalTitle(null);
      this.setState({toggle: false});
    } catch (error) {
      // console.error("Failed to change title:");
      // console.error(error);
    }
  }

  ShowTitle() {
    return <ViewTitle key={`active-title-${this.props.siteStore.activeTitle.titleId}`} />;
  }

  MoviePremiere() {
    return <MoviePremiere title={this.props.siteStore.siteInfo.assets.titles[4]} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle}/>;
  }

  Content() {
    // const featuredTitle = this.props.siteStore.siteInfo.assets.titles[4]; 

    if(this.props.siteStore.searchQuery) {
      return (
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
      );
    }
    
    return (
      <React.Fragment>
        {/* 
          Hero View/Grid Elements:
          
          Toggle between Hero View and HeroGrid by choosing HeroView or HeroGrid as the component
        */}

        {/* <HeroView title={featuredTitle} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle}/> */}

        <HeroGrid titles={this.props.siteStore.siteInfo.playlists[1].titles} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle}/>


        {/* 
          Swiper Grid/Poster Grid Elements:
          
          Toggle between normal and poster grids by setting isPoster to true 
        */}

        <SwiperGrid name="All Titles" titles={this.props.siteStore.siteInfo.assets.titles} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle} trailers={false} shouldPlay={false} isEpisode={false} isPoster={false}/>
        <SwiperGrid name="Most Viewed" titles={this.props.siteStore.siteInfo.assets.titles} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle} trailers={false} shouldPlay={false} isEpisode={false} isPoster={true}/>

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
            isPoster={false}
          />
        )}

        {/* Hardcoded Netflix Originals here */}
        <SwiperGrid name="Netflix Originals" titles={this.props.siteStore.siteInfo.assets.titles} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle} trailers={false} shouldPlay={false} isEpisode={false} isPoster={true}/>

        <SwiperGrid name="Series" titles={this.props.siteStore.siteInfo.assets.series} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle} trailers={false} shouldPlay={false} isEpisode={false} isPoster={false}/>
        <SwiperGrid name="Channels" titles={this.props.siteStore.siteInfo.assets.channels} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle} trailers={false} shouldPlay={false} isEpisode={false} isPoster={false}/>
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
        { this.props.siteStore.showPremiere ? null : <SearchBar key={`search-bar-${this.props.siteStore.searchQuery}`} />}
      </header>
    );
  }

  render() {
    if(this.props.match.params.siteSelectorId && !this.props.rootStore.accessCode) {
      return <Redirect to={`/code/${this.props.match.params.siteSelectorId}`} />;
    }

    ////////////////////////////////////////////////////////////////////////////////

    // This determines whether it's a single movie premiere or library

    // this.props.siteStore.setPremiere();

    ////////////////////////////////////////////////////////////////////////////////

    return (
      <AsyncComponent
        Load={() => this.props.siteStore.LoadSite(this.props.match.params.siteId, this.props.match.params.writeToken)}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }

          return (
            <div className="container">
              { this.props.siteStore.activeTitle ? null : this.ViewHeader()}
              { this.props.siteStore.activeTitle ? this.ShowTitle() : (this.props.siteStore.showPremiere ? this.MoviePremiere() : this.Content())}
              { this.props.siteStore.modalTitle ? this.ViewModal(this.props.siteStore.modalTitle) : null }
            </div>
          );
        }}
      />
    );
  }
}

export default Site;
