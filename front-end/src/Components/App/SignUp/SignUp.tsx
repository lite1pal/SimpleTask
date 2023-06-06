import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SignUp.css";
import Loading from "../../Loading/Loading";

import { Notify } from "notiflix";

const validatePassword = (password: string) => {
  let is8length = false;
  let isDigit = false;
  let isCapital = false;

  is8length = password.length >= 8;
  isDigit = password.split("").some((pw: string) => {
    if ("0123456789".includes(pw)) return true;
  });
  isCapital = password.split("").some((pw: string) => {
    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(pw)) return true;
  });
  return is8length && isDigit && isCapital;
};

const SignUp = ({
  apiUrl,
  isLoading,
}: {
  apiUrl: string;
  isLoading: boolean;
  setIsLoading: any;
}) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const redirect = useNavigate();

  const onChangeSetInputs = (e: any) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const createUser = async (e: any) => {
    e.preventDefault();
    try {
      const { name, email, password } = inputs;
      if (!name || !email || !password)
        return Notify.failure(
          navigator.language === "uk"
            ? "Заповніть всі поля"
            : "All fields are required"
        );

      if (!validatePassword(password))
        return Notify.info(
          navigator.language === "uk"
            ? "Пароль повинен бути мінімум з 8 символів і мати як найменше одну цифру та велику літеру"
            : "Password has to be at least 8 letters, has at least one capital letter and one digit"
        );
      const body = inputs;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };
      const response = await fetch(`${apiUrl}/users/create`, requestOptions);
      const parseRes = await response.json();
      if (response.ok) {
        Notify.success(
          navigator.language === "uk"
            ? "Аккаунт успішно створений"
            : "Signing up went successfully"
        );
        redirect("/login");
      } else {
        console.error(parseRes);
      }
    } catch (error) {
      return console.error(error);
    }
  };
  return (
    <div className="Signup">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="signup-header">
            <h1>{navigator.language === "uk" ? "Реєстрація" : "Sign up"}</h1>
          </div>
          <form onSubmit={createUser}>
            <div className="signup-main">
              <input
                className="signup-input"
                onChange={(e) => onChangeSetInputs(e)}
                type="text"
                name="name"
                placeholder={navigator.language === "uk" ? "ім'я" : "name"}
                autoComplete="off"
              />
              <input
                className="signup-input"
                onChange={(e) => onChangeSetInputs(e)}
                type="email"
                name="email"
                placeholder="email"
                autoComplete="off"
              />
              <input
                className="signup-input"
                onChange={(e) => onChangeSetInputs(e)}
                type="password"
                name="password"
                placeholder={
                  navigator.language === "uk" ? "пароль" : "password"
                }
                autoComplete="off"
              />
              <button type="submit" className="signup-submit">
                {navigator.language === "uk" ? "Створити" : "Sign up"}
              </button>
              <a
                onClick={() => redirect("/login")}
                href=""
                className="signup-login-link"
              >
                {navigator.language === "uk"
                  ? "Ввійти, якщо ви маєте аккаунт"
                  : "Sign in if you an account"}
              </a>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SignUp;
