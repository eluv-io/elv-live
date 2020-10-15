import React from "react";
import LiveChat from "./LiveChat";
import FanWall from './FanWall';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SmsIcon from '@material-ui/icons/Sms';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import Paper from '@material-ui/core/Paper';



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {children}
      {/* {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )} */}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 500,
    backgroundColor: "black",

  },
  indicator: {
    backgroundColor: 'white',
    color: 'white',
  },
});

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
          // indicatorColor="primary"
          textColor="white"
          // aria-label="icon label tabs example"
          disableFocusRipple = {true}
          disableRipple = {true}

          classes={{
            indicator: classes.indicator
          }}
          style={{height: "75px"}}

        >
          <Tab icon={<SmsIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>LIVE CHAT</span>} />
          <Tab icon={<VideocamRoundedIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>FAN WALL</span>} />
 
          {/* <Tab icon={<PersonPinIcon />} label="NEARBY" /> */}
        </Tabs>
        <TabPanel value={value} index={0}>
          {/* <LiveChat />  */}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <FanWall/>
        </TabPanel>
      </Paper>
    </div>

  );
}