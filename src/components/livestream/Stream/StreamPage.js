import React from 'react';
import clsx from 'clsx';

import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withStyles } from "@material-ui/core/styles";
import {ImageIcon} from "elv-components-js";

import AsyncComponent from "../../support/AsyncComponent";
import LiveChat from "./LiveChat";
import Switch from "../../support/Switch";
import MultiView from "./MultiView";
import BitmovinPlayer from "./BitmovinPlayer";
import { multiviewConfig } from "../../../assets/data";

// import StreamTabs from './StreamTabs';
import lightLogo from "../../../assets/images/logo/lightLogo.png";
import NavyLogo from "../../../assets/images/logo/navyLogo.png";
import loreal from "../../../assets/images/sponsor/loreal.png";

const drawerWidth = 450;

const styles = theme => ({
  lightRoot: {
    display: 'flex',
    background: "rgba(245, 239, 234, .8)",
    color: "black"
  },
  darkRoot: {
    display: 'flex',
    background: "#121212",
    color: "white"
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "transparent",
    height: "75px"
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
    background: "transparent",
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
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0
  },
});

@inject("rootStore")
@inject("siteStore")
@observer
class Stream extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      name: "",
      switchValue: false,
      activeStream: 0,
      darkSwitch: false
    };
  }

  render() {
    // if(!this.props.rootStore.client || (!this.props.rootStore.accessCode && !this.props.rootStore.chatClient)) {
    //   return <Redirect to={`/d457a576/code`} />;
    // }
    if(!this.props.siteStore.client) { return null; }

    const handleDrawerOpen = () => {
      this.setState({open: true});
    };
  
    const handleDrawerClose = () => {
      this.setState({open: false});
    };
    const handleDarkModeSwitch = () => {
      this.setState({darkSwitch: (!this.state.darkSwitch)})
      // console.log(this.state.darkSwitch);
    }

    // const setStream = (streamIndex) => {
    //   this.setState({activeStream: streamIndex});
    //   if (streamIndex === 6) {
    //     for (let i = 0; i < 6; i++) {
    //       document.getElementById(`active-stream-${i}`).controls = false;
    //       document.getElementById(`active-stream-${i}`).play = true;
    //     }
    //     // document.getElementById(`active-stream-0`).play = false;
    //   } else if (this.state.switchValue) {
    //     this.setState({switchValue: false})
    //     setTimeout(() => {
    //       document.getElementById(`active-stream-${streamIndex}`).controls = true}, 500);
    //   }
    // }

    // const handleSwitch = () => {
    //   this.setState({switchValue: !(this.state.switchValue)})
    //   if (this.state.switchValue === false) {
    //     setStream(6);
    //   }
    // }

    const { classes } = this.props;

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vw', `${vw}px`);


    return (
      <AsyncComponent
        Load={async () => {
          const siteId = await this.props.rootStore.RedeemCode(
            "alec.jo@berkeley.edu",
            "gL5995"
          );
          await this.props.siteStore.LoadStreamSite(siteId, "");
        }}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }

          return (
            <div className={clsx(classes.lightRoot, {
              [classes.darkRoot]: this.state.darkSwitch,
            })}>
              <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                  [classes.appBarShift]: this.state.open,
                })}
              >
                <Toolbar>
                  <div className="stream-nav">
                    {/* <h1 className="stream-nav__title"> Eluvio Live </h1> */}
                    <ImageIcon className="stream-nav__logo" icon={this.state.darkSwitch ?lightLogo : NavyLogo} label="Eluvio" />

                    <div className="stream-nav__button-grp">

                      <div className="stream-nav__button-grp2">
                        <IconButton
                          color="inherit"
                          aria-label="open drawer"
                          edge="end"
                          onClick={handleDrawerOpen}
                          className={clsx(this.state.open && classes.hide)}
                          size="medium"
                        >
                          <MenuIcon style={this.state.darkSwitch ?{ color: "white" } : { color: "black" }} />
                        </IconButton>

                        <IconButton
                          color="inherit"
                          aria-label="close drawer"
                          edge="end"
                          onClick={handleDrawerClose}
                          className={clsx(!(this.state.open) && classes.hide)}
                          size="medium"
                        >
                          <ChevronRightIcon style={this.state.darkSwitch ?{ color: "white" } : { color: "black" }} />
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
                    <BitmovinPlayer handleDarkToggle={handleDarkModeSwitch} />

                      <div className="stream-container__streamBox--info">
                        <div className="stream-info-container">
                          <h2 style={this.state.darkSwitch ? { color: "rgba(255, 255, 255, 0.7)!important" } : { color: "rgba(0, 0, 0,.7) !important" }}  className="stream-info-container__subtitle">
                            Rita Ora Presents 
                          </h2>
                          <h1 style={this.state.darkSwitch ? { color: "rgba(255, 255, 255, 0.9) !important" } : { color: "black !important" }}  className="stream-info-container__title">
                            RO3 World Tour - Eiffel Tower
                          </h1>
                        </div>

                        <div className="sponsor-info-container"> 
                          <span style={this.state.darkSwitch ? { color: "rgba(255, 255, 255, 0.9)  !important" } : { color: "black !important" }} className="sponsor-info-container__title">
                            Presented By 
                          </span>
                          <div className="sponsor-info-container__img-container"> 
                            <img src={loreal} className="stream-sponsor-img" />
                          </div>
                        </div>
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
                  <LiveChat onDarkMode={this.state.darkSwitch}/>
                </Drawer>
              </div>
          );
        }}
      />
    );
  }
}

export default withStyles(styles, { withTheme: true })(Stream);