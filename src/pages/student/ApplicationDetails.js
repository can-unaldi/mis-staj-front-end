import { Container, Grid, Paper, Typography } from "@mui/material";
import Page from "material-ui-shell/lib/containers/Page";
import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import CustomPaper from "components/CustomPaper";
import { useParams} from "react-router-dom";
import { useHttpClient } from "shared/hooks/http-hook";
import LoadingSpinner from "components/Loading/LoadingSpinner";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ApplicationDetails = () => {
  const intl = useIntl();
  const authData = useAuth();
  let { applicationId } = useParams();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    status: false,
    message: "",
  });
  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = React.useState(false);
  const [a, setApplication] = useState();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ open: false});
  };

  useEffect(() => {
    setLoading(true);
    const getApplicaiton = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/applications/${applicationId}`
        );
        setApplication(responseData.application);
      } catch (err) {
        setSnackbar({ open: true, status: false, message: err.message });
      }
    };
    getApplicaiton();
    setLoading(false);
  }, [sendRequest, authData.auth]);
  console.log(a);
  return (
    <Page pageTitle={intl.formatMessage({ id: "ApplicationDetails" })}>
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
            <h2>{intl.formatMessage({ id: "ApplicationDetails" })}</h2>
          </div>

          {loading === false && a && (
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} md={6}>
                <Typography>Öğrenci Bilgileri</Typography>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableBody>
                      <TableRow
                        hover
                        key={a.studentName}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "studentName" })}
                        </TableCell>
                        <TableCell>{a.studentName}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.studentEmail}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "studentEmail" })}
                        </TableCell>
                        <TableCell>{a.studentEmail}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.studentId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "studentId" })}
                        </TableCell>
                        <TableCell>{a.studentId}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.semesterCompleted}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "semesterCompleted" })}
                        </TableCell>
                        <TableCell>{a.semesterCompleted}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.creditsCompleted}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "creditsCompleted" })}
                        </TableCell>
                        <TableCell>{a.creditsCompleted}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.studentTC}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "studentTC" })}
                        </TableCell>
                        <TableCell>{a.studentTC}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.studentBday}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "studentBday" })}
                        </TableCell>
                        <TableCell>{a.studentBday}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.studentPhone}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "studentPhone" })}
                        </TableCell>
                        <TableCell>{a.studentPhone}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>Şirket Bilgileri</Typography>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableBody>
                      <TableRow
                        hover
                        key={a.companyName}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "companyName" })}
                        </TableCell>
                        <TableCell>{a.companyName}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.companyAddress}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "companyAddress" })}
                        </TableCell>
                        <TableCell>{a.companyAddress}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.companyPhone}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "companyPhone" })}
                        </TableCell>
                        <TableCell>{a.companyPhone}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.supervisorName}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "supervisorName" })}
                        </TableCell>
                        <TableCell>{a.supervisorName}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.supervisorEmail}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "supervisorEmail" })}
                        </TableCell>
                        <TableCell>{a.supervisorEmail}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.supervisorPhone}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "supervisorPhone" })}
                        </TableCell>
                        <TableCell>{a.supervisorPhone}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
              <Typography>Staj Bilgileri</Typography>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableBody>
                      <TableRow
                        hover
                        key={a.internshipDescription}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "internshipDescription" })}
                        </TableCell>
                        <TableCell>{a.internshipDescription}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.internResponsibilities}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "internResponsibilities" })}
                        </TableCell>
                        <TableCell>{a.internResponsibilities}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.supportOffered}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "supportOffered" })}
                        </TableCell>
                        <TableCell>{a.supportOffered}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.startDate}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "startDate" })}
                        </TableCell>
                        <TableCell>{a.startDate}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.endDate}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "endDate" })}
                        </TableCell>
                        <TableCell>{a.endDate}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.duration}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "duration" })}
                        </TableCell>
                        <TableCell>{a.duration}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.internshipDepartment}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "internshipDepartment" })}
                        </TableCell>
                        <TableCell>{a.internshipDepartment}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.internshipArea}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "internshipArea" })}
                        </TableCell>
                        <TableCell>{a.internshipArea}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.saturdayWork}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "saturdayWork" })}
                        </TableCell>
                        <TableCell>{a.saturdayWork?"Evet":"Hayır"}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.companyTaxNo}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "companyTaxNo" })}
                        </TableCell>
                        <TableCell>{a.companyTaxNo}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.numberOfEmployee}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "numberOfEmployee" })}
                        </TableCell>
                        <TableCell>{a.numberOfEmployee}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.companyBankBranchName}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "companyBankBranchName" })}
                        </TableCell>
                        <TableCell>{a.companyBankBranchName}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.companyIbanNo}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "companyIbanNo" })}
                        </TableCell>
                        <TableCell>{a.companyIbanNo}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.feeToStudent}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "feeToStudent" })}
                        </TableCell>
                        <TableCell>{a.feeToStudent}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.companyApproval}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "companyApproval" })}
                        </TableCell>
                        <TableCell>{a.companyApproval?"Evet":"Hayır"}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.advisorApproval}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "advisorApproval" })}
                        </TableCell>
                        <TableCell>{a.advisorApproval?"Evet":"Hayır"}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.departmentApproval}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "departmentApproval" })}
                        </TableCell>
                        <TableCell>{a.departmentApproval?"Evet":"Hayır"}</TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        key={a.intershipManagerApproval}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({ id: "intershipManagerApproval" })}
                        </TableCell>
                        <TableCell>{a.intershipManagerApproval?"Evet":"Hayır"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </CustomPaper>
      </Container>
    </Page>
  );
};
export default ApplicationDetails;
