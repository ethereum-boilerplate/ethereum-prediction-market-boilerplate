import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MoralisProvider } from "react-moralis";
import "./index.css";
import QuickStart from "pages/Dashboard";
import { MoralisDappProvider } from "./providers/MoralisDappProvider/MoralisDappProvider";

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

/** Get your free Moralis Account https://moralis.io/ */
ReactDOM.render(
  <StrictMode>
    {APP_ID && SERVER_URL ? (
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <MoralisDappProvider>
          <App />
        </MoralisDappProvider>
      </MoralisProvider>
    ) : (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <QuickStart />
      </div>
    )}
  </StrictMode>,
  document.getElementById("root")
);
