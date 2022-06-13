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
import {
  Camera,
  Delete,
  Save,
  Person as PersonIcon,
} from "@mui/icons-material";
import Page from "material-ui-shell/lib/containers/Page/Page";
import React, { useState, useEffect } from "react";
import { useAuth } from "base-shell/lib/providers/Auth";
import { useIntl } from "react-intl";
import { useQuestions } from "material-ui-shell/lib/providers/Dialogs/Question";
import ImgageUploadDialog from "material-ui-shell/lib/containers/ImageUploadDialog";
import CssBaseline from "@mui/material/CssBaseline";
// import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useMenu } from "material-ui-shell/lib/providers/Menu";
import { useTheme } from "@mui/material/styles";
import { useValidatableForm } from "react-validatable-form";
import { useHttpClient } from "shared/hooks/http-hook";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import trLocale from "date-fns/locale/tr";

const userTypes = [
  "student",
  "advisor",
  "headOfDepartment",
  "internshipManager",
  "admin",
];
const UpdateProfile = ({ onSave }) => {
  const intl = useIntl();
  const { auth, updateAuth, setAuth } = useAuth();
  const {
    photoURL: currentPhoroURL = "",
    displayName: currentDisplayName = "",
    email = "",
  } = auth || {};
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [photoURL, setPhotoURL] = useState(currentPhoroURL);
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);

  const hasChange =
    displayName !== currentDisplayName || photoURL !== currentPhoroURL;

  const handleImageChange = (image) => {
    setPhotoURL(image);
    console.log(image);
    setPathValue("image", image);
  };

  const handleSave = async () => {
    updateAuth({ ...auth, displayName, photoURL });
  };

  const theme = useTheme();
  const navigate = useNavigate();
  let location = useLocation();
  const { toggleThis } = useMenu();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const rules = [
    {
      path: "phoneNumber",
      ruleSet: [
        {
          rule: "required",
        },
        {
          rule: "regex",
          regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        },
      ],
    },
    {
      path: "studentNumber",
      ruleSet: [
        {
          rule: "required",
        },
        {
          rule: "regex",
          regex: /^[0-9]{10}$/,
        },
      ],
    },
    {
      path: "tcNumber",
      ruleSet: [
        {
          rule: "required",
        },
        {
          rule: "regex",
          regex: /^[1-9]{1}[0-9]{9}[02468]{1}$/,
        },
      ],
    },
    {
      path: "birthDate",
      ruleSet: [
        {
          rule: "required",
          customMessage: intl.formatMessage({ id: "requiredError" }),
        },
      ],
    },
  ];

  const {
    isValid,
    formData,
    setPathValue,
    setFormIsSubmitted,
    setPathIsBlurred,
    getValue,
    getError,
  } = useValidatableForm({
    rules,
    hideBeforeSubmit: true,
    showAfterBlur: true,
    focusToErrorAfterSubmit: true,
  });

  useEffect(() => {
    console.log(auth);
    const getUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/details/${auth.userId}`
        );
        setPathValue("phoneNumber", responseData.user.phoneNumber);
        setPathValue("studentNumber", responseData.user.studentNumber);
        setPathValue("tcNumber", responseData.user.tcNumber);
        setPathValue("birthDate", responseData.user.birthDate);
      } catch (err) {
        console.log(err);
      }
    };
    if (auth.profileComplated) {
      getUser();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submitResultValid = setFormIsSubmitted();
    if (submitResultValid) {
      console.log(formData);
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`,
          "PATCH",
          JSON.stringify({
            birthDate: formData.birthDate,
            image: formData.image,
            phoneNumber: formData.phoneNumber,
            studentNumber: formData.studentNumber,
            tcNumber: formData.tcNumber,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        console.log(responseData);
        // auth.login(responseData.userId, responseData.token);
        updateAuth({ ...auth, displayName, photoURL, profileComplated: true });
        onSave();
      } catch (err) {}
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: 18,
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
          alignItems: "center",
          width: "80%",
          marginTop: 50,
        }}
      >
        <Fab
          onClick={() => setImageDialogOpen(true)}
          style={{
            position: "absolute",
            zIndex: 99,
            top: 50,
            marginRight: -60,
          }}
          color="primary"
          aria-label="save"
          size="small"
        >
          <Camera />
        </Fab>

        {photoURL && (
          <Avatar
            style={{ width: 120, height: 120, marginTop: -40 }}
            alt="User Picture"
            src={photoURL}
          />
        )}
        {!photoURL && (
          <Avatar
            style={{ width: 120, height: 120, marginTop: -40 }}
            alt="User Picture"
          >
            {email ? email[0].toUpperCase() : <PersonIcon />}
          </Avatar>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: 18,
            marginBottom: 18,
          }}
        >
          <InputBase
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            inputProps={{
              "aria-label": "naked",
              style: {
                fontSize: 26,
                fontWeight: "bold",
                textAlign: "center",
              },
            }}
          />
          <Typography variant="h6">{email}</Typography>
        </div>
        <Box
          component="form"
          autocomplete="on"
          onSubmit={handleSubmit}
          sx={{ mb: 3, mx: 3 }}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 1, md: 1 }}
          >
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="phoneNumber"
                type="tel"
                label={intl.formatMessage({ id: "phoneNumber" })}
                name="phoneNumber"
                autoComplete="tel"
                value={getValue("phoneNumber") || ""}
                onChange={(e) => setPathValue("phoneNumber", e.target.value)}
                onBlur={() => setPathIsBlurred("phoneNumber")}
                error={!!getError("phoneNumber")}
                helperText={getError("phoneNumber") || " "}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                name="studentNumber"
                label={intl.formatMessage({ id: "studentNumber" })}
                id="studentNumber"
                value={getValue("studentNumber") || ""}
                onChange={(e) => setPathValue("studentNumber", e.target.value)}
                onBlur={() => setPathIsBlurred("studentNumber")}
                error={!!getError("studentNumber")}
                helperText={getError("studentNumber") || " "}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                name="tcNumber"
                label={intl.formatMessage({ id: "tcNumber" })}
                id="tcNumber"
                value={getValue("tcNumber") || ""}
                onChange={(e) => setPathValue("tcNumber", e.target.value)}
                onBlur={() => setPathIsBlurred("tcNumber")}
                error={!!getError("tcNumber")}
                helperText={getError("tcNumber") || " "}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider
                locale={trLocale}
                dateAdapter={AdapterDateFns}
              >
                <MobileDatePicker
                  margin="normal"
                  required
                  fullWidth
                  name="birthDate"
                  label={intl.formatMessage({ id: "birthDate" })}
                  value={getValue("birthDate") || new Date("01.01.2000")}
                  onChange={(e) => setPathValue("birthDate", e)}
                  onBlur={() => setPathIsBlurred("birthDate")}
                  error={!!getError("birthDate")}
                  helperText={getError("birthDate") || " "}
                  renderInput={(params) => (
                    <TextField
                      autoComplete="bday"
                      margin="normal"
                      required
                      fullWidth
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
            >
              {intl.formatMessage({ id: "save" })}
            </Button>
          </Grid>
        </Box>
      </Paper>
      {
        <ImgageUploadDialog
          isOpen={isImageDialogOpen}
          handleClose={() => setImageDialogOpen(false)}
          handleCropSubmit={handleImageChange}
        />
      }
    </div>
  );
};

export default UpdateProfile;
