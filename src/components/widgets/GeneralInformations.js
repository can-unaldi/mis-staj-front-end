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
import Paper from "@mui/material/Paper";
import { useHttpClient } from "shared/hooks/http-hook";
import LoadingSpinner from "components/Loading/LoadingSpinner";

const GeneralInformations = () => {
  const intl = useIntl();
  const [loading, setLoading] = React.useState(false);
  const [informations, setInformations] = React.useState({});
  const { auth } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    console.log(auth);
    const getUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/details/${auth.userId}`
        );
        console.log(responseData);
        setInformations(responseData.user);
      } catch (err) {
        console.log(err);
      }
    };
    if (auth.profileComplated) {
      getUser();
    }
  }, []);

  return (
    <>
      <LoadingSpinner loading={loading} />

      <Card sx={{ minWidth: 150 }}>
        {loading === false && informations && (
          <CardContent>
            <Typography
              sx={{ fontSize: 20, fontWeight: "bold" }}
              color="text.secondary"
              gutterBottom
            >
              {intl.formatMessage({ id: "GeneralInformations" })}
            </Typography>
            <Table sx={{ minWidth: 150 }} aria-label="simple table">
              <TableBody>
                <TableRow
                  //   key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Ad Soyad:</Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">{informations.name}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow
                  //   key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Bölüm:</Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">{informations.department}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow
                  //   key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Öğrenci Numarası:</Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">{informations.studentNumber}</Typography>
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default GeneralInformations;
