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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import trLocale from "date-fns/locale/tr";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UpdateStudent = ({ redirectTo = "/home" }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const authData = useAuth();

  let { userId } = useParams();
  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    status: false,
    message: "",
  });
  const [advisors, setAdvisors] = useState([]);

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
      path: "name",
      ruleSet: [
        {
          rule: "required",
          customMessage: intl.formatMessage({ id: "requiredError" }),
        },
      ],
    },
    {
      path: "phoneNumber",
      ruleSet: [
        {
          rule: "required",
        },
        {
          rule: "regex",
          regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        },
      ],
    },
    {
      path: "studentNumber",
      ruleSet: [
        {
          rule: "required",
        },
        {
          rule: "regex",
          regex: /^[0-9]{10}$/,
        },
      ],
    },
    {
      path: "tcNumber",
      ruleSet: [
        {
          rule: "required",
        },
        {
          rule: "regex",
          regex: /^[1-9]{1}[0-9]{9}[02468]{1}$/,
        },
      ],
    },
    {
      path: "birthDate",
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

  useEffect(() => {
    const getUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/student/${userId}`
        );
        setPathValue("name", responseData.user.name);
        setPathValue("email", responseData.user.email);
        setPathValue("advisor", responseData.user.advisor.id);
        setPathValue("phoneNumber", responseData.user.phoneNumber);
        setPathValue("studentNumber", responseData.user.studentNumber);
        setPathValue("tcNumber", responseData.user.tcNumber);
        setPathValue("birthDate", responseData.user.birthDate);
        console.log(responseData);
        setAdvisors(responseData.advisors);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submitResultValid = setFormIsSubmitted();
    if (submitResultValid) {
      console.log(formData);
      setLoading(true);
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/admin/student/${userId}`,
          "PATCH",
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            advisor: formData.advisor,
            phoneNumber: formData.phoneNumber,
            studentNumber: formData.studentNumber,
            tcNumber: formData.tcNumber,
            birthDate: formData.birthDate,
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
          message: "Kullanıcı başarı ile gğncellendi.",
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
          {intl.formatMessage({ id: "UpdateStudent" })}
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
              <TextField
                margin="normal"
                required
                fullWidth
                id="phoneNumber"
                type="tel"
                label={intl.formatMessage({ id: "phoneNumber" })}
                name="phoneNumber"
                autoComplete="tel"
                value={getValue("phoneNumber") || ""}
                onChange={(e) => setPathValue("phoneNumber", e.target.value)}
                onBlur={() => setPathIsBlurred("phoneNumber")}
                error={!!getError("phoneNumber")}
                helperText={getError("phoneNumber") || " "}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                name="studentNumber"
                label={intl.formatMessage({ id: "studentNumber" })}
                id="studentNumber"
                value={getValue("studentNumber") || ""}
                onChange={(e) => setPathValue("studentNumber", e.target.value)}
                onBlur={() => setPathIsBlurred("studentNumber")}
                error={!!getError("studentNumber")}
                helperText={getError("studentNumber") || " "}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                name="tcNumber"
                label={intl.formatMessage({ id: "tcNumber" })}
                id="tcNumber"
                value={getValue("tcNumber") || ""}
                onChange={(e) => setPathValue("tcNumber", e.target.value)}
                onBlur={() => setPathIsBlurred("tcNumber")}
                error={!!getError("tcNumber")}
                helperText={getError("tcNumber") || " "}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider
                locale={trLocale}
                dateAdapter={AdapterDateFns}
              >
                <MobileDatePicker
                  margin="normal"
                  required
                  fullWidth
                  name="birthDate"
                  label={intl.formatMessage({ id: "birthDate" })}
                  value={getValue("birthDate") || new Date("01.01.2000")}
                  onChange={(e) => setPathValue("birthDate", e)}
                  onBlur={() => setPathIsBlurred("birthDate")}
                  error={!!getError("birthDate")}
                  helperText={getError("birthDate") || " "}
                  renderInput={(params) => (
                    <TextField
                      autoComplete="bday"
                      margin="normal"
                      required
                      fullWidth
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
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
                  <InputLabel id="advisor">
                    {intl.formatMessage({ id: "advisor" })}
                  </InputLabel>
                  <Select
                    labelId="advisor"
                    id="advisor"
                    value={getValue("advisor") || 1}
                    label={intl.formatMessage({ id: "advisor" })}
                    onChange={(e) => setPathValue("advisor", e.target.value)}
                  >
                    {advisors.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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

export default UpdateStudent;
