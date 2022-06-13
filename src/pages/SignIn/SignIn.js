import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
// import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider } from "@mui/material/styles";
import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "base-shell/lib/providers/Auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import { useMenu } from "material-ui-shell/lib/providers/Menu";
import { useTheme } from "@mui/material/styles";
import { useValidatableForm } from "react-validatable-form";
import { useHttpClient } from "shared/hooks/http-hook";
import backgroundImg from "../../public/hisar.png";
import LoadingSpinner from "components/Loading/LoadingSpinner";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const userTypes = [
  "student",
  "advisor",
  "headOfDepartment",
  "internshipManager",
  "admin",
];
const SignIn = ({ redirectTo = "/home" }) => {
  const intl = useIntl();
  const theme = useTheme();
  const navigate = useNavigate();
  let location = useLocation();
  const { toggleThis } = useMenu();
  const { setAuth } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    status: false,
    message: "",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ open: false });
  };

  const rules = [
    {
      path: "email",
      ruleSet: [
        {
          rule: "required",
          customMessage: intl.formatMessage({ id: "requiredError" }),
        },
        {
          rule: "email",
          customMessage: intl.formatMessage({ id: "emailError" }),
        },
        {
          rule: "includes",
          includes: "@boun.edu.tr",
          customMessage: intl.formatMessage({ id: "bounEmailError" }),
        },
      ],
    },
    {
      path: "password",
      ruleSet: [
        {
          rule: "required",
          customMessage: intl.formatMessage({ id: "requiredError" }),
        },
        {
          rule: "length",
          greaterThan: 6,
          customMessage: intl.formatMessage({ id: "passwordError" }),
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const submitResultValid = setFormIsSubmitted();
    if (submitResultValid) {
      console.log(formData);
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        console.log("rESPOSEs", responseData);
        setSnackbar({
          open: true,
          status: true,
          message: responseData.message,
        });
        // auth.login(responseData.userId, responseData.token);
        authenticate({
          displayName: responseData.name,
          userId: responseData.userId,
          email: responseData.email,
          token: responseData.token,
          userType: responseData.type,
          profileComplated: responseData.profileComplated,
          photoURL: responseData.image,
        });
      } catch (err) {
        setSnackbar({ open: true, status: false, message: err.message });
      }
      setLoading(false);
    }
  };

  const authenticate = (user) => {
    setAuth({ isAuthenticated: true, ...user });
    toggleThis("isAuthMenuOpen", false);

    let from = new URLSearchParams(location.search).get("from");

    if (from) {
      navigate(from, { replace: true });
    } else {
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {intl.formatMessage({ id: "sign_in" })}
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
              autoComplete="on"
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={intl.formatMessage({ id: "email" })}
                name="email"
                autoComplete="email"
                autoFocus
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
                name="password"
                label={intl.formatMessage({ id: "password" })}
                type="password"
                id="password"
                autoComplete="current-password"
                value={getValue("password") || ""}
                onChange={(e) => setPathValue("password", e.target.value)}
                onBlur={() => setPathIsBlurred("password")}
                error={!!getError("password")}
                helperText={getError("password") || " "}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {intl.formatMessage({ id: "sign_in" })}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/password-reset">
                    {intl.formatMessage({ id: "forgot_password" })}?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default SignIn;
