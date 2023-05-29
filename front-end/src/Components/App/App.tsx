import { useEffect, useState } from "react";

// imports css file of this component
import "./App.css";
// imports other components
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp";
import Main from "./Main/Main";

import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  const changeAuthStatus = (boolean: boolean) => {
    setIsAuth(boolean);
  };

  useEffect(() => {
    const sessionId = Cookies.get("sessionId");
    // console.log(isAuth);
    if (!sessionId) {
      changeAuthStatus(false);
    } else {
      changeAuthStatus(true);
    }
  }, [isAuth]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            isAuth ? (
              <Main changeAuthStatus={changeAuthStatus} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuth ? (
              <Navigate to="/main" />
            ) : (
              <Login changeAuthStatus={changeAuthStatus} />
            )
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/main"
          element={
            isAuth ? (
              <Main changeAuthStatus={changeAuthStatus} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
