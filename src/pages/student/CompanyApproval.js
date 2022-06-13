import {
  Avatar,
  Paper,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { useParams, useNavigate, useLocation } from "react-router-dom";

import { useValidatableForm } from "react-validatable-form";
import { useHttpClient } from "shared/hooks/http-hook";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import CustomPaper from "components/CustomPaper";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import logo from "../../public/logo192.png";
import LoadingSpinner from "components/Loading/LoadingSpinner";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CompanyApproval = ({ redirectTo = "/home" }) => {
  const intl = useIntl();
  const navigate = useNavigate();

  let { applicationId } = useParams();
  const [a, setApplication] = useState();
  const [companyApproval, setCompanyApproval] = useState(false);
  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    status: false,
    message: "",
  });
  const rules = [
    {
      path: "companyTaxNo",
      ruleSet: [
        {
          rule: "required",
          customMessage: intl.formatMessage({ id: "requiredError" }),
        },
      ],
    },
    {
      path: "numberOfEmployee",
      ruleSet: [
        {
          rule: "required",
          customMessage: intl.formatMessage({ id: "requiredError" }),
        },
      ],
    },
    {
      path: "companyBankBranchName",
      ruleSet: [
        {
          rule: "required",
          customMessage: intl.formatMessage({ id: "requiredError" }),
        },
      ],
    },
    {
      path: "companyIbanNo",
      ruleSet: [
        {
          rule: "required",
          customMessage: intl.formatMessage({ id: "requiredError" }),
        },
        {
          rule: "iban",
        },
      ],
    },
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
    setSnackbar({ open: false});
  };

  useEffect(() => {
    setLoading(true);
    const getApplication = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/company-approval/${applicationId}`
        );
        console.log(responseData);
        setApplication(responseData);
      } catch (err) {
        console.log(err);
        setSnackbar({ open: true, status: false, message: err.message });
        setTimeout(function () {
          navigate("/");
        }, 3000);
      }
      setLoading(false);
    };
    getApplication();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submitResultValid = setFormIsSubmitted();
    if (submitResultValid) {
      console.log(formData);
      setOpen(true);
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/company-approval/send-mail/${applicationId}`
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
          `${process.env.REACT_APP_BACKEND_URL}/company-approval/${applicationId}`,
          "PATCH",
          JSON.stringify({
            companyApproval: formData.companyApproval,
            companyBankBranchName: formData.companyBankBranchName,
            companyIbanNo: formData.companyIbanNo,
            companyTaxNo: formData.companyTaxNo,
            confirmationToken: formData.confirmationToken,
            feeToStudent: formData.feeToStudent,
            numberOfEmployee: formData.numberOfEmployee,
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
        {loading === false && a && (
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
                    "Stajyer adayınızın staj başvuru sürecinin devam etmesi için alttaki bilgileri doldurmanız ve e-mail adresinize göndereceğimiz onay kodunu sisteme girmeniz gerekmektedir."
                  }
                </Typography>
                <Typography variant="p" textAlign="center">
                  {
                    "Stajyerin ve staj başvurusunun bilgileri altta görebilirsiniz. Bilgilerde herhangi bir yanlışlık olduğunu düşünüyorsanız lütfen stajyer ile iletişime geçin."
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
                    <Typography>Staj Bilgileri</Typography>
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
                            key={"a.supervisorName"}
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
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="companyTaxNo"
                    type="text"
                    label={intl.formatMessage({ id: "companyTaxNo" })}
                    name="companyTaxNo"
                    autoComplete="number"
                    value={getValue("companyTaxNo") || ""}
                    onChange={(e) =>
                      setPathValue("companyTaxNo", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("companyTaxNo")}
                    error={!!getError("companyTaxNo")}
                    helperText={getError("companyTaxNo") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="number"
                    name="numberOfEmployee"
                    label={intl.formatMessage({ id: "numberOfEmployee" })}
                    id="numberOfEmployee"
                    value={getValue("numberOfEmployee") || ""}
                    onChange={(e) =>
                      setPathValue("numberOfEmployee", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("numberOfEmployee")}
                    error={!!getError("numberOfEmployee")}
                    helperText={getError("numberOfEmployee") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="text"
                    name="companyBankBranchName"
                    label={intl.formatMessage({ id: "companyBankBranchName" })}
                    id="companyBankBranchName"
                    value={getValue("companyBankBranchName") || ""}
                    onChange={(e) =>
                      setPathValue("companyBankBranchName", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("companyBankBranchName")}
                    error={!!getError("companyBankBranchName")}
                    helperText={getError("companyBankBranchName") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="text"
                    name="companyIbanNo"
                    label={intl.formatMessage({ id: "companyIbanNo" })}
                    id="companyIbanNo"
                    autoComplete="iban"
                    value={getValue("companyIbanNo") || ""}
                    onChange={(e) =>
                      setPathValue("companyIbanNo", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("companyIbanNo")}
                    error={!!getError("companyIbanNo")}
                    helperText={getError("companyIbanNo") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    type="text"
                    name="feeToStudent"
                    label={intl.formatMessage({ id: "feeToStudent" })}
                    id="feeToStudent"
                    value={getValue("feeToStudent") || ""}
                    onChange={(e) =>
                      setPathValue("feeToStudent", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("feeToStudent")}
                    error={!!getError("feeToStudent")}
                    helperText={
                      getError("feeToStudent") ||
                      "Ödenmeyecek ise 0 yazınız."
                    }
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
                    {!companyApproval && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={getValue("companyApproval") || false}
                            margin="normal"
                            name="companyApproval"
                            label={intl.formatMessage({
                              id: "companyApproval",
                            })}
                            id="companyApproval"
                            onChange={(e) => {
                              setCompanyApproval(true);
                              setPathValue("companyApproval", true);
                            }}
                            onBlur={() => setPathIsBlurred("companyApproval")}
                          />
                        }
                        label={intl.formatMessage({
                          id: "companyApprovalText",
                        })}
                      />
                    )}
                    {companyApproval && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={getValue("companyApproval") || false}
                            margin="normal"
                            name="companyApproval"
                            label={intl.formatMessage({
                              id: "companyApproval",
                            })}
                            id="companyApproval"
                            onChange={(e) => {
                              setCompanyApproval(false);
                              setPathValue("companyApproval", false);
                            }}
                            onBlur={() => setPathIsBlurred("companyApproval")}
                          />
                        }
                        label={intl.formatMessage({
                          id: "companyApprovalText",
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
                  disabled={companyApproval ? false : true}
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

export default CompanyApproval;
