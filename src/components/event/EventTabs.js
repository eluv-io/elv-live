import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ScheduleIcon from '@material-ui/icons/Schedule';
import InfoIcon from '@material-ui/icons/Info';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import Paper from '@material-ui/core/Paper';

// import LiveChat from "./LiveChat";
// import FanWall from './FanWall';
import FilmOverview from "./film/FilmOverview";
import Merch from "./Merch";
import Schedule from "./series/SeriesSchedule";
import ConcertSchedule from "./concert/ConcertSchedule";
import ConcertOverview from "./concert/ConcertOverview";
import ArtistInfo from "./concert/ArtistInfo";

import SeriesOverview from "./series/SeriesOverview";

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
    backgroundColor: "transparent",
  },
  indicator: {
    backgroundColor: 'white',
    color: 'white',
  },
});



class EventTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 0,
    };
  }

  ScheduleManager(type) {

    if (type == "series") {
      return (
        <TabPanel value={this.state.tab} index={1}>
          <Schedule name={this.props.name} />
        </TabPanel>
      )
    } else if (type == "concert") {
      return (
          <TabPanel value={this.state.tab} index={1}>
            <ConcertSchedule name={this.props.name} />
          </TabPanel>


      )
    } else {
      return null;
    }
  }
  
  render() {
    // const classes = useStyles();
    // const [value, setValue] = React.useState(0);
    const { classes } = this.props;

    const handleChange = (event, newValue) => {
      this.setState({tab: newValue});
    };
    let showSchedule = 1;
    if (this.props.type != "film") {
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
            <Tab icon={<InfoIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>EVENT OVERVIEW</span>} />
            {this.props.type != "film" ? <Tab icon={<ScheduleIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>{this.props.type == "series" ? "EPISODE SCHEDULE" : "UPCOMING SHOWS"}</span>} /> : null}
            <Tab icon={<ShoppingCartIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>MERCH</span>} />
            {this.props.type == "concert" ? <Tab icon={<MusicNoteIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>ARTIST</span>} />: null}

          </Tabs>
          
          <TabPanel value={this.state.tab} index={0}>
            {this.props.type == "concert" ?  <ConcertOverview title={this.props.title} name={this.props.name}/>  :  this.props.type == "film"  ? <FilmOverview title={this.props.title} name={this.props.name}/> : <SeriesOverview title={this.props.title} name={this.props.name}/>}
          </TabPanel>
          {this.ScheduleManager(this.props.type)}
          <TabPanel value={this.state.tab} index={showSchedule}>
            <Merch name={this.props.name}/>
          </TabPanel>
          <TabPanel value={this.state.tab} index={showSchedule}>
            <Merch name={this.props.name}/>
          </TabPanel>
          {this.props.type == "concert" ? 
          <TabPanel value={this.state.tab} index={3}>
            <ArtistInfo title={this.props.title} name={this.props.name}/>    
          </TabPanel>: null}
        </Paper>
      </div>
    );
        }
}
EventTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventTabs);
