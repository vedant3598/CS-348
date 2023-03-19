import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import {
  Athlete, Country, Home, Login, User,
} from './pages';
import reportWebVitals from './reportWebVitals';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    padding: 0;
    margin: 0;
  }
`;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/user/:userid',
    element: <User />,
  },
  {
    path: '/country/:countrycode',
    element: <Country />,
  },
  {
    path: '/athlete/:athleteid',
    element: <Athlete />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
