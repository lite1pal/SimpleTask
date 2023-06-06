import { useState } from "react";
import Cookies from "js-cookie";
import "./Login.css";

import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Loading from "../../Loading/Loading";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Notify } from "notiflix";

const Login = ({
  changeAuthStatus,
  apiUrl,
  isLoading,
}: {
  changeAuthStatus: (status: boolean) => void;
  apiUrl: string;
  isLoading: boolean;
  setIsLoading: any;
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
      Notify.info(
        navigator.language === "uk"
          ? "Зачекайте трішки, будь ласка, сервер просинається після тяжкого робочого дня"
          : "Wait a bit, please, the server is waking up after a hard work day"
      );
      const response = await fetch(`${apiUrl}/users/auth`, requestOptions);
      const parseRes = await response.json();
      if (response.ok) {
        Notify.success(
          navigator.language === "uk"
            ? "Вхід успішний"
            : "You signed in successfully"
        );
        Cookies.set("sessionId", parseRes.sessionId);
        Cookies.set("name", parseRes.user.name);
        Cookies.set("email", parseRes.user.email);
        Cookies.set("id", parseRes.user._id);
        changeAuthStatus(true);
        redirect("/main");
      } else {
        console.log(parseRes);
        toast(parseRes);
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
      Notify.info(
        navigator.language === "uk"
          ? "Зачекайте трішки, будь ласка, сервер просинається після тяжкого робочого дня"
          : "Wait a bit, please, the server is waking up after a hard work day",
        { timeout: 5000 }
      );
      const response = await fetch(
        `${apiUrl}/users/auth/google`,
        requestOptions
      );
      const parseRes = await response.json();
      console.log(parseRes);
      if (response.ok) {
        Notify.success(
          navigator.language === "uk"
            ? "Вхід успішний"
            : "You signed in successfully",
          { timeout: 5000 }
        );
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
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="login-header">
            <h1>{navigator.language === "uk" ? "Вхід" : "Login"}</h1>
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
                placeholder={
                  navigator.language === "uk" ? "пароль" : "password"
                }
                required
              />
              <button type="submit" className="login-submit">
                {navigator.language === "uk" ? "Ввійти" : "Sign in"}
              </button>
              <p className="or-between-buttons">
                {navigator.language === "uk" ? "або" : "or"}
              </p>
              <div className="login-google">
                <GoogleLogin
                  onSuccess={(credentialResponse: any) => {
                    authUserGoogle(credentialResponse.credential);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
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
                {navigator.language === "uk" ? "Створити аккаунт" : "Sign up"}
              </a>
            </div>
          </form>
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default Login;
