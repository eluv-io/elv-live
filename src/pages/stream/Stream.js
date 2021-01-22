import React from "react";
import clsx from "clsx";

import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import { NavLink, withRouter } from "react-router-dom";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { withStyles } from "@material-ui/core/styles";
import {ImageIcon} from "elv-components-js";

import AsyncComponent from "Common/AsyncComponent";
import LiveChat from "./components/LiveChat";
import BitmovinPlayer from "./player/BitmovinPlayer";

import LightLogo from "Images/logo/lightEluvioLiveLogo.png";
import DarkLogo from "Images/logo/darkEluvioLiveLogo.png";

const drawerWidth = 450;

const styles = theme => ({
  lightRoot: {
    display: "flex",
    background: "rgba(245, 239, 234, .8)",
    color: "black"
  },
  darkRoot: {
    display: "flex",
    background: "#121212",
    color: "white"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "transparent",
    height: "75px"
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
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
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "inherit"
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
    height: "75px",
    minHeight: "56px",
    backgroundColor: "inherit"
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
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
      activeStream: 0,
      darkSwitch: false,

    };
  }

  render() {
    if(!this.props.rootStore.client || !this.props.rootStore.streamAccess) {
      return <Redirect to={`${this.props.siteStore.basePath}/code`} />;
    }

    const handleDrawerOpen = () => {
      this.setState({open: true});
    };
  
    const handleDrawerClose = () => {
      this.setState({open: false});
    };
    const handleDarkModeSwitch = () => {
      this.setState({darkSwitch: (!this.state.darkSwitch)});
    };

    let streamInfo= this.props.siteStore.eventSites[this.props.siteStore.siteSlug]["stream_app"][0];
    let sponsorInfo= this.props.siteStore.eventSites[this.props.siteStore.siteSlug]["sponsor"][0];

    const { classes } = this.props;

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
              <NavLink to={`${this.props.siteStore.basePath}/${this.props.siteStore.siteSlug}`}  >
                <ImageIcon className="stream-nav__logo" icon={this.state.darkSwitch ? LightLogo : DarkLogo} label="Eluvio" />
              </NavLink>


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
              <div className="stream-container__streamBox--videoBox">

                <AsyncComponent
                  Load={async () => {
                    await this.props.siteStore.LoadStreamObject(this.props.match.params.siteId);
                  }}
                  loadingSpin={true}
                  render={() => {
                    return (
                      <BitmovinPlayer handleDarkToggle={handleDarkModeSwitch} />
                    );
                  }}
                />
              </div>
              <div className="stream-container__streamBox--info">
                <div className="stream-info-container">
                  <h2 style={this.state.darkSwitch ? { color: "rgba(255, 255, 255, 0.7)!important" } : { color: "rgba(0, 0, 0,.7) !important" }}  className="stream-info-container__subtitle">
                    {streamInfo["subheader"]}
                  </h2>
                  <h1 style={this.state.darkSwitch ? { color: "rgba(255, 255, 255, 0.9) !important" } : { color: "black !important" }}  className="stream-info-container__title">
                    {streamInfo["header"]}
                  </h1>
                </div>

                <div className="sponsor-info-container"> 
                  <span style={this.state.darkSwitch ? { color: "rgba(255, 255, 255, 0.9)  !important" } : { color: "black !important" }} className="sponsor-info-container__title">
                    {sponsorInfo["stream_text"]}
                  </span>
                  <div className="sponsor-info-container__img-container"> 
                    <img src={this.props.siteStore.sponsorImage} className="stream-sponsor-img" />
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
  }
}

export default withStyles(styles, { withTheme: true })(Stream);