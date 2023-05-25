import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import "./Login.css";

import { useNavigate } from "react-router-dom";

const Login = ({
  changeAuthStatus,
}: {
  changeAuthStatus: (status: boolean) => void;
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
      const response = await fetch(
        "http://localhost:4001/users/auth",
        requestOptions
      );
      const parseRes = await response.json();
      if (response.ok) {
        Cookie.set("sessionId", parseRes.sessionId);
        Cookie.set("name", parseRes.user.name);
        Cookie.set("email", parseRes.user.email);
        Cookie.set("id", parseRes.user._id);
        changeAuthStatus(true);
        redirect("/main");
      }
      console.log(parseRes);
    } catch (error) {
      return console.error(error);
    }
  };
  return (
    <div className="Login">
      <div className="login-title">
        <h1>Login</h1>
      </div>
      <form onSubmit={(e) => authUser(e)}>
        <div className="login-inputs">
          <input
            onChange={(e) => onChangeSetInputs(e)}
            type="email"
            name="email"
            placeholder="email"
            required
          />
          <input
            onChange={(e) => onChangeSetInputs(e)}
            type="password"
            name="password"
            placeholder="password"
            required
          />
        </div>
        <div className="login-buttons">
          <button type="submit" className="login-button">
            Login
          </button>
        </div>
      </form>
      <a>Sign up if you do not have an account</a>
    </div>
  );
};

export default Login;
