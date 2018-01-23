import React from "react";
import ReactDOM from "react-dom";

import "bootstrap";
import { Layout } from "./js/components/Layout.jsx";
import "font-awesome/css/font-awesome.min.css";
require("./css/main/styles.scss");

// Add CSS files to bundle
//require('../css/styles.scss');
// Render application to DOM
ReactDOM.render(
  <Layout />,
  document.querySelector("#app")
);