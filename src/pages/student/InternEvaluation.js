import {
  Avatar,
  Fab,
  InputBase,
  Paper,
  Zoom,
  Typography,
  Button,
  TextField,
  Stack,
  Container,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useAuth } from "base-shell/lib/providers/Auth";
import { useIntl } from "react-intl";
// import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useValidatableForm } from "react-validatable-form";
import { useHttpClient } from "shared/hooks/http-hook";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CustomPaper from "components/CustomPaper";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import Rating from "@mui/material/Rating";

import logo from "../../public/logo192.png";
import LoadingSpinner from "components/Loading/LoadingSpinner";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const InternEvaluation = ({ redirectTo = "/home" }) => {
  const intl = useIntl();
  const navigate = useNavigate();

  let { internshipId } = useParams();
  const [internship, setInternship] = useState();
  const [studentEvaluationApproved, setStudentEvaluationApproved] =
    useState(false);
  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    status: false,
    message: "",
  });
  const rules = [
    // {
    //   path: "companyTaxNo",
    //   ruleSet: [
    //     {
    //       rule: "required",
    //       customMessage: intl.formatMessage({ id: "requiredError" }),
    //     },
    //   ],
    // },
    // {
    //   path: "numberOfEmployee",
    //   ruleSet: [
    //     {
    //       rule: "required",
    //       customMessage: intl.formatMessage({ id: "requiredError" }),
    //     },
    //   ],
    // },
    // {
    //   path: "companyBankBranchName",
    //   ruleSet: [
    //     {
    //       rule: "required",
    //       customMessage: intl.formatMessage({ id: "requiredError" }),
    //     },
    //   ],
    // },
    // {
    //   path: "companyIbanNo",
    //   ruleSet: [
    //     {
    //       rule: "required",
    //       customMessage: intl.formatMessage({ id: "requiredError" }),
    //     },
    //     {
    //       rule: "iban",
    //     },
    //   ],
    // },
  ];

  const {
    isValid,
    formData,
    setPathValue,
    setFormIsSubmitted,
    setPathIsBlurred,
    getValue,
    getError,
  } = useValidatableForm({
    rules,
    hideBeforeSubmit: true,
    showAfterBlur: true,
    focusToErrorAfterSubmit: true,
  });

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ open: false });
  };

  useEffect(() => {
    setLoading(true);
    setPathValue("attendance", 1);
    setPathValue("responsibility", 1);
    setPathValue("workPerformance", 1);
    setPathValue("adaptationToAGivenTask", 1);
    setPathValue("motivation", 1);
    setPathValue("abilityOfExpressingHerself", 1);
    setPathValue("adaptationToCompanyregulations", 1);
    setPathValue("relationsWithOtherPersonnel", 1);

    const getInternship = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/company-approval/internship/${internshipId}`
        );
        setInternship(responseData.internship);
        setPathValue("supervisorName", responseData.internship.supervisorName);
        setPathValue(
          "supervisorEmail",
          responseData.internship.supervisorEmail
        );
        setPathValue(
          "supervisorPhone",
          responseData.internship.supervisorPhone
        );
      } catch (err) {
        console.log(err);
        setSnackbar({ open: true, status: false, message: err.message });
        // setTimeout(function () {
        //   navigate("/");
        // }, 3000);
      }
      setLoading(false);
    };
    getInternship();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submitResultValid = setFormIsSubmitted();
    if (submitResultValid) {
      console.log(formData);
      setOpen(true);
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/company-approval/send-mail/internship/${internshipId}?supervisorEmail=${getValue(
            "supervisorEmail"
          )}&supervisorName=${getValue("supervisorName")}`
        );
        console.log(responseData);
        setSnackbar({
          open: true,
          status: true,
          message: "Onay maili gönderildi.",
        });
      } catch (err) {
        setSnackbar({ open: true, status: false, message: err.message });
      }
    }
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const submitResultValid = setFormIsSubmitted();
    if (submitResultValid) {
      console.log(formData);
      setOpen(false);
      setLoading(true);
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/company-approval/internship/${internshipId}`,
          "PATCH",
          JSON.stringify({
            workedDayDuration: formData.workedDayDuration,
            nonWorkedDayDuration: formData.nonWorkedDayDuration,
            attendance: formData.attendance,
            attendanceComment: formData.attendanceComment,
            responsibility: formData.responsibility,
            responsibilityComment: formData.responsibilityComment,
            workPerformance: formData.workPerformance,
            workPerformanceComment: formData.workPerformanceComment,
            adaptationToAGivenTask: formData.adaptationToAGivenTask,
            adaptationToAGivenTaskComment:
              formData.adaptationToAGivenTaskComment,
            motivation: formData.motivation,
            motivationComment: formData.motivationComment,
            abilityOfExpressingHerself: formData.abilityOfExpressingHerself,
            abilityOfExpressingHerselfComment:
              formData.abilityOfExpressingHerselfComment,
            adaptationToCompanyregulations:
              formData.adaptationToCompanyregulations,
            adaptationToCompanyregulationsComment:
              formData.adaptationToCompanyregulationsComment,
            relationsWithOtherPersonnel: formData.relationsWithOtherPersonnel,
            relationsWithOtherPersonnelComment:
              formData.relationsWithOtherPersonnelComment,
            notes: formData.notes,
            studentEvaluationApproved: formData.studentEvaluationApproved,
            supervisorName: formData.supervisorName,
            supervisorEmail: formData.supervisorEmail,
            supervisorPhone: formData.supervisorPhone,
            confirmationToken: formData.confirmationToken,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setLoading(false);
        console.log(responseData);
        setSnackbar({
          open: true,
          status: true,
          message: "Staj başvurusu başarı ile onaylandı.",
        });
        setTimeout(function () {
          navigate("/");
        }, 3000);
      } catch (err) {
        setSnackbar({ open: true, status: false, message: err.message });
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <LoadingSpinner loading={loading} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snackbar.status === true ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: 18,
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
          alignItems: "center",
          width: "80%",
          marginTop: 50,
        }}
      >
        {loading === false && internship && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: 18,
                marginBottom: 18,
              }}
            >
              <Avatar
                alt="Bogazici"
                src={logo}
                sx={{ width: 56, height: 56 }}
              />
              <Typography variant="h6">
                {"Boğaziçi Üniversitesi Yönetim Bilişim Sistmeleri Bölümü"}
              </Typography>
              <Typography variant="h4">
                {"Staj Yönetim Sistemine Hoş Geldiniz"}
              </Typography>
              <div
                style={{
                  display: "flex",
                  margin: 10,
                }}
              >
                <Typography variant="p" textAlign="center">
                  {
                    "Stajyerinizin stajının onaylanması için alttaki bilgileri doldurmanız ve e-mail adresinize göndereceğimiz onay kodunu sisteme girmeniz gerekmektedir."
                  }
                </Typography>
                <Typography variant="p" textAlign="center">
                  {
                    "Stajyerin ve yaptığı stajın bilgileri altta görebilirsiniz. Bilgilerde herhangi bir yanlışlık olduğunu düşünüyorsanız lütfen stajyer ile iletişime geçin."
                  }
                </Typography>
              </div>
              <CustomPaper elevation={1} style={{ width: "100%" }}>
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
                            key={internship.studentName}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {intl.formatMessage({ id: "studentName" })}
                            </TableCell>
                            <TableCell>{internship.studentName}</TableCell>
                          </TableRow>
                          <TableRow
                            hover
                            key={internship.studentEmail}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {intl.formatMessage({ id: "studentEmail" })}
                            </TableCell>
                            <TableCell>{internship.studentEmail}</TableCell>
                          </TableRow>
                          <TableRow
                            hover
                            key={internship.studentPhone}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {intl.formatMessage({ id: "studentPhone" })}
                            </TableCell>
                            <TableCell>{internship.studentPhone}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>Staj Bilgileri</Typography>
                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableBody>
                          <TableRow
                            hover
                            key={internship.companyName}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {intl.formatMessage({ id: "companyName" })}
                            </TableCell>
                            <TableCell>{internship.companyName}</TableCell>
                          </TableRow>
                          <TableRow
                            hover
                            key={"a.supervisorName"}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {intl.formatMessage({ id: "supervisorName" })}
                            </TableCell>
                            <TableCell>{internship.supervisorName}</TableCell>
                          </TableRow>
                          <TableRow
                            hover
                            key={internship.supervisorEmail}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {intl.formatMessage({ id: "supervisorEmail" })}
                            </TableCell>
                            <TableCell>{internship.supervisorEmail}</TableCell>
                          </TableRow>
                          <TableRow
                            hover
                            key={internship.supervisorPhone}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {intl.formatMessage({ id: "supervisorPhone" })}
                            </TableCell>
                            <TableCell>{internship.supervisorPhone}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CustomPaper>
            </div>
            <Box
              component="form"
              autocomplete="on"
              onSubmit={handleSubmit}
              sx={{ mb: 3, mx: 3 }}
            >
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 1, md: 1 }}
              >
                <Grid item xs={12}>
                  <Typography variant="h6" textAlign="center">
                    {"Stajyer Değerlendirme Formu"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="number"
                    name="workedDayDuration"
                    label={intl.formatMessage({ id: "workedDayDuration" })}
                    id="workedDayDuration"
                    value={getValue("workedDayDuration") || ""}
                    onChange={(e) =>
                      setPathValue("workedDayDuration", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("workedDayDuration")}
                    error={!!getError("workedDayDuration")}
                    helperText={getError("workedDayDuration") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    type="number"
                    name="nonWorkedDayDuration"
                    label={intl.formatMessage({ id: "nonWorkedDayDuration" })}
                    id="nonWorkedDayDuration"
                    value={getValue("nonWorkedDayDuration") || ""}
                    onChange={(e) =>
                      setPathValue("nonWorkedDayDuration", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("nonWorkedDayDuration")}
                    error={!!getError("nonWorkedDayDuration")}
                    helperText={getError("nonWorkedDayDuration") || " "}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TableContainer sx={{ minWidth: 350 }} component={Container}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            {intl.formatMessage({
                              id: "subject",
                            })}
                          </TableCell>
                          <TableCell align="center">
                            {intl.formatMessage({
                              id: "badAverageGood",
                            })}
                          </TableCell>
                          <TableCell align="center">
                            {intl.formatMessage({
                              id: "comments",
                            })}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow
                          key="attendance"
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography component="legend">
                              {intl.formatMessage({ id: "attendance" })}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Rating
                              id="attendance"
                              required
                              name="attendance"
                              value={getValue("attendance") || 1}
                              onChange={(event, newValue) => {
                                setPathValue("attendance", newValue);
                              }}
                              max={3}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              margin="normal"
                              required
                              fullWidth
                              id="attendanceComment"
                              type="text"
                              label={intl.formatMessage({
                                id: "attendanceComment",
                              })}
                              name="attendanceComment"
                              autoComplete="number"
                              value={getValue("attendanceComment") || ""}
                              onChange={(e) =>
                                setPathValue(
                                  "attendanceComment",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                setPathIsBlurred("attendanceComment")
                              }
                              error={!!getError("attendanceComment")}
                              helperText={getError("attendanceComment") || " "}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          key="responsibility"
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography component="legend">
                              {intl.formatMessage({ id: "responsibility" })}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Rating
                              id="responsibility"
                              required
                              name="responsibility"
                              value={getValue("responsibility") || 1}
                              onChange={(event, newValue) => {
                                setPathValue("responsibility", newValue);
                              }}
                              max={3}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              margin="normal"
                              required
                              fullWidth
                              id="responsibilityComment"
                              type="text"
                              label={intl.formatMessage({
                                id: "responsibilityComment",
                              })}
                              name="responsibilityComment"
                              autoComplete="number"
                              value={getValue("responsibilityComment") || ""}
                              onChange={(e) =>
                                setPathValue(
                                  "responsibilityComment",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                setPathIsBlurred("responsibilityComment")
                              }
                              error={!!getError("responsibilityComment")}
                              helperText={
                                getError("responsibilityComment") || " "
                              }
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          key="workPerformance"
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography component="legend">
                              {intl.formatMessage({ id: "workPerformance" })}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Rating
                              id="workPerformance"
                              required
                              name="workPerformance"
                              value={getValue("workPerformance") || 1}
                              onChange={(event, newValue) => {
                                setPathValue("workPerformance", newValue);
                              }}
                              max={3}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              margin="normal"
                              required
                              fullWidth
                              id="workPerformanceComment"
                              type="text"
                              label={intl.formatMessage({
                                id: "workPerformanceComment",
                              })}
                              name="workPerformanceComment"
                              autoComplete="number"
                              value={getValue("workPerformanceComment") || ""}
                              onChange={(e) =>
                                setPathValue(
                                  "workPerformanceComment",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                setPathIsBlurred("workPerformanceComment")
                              }
                              error={!!getError("workPerformanceComment")}
                              helperText={
                                getError("workPerformanceComment") || " "
                              }
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          key="adaptationToAGivenTask"
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography component="legend">
                              {intl.formatMessage({
                                id: "adaptationToAGivenTask",
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Rating
                              id="adaptationToAGivenTask"
                              required
                              name="adaptationToAGivenTask"
                              value={getValue("adaptationToAGivenTask") || 1}
                              onChange={(event, newValue) => {
                                setPathValue(
                                  "adaptationToAGivenTask",
                                  newValue
                                );
                              }}
                              max={3}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              margin="normal"
                              required
                              fullWidth
                              id="adaptationToAGivenTaskComment"
                              type="text"
                              label={intl.formatMessage({
                                id: "adaptationToAGivenTaskComment",
                              })}
                              name="adaptationToAGivenTaskComment"
                              autoComplete="number"
                              value={
                                getValue("adaptationToAGivenTaskComment") || ""
                              }
                              onChange={(e) =>
                                setPathValue(
                                  "adaptationToAGivenTaskComment",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                setPathIsBlurred(
                                  "adaptationToAGivenTaskComment"
                                )
                              }
                              error={
                                !!getError("adaptationToAGivenTaskComment")
                              }
                              helperText={
                                getError("adaptationToAGivenTaskComment") || " "
                              }
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          key="motivation"
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography component="legend">
                              {intl.formatMessage({ id: "motivation" })}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Rating
                              id="motivation"
                              required
                              name="motivation"
                              value={getValue("motivation") || 1}
                              onChange={(event, newValue) => {
                                setPathValue("motivation", newValue);
                              }}
                              max={3}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              margin="normal"
                              required
                              fullWidth
                              id="motivationComment"
                              type="text"
                              label={intl.formatMessage({
                                id: "motivationComment",
                              })}
                              name="motivationComment"
                              autoComplete="number"
                              value={getValue("motivationComment") || ""}
                              onChange={(e) =>
                                setPathValue(
                                  "motivationComment",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                setPathIsBlurred("motivationComment")
                              }
                              error={!!getError("motivationComment")}
                              helperText={getError("motivationComment") || " "}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          key="abilityOfExpressingHerself"
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography component="legend">
                              {intl.formatMessage({
                                id: "abilityOfExpressingHerself",
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Rating
                              id="abilityOfExpressingHerself"
                              required
                              name="abilityOfExpressingHerself"
                              value={
                                getValue("abilityOfExpressingHerself") || 1
                              }
                              onChange={(event, newValue) => {
                                setPathValue(
                                  "abilityOfExpressingHerself",
                                  newValue
                                );
                              }}
                              max={3}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              margin="normal"
                              required
                              fullWidth
                              id="abilityOfExpressingHerselfComment"
                              type="text"
                              label={intl.formatMessage({
                                id: "abilityOfExpressingHerselfComment",
                              })}
                              name="abilityOfExpressingHerselfComment"
                              autoComplete="number"
                              value={
                                getValue("abilityOfExpressingHerselfComment") ||
                                ""
                              }
                              onChange={(e) =>
                                setPathValue(
                                  "abilityOfExpressingHerselfComment",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                setPathIsBlurred(
                                  "abilityOfExpressingHerselfComment"
                                )
                              }
                              error={
                                !!getError("abilityOfExpressingHerselfComment")
                              }
                              helperText={
                                getError("abilityOfExpressingHerselfComment") ||
                                " "
                              }
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          key="adaptationToCompanyregulations"
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography component="legend">
                              {intl.formatMessage({
                                id: "adaptationToCompanyregulations",
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Rating
                              id="adaptationToCompanyregulations"
                              required
                              name="adaptationToCompanyregulations"
                              value={
                                getValue("adaptationToCompanyregulations") || 1
                              }
                              onChange={(event, newValue) => {
                                setPathValue(
                                  "adaptationToCompanyregulations",
                                  newValue
                                );
                              }}
                              max={3}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              margin="normal"
                              required
                              fullWidth
                              id="adaptationToCompanyregulationsComment"
                              type="text"
                              label={intl.formatMessage({
                                id: "adaptationToCompanyregulationsComment",
                              })}
                              name="adaptationToCompanyregulationsComment"
                              autoComplete="number"
                              value={
                                getValue(
                                  "adaptationToCompanyregulationsComment"
                                ) || ""
                              }
                              onChange={(e) =>
                                setPathValue(
                                  "adaptationToCompanyregulationsComment",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                setPathIsBlurred(
                                  "adaptationToCompanyregulationsComment"
                                )
                              }
                              error={
                                !!getError(
                                  "adaptationToCompanyregulationsComment"
                                )
                              }
                              helperText={
                                getError(
                                  "adaptationToCompanyregulationsComment"
                                ) || " "
                              }
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          key="relationsWithOtherPersonnel"
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography component="legend">
                              {intl.formatMessage({
                                id: "relationsWithOtherPersonnel",
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Rating
                              id="relationsWithOtherPersonnel"
                              required
                              name="relationsWithOtherPersonnel"
                              value={
                                getValue("relationsWithOtherPersonnel") || 1
                              }
                              onChange={(event, newValue) => {
                                setPathValue(
                                  "relationsWithOtherPersonnel",
                                  newValue
                                );
                              }}
                              max={3}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              margin="normal"
                              required
                              fullWidth
                              id="relationsWithOtherPersonnelComment"
                              type="text"
                              label={intl.formatMessage({
                                id: "relationsWithOtherPersonnelComment",
                              })}
                              name="relationsWithOtherPersonnelComment"
                              autoComplete="text"
                              value={
                                getValue(
                                  "relationsWithOtherPersonnelComment"
                                ) || ""
                              }
                              onChange={(e) =>
                                setPathValue(
                                  "relationsWithOtherPersonnelComment",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                setPathIsBlurred(
                                  "relationsWithOtherPersonnelComment"
                                )
                              }
                              error={
                                !!getError("relationsWithOtherPersonnelComment")
                              }
                              helperText={
                                getError(
                                  "relationsWithOtherPersonnelComment"
                                ) || " "
                              }
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="notes"
                    type="text"
                    label={intl.formatMessage({ id: "notes" })}
                    name="notes"
                    autoComplete="text"
                    value={getValue("notes") || ""}
                    onChange={(e) => setPathValue("notes", e.target.value)}
                    onBlur={() => setPathIsBlurred("notes")}
                    error={!!getError("notes")}
                    helperText={getError("notes") || " "}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="p" textAlign="center">
                    {
                      "Yukarıdaki Staj sorumlusu bilgileri size ait değil ise lütfen alttaki alanları doldurunuz."
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="supervisorName"
                    type="text"
                    label={intl.formatMessage({ id: "supervisorName" })}
                    name="supervisorName"
                    autoComplete="name"
                    value={getValue("supervisorName") || ""}
                    onChange={(e) =>
                      setPathValue("supervisorName", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("supervisorName")}
                    error={!!getError("supervisorName")}
                    helperText={getError("supervisorName") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    margin="normal"
                    fullWidth
                    type="email"
                    name="supervisorEmail"
                    autoComplete="email"
                    label={intl.formatMessage({ id: "supervisorEmail" })}
                    id="supervisorEmail"
                    value={getValue("supervisorEmail") || ""}
                    onChange={(e) =>
                      setPathValue("supervisorEmail", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("supervisorEmail")}
                    error={!!getError("supervisorEmail")}
                    helperText={getError("supervisorEmail") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    margin="normal"
                    fullWidth
                    type="phone"
                    name="supervisorPhone"
                    autoComplete="phone"
                    label={intl.formatMessage({ id: "supervisorPhone" })}
                    id="supervisorPhone"
                    value={getValue("supervisorPhone") || ""}
                    onChange={(e) =>
                      setPathValue("supervisorPhone", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("supervisorPhone")}
                    error={!!getError("supervisorPhone")}
                    helperText={getError("supervisorPhone") || " "}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {!studentEvaluationApproved && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              getValue("studentEvaluationApproved") || false
                            }
                            margin="normal"
                            name="studentEvaluationApproved"
                            label={intl.formatMessage({
                              id: "studentEvaluationApproved",
                            })}
                            id="studentEvaluationApproved"
                            onChange={(e) => {
                              setStudentEvaluationApproved(true);
                              setPathValue("studentEvaluationApproved", true);
                            }}
                            onBlur={() =>
                              setPathIsBlurred("studentEvaluationApproved")
                            }
                          />
                        }
                        label={intl.formatMessage({
                          id: "internEvaluationText",
                        })}
                      />
                    )}
                    {studentEvaluationApproved && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              getValue("studentEvaluationApproved") || false
                            }
                            margin="normal"
                            name="studentEvaluationApproved"
                            label={intl.formatMessage({
                              id: "studentEvaluationApproved",
                            })}
                            id="studentEvaluationApproved"
                            onChange={(e) => {
                              setStudentEvaluationApproved(false);
                              setPathValue("studentEvaluationApproved", false);
                            }}
                            onBlur={() =>
                              setPathIsBlurred("studentEvaluationApproved")
                            }
                          />
                        }
                        label={intl.formatMessage({
                          id: "internEvaluationText",
                        })}
                      />
                    )}
                  </div>
                </Grid>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mt: 1, mb: 1 }}
                  disabled={studentEvaluationApproved ? false : true}
                >
                  {intl.formatMessage({ id: "save" })}
                </Button>
              </Grid>
            </Box>
          </>
        )}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Mail Doğrulama</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Lütfen mail adresinize gelen doğrumala kodunu giriniz.
            </DialogContentText>
            <TextField
              margin="normal"
              fullWidth
              type="text"
              name="confirmationToken"
              label={intl.formatMessage({ id: "confirmationToken" })}
              id="feeToStudent"
              value={getValue("confirmationToken") || ""}
              onChange={(e) =>
                setPathValue("confirmationToken", e.target.value)
              }
              onBlur={() => setPathIsBlurred("confirmationToken")}
              error={!!getError("confirmationToken")}
              helperText={getError("confirmationToken") || " "}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={submitForm} autoFocus>
              Onayla
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
};

export default InternEvaluation;
