import React, { useState } from "react";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Avatar, MenuItem, MenuList } from "@mui/material";
import { DebounceInput } from "react-debounce-input";
import OutsideClickHandler from "react-outside-click-handler";
import codeToFlag from "./codeToFlag";

const TopBar = () => {
  const [athleteResults, setAthleteResults] = useState([]);
  const [countryResults, setCountryResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const searchDb = async (searchTerm) => {
    const res = await axios.get("http://localhost:5000/search", {
      params: { query: searchTerm },
      headers: { "Content-Type": "application/json" }
    });

    setAthleteResults(res.data.athlete);
    setCountryResults(res.data.country);
  };

  const search = (e) => {
    const searchTerm = e.target.value;
    setSearchQuery(searchTerm);
    if (searchTerm === "") {
      setAthleteResults([]);
      setCountryResults([]);
      return;
    }

    searchDb(searchTerm);
  };

  const clearSearch = () => {
    if (searchQuery === "") {
      return;
    }
    setSearchQuery("");
    setAthleteResults([]);
    setCountryResults([]);
  };

  return (
    <Container>
      <Spacer>
        <Typography variant="h4">🏅</Typography>
      </Spacer>
      <SearchContainer>
        <OutsideClickHandler onOutsideClick={clearSearch}>
          <SearchBar
            value={searchQuery}
            onChange={search}
            minLength={3}
            debounceTimeout={500}
            placeholder="Search"
          />
          {(athleteResults.length !== 0 || countryResults.length !== 0) && (
            <MenuList
              sx={{
                position: "absolute",
                backgroundColor: "#fdded6",
                marginTop: 1
              }}
            >
              {athleteResults.map(({ first_name, surname, sex, id }) => (
                <MenuItem
                  sx={{ width: 300, overflow: "hidden" }}
                  onClick={() => {
                    window.location.href = `/athlete/${id}`;
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "#b6cdbf",
                      marginRight: 1
                    }}
                  >
                    {sex === "M" ? "👨" : "👩"}
                  </Avatar>
                  <Typography variant="body1">
                    {first_name} {surname}
                  </Typography>
                </MenuItem>
              ))}
              {countryResults.map(({ name, country_code }) => (
                <MenuItem
                  sx={{ width: 300, overflow: "hidden" }}
                  onClick={() => {
                    window.location.href = `/country/${country_code}`;
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "#b6cdbf",
                      marginRight: 1
                    }}
                  >
                    {codeToFlag(country_code)}
                  </Avatar>
                  <Typography variant="body1">{name}</Typography>
                </MenuItem>
              ))}
            </MenuList>
          )}
        </OutsideClickHandler>
      </SearchContainer>
    </Container>
  );
};

export default TopBar;

const Container = styled.div`
  top: 0px;
  padding: 0 25px;
  position: sticky;
  height: 60px;
  background-color: #fdded6;
  z-index: 1;

  display: flex;
  align-items: center;
`;

const Spacer = styled.div`
  flex: 5;
`;

const SearchBar = styled(DebounceInput)`
  width: 100%;
  height: 40px;
  padding-left: 30px;
  border-radius: 30px;
  border: none;
  box-sizing: border-box;

  background-color: #fef2e8;
`;

const SearchContainer = styled.div`
  flex: 1;
`;
