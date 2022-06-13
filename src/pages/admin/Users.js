import { Button, Container, Grid, Typography, Chip } from "@mui/material";
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
const Users = () => {
  const intl = useIntl();
  const authData = useAuth();
  const navigate = useNavigate();

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Adı", width: 130 },
    {
      field: "email",
      headerName: "Mail",
      width: 180,
    },
    {
      field: "type",
      headerName: "Kullanıcı Türü",
      width: 150,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        return params.value === 0 ? (
          <Chip label="Öğrenci" color="success" />
        ) : params.value === 1 ? (
          <Chip label="Danışman" color="secondary" />
        ) : params.value === 2 ? (
          <Chip label="Bölüm Görevlisi" color="primary" />
        ) : params.value === 3 ? (
          <Chip label="Staj Sorumlusu" color="warning" />
        ) : params.value === 4 ? (
          <Chip label="Admin" color="error" />
        ) : (
          <></>
        );
      },
    },
    {
      field: "phoneNumber",
      headerName: "Telefon Numarası",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 150,
      valueGetter: (params) => params.value || "-",
    },
    {
      field: "tcNumber",
      headerName: "T.C. No",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 120,
      valueGetter: (params) => params.value || "-",
    },
    {
      field: "studentNumber",
      headerName: "Öğrenci Numarası",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 120,
      valueGetter: (params) => params.value || "-",
    },
    {
      field: "birthDate",
      headerName: "Danışman",
      width: 130,
      valueGetter: (params) => {
        return params.row.advisor ? params.row.advisor.name : "-";
      },
    },
    {
      field: "actions",
      type: "actions",
      width: 200,
      getActions: (params) => [
        <Button
          onClick={() => {
            if (params.row.type === 0) {
              navigate(`/admin/update-student/${params.id}`);
            } else {
              navigate(`/admin/update-user/${params.id}`);
            }
          }}
          variant="outlined"
          color="warning"
        >
          Güncelle
        </Button>,
        <Button
          onClick={() => {
            setSelectedApplication(params.id);
            setOpenApplyModal(true);
          }}
          variant="outlined"
          color="error"
        >
          Sil
        </Button>,
      ],
    },
  ];

  const [loading, setLoading] = React.useState(false);
  const [openRejectModal, setOpenRejectModal] = React.useState(false);
  const [openApplyModal, setOpenApplyModal] = React.useState(false);
  const [selectedApplication, setSelectedApplication] = React.useState("");

  const [users, setUser] = useState([]);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    status: false,
    message: "",
  });
  const { sendRequest } = useHttpClient();

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${id}`,
        "DELETE",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authData.auth.token,
        }
      );
      console.log(responseData);
      setSnackbar({ open: true, status: true, message: responseData.message });
      setUser(users.filter((user) => user._id != id));
      setOpenApplyModal(false);
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
          `${process.env.REACT_APP_BACKEND_URL}/users/`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authData.auth.token,
          }
        );
        setUser(responseData.users);
        console.log(responseData.users);
      } catch (err) {
        console.log(err);
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
        onSubmit={deleteUser}
      />
      <ApprovalModal
        id={selectedApplication}
        open={openApplyModal}
        handleClose={() => setOpenApplyModal(false)}
        onSubmit={deleteUser}
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
        {loading === false && users.length > 0 && (
          <div style={{ height: 550, width: "100%" }}>
            <DataGrid
              rows={users}
              columns={columns}
              pageSize={8}
              rowsPerPageOptions={[8]}
              getRowId={(users) => users._id}
            />
          </div>
        )}
        {users.length === 0 && (
          <Typography
            sx={{ fontSize: 14, fontWeight: "bold", width: "100%" }}
            // color="text.secondary"
            // gutterBottom
            component={"span"}
          >
            {intl.formatMessage({ id: "noUsersFound" })}
          </Typography>
        )}
      </div>
    </>
  );
};
export default Users;
