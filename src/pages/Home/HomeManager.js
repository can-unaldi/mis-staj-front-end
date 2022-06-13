import { Button, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import WaitingApplications from "pages/manager/WaitingApplications";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ApprovedApplications from "pages/manager/ApprovedApplications";
import RejectedApplications from "pages/manager/RejectedApplications";
import WaitingInterships from "pages/manager/WaitingInterships";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const HomeManager = () => {
  const intl = useIntl();
  const authData = useAuth();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container
      maxWidth="xl"
      style={{ marginTop: 20, marginBottom: 20, height: "90%" }}
    >
      <div
        className={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: `100%`,
        }}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Onaya Gönderilen Stajlar" {...a11yProps(0)} />
              <Tab label="Bekleyen Başvurular" {...a11yProps(1)} />
              <Tab label="Onaylanan Başvurular" {...a11yProps(2)} />
              <Tab label="Reddedilen Başvurular" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel style={{ height: "100%" }} value={value} index={0}>
            <WaitingInterships />
          </TabPanel>
          <TabPanel style={{ height: "100%" }} value={value} index={1}>
            <WaitingApplications />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ApprovedApplications />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <RejectedApplications />
          </TabPanel>
        </Box>
      </div>
    </Container>
  );
};
export default HomeManager;
