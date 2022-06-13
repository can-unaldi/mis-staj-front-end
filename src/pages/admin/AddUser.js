import {
  Paper,
  Typography,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
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
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LoadingSpinner from "components/Loading/LoadingSpinner";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddUser = ({ redirectTo = "/home" }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const authData = useAuth();

  let { applicationId } = useParams();
  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    status: false,
    message: "",
  });
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
    {
      path: "name",
      ruleSet: [
        {
          rule: "required",
          customMessage: intl.formatMessage({ id: "requiredError" }),
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

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ open: false });
  };

  useEffect(() => {}, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submitResultValid = setFormIsSubmitted();
    if (submitResultValid) {
      console.log(formData);
      setLoading(true);
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          "POST",
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            type: formData.type || 1,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authData.auth.token,
          }
        );
        setLoading(false);
        console.log(responseData);
        setSnackbar({
          open: true,
          status: true,
          message: "Kullanıcı başarı ile oluşturuldu.",
        });
        setTimeout(function () {
          navigate("/home");
        }, 1000);
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
        <Typography variant="h6" style={{ marginTop: 20 }}>
          {intl.formatMessage({ id: "addUser" })}
        </Typography>

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
                id="name"
                type="text"
                label={intl.formatMessage({ id: "name" })}
                name="name"
                autoComplete="name"
                value={getValue("name") || ""}
                onChange={(e) => setPathValue("name", e.target.value)}
                onBlur={() => setPathIsBlurred("name")}
                error={!!getError("name")}
                helperText={getError("name") || " "}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="type">
                    {intl.formatMessage({ id: "type" })}
                  </InputLabel>
                  <Select
                    labelId="type"
                    id="type"
                    value={getValue("type") || 1}
                    label={intl.formatMessage({ id: "type" })}
                    onChange={(e) => setPathValue("type", e.target.value)}
                  >
                    <MenuItem value={1}>Danışman</MenuItem>
                    <MenuItem value={2}>Bölüm Sorumlusu</MenuItem>
                    <MenuItem value={3}>Staj Sorumlusu</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  type="text"
                  label={intl.formatMessage({ id: "password" })}
                  name="password"
                  autoComplete="password"
                  value={getValue("password") || ""}
                  onChange={(e) => setPathValue("password", e.target.value)}
                  onBlur={() => setPathIsBlurred("password")}
                  error={!!getError("password")}
                  helperText={getError("password") || " "}
                />
              </div>
            </Grid>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
            >
              {intl.formatMessage({ id: "save" })}
            </Button>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
};

export default AddUser;
