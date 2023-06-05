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
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = "http://localhost:4001";

  const changeAuthStatus = (boolean: boolean) => {
    setIsAuth(boolean);
  };

  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  useEffect(() => {
    const sessionId = Cookies.get("sessionId");
    if (!sessionId || sessionId === "undefined") {
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
          element={isAuth ? <Navigate to="/main" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={
            isAuth ? (
              <Navigate to="/main" />
            ) : (
              <Login
                changeAuthStatus={changeAuthStatus}
                apiUrl={apiUrl}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )
          }
        />
        <Route
          path="/signup"
          element={
            <SignUp
              apiUrl={apiUrl}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          }
        />
        <Route
          path="/main"
          element={
            isAuth ? (
              <Main
                changeAuthStatus={changeAuthStatus}
                apiUrl={apiUrl}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
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
