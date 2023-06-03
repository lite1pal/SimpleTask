import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import jwt from "jwt-decode";
import "./Login.css";

import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";

const Login = ({
  changeAuthStatus,
  apiUrl,
}: {
  changeAuthStatus: (status: boolean) => void;
  apiUrl: string;
}) => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const redirect = useNavigate();

  const onChangeSetInputs = (e: any) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const authUser = async (e: any) => {
    e.preventDefault();
    try {
      const { email, password } = inputs;
      if (!email || !password) return console.log("All fields are required.");
      const body = inputs;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };
      const response = await fetch(`${apiUrl}/users/auth`, requestOptions);
      const parseRes = await response.json();
      if (response.ok) {
        Cookies.set("sessionId", parseRes.sessionId);
        Cookies.set("name", parseRes.user.name);
        Cookies.set("email", parseRes.user.email);
        Cookies.set("id", parseRes.user._id);
        changeAuthStatus(true);
        redirect("/main");
      } else {
        console.log(parseRes);
      }
    } catch (error) {
      return console.error(error);
    }
  };

  const authUserGoogle = async (token: any) => {
    try {
      const body = { token };
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };
      const response = await fetch(
        `${apiUrl}/users/auth/google`,
        requestOptions
      );
      const parseRes = await response.json();
      console.log(parseRes);
      if (response.ok) {
        Cookies.set("sessionId", parseRes.user.sessionId);
        Cookies.set("name", parseRes.user.name);
        Cookies.set("email", parseRes.user.email);
        Cookies.set("id", parseRes.user._id);
        changeAuthStatus(true);
        redirect("/main");
      } else {
        console.log(parseRes);
      }
    } catch (error) {
      return console.error(error);
    }
  };

  return (
    <div className="Login">
      <div className="login-header">
        <h1>Login</h1>
      </div>
      <form className="login-form" onSubmit={(e) => authUser(e)}>
        <div className="login-main">
          <input
            className="login-input"
            onChange={(e) => onChangeSetInputs(e)}
            type="email"
            name="email"
            placeholder="email"
            required
          />
          <input
            className="login-input"
            onChange={(e) => onChangeSetInputs(e)}
            type="password"
            name="password"
            placeholder="password"
            required
          />
          <button type="submit" className="login-submit">
            Sign in
          </button>
          <p className="or-between-buttons">or</p>
          <div className="login-google">
            <GoogleLogin
              onSuccess={(credentialResponse: any) => {
                authUserGoogle(credentialResponse.credential);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              // type="icon"
              shape="circle"
              useOneTap
              size="large"
            />
          </div>
          <a
            onClick={() => redirect("/signup")}
            href=""
            className="login-signup-link"
          >
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
