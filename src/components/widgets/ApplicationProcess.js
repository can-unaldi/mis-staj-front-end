import React, { useEffect, useState } from "react";
import { Button, Container, TableContainer, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate, useLocation } from "react-router-dom";
import SendCompanyApproval from "components/Modals/SendCompanyApproval";
import FileUploadModal from "components/Forms/FileUploadModal";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const steps = [
  "Staj Başvuru Formu*",
  "Şirket Onayı*",
  "Danışman Onayı",
  "Bölüm Başkanlığı Onayı",
  "MIS Staj Koordinatörü Onayı",
  "Sigorta Belgesi Yükleme*",
];
const actions = [
  "Staj Başvuru Formu'nu doldur",
  "Staj Yapacağın Şirketten Onay Al",
  "Onayı Bekle",
  "Onayı Bekle",
  "Onayı Bekle",
  "Sigorta Belgeni Sisteme Yükle",
  "Başvuruyu Sil",
  "Stajlarım",
];
const ApplicationProcess = ({ application }) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(1);
  const [open, setOpen] = React.useState(false);
  const [openFileModal, setOpenFileModal] = React.useState(false);

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    status: false,
    message: "",
  });

  const handleClick = () => {
    if (activeStep === 1) {
      setOpen(true);
    } else if (activeStep === 5) {
      setOpenFileModal(true);
    } else if (activeStep === 6) {
      deleteApplication();
    } else if (activeStep === 7) {
      navigate("/internships");
    }
  };

  const deleteApplication = () => {
    console.log("deleteApplication", application._id);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (application.approved === true) {
      setActiveStep(7);
    } else if (
      application.companyApproval === false ||
      application.advisorApproval === false ||
      application.departmentApproval === false ||
      application.intershipManagerApproval === false ||
      application.approved === false
    ) {
      setActiveStep(6);
    } else if (
      application.companyApproval &&
      application.advisorApproval &&
      application.departmentApproval &&
      application.intershipManagerApproval
    ) {
      setActiveStep(5);
    } else if (
      application.companyApproval &&
      application.advisorApproval &&
      application.departmentApproval &&
      application.intershipManagerApproval === null &&
      application.approved === null
    ) {
      setActiveStep(4);
    } else if (
      application.companyApproval &&
      application.advisorApproval &&
      application.departmentApproval === null &&
      application.intershipManagerApproval === null &&
      application.approved === null
    ) {
      setActiveStep(3);
    } else if (
      application.companyApproval &&
      application.advisorApproval === null &&
      application.departmentApproval === null &&
      application.intershipManagerApproval === null &&
      application.approved === null
    ) {
      setActiveStep(2);
    } else if (
      application.companyApproval === null &&
      application.advisorApproval === null &&
      application.departmentApproval === null &&
      application.intershipManagerApproval === null &&
      application.approved === null
    ) {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
    console.log("App:", application, "Step:", activeStep);
  }, [application]);
  console.log("Apps:", application, "Step:", activeStep);

  return (
    <>
      <Card sx={{ minWidth: 150 }}>
        {activeStep === 6 ? (
          <>
            <TableContainer
              sx={{
                width: "100%",
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: `100%`,
                    paddingBottom: 20,
                  }}
                >
                  <Typography
                    sx={{ fontSize: 20, fontWeight: "bold" }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Başvurunuz Reddedilmiştir.
                  </Typography>
                  <Typography
                    sx={{ fontSize: 20, fontWeight: "bold" }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {`Red Nedeni: ${application.rejectedMessage}`}
                  </Typography>
                </div>
              </CardContent>
            </TableContainer>
          </>
        ) : activeStep === 7 ? (
          <>
            <TableContainer
              sx={{
                width: "100%",
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: `100%`,
                    paddingBottom: 20,
                  }}
                >
                  <Typography
                    sx={{ fontSize: 20, fontWeight: "bold" }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Başvurunuz Onaylanmıştır.
                  </Typography>
                  <Button
                    onClick={handleClick}
                    endIcon={<ArrowForwardIosIcon />}
                    variant="contained"
                    color="success"
                  >
                    {actions[activeStep]}
                  </Button>
                </div>
              </CardContent>
            </TableContainer>
          </>
        ) : (
          <>
            <TableContainer
              sx={{
                width: "100%",
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: `100%`,
                    paddingBottom: 20,
                  }}
                >
                  <Typography
                    sx={{ fontSize: 20, fontWeight: "bold" }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {intl.formatMessage({ id: "applicationId" })}:
                    {application._id}
                  </Typography>
                  <Button
                    sx={{ width: "25%", flexShrink: 0 }}
                    variant="contained"
                    onClick={() =>
                      navigate(`/application-details/${application._id}`)
                    }
                  >
                    {intl.formatMessage({ id: "details" })}
                  </Button>
                </div>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  *Bu adımlarda öğrencinin süreci devam ettirmesi gerekmektedir.
                </Typography>
              </CardContent>
            </TableContainer>
            <CardActions>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <LoadingButton
                  onClick={handleClick}
                  endIcon={<ArrowForwardIosIcon />}
                  loading={actions[activeStep] === "Onayı Bekle" ? true : false}
                  loadingPosition="end"
                  variant="contained"
                  color={activeStep === 6 ? "error" : "primary"}
                >
                  {actions[activeStep]}
                </LoadingButton>
              </div>
            </CardActions>
          </>
        )}
      </Card>
      <SendCompanyApproval
        id={application._id}
        link={`/company-approval/${application._id}`}
        open={open}
        handleClose={handleClose}
      />
      <FileUploadModal
        open={openFileModal}
        apiUrl={`${process.env.REACT_APP_BACKEND_URL}/approval/insurance-certificate/${application._id}`}
        acceptedFiles={[".pdf"]}
        onClose={() => {
          setOpenFileModal(false);
        }}
        snackbar={setSnackbar}
      />
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
    </>
  );
};

export default ApplicationProcess;
