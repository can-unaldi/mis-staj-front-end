import { Button, Typography } from "@mui/material";
import Page from "material-ui-shell/lib/containers/Page";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import CustomPaper from "../../components/CustomPaper";
import { useHttpClient } from "shared/hooks/http-hook";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import LoadingSpinner from "components/Loading/LoadingSpinner";
import { useValidatableForm } from "react-validatable-form";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PasswordReset = () => {
  const intl = useIntl();
  const theme = useTheme();
  const navigate = useNavigate();

  const [companyApproval, setCompanyApproval] = useState(false);
  const [userId, setUserId]=useState("");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submitResultValid = setFormIsSubmitted();
    if (submitResultValid) {
      console.log(formData);
      setOpen(true);
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/send-password-reset-mail`,
          "POST",
          JSON.stringify({
            email: formData.email,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        console.log(responseData);
        setUserId(responseData.user._id)
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
          `${process.env.REACT_APP_BACKEND_URL}/users/reset-password/${userId}`,
          "PATCH",
          JSON.stringify({
            confirmationToken: formData.confirmationToken,
            password: formData.password,
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
          message: "Şifreniz başarı ile değiştirildi.",
        });
        setTimeout(function () {
          navigate(-1);
        }, 3000);
      } catch (err) {
        setSnackbar({ open: true, status: false, message: err.message });
      }
    }
  };

  return (
    <Page
      pageTitle={intl.formatMessage({
        id: "password_reset",
        defaultMessage: "Password reset",
      })}
      onBackClick={() => {
        navigate(-1);
      }}
    >
      <CustomPaper elevation={6}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: `100%`,
          }}
        >
          <Typography component="h1" variant="h5">
            {intl.formatMessage({
              id: "password_reset",
              defaultMessage: "Password reset",
            })}
          </Typography>
          <form
            style={{ marginTop: theme.spacing(1) }}
            onSubmit={handleSubmit}
            // noValidate
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              type="email"
              label={intl.formatMessage({ id: "email" })}
              name="email"
              autoComplete="email"
              value={getValue("email") || ""}
              onChange={(e) => setPathValue("email", e.target.value)}
              onBlur={() => setPathIsBlurred("email")}
              error={!!getError("email")}
              helperText={getError("email") || " "}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              type="password"
              label={intl.formatMessage({ id: "password" })}
              name="password"
              autoComplete="password"
              value={getValue("password") || ""}
              onChange={(e) => setPathValue("password", e.target.value)}
              onBlur={() => setPathIsBlurred("password")}
              error={!!getError("password")}
              helperText={getError("password") || " "}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="passwordConfirm"
              type="password"
              label={intl.formatMessage({ id: "passwordConfirm" })}
              name="passwordConfirm"
              autoComplete="password"
              value={getValue("passwordConfirm") || ""}
              onChange={(e) => setPathValue("passwordConfirm", e.target.value)}
              onBlur={() => setPathIsBlurred("passwordConfirm")}
              error={!!getError("passwordConfirm")}
              helperText={getError("passwordConfirm") || " "}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ margin: theme.spacing(3, 0, 2) }}
            >
              {intl.formatMessage({
                id: "password_reset",
                defaultMessage: "Reset Password",
              })}
            </Button>
          </form>
        </div>
      </CustomPaper>
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
            onChange={(e) => setPathValue("confirmationToken", e.target.value)}
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
    </Page>
  );
};

export default PasswordReset;
