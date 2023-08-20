import React from "react";
import "./home.scss";
import { useAuth } from "../../hooks/useAuth";
import LoginForm from "../../components/ui/loginForm/LoginForm";

const Home = () => {
  const { currentUser } = useAuth();

  return (<>
    {currentUser?._id
      ? <h1>Hello, {currentUser.name}</h1>
      : <>
        <LoginForm />
        <div style={{ maxWidth: "300px" }}>
          <p style={{ marginTop: "1rem" }}>login: admin@asd.com</p>
          <p>password: ASDASD123</p>
          <hr style={{ marginTop: "1rem" }}/>
          <p style={{ marginTop: "1rem" }}>login: manager1@asd.com</p>
          <p>password: ASDASD123</p>
          <hr style={{ marginTop: "1rem" }}/>
          <p style={{ marginTop: "1rem" }}>login: user@asd.com</p>
          <p>password: ASDASD123</p>
        </div>
      </>
    }
  </>);
};

export default Home;
