import React, {useState} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";

export default function LoadingSpinner({ loading }) {

  const [open, setOpen] = React.useState(false);


  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
