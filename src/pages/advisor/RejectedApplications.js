import { Button, Chip, Container, Grid, Typography } from "@mui/material";
import Page from "material-ui-shell/lib/containers/Page";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import CustomPaper from "components/CustomPaper";
import ApplicationProcess from "components/widgets/ApplicationProcess";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingSpinner from "components/Loading/LoadingSpinner";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useHttpClient } from "shared/hooks/http-hook";
import { render } from "react-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const RejectedApplications = () => {
  const intl = useIntl();
  const authData = useAuth();
  const navigate = useNavigate();

  const columns = [
    { field: "_id", headerName: "ID", width: 50 },
    { field: "studentName", headerName: "Öğrenci Adı", width: 130 },
    {
      field: "studentId",
      headerName: "Öğrenci Numarası",
      type: "number",
      width: 100,
    },
    {
      field: "semesterCompleted",
      headerName: "Dönem",
      type: "number",
      width: 70,
    },
    {
      field: "creditsCompleted",
      headerName: "Kredi",
      type: "number",
      width: 70,
    },
    { field: "companyName", headerName: "Şirket Adı", width: 130 },
    { field: "internshipDepartment", headerName: "Departman", width: 130 },
    {
      field: "internshipArea",
      headerName: "Staj Alanı",
      width: 80,
      valueGetter: (params) => params.value.toUpperCase(),
    },
    {
      field: "startDate",
      headerName: "Başlancıç Tarihi",
      type: "dateTime",
      width: 130,
      valueGetter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "endDate",
      headerName: "Bitiş Tarihi",
      type: "dateTime",
      width: 100,
      valueGetter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    { field: "duration", headerName: "Süre(Gün)", type: "number", width: 70 },
    {
      field: "rejectedMessage",
      headerName: "Red Nedeni",
      type: "number",
      width: 140,
    },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      renderCell: (params) => <Chip label="Reddedildi" color="error" />,
    },
  ];

  const [loading, setLoading] = React.useState(false);
  const [applications, setApplications] = useState([]);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    status: false,
    message: "",
  });
  const { sendRequest } = useHttpClient();

  const approveApplication = async (id) => {
    setLoading(true);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/approval/advisor/approve/${id}`,
        "PATCH",
        JSON.stringify({
          advisorApproval: true,
          advisorId: authData.auth.userId,
          name:authData.auth.displayName
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authData.auth.token,
        }
      );
      console.log(responseData);
      setSnackbar({ open: true, status: true, message: responseData.message });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setSnackbar({ open: true, status: false, message: err });
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ open: false });
  };

  useEffect(() => {
    setLoading(true);
    const getApplicaitons = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/approval/advisor/${authData.auth.userId}?status=rejected`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authData.auth.token,
          }
        );
        setApplications(responseData.applications);
        console.log(responseData.applications);
      } catch (err) {
        setSnackbar({ open: true, status: false, message: err.message });
      }
    };
    getApplicaitons();
    setLoading(false);
  }, [sendRequest, authData.auth.userId]);

  return (
    <>
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
      <div
        className={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: `100%`,
        }}
      >
        {loading === false && applications.length > 0 && (
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={applications}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(applications) => applications._id}
            />
          </div>
        )}
        {applications.length === 0 && (
          <Typography
            sx={{ fontSize: 14, fontWeight: "bold", width: "100%" }}
            // color="text.secondary"
            // gutterBottom
            component={"span"}
          >
            {intl.formatMessage({ id: "noApplicationsFound" })}
          </Typography>
        )}
      </div>
    </>
  );
};
export default RejectedApplications;
