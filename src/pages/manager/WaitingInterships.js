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
import ApprovalModal from "components/Modals/ApprovalModal";
import InputModal from "components/Modals/InputModal";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const WaitingInterships = () => {
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
    { field: "duration", headerName: "Süre(Gün)", type: "number", width: 70 },
    { field: "companyName", headerName: "İşletme Adı", width: 130 },
    {
      field: "approved",
      headerName: "Durumu",
      width: 120,
      renderCell: (params) => {
        return params.value === true ? (
          <Chip label="Onaylandı" color="success" />
        ) : params.value === false ? (
          <Chip label="Reddedildi" color="error" />
        ) : (
          <Chip label="Bekliyor" color="warning" />
        );
      },
    },
    {
      width: 150,
      field: "download",
      headerName: "İndir",
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setSnackbar({
                open: true,
                status: true,
                message: "Dosyalar başarı ile indirildi.",
              });
            }}
            href={`${process.env.REACT_APP_BACKEND_URL}/internships/download/all/${params.id}`}
            variant="contained"
            color="primary"
          >
            Belgleri İndir
          </Button>
        );
      },
    },
    {
      width: 100,
      field: "approve",
      headerName: "Onayla",
      renderCell: (params) => {
        console.log(params);
        return params.row.approved === null ? (
          <Button
            onClick={() => {
              setSelectedInternship(params.id);
              setOpenApplyModal(true);
            }}
            variant="contained"
            color="success"
          >
            Onayla
          </Button>
        ) : (
          <></>
        );
      },
    },
    {
      width: 100,
      field: "reject",
      headerName: "Reddet",

      renderCell: (params) => {
        console.log(params);
        return params.row.approved === null ? (
          <Button
            onClick={() => {
              setSelectedInternship(params.id);
              setOpenRejectModal(true);
            }}
            variant="contained"
            color="error"
          >
            Reddet
          </Button>
        ) : (
          <></>
        );
      },
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

  const approveApplication = async (id, input) => {
    setLoading(true);
    setOpenApplyModal(false);

    console.log(id, input);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/internships/manager/approve/${id}`,
        "PATCH",
        JSON.stringify({
          approvedWorkDay: input,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authData.auth.token,
        }
      );
      console.log(responseData);
      setSnackbar({ open: true, status: true, message: responseData.message });
      setInternshipsChanged((prevState) => {
        return !prevState;
      });
      setLoading(false);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      setSnackbar({ open: true, status: false, message: err.message });
    }
  };

  const rejectApplication = async (id, input) => {
    setOpenRejectModal(false);
    setLoading(true);
    console.log(input);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/internships/manager/reject/${id}`,
        "PATCH",
        JSON.stringify({
          rejectedMessage: input,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authData.auth.token,
        }
      );
      console.log(responseData);
      setSnackbar({ open: true, status: true, message: responseData.message });
      setInternshipsChanged((prevState) => {
        return !prevState;
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setSnackbar({ open: true, status: false, message: err.message });
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
    const getInternships = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/internships/manager/sended-to-approval`,
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
        id={selectedInternship}
        open={openRejectModal}
        handleClose={() => setOpenRejectModal(false)}
        onSubmit={rejectApplication}
      />
      <InputModal
        id={selectedInternship}
        open={openApplyModal}
        handleClose={() => setOpenApplyModal(false)}
        onSubmit={approveApplication}
        dialogTitle="Stajı Onayla"
        dialogText="Kabul edilen staj günü sayısını giriniz."
        inputName="Gün sayısı"
        inputType="number"
      />
      {/* <ApprovalModal
        id={selectedInternship}
        open={openApplyModal}
        handleClose={() => setOpenApplyModal(false)}
        onSubmit={approveApplication}
      /> */}
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
    </>
  );
};
export default WaitingInterships;
