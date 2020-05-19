import React from "react";
import {IconButton} from "elv-components-js";
import ClearSearchIcon from "../static/icons/clear.svg";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: this.props.siteStore.searchQuery
    };

    this.HandleSearchChange = this.HandleSearchChange.bind(this);
  }

  // Debounce filter input
  HandleSearchChange(event) {
    const value = event.target.value;

    if(!value) {
      this.props.siteStore.ClearSearch();
      this.setState({search: ""});
      return;
    }

    if(this.state.searchTimeout) {
      clearTimeout(this.state.searchTimeout);
    }

    this.setState({
      search: value,
      searchTimeout: setTimeout(
        async () => {
          await this.props.siteStore.SearchTitles({query: this.state.search});
        }, 750
      )
    });
  }

  render() {
    if(!this.props.siteStore.searchIndex) { return null; }

    return (
      <div className="title-search">
        <input value={this.state.search} onChange={this.HandleSearchChange} placeholder="Filter titles..." autoFocus={this.props.siteStore.searchQuery} />
        <IconButton icon={ClearSearchIcon} className="clear-search" title="Clear" onClick={() => this.HandleSearchChange({target: { value: "" }})} />
      </div>
    );
  }
}

export default SearchBar;
