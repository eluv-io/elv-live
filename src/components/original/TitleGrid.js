import React from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import TitleIcon from "./TitleIcon";

@inject("siteStore")
@observer
class TitleGrid extends React.Component {
  render() {
    const noTitles = (!this.props.titles || this.props.titles.length === 0);
    if(!this.props.noTitlesMessage && noTitles) { return null; }

    return (
      <div className="title-container title-grid-container">
        <h3 className="title-grid-header">{ this.props.name }</h3>
        <div className="title-grid-titles">
          { noTitles ? <span className="no-titles-message">{ this.props.noTitlesMessage }</span> : null }
          {
            this.props.titles.map((title, index) => {
              return (
                <TitleIcon
                  key={`title-grid-title-${this.props.name}-${index}`}
                  title={title}
                  visible
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

TitleGrid.propTypes = {
  name: PropTypes.string.isRequired,
  noTitlesMessage: PropTypes.string,
  titles: PropTypes.arrayOf(
    PropTypes.object
  )
};

export default TitleGrid;
