import { Button, Typography } from "@mui/material";
import Page from "material-ui-shell/lib/containers/Page";
import React from "react";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import CustomPaper from "components/CustomPaper";
import WaitingApplications from "pages/advisor/WaitingApplications";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ApprovedApplications from "pages/advisor/ApprovedApplications";
import RejectedApplications from "pages/advisor/RejectedApplications";

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

const HomeAdvisor = () => {
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
              <Tab label="Bekleyen Ba??vurular" {...a11yProps(0)} />
              <Tab label="Onaylanan Ba??vurular" {...a11yProps(1)} />
              <Tab label="Reddedilen Ba??vurular" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel style={{ height: "100%" }} value={value} index={0}>
            <WaitingApplications />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ApprovedApplications />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <RejectedApplications />
          </TabPanel>
        </Box>
      </div>
    </Container>
  );
};
export default HomeAdvisor;
