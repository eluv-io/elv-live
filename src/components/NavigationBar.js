import React, { Component } from 'react';
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import {FaSearch} from "react-icons/fa";
import styled from "styled-components";

@inject("rootStore")
@inject("siteStore")
@observer
class NavigationBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: this.props.siteStore.searchQuery,
      scrolling: false
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

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  /** changes the scrolling state depending on the Y-position */
  handleScroll = (event) => {
    if (window.scrollY === 0) {
      this.setState({ scrolling: false });
    }
    else if (window.scrollY > 50) {
      this.setState({ scrolling: true });
    }
  }


  render() {
    // if(!this.props.siteStore.searchIndex) { return null; }

    const { scrolling } = this.state;
    const customLogo = this.props.siteStore.logoUrl ? this.props.siteStore.logoUrl : Logo;
    const NavBar = styled.nav`
      &.black {
        background-color: ${this.props.siteStore.backgroundColor};
        width: 100vw;
      }
    }
    `;
    return (
      <NavBar className={"navigation " + (scrolling ? "black" : "")} >
        <ul className="navigation__container">
          <ImageIcon className="navigation__container--logo" icon={customLogo} label="Eluvio" onClick={this.props.rootStore.ReturnToApps}/>


          <div className="navigation__container--search">
            <FaSearch className="logo"/>
            <input
              // onChange={showMovies}
              // value={this.state.search} 
              className="navigation__container--search__input"
              // onChange={this.HandleSearchChange}
              type="text"
              placeholder="Title, genres, series" 
              // autoFocus={this.props.siteStore.searchQuery}
            />
          </div>

        </ul>
      </NavBar>
    )
  }
}

export default NavigationBar; 