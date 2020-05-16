import React from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import TitleIcon from "./TitleIcon";

@inject("siteStore")
@observer
class TitleGrid extends React.Component {
  render() {
    if(!this.props.titles || this.props.titles.length === 0) { return null; }

    let titles = this.props.titles;
    if(this.props.siteStore.searchQuery) {
      titles = titles.filter(title => this.props.siteStore.filteredTitles.includes(title.objectId));
    }

    if(titles.length === 0) { return null; }

    return (
      <div className="title-grid-container">
        <h3 className="title-grid-header">{ this.props.name }</h3>
        <div className="title-grid-titles">
          {
            titles.map((title, index) => {
              if(this.props.siteStore.searchQuery && !this.props.siteStore.filteredTitles.includes(title.objectId)) {
                return null;
              }

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
  titles: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired
};

export default TitleGrid;
