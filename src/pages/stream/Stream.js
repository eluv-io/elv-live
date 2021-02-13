import React, {lazy, Suspense} from "react";
import clsx from "clsx";

import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import { NavLink } from "react-router-dom";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { withStyles } from "@material-ui/core/styles";
import ImageIcon from "Common/ImageIcon";

import AsyncComponent from "Common/AsyncComponent";

import LightLogo from "Images/logo/lightEluvioLiveLogo.png";
import DarkLogo from "Images/logo/darkEluvioLiveLogo.png";

const StreamPlayer = lazy(() => import("./player/StreamPlayer"));
const LiveChat = lazy(() => import("./components/LiveChat"));

const drawerWidth = 450;

const styles = theme => ({
  root: {
    display: "flex",
    color: "black",
    maxHeight: "100vh",
    overflow: "hidden",
    position: "fixed",
    width: "100%",
    scrollbarStyles: {
      overflowY: "scroll",
      "&::-webkit-scrollbar": {
        width: "0px",
        display: "none",
        backgroundColor: "transparent"
      },
      "&::-webkit-scrollbar-track": {
        boxShadow: "inset 0 0 0px rgba(0,0,0,0.00)",
        webkitBoxShadow: "inset 0 0 0px rgba(0,0,0,0.00)",
        width: "0px",
        display: "none",
        backgroundColor: "transparent"

      },
      "&::-webkit-scrollbar-thumb": {
        outline: "0px solid slategrey",
        borderRadius: 0,
        width: "0px",
        display: "none",
        backgroundColor: "transparent"
      }
    }

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
      activeStream: 0
    };
  }

  Sponsors() {
    return (
      <div className="sponsor-info-container__img-container">
        {
          this.props.siteStore.sponsors.map((sponsor, index) =>
            <img
              src={sponsor.image_url}
              className="stream-sponsor-img"
              alt={sponsor.name}
              key={`sponsor-image-${index}`}
            />
          )
        }
      </div>
    );
  }

  render() {
    if(!this.props.rootStore.client || !this.props.rootStore.streamAccess) {
      //return <Redirect to={this.props.siteStore.SitePath("code")} />;
    }

    const handleDrawerOpen = () => {
      this.setState({open: true});
    };

    const handleDrawerClose = () => {
      this.setState({open: false});
    };

    const { classes } = this.props;

    return (
      <div className={`stream-root ${clsx(classes.root)}`}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.state.open,
          })}
        >
          <Toolbar>
            <div className="stream-nav">
              <NavLink to={this.props.siteStore.baseSitePath}>
                <ImageIcon className="stream-nav__logo" icon={this.props.siteStore.darkMode ? LightLogo : DarkLogo } label="Eluvio" />
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
                    <ChevronRightIcon />
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
                <Suspense fallback={<div />}>
                  <AsyncComponent
                    Load={this.props.siteStore.LoadStreams}
                    loadingSpin={true}
                    render={() => {
                      return (
                        <StreamPlayer />
                      );
                    }}
                  />
                </Suspense>
              </div>
              <div className="stream-container__streamBox--info">
                <div className="stream-info-container">
                  <h2 className="stream-info-container__subtitle">
                    { this.props.siteStore.streamPageInfo.subheader }
                  </h2>
                  <h1 className="stream-info-container__title">
                    { this.props.siteStore.streamPageInfo.header }
                  </h1>
                </div>

                { this.Sponsors() }
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
          <Suspense fallback={<div />}>
            <LiveChat onDarkMode={this.props.siteStore.darkMode} />
          </Suspense>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Stream);
