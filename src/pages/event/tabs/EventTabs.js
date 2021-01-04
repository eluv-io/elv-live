import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ScheduleIcon from "@material-ui/icons/Schedule";
import InfoIcon from "@material-ui/icons/Info";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import Paper from "@material-ui/core/Paper";

import ConcertOverview from "./Overview";
import ArtistInfo from "./Artist";
import Merch from "./Merch";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="stream-container__tabs--bottom2"
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
    backgroundColor: "white",
    color: "white",
  },
});

class EventTabs extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { classes } = this.props;

    return (
      <div className="event-tabs" id="tabs">
        <Paper square className={classes.root}>
          <Tabs
            value={this.props.tab}
            onChange={this.props.handleChange}
            variant="fullWidth"
            disablefocusripple = "true"
            disableripple = "true"
            classes={{
              indicator: classes.indicator
            }}
          >
            <Tab icon={<InfoIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: "white", fontSize: 12, marginBottom: 5 }}>EVENT</span>} />
            <Tab icon={<MusicNoteIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: "white", fontSize: 12, marginBottom: 5 }}>ARTIST</span>} />
            <Tab icon={<ShoppingCartIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: "white", fontSize: 12, marginBottom: 5 }}>MERCH</span>} />
          </Tabs>
          
          <TabPanel value={this.props.tab} index={0} >
            <ConcertOverview title={this.props.title} name={this.props.name} refProp={this.props.refProp} />
          </TabPanel>
          <TabPanel value={this.props.tab} index={1}>
            <ArtistInfo title={this.props.title} name={this.props.name}/>    
          </TabPanel>
          <TabPanel value={this.props.tab} index={2}>
            <Merch name={this.props.name}/>
          </TabPanel>
        </Paper>
      </div>
    );
  }
}
EventTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventTabs);
