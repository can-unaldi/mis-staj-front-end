import { Container, Chip, Typography, Button, Grid } from "@mui/material";
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
import Page from "material-ui-shell/lib/containers/Page";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const OldInterships = () => {
  const intl = useIntl();
  const authData = useAuth();
  const navigate = useNavigate();

  const columns = [
    { field: "_id", headerName: "ID", width: 50 },
    { field: "studentName", headerName: "Öğrenci Adı", width: 130 },
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
    {
      field: "approvedWorkDayDuration",
      headerName: "Kabul Edilen Gün",
      width: 120,
      renderCell: (params) => {
        return <Chip label={params.value} color="success" />;
      },
    },
    { field: "companyName", headerName: "İşletme Adı", width: 130 },
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

  const handleClick = () => {
    navigate("/old-internships");
  };

  useEffect(() => {
    setLoading(true);
    const getInternships = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/finished-internships//student/internships/${authData.auth.userId}`,
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
      <Card sx={{ minWidth: 130 }}>
        <CardContent>
          <Typography
            sx={{ fontSize: 20, fontWeight: "bold" }}
            color="text.secondary"
            gutterBottom
          >
            {intl.formatMessage({ id: "OldInternships" })}
          </Typography>

          <Container maxWidth="xl">
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
                <div style={{ height: 162, width: "100%" }}>
                  <DataGrid
                    rows={internships}
                    columns={columns}
                    pageSize={2}
                    rowsPerPageOptions={[2]}
                    getRowId={(internships) => internships._id}
                    disableColumnFilter
                    disableColumnMenu
                    disableColumnSelector
                    hideFooter
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
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 1, md: 1 }}
              >
                <Grid item xs={12} md={4}>
                  <Button onClick={handleClick} size="small">
                    Tüm Stajları Görüntüle
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button onClick={() => navigate("/application-process/application-form")} size="small">
                    Staj Başvurusu Yap
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button onClick={() => navigate("/application-process")} size="small">
                    Başvuruları Görüntüle
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </CardContent>
      </Card>
    </>
  );
};
export default OldInterships;
