import { Typography, Button, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";

const RejectModal = ({ id, open, handleClose, onSubmit }) => {
  const intl = useIntl();
  const [rejectMessage, setRejectMessage] = useState("");
  const handleSubmit = () => {
    onSubmit(id, rejectMessage);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Staj Başvurusunu Reddetmek Üzeresiniz.</DialogTitle>
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
              xs={12}
              component={Box}
              paddingLeft="15px"
              paddingRight="15px"
            >
              <Grid
                item
                xs={12}
                component={Box}
                paddingLeft="15px"
                paddingRight="15px"
              >
                <Typography component="h5" variant="h5">
                  {intl.formatMessage({ id: "rejectApprovalText" })}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                component={Box}
                paddingLeft="15px"
                paddingRight="15px"
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="text"
                  name="rejectMessage"
                  label={intl.formatMessage({ id: "rejectMessage" })}
                  value={rejectMessage}
                  onChange={(e) => setRejectMessage(e.target.value)}
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Kapat</Button>
          <Button onClick={handleSubmit}>Onayla</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RejectModal;
