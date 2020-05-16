import React from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import TitleIcon from "./TitleIcon";

@inject("siteStore")
@observer
class TitleReel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startIndex: 0,
      visible: 5
    };
  }

  render() {
    if(!this.props.titles || this.props.titles.length === 0) { return null; }

    let titles = this.props.titles;
    if(this.props.siteStore.searchQuery) {
      titles = titles.filter(title => this.props.siteStore.filteredTitles.includes(title.objectId));
    }

    if(titles.length === 0) { return null; }

    const showLeft = this.state.startIndex !== 0;
    const showRight = this.state.startIndex + this.state.visible < this.props.titles.length;

    return (
      <div className="title-reel-container">
        <h3 className="title-reel-header">{ this.props.name }</h3>
        <div className="title-reel">
          <div
            className={`reel-arrow reel-arrow-left ${showLeft ? "" : "hidden"}`}
            onClick={event => {
              event.stopPropagation();
              this.setState({startIndex: this.state.startIndex - 1});
            }}
          >
            ➢
          </div>

          <div className="title-reel-titles">
            {
              titles.map((title, index) => (
                <TitleIcon
                  key={`title-reel-title-${this.props.name}-${index}`}
                  title={title}
                  visible={index >= this.state.startIndex && index < this.state.startIndex + this.state.visible}
                />
              ))
            }
          </div>

          <div
            className={`reel-arrow reel-arrow-right ${showRight ? "" : "hidden"}`}
            onClick={event => {
              event.stopPropagation();
              this.setState({startIndex: this.state.startIndex + 1});
            }}
          >
            ➢
          </div>
        </div>
      </div>
    );
  }
}

TitleReel.propTypes = {
  name: PropTypes.string.isRequired,
  titles: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired
};

export default TitleReel;
