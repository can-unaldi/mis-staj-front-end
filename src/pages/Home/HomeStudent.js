import { Button, Typography } from "@mui/material";
import Page from "material-ui-shell/lib/containers/Page";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useAuth } from "base-shell/lib/providers/Auth";
import CustomPaper from "components/CustomPaper";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import UpdateProfile from "components/Forms/UpdateProfile";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import GeneralInformations from "components/widgets/GeneralInformations";
import MandatoryInternshipLetter from "components/widgets/MandatoryInternshipLetter";
// import CurrentIntership from "components/widgets/ApplicationProcess";
import OldInternships from "components/widgets/OldInternships";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const HomeStudent = () => {
  const [open, setOpen] = useState(false);
  const intl = useIntl();
  const authData = useAuth();

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (authData.auth.profileComplated === false) {
      setOpen(true);
    }
  }, []);
  return (
    <>
      <Container maxWidth="xl" style={{ marginTop: 20, marginBottom:20 }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} md={6}>
            <GeneralInformations />
          </Grid>
          <Grid item xs={12} md={6}>
            <MandatoryInternshipLetter />
          </Grid>
  
          <Grid item xs={12}>
            <OldInternships />
          </Grid>
        </Grid>
      </Container>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {intl.formatMessage({ id: "complateYourProfile" })}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              {intl.formatMessage({ id: "save" })}
            </Button>
          </Toolbar>
        </AppBar>{" "}
        <DialogContent>
          <DialogContentText>
            {intl.formatMessage({ id: "complateYourProfileText" })}
          </DialogContentText>
          <UpdateProfile onSave={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default HomeStudent;
