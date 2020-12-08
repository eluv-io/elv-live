import React from 'react';
import clsx from 'clsx';

import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import {ImageIcon} from "elv-components-js";
import Select from 'react-select';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withStyles } from "@material-ui/core/styles";

import AsyncComponent from "../support/AsyncComponent";
import StreamTabs from '../livestream/Stream/StreamTabs';
import Logo from "../../static/images/Logo.png";
import ViewStream from "../livestream/Stream/ViewStream";

const drawerWidth = 450;

const options = [
  { value: '0', label: 'MULTIVIEW 1' },
  { value: '1', label: 'MULTIVIEW 2' },
  { value: '2', label: 'MULTIVIEW 3' },
  { value: 'all', label: 'ALL VIEWS' },
];

const styles = theme => ({
  root: {
    display: 'flex',
    background: "black",
    height: "100vh",
    overflow: "hidden"
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "black",
    height: "75px"
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
    background: "black",
    height: "75px"
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    height: "75px",
    minHeight: "56px"
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    height: "100vh"
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
    height: "100vh"
  },
});

@inject("rootStore")
@inject("siteStore")
@observer
class Stream extends React.Component {

  state = {
    selectedOption: options[0].value,
    open: false,
    name: "",
    openMultiView: false,
    openedView: undefined,
    openedGridSpecs: ""
  };

  render() {
    if(!this.props.rootStore.client || (!this.props.rootStore.accessCode && !this.props.rootStore.chatClient)) {
      return <Redirect to={`/code`} />;
    }
  
    const handleDrawerOpen = () => {
      this.setState({open: true});
    };
  
    const handleDrawerClose = () => {
      this.setState({open: false});
    };
    const { classes } = this.props;

    const handleChange = e => {
      this.setState({selectedOption: e.value});
    }

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vw', `${vw}px`);

    const renderFeed = (selectedOption) => {
      if (selectedOption == 'all') {
        const handleClick = event => {
          this.setState({openMultiView: true, openedGridSpecs: event.currentTarget.style.gridArea,openedView: event.currentTarget.style});
          event.currentTarget.style.gridArea = '1 / 1 / 4 / 4';
          event.currentTarget.style.zIndex = '10';
          console.log('box clicked!');
        }
    
        const handleClose = () => {
          console.log(this.state.openedView)
          this.state.openedView.gridArea = this.state.openedGridSpecs;
          this.state.openedView.zIndex = '5';
          this.setState({openMultiView: false, openedGridSpecs: "",openedView: undefined});
          console.log('box closed!');
        }

        return (
          <div className="feedGrid">
            {this.state.openMultiView ?           
            <div className="video-close" onClick={handleClose}>
              <span className="video-close-span">Return to all Views</span>
            </div> 
            : null}
  
            <div className="videobox1" onClick={handleClick}>
              <ViewStream feedOption={0} classProp = "testvideo" mutedOption = {true} showControls = {false}/>
              <h4 className="video-heading">
                <span className="video-heading-span">MAIN</span>
              </h4>
            </div>
            <div className="videobox2" onClick={handleClick}>
              <ViewStream feedOption={1} classProp = "testvideo" mutedOption = {true} showControls = {false}/>
              <h4 className="video-heading">
                <span className="video-heading-span">FULLSHOT</span>
              </h4>
            </div>
            <div className="videobox3" onClick={handleClick}>
              <ViewStream feedOption={2} classProp = "testvideo" mutedOption = {true} showControls = {false}/>
              <h4 className="video-heading">
                <span className="video-heading-span">SKYVIEW</span>
              </h4>
            </div>
            <div className="videobox4" onClick={handleClick}>
              <ViewStream feedOption={2} classProp = "testvideo" mutedOption = {true} showControls = {false}/>
              <h4 className="video-heading">
                <span className="video-heading-span">CROWD</span>
              </h4>
            </div>
            <div className="videobox5" onClick={handleClick}>
              <ViewStream feedOption={2} classProp = "testvideo" mutedOption = {true} showControls = {false}/>
              <h4 className="video-heading">
                <span className="video-heading-span">VVIP</span>
              </h4>
            </div>
            <div className="videobox6" onClick={handleClick}>
              <ViewStream feedOption={2} classProp = "testvideo" mutedOption = {true} showControls = {false}/>
              <h4 className="video-heading">
                <span className="video-heading-span">CLOSER</span>
              </h4>
            </div>
          </div>
        );
      } else {
        return (
          <div className="stream-container__streamBox--videoBox">
            <ViewStream feedOption={selectedOption} classProp = "stream-container__streamBox--video" mutedOption = {false} showControls = {true}/>
          </div>
        );
      }
    }

    return (
      <AsyncComponent
        Load={async () => {
          await this.props.siteStore.LoadStreamSite(this.props.match.params.siteId, "");
        }}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }

          return (
            <div className={classes.root}>
              <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                  [classes.appBarShift]: this.state.open,
                })}
              >
                <Toolbar>
                  <div className="stream-nav">
                    <ImageIcon className="stream-nav__logo" icon={Logo} label="Eluvio" />
                    <div className="stream-nav__button-grp">
                      <Select
                        className="stream-nav__dropdown"
                        defaultValue={options[0]}
                        options={options}
                        onChange={handleChange}
                        isDisabled={false}
                        isLoading={false}
                        isClearable={false}
                        isSearchable={false}
                        autoFocus={false}
                      />
                      <div className="stream-nav__button-grp2">
                        <IconButton
                          color="inherit"
                          aria-label="open drawer"
                          edge="end"
                          onClick={handleDrawerOpen}
                          className={clsx(this.state.open && classes.hide)}
                          size="medium"
                        >
                          <MenuIcon />
                        </IconButton>

                        <IconButton
                          color="inherit"
                          aria-label="close drawer"
                          edge="end"
                          onClick={handleDrawerClose}
                          className={clsx(!(this.state.open) && classes.hide)}
                          size="medium"
                        >
                          {<ChevronRightIcon />}
                        </IconButton>
                      </div>
                    </div>
                  </div>            
                </Toolbar>
                
                </AppBar>
                <main
                  className={clsx(classes.content, {
                    [classes.contentShift]: this.state.open,
                  })}
                >
                  <div className={classes.drawerHeader} />

                  <div className="stream-container">
                    <div className="stream-container__streamBox">
                      {renderFeed(this.state.selectedOption)}
                      {/* <Timer classProp="ticket-icon-clock" divProp="stream-countdown"/> */}

                      <div className="stream-container__streamBox--info">
                        <h2 className="stream-container__streamBox--info__subtitle">
                          Rita Ora 
                        </h2>
                        <h1 className="stream-container__streamBox--info__title">
                          RO3 World Tour - Eiffel Tower
                        </h1>
                      </div> 
                    </div>
                  </div>

                </main>
                <Drawer
                  className={classes.drawer}
                  variant="persistent"
                  anchor="right"
                  open={this.state.open}
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                >
                  <StreamTabs />
                </Drawer>
              </div>
          );
        }}
      />
    );
  }
}

export default withStyles(styles, { withTheme: true })(Stream);
