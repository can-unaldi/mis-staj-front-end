import React, { Component } from "react";
import App from "base-shell/lib";
import _config from "./config";
import { ReactValidatableFormProvider } from "react-validatable-form";

export default class Demo extends Component {
  render() {
    return (
      <ReactValidatableFormProvider>
        <App config={_config} />
      </ReactValidatableFormProvider>
    );
  }
}
