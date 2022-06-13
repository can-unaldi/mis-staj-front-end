import { Button, Container, Chip, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import LoadingSpinner from "components/Loading/LoadingSpinner";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useHttpClient } from "shared/hooks/http-hook";
import { useNavigate, useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import RejectModal from "components/Modals/RejectModal";
import Page from "material-ui-shell/lib/containers/Page";
import InputModal from "components/Modals/InputModal";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ApprovedInterships = () => {
  const intl = useIntl();
  const authData = useAuth();
  const navigate = useNavigate();

  const columns = [
    { field: "_id", headerName: "ID", width: 50 },
    { field: "studentName", headerName: "Öğrenci Adı", width: 130 },
    {
      field: "studentTC",
      headerName: "T.C. No",
      type: "number",
      width: 100,
    },
    {
      field: "studentBday",
      headerName: "Doğum Tarihi",
      type: "dateTime",
      width: 130,
      valueGetter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "studentId",
      headerName: "Öğrenci Numarası",
      type: "number",
      width: 100,
    },
    {
      field: "startDate",
      headerName: "Başlangıç Tarihi",
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
    { field: "approvedWorkDayDuration", headerName: "Kabul Edilen Gün", type: "number", width: 70 },
    { field: "companyName", headerName: "İşletme Adı", width: 130 },
    { field: "numberOfEmployee",type:"number", headerName: "Personel Sayısı", width: 100 },
    { field: "companyPhone", headerName: "İşletme Tel", width: 130 },
    { field: "companyAddress", headerName: "İşletme Adresi", width: 130 },
    {
      field: "approveDate",
      headerName: "Onay Tarihi",
      type: "dateTime",
      width: 100,
      valueGetter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

  ];

  const [loading, setLoading] = React.useState(false);
  const [openRejectModal, setOpenRejectModal] = React.useState(false);
  const [openApplyModal, setOpenApplyModal] = React.useState(false);
  const [selectedInternship, setSelectedInternship] = React.useState("");
  const [internshipsChanged, setInternshipsChanged] = useState(false);

  const [internships, setInternships] = useState([]);
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
    const getInternships = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/finished-internships/manager/internships`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authData.auth.token,
          }
        );
        setInternships(responseData.internships);
        console.log(responseData.internships);
      } catch (err) {
        console.log(err);
      }
    };
    getInternships();
    setLoading(false);
  }, [sendRequest, internshipsChanged]);

  return (
    <Page pageTitle={intl.formatMessage({ id: "home" })}>
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
      <Container
        maxWidth="xl"
        style={{ marginTop: 20, marginBottom: 20, height: "90%" }}
      >
        <div
          className={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: `100%`,
          }}
        >
          {loading === false && internships.length > 0 && (
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={internships}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                getRowId={(internships) => internships._id}
              />
            </div>
          )}
          {internships.length === 0 && (
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
      </Container>
    </Page>
  );
};
export default ApprovedInterships;
