import {
  Typography,
  Button,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useAuth } from "base-shell/lib/providers/Auth";
import { useIntl } from "react-intl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import { useMenu } from "material-ui-shell/lib/providers/Menu";
import { useTheme } from "@mui/material/styles";
import { useValidatableForm } from "react-validatable-form";
import { useHttpClient } from "shared/hooks/http-hook";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import trLocale from "date-fns/locale/tr";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LoadingSpinner from "components/Loading/LoadingSpinner";

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
const InternshipApplicationForm = () => {
  const intl = useIntl();
  const { auth } = useAuth();

  const [internshipArea, setInternshipArea] = useState("sw");
  const [doubleMajor, setDoubleMajor] = useState(false);
  const [saturdayWork, setSaturdayWork] = useState(false);
  const [studentApproval, setStudentApproval] = useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    status: false,
    message: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ open: false});
  };

  const theme = useTheme();
  const navigate = useNavigate();
  let location = useLocation();
  const { toggleThis } = useMenu();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const rules = [
    {
      path: "studentPhone",
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
      path: "studentId",
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
      path: "studentTC",
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
      path: "studentBday",
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

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/details/${auth.userId}`
        );
        setPathValue("studentName", responseData.user.name);
        setPathValue("studentEmail", responseData.user.email);
        setPathValue("studentPhone", responseData.user.phoneNumber);
        setPathValue("studentId", responseData.user.studentNumber);
        setPathValue("studentTC", responseData.user.tcNumber);
        setPathValue("studentBday", responseData.user.birthDate);
        setPathValue("advisor", responseData.user.advisor);

      } catch (err) {
        setSnackbar({ open: true, status: false, message: err.message });
      }
    };
    if (auth.profileComplated) {
      getUser();
    }
    setLoading(false);
  }, []);

  const handleSubmit = async (event) => {
    let data={...formData};
    event.preventDefault();
    setLoading(true);
    if(!formData.internshipArea){
      data={...data,internshipArea:"sw"}
    }
    if(!formData.doubleMajor){
      data={...data,doubleMajor:false}
    }
    if(!formData.saturdayWork){
      data={...data,saturdayWork:false}
    }
    const submitResultValid = setFormIsSubmitted();
    if (submitResultValid) {
      console.log(formData);

      console.log(data);
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/applications/`,
          "POST",
          JSON.stringify({
            data,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        if (responseData.status) {
          setSnackbar({
            open: true,
            status: true,
            message: "Başvurunuz başarı ile alınmıştır.",
          });
          navigate("/application-process")
        }
        console.log(responseData);
      } catch (err) {
        console.log(err);
        setSnackbar({ open: true, status: false, message: err.message });
      }
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoadingSpinner loading={loading} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.status == true ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box
        component="form"
        autocomplete="on"
        onSubmit={handleSubmit}
        sx={{ mb: 3, mx: 3 }}
      >
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs={12}>
            <Typography>Öğrenci Bilgileri</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="studentName"
              type="text"
              label={intl.formatMessage({ id: "studentName" })}
              name="studentName"
              autoComplete="name"
              value={getValue("studentName") || ""}
              onChange={(e) => setPathValue("studentName", e.target.value)}
              onBlur={() => setPathIsBlurred("studentName")}
              error={!!getError("studentName")}
              helperText={getError("studentName") || " "}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="email"
              name="studentEmail"
              autoComplete="email"
              label={intl.formatMessage({ id: "studentEmail" })}
              id="studentEmail"
              value={getValue("studentEmail") || ""}
              onChange={(e) => setPathValue("studentEmail", e.target.value)}
              onBlur={() => setPathIsBlurred("studentEmail")}
              error={!!getError("studentEmail")}
              helperText={getError("studentEmail") || " "}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              name="studentTC"
              label={intl.formatMessage({ id: "studentTC" })}
              id="studentTC"
              value={getValue("studentTC") || ""}
              onChange={(e) => setPathValue("studentTC", e.target.value)}
              onBlur={() => setPathIsBlurred("studentTC")}
              error={!!getError("studentTC")}
              helperText={getError("studentTC") || " "}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              name="studentId"
              label={intl.formatMessage({ id: "studentId" })}
              id="studentId"
              value={getValue("studentId") || ""}
              onChange={(e) => setPathValue("studentId", e.target.value)}
              onBlur={() => setPathIsBlurred("studentId")}
              error={!!getError("studentId")}
              helperText={getError("studentId") || " "}
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
                name="studentBday"
                label={intl.formatMessage({ id: "studentBday" })}
                value={getValue("studentBday") || new Date("01.01.2000")}
                onChange={(e) => setPathValue("studentBday", e)}
                onBlur={() => setPathIsBlurred("studentBday")}
                error={!!getError("studentBday")}
                helperText={getError("studentBday") || " "}
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="studentPhone"
              label={intl.formatMessage({ id: "studentPhone" })}
              name="studentPhone"
              type="tel"
              autoComplete="tel"
              value={getValue("studentPhone") || ""}
              onChange={(e) => setPathValue("studentPhone", e.target.value)}
              onBlur={() => setPathIsBlurred("studentPhone")}
              error={!!getError("studentPhone")}
              helperText={getError("studentPhone") || " "}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              name="semesterCompleted"
              label={intl.formatMessage({ id: "semesterCompleted" })}
              id="semesterCompleted"
              value={getValue("semesterCompleted") || ""}
              onChange={(e) =>
                setPathValue("semesterCompleted", e.target.value)
              }
              onBlur={() => setPathIsBlurred("semesterCompleted")}
              error={!!getError("semesterCompleted")}
              helperText={getError("semesterCompleted") || " "}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="creditsCompleted"
              type="number"
              label={intl.formatMessage({ id: "creditsCompleted" })}
              name="creditsCompleted"
              autoComplete="tel"
              value={getValue("creditsCompleted") || ""}
              onChange={(e) => setPathValue("creditsCompleted", e.target.value)}
              onBlur={() => setPathIsBlurred("creditsCompleted")}
              error={!!getError("creditsCompleted")}
              helperText={getError("creditsCompleted") || " "}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {!doubleMajor && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={getValue("doubleMajor") || false}
                      margin="normal"
                      name="doubleMajor"
                      label={intl.formatMessage({ id: "doubleMajor" })}
                      id="doubleMajor"
                      onChange={(e) => {
                        setDoubleMajor(true);
                        setPathValue("doubleMajor", true);
                      }}
                      onBlur={() => setPathIsBlurred("doubleMajor")}
                    />
                  }
                  label={intl.formatMessage({ id: "doubleMajor" })}
                />
              )}
              {doubleMajor && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={getValue("doubleMajor") || false}
                      margin="normal"
                      name="doubleMajor"
                      label={intl.formatMessage({ id: "doubleMajor" })}
                      id="doubleMajor"
                      onChange={(e) => {
                        setDoubleMajor(false);
                        setPathValue("doubleMajor", false);
                      }}
                      onBlur={() => setPathIsBlurred("doubleMajor")}
                    />
                  }
                  label={intl.formatMessage({ id: "doubleMajor" })}
                />
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            {doubleMajor && (
              <TextField
                margin="normal"
                fullWidth
                type="text"
                name="doubleMajorDepartment"
                label={intl.formatMessage({ id: "doubleMajorDepartment" })}
                id="doubleMajorDepartment"
                value={getValue("doubleMajorDepartment") || ""}
                onChange={(e) =>
                  setPathValue("doubleMajorDepartment", e.target.value)
                }
                onBlur={() => setPathIsBlurred("doubleMajorDepartment")}
                error={!!getError("doubleMajorDepartment")}
                helperText={getError("doubleMajorDepartment") || " "}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography>Staj Başvuru Bilgileri</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="text"
              name="companyName"
              label={intl.formatMessage({ id: "companyName" })}
              id="companyName"
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
              type="text"
              name="companyAddress"
              label={intl.formatMessage({ id: "companyAddress" })}
              id="companyAddress"
              value={getValue("companyAddress") || ""}
              onChange={(e) => setPathValue("companyAddress", e.target.value)}
              onBlur={() => setPathIsBlurred("companyAddress")}
              error={!!getError("companyAddress")}
              helperText={getError("companyAddress") || " "}
            />
          </Grid>{" "}
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="companyPhone"
              label={intl.formatMessage({ id: "companyPhone" })}
              id="companyPhone"
              type="tel"
              autoComplete="tel"
              value={getValue("companyPhone") || ""}
              onChange={(e) => setPathValue("companyPhone", e.target.value)}
              onBlur={() => setPathIsBlurred("companyPhone")}
              error={!!getError("companyPhone")}
              helperText={getError("companyPhone") || " "}
            />
          </Grid>{" "}
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="text"
              name="supervisorName"
              label={intl.formatMessage({ id: "supervisorName" })}
              id="supervisorName"
              value={getValue("supervisorName") || ""}
              onChange={(e) => setPathValue("supervisorName", e.target.value)}
              onBlur={() => setPathIsBlurred("supervisorName")}
              error={!!getError("supervisorName")}
              helperText={getError("supervisorName") || " "}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="email"
              name="supervisorEmail"
              label={intl.formatMessage({ id: "supervisorEmail" })}
              id="supervisorEmail"
              value={getValue("supervisorEmail") || ""}
              onChange={(e) => setPathValue("supervisorEmail", e.target.value)}
              onBlur={() => setPathIsBlurred("supervisorEmail")}
              error={!!getError("supervisorEmail")}
              helperText={getError("supervisorEmail") || " "}
            />
          </Grid>{" "}
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="supervisorPhone"
              label={intl.formatMessage({ id: "supervisorPhone" })}
              id="supervisorPhone"
              type="tel"
              autoComplete="tel"
              value={getValue("supervisorPhone") || ""}
              onChange={(e) => setPathValue("supervisorPhone", e.target.value)}
              onBlur={() => setPathIsBlurred("supervisorPhone")}
              error={!!getError("supervisorPhone")}
              helperText={getError("supervisorPhone") || " "}
            />
          </Grid>{" "}
          <Grid item xs={12} md={6}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {!saturdayWork && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={getValue("saturdayWork") || false}
                      margin="normal"
                      name="saturdayWork"
                      label={intl.formatMessage({ id: "saturdayWork" })}
                      id="saturdayWork"
                      onChange={(e) => {
                        setSaturdayWork(true);
                        setPathValue("saturdayWork", true);
                      }}
                      onBlur={() => setPathIsBlurred("saturdayWork")}
                    />
                  }
                  label={intl.formatMessage({ id: "saturdayWork" })}
                />
              )}
              {saturdayWork && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={getValue("saturdayWork") || false}
                      margin="normal"
                      name="saturdayWork"
                      label={intl.formatMessage({ id: "saturdayWork" })}
                      id="saturdayWork"
                      onChange={(e) => {
                        setSaturdayWork(false);
                        setPathValue("saturdayWork", false);
                      }}
                      onBlur={() => setPathIsBlurred("saturdayWork")}
                    />
                  }
                  label={intl.formatMessage({ id: "saturdayWork" })}
                />
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl>
              <FormLabel id="internshipArea">
                {intl.formatMessage({ id: "internshipArea" })}
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="internshipArea"
                name="internshipArea"
                margin="normal"
                required
                label={intl.formatMessage({ id: "internshipArea" })}
                id="internshipArea"
                onChange={(e) => {
                  setInternshipArea(e.target.value);
                  setPathValue("internshipArea", e.target.value);
                }}
                onBlur={() => setPathIsBlurred("internshipArea")}
                defaultValue={internshipArea}
              >
                <FormControlLabel value="sw" control={<Radio />} label="SW" />
                <FormControlLabel value="hw" control={<Radio />} label="HW" />
                <FormControlLabel value="bus" control={<Radio />} label="BUS" />
                <FormControlLabel value="is" control={<Radio />} label="IS" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="text"
              name="internshipDepartment"
              label={intl.formatMessage({ id: "internshipDepartment" })}
              id="internshipDepartment"
              value={getValue("internshipDepartment") || ""}
              onChange={(e) =>
                setPathValue("internshipDepartment", e.target.value)
              }
              onBlur={() => setPathIsBlurred("internshipDepartment")}
              error={!!getError("internshipDepartment")}
              helperText={getError("internshipDepartment") || " "}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              name="duration"
              label={intl.formatMessage({ id: "duration" })}
              id="duration"
              value={getValue("duration") || ""}
              onChange={(e) => setPathValue("duration", e.target.value)}
              onBlur={() => setPathIsBlurred("duration")}
              error={!!getError("duration")}
              helperText={getError("duration") || " "}
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
                value={getValue("startDate") || new Date()}
                onChange={(e) => setPathValue("startDate", e)}
                onBlur={() => setPathIsBlurred("startDate")}
                error={!!getError("startDate")}
                helperText={getError("startDate") || " "}
                renderInput={(params) => (
                  <TextField margin="normal" required fullWidth {...params} />
                )}
              />
            </LocalizationProvider>
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
                name="endDate"
                label={intl.formatMessage({ id: "endDate" })}
                value={getValue("endDate") || new Date()}
                onChange={(e) => setPathValue("endDate", e)}
                onBlur={() => setPathIsBlurred("endDate")}
                error={!!getError("endDate")}
                helperText={getError("endDate") || " "}
                renderInput={(params) => (
                  <TextField margin="normal" required fullWidth {...params} />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="text"
              multiline
              rows={4}
              name="internshipDescription"
              label={intl.formatMessage({ id: "internshipDescription" })}
              id="internshipDescription"
              value={getValue("internshipDescription") || ""}
              onChange={(e) =>
                setPathValue("internshipDescription", e.target.value)
              }
              onBlur={() => setPathIsBlurred("internshipDescription")}
              error={!!getError("internshipDescription")}
              helperText={getError("internshipDescription") || " "}
            />
          </Grid>{" "}
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="text"
              multiline
              rows={4}
              name="internResponsibilities"
              label={intl.formatMessage({ id: "internResponsibilities" })}
              id="internResponsibilities"
              value={getValue("internResponsibilities") || ""}
              onChange={(e) =>
                setPathValue("internResponsibilities", e.target.value)
              }
              onBlur={() => setPathIsBlurred("internResponsibilities")}
              error={!!getError("internResponsibilities")}
              helperText={getError("internResponsibilities") || " "}
            />
          </Grid>{" "}
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="text"
              name="supportOffered"
              multiline
              rows={4}
              label={intl.formatMessage({ id: "supportOffered" })}
              id="supportOffered"
              value={getValue("supportOffered") || ""}
              onChange={(e) => setPathValue("supportOffered", e.target.value)}
              onBlur={() => setPathIsBlurred("supportOffered")}
              error={!!getError("supportOffered")}
              helperText={getError("supportOffered") || " "}
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
              {!studentApproval && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={getValue("studentApproval") || false}
                      margin="normal"
                      name="studentApproval"
                      label={intl.formatMessage({ id: "studentApproval" })}
                      id="studentApproval"
                      onChange={(e) => {
                        setStudentApproval(true);
                        setPathValue("studentApproval", true);
                      }}
                      onBlur={() => setPathIsBlurred("studentApproval")}
                    />
                  }
                  label={intl.formatMessage({
                    id: "studentApprovalApplicationForm",
                  })}
                />
              )}
              {studentApproval && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={getValue("studentApproval") || false}
                      margin="normal"
                      name="studentApproval"
                      label={intl.formatMessage({ id: "studentApproval" })}
                      id="studentApproval"
                      onChange={(e) => {
                        setStudentApproval(false);
                        setPathValue("studentApproval", false);
                      }}
                      onBlur={() => setPathIsBlurred("studentApproval")}
                    />
                  }
                  label={intl.formatMessage({
                    id: "studentApprovalApplicationForm",
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
            disabled={studentApproval ? false : true}
          >
            {intl.formatMessage({ id: "save" })}
          </Button>
        </Grid>
      </Box>
    </div>
  );
};

export default InternshipApplicationForm;
