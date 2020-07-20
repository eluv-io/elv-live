import React from "react";
import {inject, observer} from "mobx-react";
import SwiperTitleIcon from "./SwiperTitleIcon";


/// SAME THING AS TITLE GRID BUT WITH DIFFERENT CLASSNAME
/// TODO: Might get rid of Carousel effect for the Search Grid

@inject("siteStore")
@observer
class TitleGrid extends React.Component {
  render() {
    const noTitles = (!this.props.titles || this.props.titles.length === 0);
    
    return (
      <div className={this.props.trailers === true ? "title-grid__trailer" : "title-grid__search"}>
        <h1 className="title-heading"> 
          { noTitles ? this.props.noTitlesMessage :this.props.name } 
        </h1>

        <div className="title-grid-container">
          {
            this.props.titles.map((title, index) => {
              return (
                <SwiperTitleIcon
                  key={`title-grid-title-${this.props.name}-${index}`}
                  large = {false}
                  title={title}
                  visible
                  episode= {index}
                  isEpisode = {this.props.isEpisode}
                  trailers={this.props.trailers}
                  shouldPlay={this.props.shouldPlay}
                  isPoster = {this.props.isPoster}
                />
              );
            })
          }
        </div>

      </div>
    );
  }
}

export default TitleGrid;