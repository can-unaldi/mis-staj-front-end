import { Button, Container, Grid, Typography } from "@mui/material";
import Page from "material-ui-shell/lib/containers/Page";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import CustomPaper from "components/CustomPaper";
import ApplicationProcess from "components/widgets/ApplicationProcess";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingSpinner from "components/Loading/LoadingSpinner";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useHttpClient } from "shared/hooks/http-hook";
import { render } from "react-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, useLocation } from "react-router-dom";
import InternshipProcess from "components/widgets/InternshipProcess";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Internships = () => {
  const intl = useIntl();
  const authData = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [internships, setInternships] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    status: false,
    message: "",
  });
  const { sendRequest } = useHttpClient();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ open: false});
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    setLoading(true);
    const getInternships = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/internships/user/${authData.auth.userId}`
        );
        console.log("İnternships:",responseData)
        setInternships(responseData.internships);
      } catch (err) {
        // setSnackbar({ open: true, status: false, message: err.message });
      }
    };
    getInternships();
    setLoading(false);
  }, [sendRequest, authData.auth.userId]);

  console.log(internships);
  return (
    <Page
      pageTitle={intl.formatMessage({ id: "Internships" })}
    >
      <LoadingSpinner loading={loading} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.status === true ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Container maxWidth="xl" style={{ marginTop: 20, marginBottom: 20 }}>
        <div
          className={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: `100%`,
          }}
        >
          <h2>{intl.formatMessage({ id: "onGoingInternships" })}</h2>
          {loading === false && internships.length > 0 && (
            <div>
              {internships.map((a) => (
                <Accordion
                  expanded={expanded === a._id}
                  onChange={handleChange(a._id)}
                  key={a._id}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography sx={{ width: "33%", flexShrink: 0 }}>
                      {intl.formatMessage({ id: "company" })}:{a.companyName}
                    </Typography>
                    <Typography sx={{ width: "33%", flexShrink: 0 }}>
                      {intl.formatMessage({ id: "applyDate" })}:
                      {a.applicationDate.slice(0, 10)}
                    </Typography>
                    <Typography sx={{ width: "33%", flexShrink: 0 }}>
                      {intl.formatMessage({ id: "status" })}:
                      {a.approved
                        ? "Onaylandı"
                        : a.finishInternshipProcess
                        ? "Onaya Gönderildi"
                        : "Devam Ediyor"}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <InternshipProcess internshipProp={a} />
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          )}
          {internships.length === 0 && (
            <Typography
              sx={{ fontSize: 14, fontWeight: "bold", width: "100%" }}
              color="text.secondary"
              gutterBottom
            >
              {intl.formatMessage({ id: "noInternshipsFound" })}
            </Typography>
          )}
        </div>
      </Container>
    </Page>
  );
};
export default Internships;
