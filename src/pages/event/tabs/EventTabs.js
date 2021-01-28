import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import InfoIcon from "@material-ui/icons/Info";
import Paper from "@material-ui/core/Paper";
// import MusicNoteIcon from "@material-ui/icons/MusicNote";

import ConcertOverview from "./Overview";
import Merch from "./Merch";
// import ArtistInfo from "./Artist";

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

const styles = () => ({
  root: {
    flexGrow: 1,
    maxWidth: 5000,
    backgroundColor: "transparent",
    boxShadow: "none"
  },
  indicator: {
    backgroundColor: "black",
    color: "black",
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
            classes={{
              indicator: classes.indicator
            }}
          >
            <Tab icon={<InfoIcon style={{ color: "black",fontSize: 22  }} />} disableFocusRipple = {true} disableRipple = {true} label={<span style={{ color: "black", fontSize: 12, marginBottom: 5 }}>EVENT</span>} />
            {/* <Tab icon={<MusicNoteIcon style={{ color: "black",fontSize: 22  }} />} label={<span style={{ color: "black", fontSize: 12, marginBottom: 5 }}>ARTIST</span>} /> */}
            <Tab icon={<ShoppingCartIcon style={{ color: "black",fontSize: 22  }} />} disableFocusRipple = {true} disableRipple = {true} label={<span style={{ color: "black", fontSize: 12, marginBottom: 5 }}>MERCH</span>} />
          </Tabs>

          <TabPanel value={this.props.tab} index={0} >
            <ConcertOverview title={this.props.title} refProp={this.props.refProp} />
          </TabPanel>
          {/* <TabPanel value={this.props.tab} index={1}>
            <ArtistInfo title={this.props.title} name={this.props.name}/>
          </TabPanel> */}
          <TabPanel value={this.props.tab} index={1}>
            { //<Merch />
            }
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
