import "./index.css";

import { Outlet, Router } from "@tanstack/react-location";

import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { location } from "./location";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router
      location={location}
      routes={[
        { path: ":renderer", element: <App /> },
        { path: "/", element: <App /> },
      ]}
    >
      <Outlet />
    </Router>
  </React.StrictMode>
);
