import { useState, useEffect } from "react";

import "./SignUp";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    age: 0,
  });

  const onChangeSetInputs = (e: any) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const createUser = async (e: any) => {
    e.preventDefault();
    try {
      const { name, email, password, age } = inputs;
      if (!name || !email || !password || !age)
        return console.log("All fields are required.");

      const body = inputs;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };
      const response = await fetch(
        "http://localhost:4001/users/create",
        requestOptions
      );
      const parseRes = await response.json();
      console.log(parseRes);
      if (response.ok) {
      }
    } catch (error) {
      return console.error(error);
    }
  };
  return (
    <div className="SignUp">
      <div className="signup-title">
        <h1>Sign up</h1>
      </div>
      <form onSubmit={createUser}>
        <div className="signup-inputs">
          <input
            onChange={(e) => onChangeSetInputs(e)}
            type="text"
            name="name"
            placeholder="name"
          />
          <input
            onChange={(e) => onChangeSetInputs(e)}
            type="email"
            name="email"
            placeholder="email"
          />
          <input
            onChange={(e) => onChangeSetInputs(e)}
            type="password"
            name="password"
            placeholder="password"
          />
          <input
            onChange={(e) => onChangeSetInputs(e)}
            type="age"
            name="age"
            placeholder="age"
          />
        </div>
        <div className="signup-buttons">
          <button type="submit" className="signup-button">
            Sign up
          </button>
        </div>
      </form>
      <a>Log in if you have an account</a>
    </div>
  );
};

export default SignUp;
