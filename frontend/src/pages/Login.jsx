import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  Alert,
  Button,
  MenuItem,
  Snackbar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const LoginFields = ({ setOpen, setUserInfo }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);

    axios.post("http://localhost:5000/login", form).then((res) => {
      if (res.data !== null) {
        setUserInfo(res.data);
        window.location.href = "/";
      } else {
        setOpen(true);
      }
    });
  };

  const handleBackClick = () => {
    window.location.href = "/";
  };

  return (
    <>
      <TextContainer>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ width: "100%" }}
        />
      </TextContainer>
      <TextContainer>
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: "100%" }}
        />
      </TextContainer>
      <ButtonContainer>
        <Button sx={{ color: "#f1bdad" }} onClick={handleBackClick}>
          Back
        </Button>
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          sx={{
            backgroundColor: "#f1bdad",
            ":hover": {
              backgroundColor: "#b6cdbf",
              color: "white"
            }
          }}
          onClick={handleClick}
        >
          Login
        </Button>
      </ButtonContainer>
    </>
  );
};

const SignUpFields = () => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [favCountry, setFavCountry] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [countryCodes, setCountryCodes] = useState([]);

  useEffect(() => {
    const asyncFunction = async () => {
      const countryCodesRes = await axios.get(
        "http://localhost:5000/country-codes"
      );
      setCountryCodes(countryCodesRes.data);
    };

    asyncFunction();
  }, []);

  const handleBackClick = () => {
    window.location.href = "/";
  };

  const handleClick = () => {
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    form.append("first_name", firstName);
    form.append("surname", surname);
    form.append("fav_country", favCountry);
    form.append("email", email);

    axios.post("http://localhost:5000/create-user", form).then((res) => {
      if (res.data !== null) {
        window.location.href = "/login?reg_success=true";
      }
    });
  };

  return (
    <>
      <TextContainer>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{ width: "100%" }}
        />
      </TextContainer>
      <TextContainer>
        <TextField
          label="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          sx={{ width: "100%" }}
        />
      </TextContainer>
      <TextContainer>
        <TextField
          value={favCountry}
          label="Favourite Country"
          onChange={(e) => setFavCountry(e.target.value)}
          select
          sx={{ width: "100%" }}
        >
          {countryCodes.map(({ country_code }) => (
            <MenuItem value={country_code}>{country_code}</MenuItem>
          ))}
        </TextField>
      </TextContainer>
      <TextContainer>
        <TextField
          label="Email"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          sx={{ width: "100%" }}
        />
      </TextContainer>
      <TextContainer>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ width: "100%" }}
        />
      </TextContainer>
      <TextContainer>
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: "100%" }}
        />
      </TextContainer>
      <ButtonContainer>
        <Button sx={{ color: "#f1bdad" }} onClick={handleBackClick}>
          Back
        </Button>
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          sx={{
            backgroundColor: "#f1bdad",
            ":hover": {
              backgroundColor: "#b6cdbf",
              color: "white"
            }
          }}
          onClick={handleClick}
        >
          Sign Up
        </Button>
      </ButtonContainer>
    </>
  );
};

const Login = ({ setUserInfo }) => {
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const [buttonState, setButtonState] = useState("login");
  const [open, setOpen] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    setRegSuccess(!!searchParams.get("reg_success"));
  }, []);

  const handleChange = (e, val) => {
    setButtonState(val);
  };

  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleRegClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setRegSuccess(false);
  };

  return (
    <Container>
      <LoginContainer>
        <ToggleButtonGroup
          value={buttonState}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="login">
            <Typography variant="h3">Login</Typography>
          </ToggleButton>
          <ToggleButton value="signUp">
            <Typography variant="h3">Sign Up</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
        {buttonState === "login" ? (
          <LoginFields setUserInfo={setUserInfo} setOpen={setOpen} />
        ) : (
          <SignUpFields />
        )}
      </LoginContainer>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity="error" onClose={handleClose}>
          Incorrect username/ password.
        </Alert>
      </Snackbar>
      <Snackbar
        open={regSuccess}
        autoHideDuration={3000}
        onClose={handleRegClose}
      >
        <Alert severity="success" onClose={handleRegClose}>
          Please login.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;

const ButtonContainer = styled.div`
  width: 100%;
  margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;

  background-color: #fef2e8;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TextContainer = styled.div`
  width: 100%;
  margin-top: 25px;
  box-sizing: border-box;
`;
