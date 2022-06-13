import { Typography, Button, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const InputModal = ({ id, open, handleClose, onSubmit, dialogTitle,dialogText,inputName,inputType }) => {
  const intl = useIntl();
  const [input, setInput] = useState("");
  const handleSubmit = () => {
    onSubmit(id, input);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
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
                  {dialogText}
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
                  type={inputType}
                  name={inputName}
                  label={intl.formatMessage({ id: inputName })}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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

export default InputModal;
