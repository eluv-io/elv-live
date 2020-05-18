import React from "react";
import {inject, observer} from "mobx-react";
import {AsyncComponent, IconButton, ImageIcon, onEnterPressed} from "elv-components-js";

import BackIcon from "../static/icons/back.svg";
import PageBack from "../static/icons/Backward.svg";
import PageForward from "../static/icons/Forward.svg";

@inject("rootStore")
@observer
class ContentSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAvailableSites: true,
      libraryId: "",
      page: 1,
      perPage: 10,
      filter: "",
      filterInput: "",
      cacheId: "",
      count: 0
    };
  }

  Tabs() {
    if(!this.props.rootStore.availableSites || this.props.rootStore.availableSites.length === 0) {
      return null;
    }

    return (
      <nav className="tabs">
        <button
          className={this.state.showAvailableSites ? "active-tab" : ""}
          onClick={() => this.setState({showAvailableSites: true})}
        >
          Available Sites
        </button>
        <button
          className={this.state.showAvailableSites ? "": "active-tab"}
          onClick={() => this.setState({showAvailableSites: false})}
        >
          All
        </button>
      </nav>
    );
  }

  Objects() {
    const library = this.props.rootStore.libraries[this.state.libraryId];

    return (
      <div className="menu-entries" key={`menu-entries-${this.state.libraryId}`}>
        <h4>
          <ImageIcon
            label="Back"
            className="back-button"
            icon={BackIcon}
            onClick={() => this.setState({libraryId: "", cacheId: "", count: 0, page: 1})}
          />
          {library ? library.name : ""}
        </h4>

        <div className="menu-page-controls">
          <IconButton
            hidden={this.state.page === 1}
            icon={PageBack}
            title="Previous Page"
            onClick={() => this.setState({page: this.state.page - 1})}
          />
          <span
            title="Current Page"
            hidden={this.state.count === 0}
            className="current-page"
          >
            {this.state.page} / {Math.ceil(this.state.count / this.state.perPage)}
          </span>
          <IconButton
            hidden={this.state.perPage * this.state.page > this.state.count}
            icon={PageForward}
            title="Next Page"
            onClick={() => this.setState({page: this.state.page + 1})}
          />
        </div>

        <div className="menu-filter">
          <input
            placeholder="Filter..."
            value={this.state.filterInput}
            onChange={event => {
              this.setState({
                filterInput: event.target.value
              });

              clearTimeout(this.filterTimeout);

              this.filterTimeout = setTimeout(() => {
                this.setState({
                  page: 1,
                  filter: this.state.filterInput,
                  cacheId: "",
                  count: 0
                });
              }, 500);
            }}
          />
        </div>

        <AsyncComponent
          key={`objects-container-${this.state.filter}-${this.state.page}-${this.state.libraryId}`}
          Load={async () => {
            const paging = await this.props.rootStore.ListObjects({
              libraryId: this.state.libraryId,
              page: this.state.page,
              perPage: this.state.perPage,
              filter: this.state.filter,
              cacheId: this.state.cacheId,
              count: 0
            });

            this.setState({count: paging.items, cacheId: paging.cache_id});
          }}
        >
          {
            (this.props.rootStore.objects[this.state.libraryId] || []).length === 0 ?
              <div className="menu-empty">No Content Available</div> :
              <ul>
                {
                  (this.props.rootStore.objects[this.state.libraryId] || [])
                    .sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
                    .map(object => {
                      const onClick = () => this.props.rootStore.SetSiteId(object.objectId);

                      return (
                        <li
                          tabIndex={0}
                          onClick={onClick}
                          onKeyPress={onEnterPressed(onClick)}
                          key={`content-object-${object.objectId}`}
                        >
                          { object.name }
                        </li>
                      );
                    })
                }
              </ul>
          }
        </AsyncComponent>
      </div>
    );
  }

  Libraries() {
    const libraries = Object.values(this.props.rootStore.libraries)
      .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);

    return (
      <AsyncComponent
        key="libraries-container"
        Load={this.props.rootStore.ListLibraries}
      >
        {
          libraries.length === 0 ?
            <div className="menu-empty">No Libraries Available</div> :
            <div className="menu-entries">
              <ul>
                {
                  libraries.map(library => {
                    const onClick = () => this.setState({libraryId: library.libraryId});
                    return (
                      <li
                        tabIndex={0}
                        onKeyPress={onEnterPressed(onClick)}
                        onClick={onClick}
                        key={`library-${library.libraryId}`}
                      >
                        {library.name}
                      </li>
                    );
                  })
                }
              </ul>
            </div>
        }
      </AsyncComponent>
    );
  }

  AvailableSites() {
    return (
      <div className="menu-entries" key="menu-entries-available">
        {
          <ul>
            {
              this.props.rootStore.availableSites
                .sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
                .map(object => {
                  const onClick = () => this.props.rootStore.SetSiteId(object.objectId);

                  return (
                    <li
                      tabIndex={0}
                      onClick={onClick}
                      onKeyPress={onEnterPressed(onClick)}
                      key={`content-object-${object.objectId}`}
                    >
                      { object.name }
                    </li>
                  );
                })
            }
          </ul>
        }
      </div>
    );
  }

  render() {
    const showAvailable = this.props.rootStore.availableSites && this.props.rootStore.availableSites.length > 0 && this.state.showAvailableSites;

    return (
      <AsyncComponent Load={this.props.rootStore.LoadAvailableSites}>
        <div className="menu-container">
          <h1>Select a Site</h1>
          { this.Tabs() }
          { showAvailable ? this.AvailableSites() : (this.state.libraryId ? this.Objects() : this.Libraries()) }
        </div>
      </AsyncComponent>
    );
  }
}

export default ContentSelector;
