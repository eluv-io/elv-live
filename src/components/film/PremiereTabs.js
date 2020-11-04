import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ScheduleIcon from '@material-ui/icons/Schedule';
import InfoIcon from '@material-ui/icons/Info';

import Paper from '@material-ui/core/Paper';

// import LiveChat from "./LiveChat";
// import FanWall from './FanWall';
import PremiereOverview from "./PremiereOverview";
import Merch from "./Merch";
import Schedule from "./Schedule";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="stream-container__tabs--bottom"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 5000,
    backgroundColor: "black",
  },
  indicator: {
    backgroundColor: 'white',
    color: 'white',
  },
});


class PremiereTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 0,
    };
  }
  render() {
    // const classes = useStyles();
    // const [value, setValue] = React.useState(0);
    const { classes } = this.props;

    const handleChange = (event, newValue) => {
      this.setState({tab: newValue});
    };
    let showSchedule = 1;
    if (this.props.type == "series") {
      showSchedule = 2; 
    }


    return (
      <div className="premiereTabs">
        <Paper square className={classes.root}>
          <Tabs
            value={this.state.tab}
            onChange={handleChange}
            variant="fullWidth"
            disablefocusripple = "true"
            disableripple = "true"
            classes={{
              indicator: classes.indicator
            }}
          >
            <Tab icon={<InfoIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>OVERVIEW</span>} />
            {this.props.type == "series" ? <Tab icon={<ScheduleIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>EPISODE SCHEDULE</span>} /> : null}
            <Tab icon={<ShoppingCartIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>MERCH</span>} />

          </Tabs>
          
          <TabPanel value={this.state.tab} index={0}>
            <PremiereOverview title={this.props.title}/> 
          </TabPanel>
          {this.props.type == "series" ?
            <TabPanel value={this.state.tab} index={1}>
              <Schedule name={this.props.name} />
            </TabPanel>
            : null
          }
          <TabPanel value={this.state.tab} index={showSchedule}>
            <Merch />
          </TabPanel>
          
        </Paper>
      </div>
    );
        }
}
PremiereTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(PremiereTabs);

// import React from "react";
// import {inject, observer} from "mobx-react";
// import PremiereOverview from "./PremiereOverview";
// // import PremiereEpisodes from "./PremiereEpisodes";

// @inject("rootStore")
// @inject("siteStore")
// @observer
// class PremiereTabs extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       loading: false,
//       activeTab: "Overview",
//       tabs: ["Overview"],
//       showPlay: true
//     };
//   }

//   componentDidMount() {
//     // if(["series", "season"].includes(this.props.title.title_type)){
//     //   this.setState({tabs: ["Title Overview", "Episodes"]});
//     // } else if(["channel"].includes(this.props.title.title_type)) {
//     //   this.setState({tabs: ["Title Overview", "Live Schedule"]});
//     // }

//     // if(this.props.siteStore.premiere) {
//     //   this.setState({showPlay: false});
//     // }
//   }

//   Tabs() {
//     return (
//       <nav className="premiereTabs__tabs">
//         {
//           this.state.tabs.map(tab =>
//             <button
//               key={`active-title-tab-${tab}`}
//               className={tab === this.state.activeTab ? "active-tab" : ""}
//               onClick={() => {
//                 this.setState({activeTab: tab});
//               }}
//             >
//               { tab }
//             </button>
//           )
//         }
//       </nav>
//     );
//   }

//   render() {
//     // let eventInfo = this.props.siteStore.eventAssets.get(this.props.match.params.artist);

//     const featuredTitle = this.props.title;
    
//     return (
//       <div
//         className="premiereTabs"
//       >
//         { this.Tabs() }
//         {/* {(["series", "season"].includes(this.props.title.title_type)) ? <PremiereEpisodes title={featuredTitle} showTab={this.state.activeTab} /> : null} */}
//         <PremiereOverview title={featuredTitle} showTab={this.state.activeTab} />
//       </div>
//     );
//   }
// }

// export default PremiereTabs;