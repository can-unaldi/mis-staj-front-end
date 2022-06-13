import { Button, Typography } from "@mui/material";
import Page from "material-ui-shell/lib/containers/Page";
import React from "react";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import CustomPaper from "components/CustomPaper";
import HomeStudent from "./HomeStudent";
import HomeAdvisor from "./HomeAdvisor";
import HomeManager from "./HomeManager";
import HomeDepartment from "./HomeDepartment";
import HomeAdmin from "./HomeAdmin";
const HomePage = () => {
  const intl = useIntl();
  const authData = useAuth();
  let homeScreen;
  if(authData.auth.userType===0){
    homeScreen= <HomeStudent/>
  }else if(authData.auth.userType===1){
    homeScreen=<HomeAdvisor/>
  }
  else if(authData.auth.userType===2){
    homeScreen=<HomeDepartment/>
  }
  else if(authData.auth.userType===3){
    homeScreen=<HomeManager/>
  }
  else if(authData.auth.userType===4){
    homeScreen=<HomeAdmin/>
  }
  return (
    <Page pageTitle={intl.formatMessage({ id: "home" })}>
      <>{homeScreen}</>
    </Page>
  );
};
export default HomePage;
