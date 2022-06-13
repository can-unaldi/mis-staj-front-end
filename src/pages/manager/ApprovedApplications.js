import { Button, Chip, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import LoadingSpinner from "components/Loading/LoadingSpinner";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useHttpClient } from "shared/hooks/http-hook";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ApprovedApplications = () => {
  const intl = useIntl();
  const authData = useAuth();

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
      field: "actions",
      type: "actions",
      flex: 1,
      renderCell: (params) => <Chip label="Onaylandı" color="success" />,
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
          `${process.env.REACT_APP_BACKEND_URL}/approval/manager?status=approved`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authData.auth.token,
          }
        );
        setApplications(responseData.applications);
      } catch (err) {}
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
export default ApprovedApplications;
