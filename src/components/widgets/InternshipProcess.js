import React, { useEffect, useState } from "react";
import { Button, Container, TableContainer, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate, useLocation } from "react-router-dom";
import SendCompanyApproval from "components/Modals/SendCompanyApproval";
import FileUploadModal from "components/Forms/FileUploadModal";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DoneIcon from "@mui/icons-material/Done";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { DownloadRounded } from "@mui/icons-material";
import { useHttpClient } from "shared/hooks/http-hook";
import LoadingSpinner from "components/Loading/LoadingSpinner";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const InternshipProcess = ({ internshipProp }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const authData = useAuth();
  const [internship, setInternship] = useState(internshipProp);
  const [open, setOpen] = React.useState(false);
  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [openFileModal, setOpenFileModal] = React.useState(false);
  const [fileModalUrl, setfileModalUrl] = React.useState("");
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    status: false,
    message: "",
  });

  const deleteInternship = () => {
    console.log("deleteInternship", internship._id);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ open: false });
  };

  useEffect(() => {
    setInternship(internshipProp);
  }, [internship]);

  const sendToApproval = async () => {
    setLoading(true);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/internships/send-to-approval/${internship._id}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authData.auth.token,
        }
      );
      console.log(responseData);
      setInternship(responseData.internship);
      setSnackbar({
        open: true,
        status: true,
        message: "Stajınız başarı ile onaya gönderildi.",
      });
      // window.location.reload()
    } catch (err) {
      console.log(err);
      setSnackbar({ open: true, status: false, message: err.message });
    }
    setLoading(false);
  };

  return (
    <>
      <Card sx={{ minWidth: 150 }}>
        <>
          <TableContainer
            sx={{
              width: "100%",
            }}
          >
            <CardContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <TableContainer
                  sx={{ minWidth: 350, maxWidth: 600 }}
                  component={Container}
                >
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tamlanması Gereken Görevler</TableCell>
                        <TableCell align="center">Durumu</TableCell>
                        <TableCell align="center">Eylem</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        key="Staj Bitti Yazısı Yükle"
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Staj Bitti Yazısı Yükle
                        </TableCell>
                        <TableCell align="center">
                          {internship.internshipEndedDocument ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <DoNotDisturbOnIcon color="error" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            endIcon={<CloudUploadIcon />}
                            disabled={
                              internship.internshipEndedDocument === true
                                ? true
                                : false
                            }
                            onClick={() => {
                              setOpenFileModal(true);
                              setfileModalUrl(
                                `${process.env.REACT_APP_BACKEND_URL}/internships/internship-ended-document/${internship._id}`
                              );
                            }}
                          >
                            Yükle
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        key="Staj Defteri Yükle"
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Staj Defteri Yükle
                        </TableCell>
                        <TableCell align="center">
                          {internship.internshipReport ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <DoNotDisturbOnIcon color="error" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            disabled={
                              internship.internshipReport ? true : false
                            }
                            endIcon={<CloudUploadIcon />}
                            onClick={() => {
                              setOpenFileModal(true);
                              setfileModalUrl(
                                `${process.env.REACT_APP_BACKEND_URL}/internships/internship-report/${internship._id}`
                              );
                            }}
                          >
                            Yükle
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        key="Öğrenci Değerlendirme Formu Yükle"
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Öğrenci Değerlendirme Formu
                        </TableCell>
                        <TableCell align="center">
                          {internship.studentEvaluationApproved ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <DoNotDisturbOnIcon color="error" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            disabled={
                              internship.studentEvaluationApproved
                                ? true
                                : false
                            }
                            endIcon={<SendIcon />}
                            onClick={() => {
                              setOpen(true);
                            }}
                          >
                            Gönder
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        key="İş Yeri Değerlendirme Formu Yükle"
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          İş Yeri Değerlendirme Formu
                        </TableCell>
                        <TableCell align="center">
                          {internship.companyEvaluationForm ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <DoNotDisturbOnIcon color="error" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            disabled={
                              internship.companyEvaluationForm ? true : false
                            }
                            endIcon={<DriveFileRenameOutlineIcon />}
                            onClick={() => {
                              navigate(
                                `/internships/company-evaluation/${internship._id}`
                              );
                            }}
                          >
                            Doldur
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        key="Bordro Yükle"
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Bordro Yükle
                        </TableCell>
                        <TableCell align="center">
                          {internship.payrollDocument ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <DoNotDisturbOnIcon color="error" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            endIcon={<CloudUploadIcon />}
                            disabled={
                              internship.feeToStudent !== 0
                                ? internship.payrollDocument
                                  ? true
                                  : false
                                : true
                            }
                            onClick={() => {
                              setOpenFileModal(true);
                              setfileModalUrl(
                                `${process.env.REACT_APP_BACKEND_URL}/internships/payroll-document/${internship._id}`
                              );
                            }}
                          >
                            Yükle
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </CardContent>
          </TableContainer>
          <CardActions>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Button
                variant="contained"
                endIcon={<DownloadRounded />}
                disabled={
                  internship.payrollDocument
                    ? internship.payrollDocument &&
                      internship.internEvaluationForm &&
                      internship.internshipReport &&
                      internship.internshipEndedDocument &&
                      internship.companyEvaluationForm
                      ? false
                      : true
                    : internship.feeToStudent === 0 &&
                      internship.internEvaluationForm &&
                      internship.internshipReport &&
                      internship.internshipEndedDocument &&
                      internship.companyEvaluationForm
                    ? false
                    : true
                }
                href={`${process.env.REACT_APP_BACKEND_URL}/internships/download/all/${internship._id}`}
                onClick={() => {
                  setSnackbar({
                    open: true,
                    status: true,
                    message: "Dosyalar başarı ile indirildi.",
                  });
                }}
              >
                Tüm Staj Belgelerini İndir
              </Button>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                disabled={
                  internship.finishInternshipProcess
                    ? true
                    : internship.feeToStudent !== 0 ||
                      internship.payrollDocument
                    ? internship.payrollDocument &&
                      internship.internEvaluationForm &&
                      internship.internshipReport &&
                      internship.internshipEndedDocument &&
                      internship.companyEvaluationForm
                      ? false
                      : true
                    : internship.internEvaluationForm &&
                      internship.internshipReport &&
                      internship.internshipEndedDocument &&
                      internship.companyEvaluationForm
                    ? false
                    : true
                }
                onClick={() => {
                  sendToApproval();
                }}
              >
                Onaya Gönder
              </Button>
            </div>
          </CardActions>
        </>
      </Card>
      <SendCompanyApproval
        id={internship._id}
        link={`/intern-evaluation/${internship._id}`}
        open={open}
        handleClose={handleClose}
      />
      <FileUploadModal
        open={openFileModal}
        apiUrl={fileModalUrl}
        acceptedFiles={[".pdf",".docx",".doc"]}
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
    </>
  );
};

export default InternshipProcess;
