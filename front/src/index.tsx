import React from "react";
import ReactDOM from "react-dom";
import { ToastProvider } from "react-toast-notifications";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";
import App from "./App";
import AuthProvider from "./providers/auth";
import "./styles/global.css";

export const fetcher = (resource: any, init: RequestInit) =>
  fetch(resource, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(localStorage.getItem("jid")
        ? {
            authorization: localStorage.getItem("jid")!,
          }
        : {}),
    },
  }).then((res) => res.json());

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        fetcher: fetcher,
      }}
    >
      <AuthProvider>
        <ToastProvider
          placement="bottom-center"
          autoDismiss
          autoDismissTimeout={3000}
        >
          <App />
        </ToastProvider>
      </AuthProvider>
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById("root")
);
