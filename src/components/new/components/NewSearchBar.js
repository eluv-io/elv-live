import React from "react";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class NewSearchBar extends React.Component {
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
      <div className="header__search">
        <input value={this.state.search} className="header__search__input" onChange={this.HandleSearchChange} placeholder="Search Titles" autoFocus={this.props.siteStore.searchQuery} />
      </div>
    );
  }
}

export default NewSearchBar;
