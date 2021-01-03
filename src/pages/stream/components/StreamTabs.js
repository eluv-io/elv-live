import React from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SmsIcon from '@material-ui/icons/Sms';
import Paper from '@material-ui/core/Paper';

import LiveChat from "./LiveChat";

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 5000,
    backgroundColor: "black",

  },
  indicator: {
    backgroundColor: 'white',
    color: 'white',
  },
}));

export default function IconLabelTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <div className="stream-container__tabs">
      <Paper square className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          disablefocusripple = "true"
          disableripple = "true"
          classes={{
            indicator: classes.indicator
          }}
        >
          <Tab icon={<SmsIcon style={{ color: "white",fontSize: "22 !important"  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>LIVE CHAT</span>} />
          {/* <Tab icon={<VideocamRoundedIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>FAN WALL</span>} /> */}
        </Tabs>
        
        <TabPanel value={value} index={0}>
          <LiveChat /> 
        </TabPanel>
        {/* <TabPanel value={value} index={1}>
          <FanWall/>
        </TabPanel> */}
        
      </Paper>
    </div>
  );
}