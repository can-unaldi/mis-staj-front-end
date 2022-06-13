import {
  Avatar,
  Fab,
  InputBase,
  Paper,
  Zoom,
  Typography,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState, useEffect } from "react";
import { useAuth } from "base-shell/lib/providers/Auth";
import { useIntl } from "react-intl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { useHttpClient } from "shared/hooks/http-hook";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SendCompanyApproval = ({ open, handleClose, link, id }) => {
  const intl = useIntl();
  const { auth, updateAuth, setAuth } = useAuth();
  const [copiedText, setCopiedText] = useState();
  const theme = useTheme();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [companyApprovalLink, setCompanyApprovalLink] = useState(link);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    status: false,
    message: "",
  });

  const handleCloses = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ open: false});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/applications/send-mail-to-company/${id}`
      );
      console.log(responseData);
      setSnackbar({
        open: true,
        status: true,
        message: "Mail başarı ile gönderildi.",
      });
    } catch (err) {
      console.log(err);
      setSnackbar({ open: true, status: false, message: err.message });
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Onaylaması İçin Staj Başvurunu Şirkete Gönder</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid
              item
              lg={3}
              md={6}
              xs={12}
              component={Box}
              paddingLeft="15px"
              paddingRight="15px"
            >
              <CopyToClipboard
                text={companyApprovalLink}
                onCopy={() => setCopiedText(companyApprovalLink)}
              >
                <Tooltip
                  title={
                    copiedText === companyApprovalLink
                      ? "This was Copied!"
                      : "Copy To Clipboard"
                  }
                  placement="top"
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    disabled={true}
                    type="url"
                    name="companyApprovalLink"
                    label={intl.formatMessage({ id: "companyApprovalLink" })}
                    value={companyApprovalLink}
                  />
                </Tooltip>
              </CopyToClipboard>
            </Grid>
            <Grid
              item
              lg={3}
              md={6}
              xs={12}
              component={Box}
              paddingLeft="15px"
              paddingRight="15px"
            >
              <Typography component="h5" variant="h5">
                {intl.formatMessage({ id: "or" })}
              </Typography>
            </Grid>
            <Grid
              item
              lg={3}
              md={6}
              xs={12}
              component={Box}
              paddingLeft="15px"
              paddingRight="15px"
            >
              <Button variant="contained" onClick={handleSubmit}>
                {intl.formatMessage({ id: "sendCompanyApprovalLink" })}
              </Button>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Kapat</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1000}
        onClose={handleCloses}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.status == true ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SendCompanyApproval;
