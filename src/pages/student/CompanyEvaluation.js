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

const CompanyEvaluation = ({ redirectTo = "/home" }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const authData = useAuth();

  let { internshipId } = useParams();
  const [studentEvaluationApproved, setStudentEvaluationApproved] =
    useState(false);
  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
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
          `${process.env.REACT_APP_BACKEND_URL}/internships/company-evaluation/${internshipId}`,
          "PATCH",
          JSON.stringify({
            companySector: formData.companySector,
            numberOfInterns: formData.numberOfInterns,
            companySystemSpecifications: formData.companySystemSpecifications,
            descriptionOfProgram: formData.descriptionOfProgram,
            interestForIntern: formData.interestForIntern,
            companyContribution: formData.companyContribution,
            wouldYouRecommend: formData.wouldYouRecommend,
            companyEvaluationApproved: formData.companyEvaluationApproved,
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
          message: "Staj başvurusu başarı ile onaylandı.",
        });

        navigate("/internships");
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
        {loading === false && (
          <>
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
                <Grid item xs={12} style={{ paddingTop: 30 }}>
                  <Typography variant="h6" textAlign="center">
                    {"İş Yeri Değerlendirme Formu"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="text"
                    name="companySector"
                    label={intl.formatMessage({ id: "companySector" })}
                    id="companySector"
                    value={getValue("companySector") || ""}
                    onChange={(e) =>
                      setPathValue("companySector", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("companySector")}
                    error={!!getError("companySector")}
                    helperText={getError("companySector") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    type="number"
                    name="numberOfInterns"
                    label={intl.formatMessage({ id: "numberOfInterns" })}
                    id="numberOfInterns"
                    value={getValue("numberOfInterns") || ""}
                    onChange={(e) =>
                      setPathValue("numberOfInterns", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("numberOfInterns")}
                    error={!!getError("numberOfInterns")}
                    helperText={getError("numberOfInterns") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    type="text"
                    name="companySystemSpecifications"
                    label={intl.formatMessage({
                      id: "companySystemSpecifications",
                    })}
                    id="companySystemSpecifications"
                    value={getValue("companySystemSpecifications") || ""}
                    onChange={(e) =>
                      setPathValue(
                        "companySystemSpecifications",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      setPathIsBlurred("companySystemSpecifications")
                    }
                    error={!!getError("companySystemSpecifications")}
                    helperText={getError("companySystemSpecifications") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    type="text"
                    name="descriptionOfProgram"
                    label={intl.formatMessage({ id: "descriptionOfProgram" })}
                    id="descriptionOfProgram"
                    value={getValue("descriptionOfProgram") || ""}
                    onChange={(e) =>
                      setPathValue("descriptionOfProgram", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("descriptionOfProgram")}
                    error={!!getError("descriptionOfProgram")}
                    helperText={getError("descriptionOfProgram") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    type="text"
                    name="interestForIntern"
                    label={intl.formatMessage({ id: "interestForIntern" })}
                    id="interestForIntern"
                    value={getValue("interestForIntern") || ""}
                    onChange={(e) =>
                      setPathValue("interestForIntern", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("interestForIntern")}
                    error={!!getError("interestForIntern")}
                    helperText={getError("interestForIntern") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    type="text"
                    name="companyContribution"
                    label={intl.formatMessage({ id: "companyContribution" })}
                    id="companyContribution"
                    value={getValue("companyContribution") || ""}
                    onChange={(e) =>
                      setPathValue("companyContribution", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("companyContribution")}
                    error={!!getError("companyContribution")}
                    helperText={getError("companyContribution") || " "}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    type="text"
                    name="wouldYouRecommend"
                    label={intl.formatMessage({ id: "wouldYouRecommend" })}
                    id="wouldYouRecommend"
                    value={getValue("wouldYouRecommend") || ""}
                    onChange={(e) =>
                      setPathValue("wouldYouRecommend", e.target.value)
                    }
                    onBlur={() => setPathIsBlurred("wouldYouRecommend")}
                    error={!!getError("wouldYouRecommend")}
                    helperText={getError("wouldYouRecommend") || " "}
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
                              getValue("companyEvaluationApproved") || false
                            }
                            margin="normal"
                            name="companyEvaluationApproved"
                            label={intl.formatMessage({
                              id: "companyEvaluationApproved",
                            })}
                            id="companyEvaluationApproved"
                            onChange={(e) => {
                              setStudentEvaluationApproved(true);
                              setPathValue("companyEvaluationApproved", true);
                            }}
                            onBlur={() =>
                              setPathIsBlurred("companyEvaluationApproved")
                            }
                          />
                        }
                        label={intl.formatMessage({
                          id: "companyEvaluationText",
                        })}
                      />
                    )}
                    {studentEvaluationApproved && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              getValue("companyEvaluationApproved") || false
                            }
                            margin="normal"
                            name="companyEvaluationApproved"
                            label={intl.formatMessage({
                              id: "companyEvaluationApproved",
                            })}
                            id="companyEvaluationApproved"
                            onChange={(e) => {
                              setStudentEvaluationApproved(false);
                              setPathValue("companyEvaluationApproved", false);
                            }}
                            onBlur={() =>
                              setPathIsBlurred("companyEvaluationApproved")
                            }
                          />
                        }
                        label={intl.formatMessage({
                          id: "companyEvaluationText",
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
      </Paper>
    </div>
  );
};

export default CompanyEvaluation;
