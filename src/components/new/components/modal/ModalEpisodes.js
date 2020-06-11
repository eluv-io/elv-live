import React from "react";
import SwiperGrid from "../SwiperGrid";
import {inject, observer} from "mobx-react";
import { Dropdown } from "semantic-ui-react";

@inject("rootStore")
@inject("siteStore")
@observer
class ModalEpisodes extends React.Component {
  constructor(props) {
    super(props);

    const seasons = [];
    let allSeasons = this.props.siteStore.currentSite.seasons;

    for(let i = 0; i < allSeasons.length; i++) {
      seasons.push({
        key: this.props.siteStore.currentSite.episodes,
        text: allSeasons[i].title,
        value: allSeasons[i].title
      });
    }

    this.state = {
      seasons,
      selected: null,
    };
  }

  onChange = (e, data) => {
    console.log(data);
    this.setState({ selected: data.value });
  }
  
  render() {
    const featuredTitle = this.props.title;
    const dropdownStyle = {
      width: "20rem",
      marginLeft: "6rem",
      marginTop: "3rem",
      // color: "rgba(0, 0, 0, 1)"
    };
    const { seasons, selected } = this.state;


    return (
      <div className={`modal__container ${this.props.showTab === "Episodes" ? "" : "hide"}`}>
        <h1 className="modal__title">
          {featuredTitle.displayTitle}
        </h1>
        <Dropdown
          placeholder={this.state.seasons[0].text}
          fluid
          selection
          options={this.state.seasons}
          value= {selected}
          style={dropdownStyle}
          onChange={this.onChange}
        />
        <SwiperGrid name="" titles={this.props.siteStore.currentSite.episodes} modalClose={this.props.modalClose} modalOpen={this.props.modalOpen} playTitle={this.props.playTitle} trailers={true} shouldPlay={true} isEpisode={true}/>
      </div>
    );
  }
}

export default ModalEpisodes;
