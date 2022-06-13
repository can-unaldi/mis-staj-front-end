import React, {  useEffect } from "react";
import { useAuth } from "base-shell/lib/providers/Auth";
import { useIntl } from "react-intl";
import { useHttpClient } from "shared/hooks/http-hook";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { DropzoneDialog } from "mui-file-dropzone";

const FileUploadModal = ({ open, apiUrl,acceptedFiles, onClose, snackbar }) => {
  const intl = useIntl();
  const { auth, updateAuth, setAuth } = useAuth();
  const useStyles = makeStyles((theme) =>
    createStyles({
      previewChip: {
        minWidth: 160,
        maxWidth: 210,
      },
    })
  );

  const classes = useStyles();
  const { sendRequest } = useHttpClient();

  useEffect(() => {}, []);

  const handleSubmit = async (file) => {
    console.log("File:", file);
    const data = new FormData();
    data.append("file", file);
    console.log(data);
    try {
      const responseData = await sendRequest(apiUrl, "POST", data, {
        Authorization: "Bearer " + auth.token,
      });
      console.log(responseData);
      snackbar({ open: true, status: true, message: responseData.message });
    } catch (err) {
      snackbar({ open: true, status: false, message: err.message });
    }
  };

  return (
    <DropzoneDialog
      acceptedFiles={acceptedFiles}
      cancelButtonText={"Kapat"}
      submitButtonText={"Yükle"}
      open={open}
      onClose={onClose}
      onSave={(file) => {
        handleSubmit(file[0]);
        onClose(false);
      }}
      filesLimit={1}
      maxFileSize={500000}
      dropzoneText={"Dosyayı sürükleyip bırakın ya da tıklayın"}
      // showFileNames={true}
      // showFileNamesInPreview={true}
      showAlerts={false}
      showPreviews={true}
      showPreviewsInDropzone={false}
      useChipsForPreview
      previewGridProps={{
        container: { spacing: 1, direction: "row", justifyContent: "center" },
      }}
      previewChipProps={{ classes: { root: classes.previewChip } }}
      previewText="Seçili Dosya"
    />
  );
};

export default FileUploadModal;
