import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Athlete, Country, Home, Login, User } from "./pages";
import reportWebVitals from "./reportWebVitals";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    padding: 0;
    margin: 0;
  }
`;

const RootComponent = () => {
  const [userInfo, setUserInfo] = useState({});

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home userInfo={userInfo} />
    },
    {
      path: "/login",
      element: <Login setUserInfo={setUserInfo} />
    },
    {
      path: "/user/:userId",
      element: <User userInfo={userInfo} />
    },
    {
      path: "/country/:countryCode",
      element: <Country userInfo={userInfo} />
    },
    {
      path: "/athlete/:athleteId",
      element: <Athlete userInfo={userInfo} />
    }
  ]);

  return <RouterProvider router={router} />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <GlobalStyle />
    <RootComponent />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
