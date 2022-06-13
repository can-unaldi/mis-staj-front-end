import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import Page from "material-ui-shell/lib/containers/Page";
import React from "react";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import CustomPaper from "components/CustomPaper";
import ApplicationProcess from "components/widgets/ApplicationProcess";
import UpdateProfile from "components/Forms/UpdateProfile";
import InternshipApplicationForm from "components/Forms/InternshipApplicationForm";

const ApplicationForm = () => {
  const intl = useIntl();
  const authData = useAuth();

  return (
    <Page
      pageTitle={intl.formatMessage({ id: "ApplicationForm" })}
    >
      <Container maxWidth="xl" style={{ marginTop: 20, marginBottom: 20 }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <CustomPaper elevation={1} style={{ width: "100%" }}>
              <div
                className={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: `100%`,
                }}
              >
                <h2>
                  {intl.formatMessage({ id: "InternshipApplicationForm" })}
                </h2>
                <InternshipApplicationForm/>
              </div>
            </CustomPaper>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
export default ApplicationForm;
