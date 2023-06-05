import ReactDOM from "react-dom/client";
import App from "./Components/App/App.tsx";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="38655204534-bhg2h8ap0ca0t5ftig84kp2tv2b724oi.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
);
