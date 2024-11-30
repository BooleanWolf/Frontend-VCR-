import React from "react";
import ReactDOM from "react-dom";
import AppRoutes from "./AppRoutes";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
  document.getElementById("root")
);
