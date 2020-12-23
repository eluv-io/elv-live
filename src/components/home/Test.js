// import React from 'react';
// import clsx from 'clsx';

// import {inject, observer} from "mobx-react";
// import {Redirect} from "react-router";

// import Drawer from '@material-ui/core/Drawer';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';

// import { withStyles } from "@material-ui/core/styles";

// import AsyncComponent from "../support/AsyncComponent";
// import BitmovinPlayer from '../livestream/Stream/BitmovinPlayer';

// const drawerWidth = 450;

// const styles = theme => ({
//   root: {
//     display: 'flex',
//     background: "rgba(245, 239, 234, .8)",
//     height: "100vh",
//     overflow: "hidden"
//   },
//   appBar: {
//     transition: theme.transitions.create(['margin', 'width'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     background: "transparent",
//     height: "75px"
//   },
//   appBarShift: {
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(['margin', 'width'], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginRight: drawerWidth,
//     background: "transparent",
//     height: "75px"
//   },
//   title: {
//     flexGrow: 1,
//   },
//   hide: {
//     display: 'none',
//   },
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   drawerHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     ...theme.mixins.toolbar,
//     justifyContent: 'flex-start',
//     height: "75px",
//     minHeight: "56px"
//   },
//   content: {
//     flexGrow: 1,
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     marginRight: -drawerWidth,
//     height: "100vh"
//   },
//   contentShift: {
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginRight: 0,
//     height: "100vh"
//   },
// });

// @inject("rootStore")
// @inject("siteStore")
// @observer
// class Test extends React.Component {
  
//   constructor(props) {
//     super(props);

//     this.state = {
//       open: false,
//       name: "",
//       switchValue: false,
//       activeStream: 0
//     };
//   }

//   render() {
//     // if(!this.props.rootStore.client || (!this.props.rootStore.accessCode && !this.props.rootStore.chatClient)) {
//     //   return <Redirect to={`/d457a576/code`} />;
//     // }
  
//     // const handleDrawerOpen = () => {
//     //   this.setState({open: true});
//     // };
  
//     // const handleDrawerClose = () => {
//     //   this.setState({open: false});
//     // };

//     // const setStream = (streamIndex) => {
//     //   this.setState({activeStream: streamIndex});
//     //   if (streamIndex === 6) {
//     //     for (let i = 0; i < 6; i++) {
//     //       document.getElementById(`active-stream-${i}`).controls = false;
//     //       document.getElementById(`active-stream-${i}`).play = true;
//     //     }
//     //     // document.getElementById(`active-stream-0`).play = false;
//     //   } else if (this.state.switchValue) {
//     //     this.setState({switchValue: false})
//     //     setTimeout(() => {
//     //       document.getElementById(`active-stream-${streamIndex}`).controls = true}, 500);
//     //   }
//     // }

//     const handleSwitch = () => {
//       this.setState({switchValue: !(this.state.switchValue)})
//       if (this.state.switchValue === false) {
//         setStream(6);
//       }
//     }

//     const { classes } = this.props;

//     // let vh = window.innerHeight * 0.01;
//     // document.documentElement.style.setProperty('--vh', `${vh}px`);
//     // let vw = window.innerWidth * 0.01;
//     // document.documentElement.style.setProperty('--vw', `${vw}px`);

//     return (

//       <AsyncComponent
//         Load={async () => {
//           const siteId = await this.props.rootStore.RedeemCode(
//             "alec.jo@berkeley.edu",
//             "gL5995"
//           );
//           await this.props.siteStore.LoadStreamSite(siteId, "");
//         }}
//         render={() => {
//           if(!this.props.siteStore.siteInfo) { return null; }

//           return (
//             <div className={classes.root}>
//               <AppBar
//                 position="fixed"
//                 className={clsx(classes.appBar, {
//                   [classes.appBarShift]: this.state.open,
//                 })}
//               >
//                 <Toolbar>
                     
//                 </Toolbar>
                
//                 </AppBar>
//                 <main
//                   className={clsx(classes.content, {
//                     [classes.contentShift]: this.state.open,
//                   })}
//                 >
//                   <div className={classes.drawerHeader} />

//                   <div className="stream-container">
//                     <div className="stream-container__streamBox">
//                     <BitmovinPlayer feed={0} />
//                     </div>
//                   </div>

//                 </main>
//                 <Drawer
//                   className={classes.drawer}
//                   variant="persistent"
//                   anchor="right"
//                   open={this.state.open}
//                   classes={{
//                     paper: classes.drawerPaper,
//                   }}
//                 >
//                   {/* <LiveChat /> */}
//                 </Drawer>
//               </div>
//           );
//         }}
//       />
//     );
//   }
// }

// export default withStyles(styles, { withTheme: true })(Test);