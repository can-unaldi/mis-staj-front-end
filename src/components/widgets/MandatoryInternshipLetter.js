import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Container from "@mui/material/Container";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const data = [
    {
      id: "d1",
      document: "Zorunlu Staj Belgesi",
      applyDate: "23/02/2022",
      approveDate: "13/03/2022",
      status: 0,
    },
];
const MandatoryInternshipLetter = () => {
  const intl = useIntl();
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Belge talebin başarı ile alındı.
        </Alert>
      </Snackbar>
      <Card sx={{ minWidth: 150 }}>
        <CardContent>
          <Typography
            sx={{ fontSize: 20, fontWeight: "bold" }}
            color="text.secondary"
            gutterBottom
          >
            {intl.formatMessage({ id: "MandatoryInternshipLetter" })}
          </Typography>
          <TableContainer
            sx={{
              width: "100%",
            }}
          >
            {data.length > 0 && (
              <Table sx={{ minWidth: 150 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Belge</TableCell>
                    <TableCell align="right">Başvuru Tarihi</TableCell>
                    <TableCell align="right">Onay Tarihi</TableCell>
                    <TableCell align="right">Durumu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((d) => (
                    <TableRow
                      key={d.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {d.document}
                      </TableCell>
                      <TableCell align="right">{d.applyDate}</TableCell>
                      <TableCell align="right">{d.approveDate}</TableCell>
                      <TableCell align="right">
                        <Chip
                          icon={
                            d.status === 0 ? (
                              <CloudDownloadIcon />
                            ) : d.status === 1 ? (
                              <NotificationsActiveIcon />
                            ) : (
                              <DeleteIcon />
                            )
                          }
                          label={
                            d.status === 0
                              ? "Onaylandı"
                              : d.status === 1
                              ? "Bekliyor"
                              : "Reddedildi"
                          }
                          color={
                            d.status === 0
                              ? "success"
                              : d.status === 1
                              ? "warning"
                              : "error"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {data.length === 0 && (
              <Typography
                sx={{ fontSize: 14, fontWeight: "bold", width: "100%" }}
                color="text.secondary"
                gutterBottom
              >
                {intl.formatMessage({ id: "noLetterRequest" })}
              </Typography>
            )}
          </TableContainer>
        </CardContent>
        <CardActions>
          <Button onClick={handleClick} size="small">
            Belge Talep Et
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default MandatoryInternshipLetter;
