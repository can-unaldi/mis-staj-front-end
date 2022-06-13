import Page from "material-ui-shell/lib/containers/Page/Page";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import UpdateProfile from "components/Forms/UpdateProfile";
import { useNavigate, useLocation } from "react-router-dom";

const MyAccount = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const onSave = () => {
    navigate("/home");
  };
  return (
    <Page
      pageTitle={intl.formatMessage({
        id: "my_account",
        defaultMessage: "My Account",
      })}
    >
      <UpdateProfile onSave={onSave} />
    </Page>
  );
};

export default MyAccount;
