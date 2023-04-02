import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Avatar, Chip } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";

import codeToFlag from "../helpers/codeToFlag";
import TopBar from "../helpers/TopBar";

const NoRowsOverlay = () => (
  <SkeletonOverlay>
    <Typography sx={{ justifyContent: "center" }}>Loading data...</Typography>
  </SkeletonOverlay>
);

const Athlete = () => {
  const columns = [
    { field: "event_name", headerName: "Event", width: 500 },
    {
      field: "year",
      headerName: "Year",
      width: 200
    },
    {
      field: "season",
      headerName: "Season",
      width: 200
    },
    {
      field: "medal_achieved",
      headerName: "Medal",
      width: 200
    }
  ];

  const { athleteId } = useParams();
  const [athleteStats, setAthleteStats] = useState({
    age: 0,
    count_bronze: 0,
    count_gold: 0,
    count_silver: 0,
    country: "NA",
    first_name: "Athlete",
    height: 0,
    sex: "M",
    surname: "Name",
    weight: 0,
    medal_rank: 0
  });
  const [events, setEvents] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [isUserFavourite, setIsUserFavourite] = useState(false);

  const handleFavouriteCountryClick = () => {
    const form = new FormData();
    form.append("user_id", userInfo.id);
    form.append("athlete_id", athleteId);

    axios.post(`http://localhost:5000/${isUserFavourite ? 'delete-user-selected-athlete' : 'favourite-athlete'}`, form).then((res) => {
      if (res.data !== null) {
        setIsUserFavourite(!isUserFavourite);
      }
    });
  };

  useEffect(() => {
    const info = JSON.parse(
      localStorage.getItem("CS348-olympics-scoreboard-login")
    );
    setUserInfo(info);
    const asyncFunc = async () => {
      const athleteRes = await axios.get("http://localhost:5000/athlete", {
        params: { athlete_id: athleteId },
        headers: { "Content-Type": "application/json" }
      });
      setAthleteStats(athleteRes.data);

      const eventsRes = await axios.get(
        "http://localhost:5000/events-for-athlete",
        {
          params: { athlete_id: athleteId },
          headers: { "Content-Type": "application/json" }
        }
      );
      setEvents(eventsRes.data);

      const favouriteRes = await axios.get(
        "http://localhost:5000/favourite-athletes",
        {
          params: { user_id: info.id },
          headers: { "Content-Type": "application/json" }
        }
      );
      setIsUserFavourite(!!favouriteRes.data.filter((val) => val.id === athleteId));
      setLoaded(true);
    };

    asyncFunc();
  }, []);

  return (
    <Container>
      <div>
        <TopBar />
        <div style={{ margin: 10 }}>
          <div style={{ display: "flex" }}>
            <Avatar
              sx={{
                backgroundColor: "#b6cdbf",
                width: 72,
                height: 72,
                fontSize: 56,
                marginRight: 5
              }}
            >
              {athleteStats.sex === "M" ? "👨" : "👩"}
            </Avatar>
            <Typography
              variant="h3"
              style={{ alignSelf: "center", marginRight: 10 }}
            >
              {loaded
                ? `${athleteStats.first_name} ${athleteStats.surname}`
                : "Athlete"}
            </Typography>
            {isUserFavourite ? (
              <StarIcon
                onClick={handleFavouriteCountryClick}
                sx={{
                  cursor: "pointer",
                  color: "#e2a020",
                  width: 36,
                  height: 36,
                  alignSelf: "center"
                }}
              />
            ) : (
              <StarOutlineIcon
                onClick={handleFavouriteCountryClick}
                sx={{
                  cursor: "pointer",
                  color: "#e2a020",
                  width: 36,
                  height: 36,
                  alignSelf: "center"
                }}
              />
            )}
            <div
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginLeft: 25
              }}
            >
              <StyledChip label={`🏆 #${athleteStats.medal_rank}`} />
              <StyledChip label={`😎 ${athleteStats.age} years old`} />
              <StyledChip label={codeToFlag(athleteStats.country)} />
              <StyledChip label={athleteStats.sex === "M" ? "👨" : "👩"} />
              <StyledChip label={`⚖️ ${athleteStats.weight} kg`} />
              <StyledChip label={`📏 ${athleteStats.height} cm`} />
              <StyledChip label={`🥇 ${athleteStats.count_gold}`} />
              <StyledChip label={`🥈 ${athleteStats.count_silver}`} />
              <StyledChip label={`🥉 ${athleteStats.count_bronze}`} />
            </div>
          </div>
          <div style={{ marginTop: 30 }}>
            <div style={{ marginLeft: 20 }}>
              <Typography variant="h4">{`${athleteStats.first_name} ${athleteStats.surname}'s Events`}</Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <Box sx={{ height: 400, width: "75%" }}>
                <DataGrid
                  getRowId={(row) =>
                    `${row.event_name}-${row.year}-${row.season}`
                  }
                  rows={events}
                  columns={columns}
                  disableRowSelectionOnClick
                  slots={{
                    noRowsOverlay: NoRowsOverlay
                  }}
                />
              </Box>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Athlete;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background-color: #fef2e8;
`;

// eslint-disable-next-line react/prop-types
const StyledChip = ({ label }) => (
  <Chip
    style={{ marginInline: 5, marginTop: 20 }}
    variant="outlined"
    label={label}
  />
);

const SkeletonKeyFrames = keyframes`
  0% {
    background-color: whitesmoke;
  }
  100% {
    background-color: lightgrey;
  }
`;

const SkeletonOverlay = styled(Box)`
  background-color: #fef2e8;
  align-items: center;
  justify-content: center;
  display: inline-flex;
  height: 100%;
  width: 100%;
  animation: ${SkeletonKeyFrames} 1.5s linear infinite alternate;
`;
