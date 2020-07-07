import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import SwiperGrid from "./SwiperGrid";
import ViewTitle from "./ViewTitle";
import Modal from "./modal/Modal";
import SearchBar from "./SearchBar";
import Logo from "../static/images/Logo.png";
import SearchGrid from "./SearchGrid";
import {Redirect} from "react-router";
import AsyncComponent from "./AsyncComponent";
import MoviePremiere from "./premiere/MoviePremiere";
import HeroGrid from "./hero/HeroGrid";

const FormatName = (name) => {
  return (name || "")
    .split(/[_, \s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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

  ArrangementEntry(entry, i) {
    const key = `arrangement-entry-${i}`;

    let name, titles;
    switch (entry.type) {
      case "header":
        return <h1 key={key}>{entry.options.text}</h1>;
      case "playlist":
        const playlist = this.props.siteStore.siteInfo.playlists.find(playlist => playlist.slug === entry.playlist_slug);
        name = entry.label;
        titles = playlist.titles;
        break;
      case "asset":
        name = entry.label;
        titles = this.props.siteStore.siteInfo.assets[entry.name];
        break;
      default:
        // eslint-disable-next-line no-console
        console.error("Unknown Asset Type:", entry.type);
        // eslint-disable-next-line no-console
        console.error(entry);
        return;
    }

    const variant = entry.options && entry.options.variant;
    switch (entry.component) {
      case "feature":
        return (
          <HeroGrid
            key={key}
            titles={titles}
            modalClose={this.TurnOffToggle}
            modalOpen={this.TurnOnToggle}
            playTitle={this.PlayTitle}
          />
        );
      case "carousel":
        return (
          <SwiperGrid
            key={key}
            name={name}
            titles={titles}
            modalClose={this.TurnOffToggle}
            modalOpen={this.TurnOnToggle}
            playTitle={this.PlayTitle}
            trailers={false}
            shouldPlay={false}
            isEpisode={false}
            isPoster={variant === "portrait"}
          />
        );
      case "grid":
        // TODO
        break;
      default:
        // eslint-disable-next-line no-console
        console.error("Unknown component:", entry.component);
        // eslint-disable-next-line no-console
        console.error(entry);
    }
  }

  Content() {
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

    const siteCustomization = this.props.siteStore.siteCustomization || {};
    let arrangement = siteCustomization.arrangement;

    if(!arrangement) {
      // Default arrangement: Playlists then assets, all medium carousel
      arrangement = this.props.siteStore.siteInfo.playlists.map(playlist => ({
        type: "playlist",
        name: playlist.name,
        label: playlist.name,
        playlist_slug: playlist.slug,
        component: "carousel",
        options: {
          variant: "landscape",
          width: "medium"
        }
      }));

      arrangement = arrangement.concat(
        Object.keys(this.props.siteStore.siteInfo.assets).sort().map(key => ({
          type: "asset",
          name: key,
          label: FormatName(key),
          component: "carousel",
          options: {
            variant: "landscape",
            width: "medium"
          }
        }))
      );
    }

    return arrangement.map((entry, i) => this.ArrangementEntry(entry, i));
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
