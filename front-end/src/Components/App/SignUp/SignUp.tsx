import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SignUp.css";
import Loading from "../../Loading/Loading";

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
        return console.log("All fields are required.");

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
        console.log(parseRes);
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
            <h1>Sign up</h1>
          </div>
          <form onSubmit={createUser}>
            <div className="signup-main">
              <input
                className="signup-input"
                onChange={(e) => onChangeSetInputs(e)}
                type="text"
                name="name"
                placeholder="name"
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
                placeholder="password"
                autoComplete="off"
              />
              <button type="submit" className="signup-submit">
                Sign up
              </button>
              <a
                onClick={() => redirect("/login")}
                href=""
                className="signup-login-link"
              >
                Sign in if you have an account
              </a>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SignUp;
