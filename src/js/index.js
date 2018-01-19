import React from "react";
import ReactDOM from "react-dom";

import $ from "jquery";
import "bootstrap";
import "../css/styles.scss";

import { Layout } from "./components/Layout.jsx";


// Add CSS files to bundle
//require('../css/styles.scss');
// Render application to DOM
ReactDOM.render(
  <Layout />,
  document.querySelector("#app")
);