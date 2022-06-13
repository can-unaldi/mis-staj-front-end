import { Button, Container, Grid, Typography } from "@mui/material";
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
import RejectModal from "components/Modals/RejectModal";
import ApprovalModal from "components/Modals/ApprovalModal";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const WaitingApplications = () => {
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
      field: "actions",
      type: "actions",
      width: 280,
      getActions: (params) => [
        <Button
          onClick={() => navigate(`/application-details/${params.id}`)}
          variant="contained"
          color="primary"
        >
          Detay
        </Button>,
        <Button
          onClick={() => {
            setSelectedApplication(params.id);
            setOpenApplyModal(true);
          }}
          variant="contained"
          color="success"
        >
          Onayla
        </Button>,
        <Button
          onClick={() => {
            setSelectedApplication(params.id);
            setOpenRejectModal(true);
          }}
          variant="contained"
          color="error"
        >
          Reddet
        </Button>,
      ],
    },
  ];

  const [loading, setLoading] = React.useState(false);
  const [openRejectModal, setOpenRejectModal] = React.useState(false);
  const [openApplyModal, setOpenApplyModal] = React.useState(false);
  const [selectedApplication, setSelectedApplication] = React.useState("");

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
        `${process.env.REACT_APP_BACKEND_URL}/approval/approve/${id}`,
        "PATCH",
        JSON.stringify({
          approval: true,
          name:authData.auth.displayName
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authData.auth.token,
        }
      );
      setApplications(applications.filter(application =>application._id!=id));
      console.log(responseData);
      setSnackbar({ open: true, status: true, message: responseData.message });
      setOpenApplyModal(false);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setSnackbar({ open: true, status: false, message: err });
    }
  };
  const rejectApplication = async (id, message) => {
    setLoading(true);
    console.log(message);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/approval/reject/${id}`,
        "PATCH",
        JSON.stringify({
          rejectedMessage: message.toString(),
          userId: authData.auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authData.auth.token,
        }
      );
      console.log(responseData);
      setSnackbar({ open: true, status: true, message: responseData.message });
      setApplications(applications.filter(application =>application._id!=id));
      setOpenRejectModal(false);
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
          `${process.env.REACT_APP_BACKEND_URL}/approval/department`,
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
        console.log(err)
      }
    };
    getApplicaitons();
    setLoading(false);
  }, [sendRequest]);

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
      <RejectModal
        id={selectedApplication}
        open={openRejectModal}
        handleClose={() => setOpenRejectModal(false)}
        onSubmit={rejectApplication}
      />
      <ApprovalModal
        id={selectedApplication}
        open={openApplyModal}
        handleClose={() => setOpenApplyModal(false)}
        onSubmit={approveApplication}
      />
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
export default WaitingApplications;
