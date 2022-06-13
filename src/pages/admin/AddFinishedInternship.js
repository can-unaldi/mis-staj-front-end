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

const AddFinishedInternship = ({ redirectTo = "/home" }) => {
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
      path: "insuranceStartDate",
      ruleSet: [
        {
          rule: "required",
          customMessage: intl.formatMessage({ id: "requiredError" }),
        },
      ],
    },
    {
      path: "startDate",
      ruleSet: [
        {
          rule: "required",
          customMessage: intl.formatMessage({ id: "requiredError" }),
        },
      ],
    },
    {
      path: "endDate",
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
          `${process.env.REACT_APP_BACKEND_URL}/finished-internships/admin/create-intership`,
          "POST",
          JSON.stringify({
            data: formData,
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
          message: "Staj başarı ile eklendi.",
        });
        setTimeout(function () {
          navigate("/admin/finished-internships");
        }, 1000);
      } catch (err) {
        setLoading(false);
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
          {intl.formatMessage({ id: "AddFinishedInternship" })}
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
              <LocalizationProvider
                locale={trLocale}
                dateAdapter={AdapterDateFns}
              >
                <MobileDatePicker
                  margin="normal"
                  required
                  fullWidth
                  name="startDate"
                  label={intl.formatMessage({ id: "startDate" })}
                  value={getValue("startDate") || ""}
                  onChange={(e) => setPathValue("startDate", e)}
                  onBlur={() => setPathIsBlurred("startDate")}
                  error={!!getError("startDate")}
                  helperText={getError("startDate") || " "}
                  renderInput={(params) => (
                    <TextField margin="normal" required fullWidth {...params} />
                  )}
                />
              </LocalizationProvider>
            </Grid>{" "}
            <Grid item xs={12} md={6}>
              <LocalizationProvider
                locale={trLocale}
                dateAdapter={AdapterDateFns}
              >
                <MobileDatePicker
                  margin="normal"
                  required
                  fullWidth
                  name="endDate"
                  label={intl.formatMessage({ id: "endDate" })}
                  value={getValue("endDate") || ""}
                  onChange={(e) => setPathValue("endDate", e)}
                  onBlur={() => setPathIsBlurred("endDate")}
                  error={!!getError("endDate")}
                  helperText={getError("endDate") || " "}
                  renderInput={(params) => (
                    <TextField margin="normal" required fullWidth {...params} />
                  )}
                />
              </LocalizationProvider>
            </Grid>{" "}
            <Grid item xs={12} md={6}>
              <LocalizationProvider
                locale={trLocale}
                dateAdapter={AdapterDateFns}
              >
                <MobileDatePicker
                  margin="normal"
                  required
                  fullWidth
                  name="insuranceStartDate"
                  label={intl.formatMessage({ id: "insuranceStartDate" })}
                  value={getValue("insuranceStartDate") || ""}
                  onChange={(e) => setPathValue("insuranceStartDate", e)}
                  onBlur={() => setPathIsBlurred("insuranceStartDate")}
                  error={!!getError("insuranceStartDate")}
                  helperText={getError("insuranceStartDate") || " "}
                  renderInput={(params) => (
                    <TextField margin="normal" required fullWidth {...params} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                name="approvedWorkDayDuration"
                label={intl.formatMessage({ id: "approvedWorkDayDuration" })}
                id="approvedWorkDayDuration"
                value={getValue("approvedWorkDayDuration") || ""}
                onChange={(e) =>
                  setPathValue("approvedWorkDayDuration", e.target.value)
                }
                onBlur={() => setPathIsBlurred("approvedWorkDayDuration")}
                error={!!getError("approvedWorkDayDuration")}
                helperText={getError("approvedWorkDayDuration") || " "}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="companyName"
                type="text"
                label={intl.formatMessage({ id: "companyName" })}
                name="companyName"
                autoComplete="companyName"
                value={getValue("companyName") || ""}
                onChange={(e) => setPathValue("companyName", e.target.value)}
                onBlur={() => setPathIsBlurred("companyName")}
                error={!!getError("companyName")}
                helperText={getError("companyName") || " "}
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
                id="companyPhone"
                type="tel"
                label={intl.formatMessage({ id: "companyPhone" })}
                name="companyPhone"
                autoComplete="tel"
                value={getValue("companyPhone") || ""}
                onChange={(e) => setPathValue("companyPhone", e.target.value)}
                onBlur={() => setPathIsBlurred("companyPhone")}
                error={!!getError("companyPhone")}
                helperText={getError("companyPhone") || " "}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="companyAddress"
                type="text"
                label={intl.formatMessage({ id: "companyAddress" })}
                name="companyAddress"
                autoComplete="companyAddress"
                value={getValue("companyAddress") || ""}
                onChange={(e) => setPathValue("companyAddress", e.target.value)}
                onBlur={() => setPathIsBlurred("companyAddress")}
                error={!!getError("companyAddress")}
                helperText={getError("companyAddress") || " "}
              />
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

export default AddFinishedInternship;
