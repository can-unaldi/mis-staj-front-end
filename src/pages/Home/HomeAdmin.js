import { Button, Typography, Container,Grid } from "@mui/material";
import Page from "material-ui-shell/lib/containers/Page";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import Users from "pages/admin/Users";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {  useNavigate } from "react-router-dom";
import LoadingSpinner from "components/Loading/LoadingSpinner";
import FileUploadModal from "components/Forms/FileUploadModal";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const HomeAdmin = () => {
  const intl = useIntl();
  const authData = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [openFileModal, setOpenFileModal] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    status: false,
    message: "",
  });

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ open: false });
  };

  return (
    <Container
      maxWidth="xl"
      style={{ marginTop: 20, marginBottom: 20, height: "90%" }}
    >
      <FileUploadModal
        open={openFileModal}
        apiUrl={`${process.env.REACT_APP_BACKEND_URL}/users/admin/create-users`}
        acceptedFiles={[".xlsx"]}
        onClose={() => {
          setOpenFileModal(false);
        }}
        snackbar={setSnackbar}
      />
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
      <div
        className={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: `100%`,
        }}
      >
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              onClick={() => {
                setSnackbar({
                  open: true,
                  status: true,
                  message: "Dosya başarı ile indirildi.",
                });
              }}
              href={`${process.env.REACT_APP_BACKEND_ASSET_URL}/public/files/studentList.xlsx`}
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              color="success"
            >
              Toplu Öğrenci Ekleme Taslağı İndir
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              onClick={() => setOpenFileModal(true)}
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              color="success"
            >
              Toplu Öğrenci Ekle
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              onClick={() => navigate("/admin/add-student")}
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
            >
              Öğrenci Ekle
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              onClick={() => navigate("/admin/add-user")}
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
            >
              Kullanıcı Ekle
            </Button>
          </Grid>
        </Grid>
        <Typography variant="h6">
          {intl.formatMessage({ id: "users" })}
        </Typography>
        <Users />
      </div>
    </Container>
  );
};
export default HomeAdmin;
