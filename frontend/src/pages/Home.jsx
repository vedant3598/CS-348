import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { BarChart, TableChart, ViewCarousel } from "@mui/icons-material";
import styled, { keyframes } from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import Carousel from "react-multi-carousel";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import codeToFlag from "../helpers/codeToFlag";

const FRIEND_COUNT = 100;
const ATHLETE_COUNT = 100;
const COUNTRY_COUNT = 100;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const responsive = {
  carousel: {
    breakpoint: { max: 4000, min: 0 },
    items: 5,
  },
};

const NoRowsOverlay = () => (
  <SkeletonOverlay>
    <Typography sx={{ justifyContent: "center" }}>Loading data...</Typography>
  </SkeletonOverlay>
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

const Friend = ({
  first_name: firstName,
  surname,
  fav_country: favCountry,
  email,
  username,
  id,
}) => (
  <Card
    key={id}
    sx={{
      backgroundColor: "#fdded6",
      margin: 5,
      cursor: "pointer",
      height: 150,
    }}
  >
    <CardHeader
      title={
        <Typography>
          {firstName} {surname} {codeToFlag(favCountry)}
        </Typography>
      }
      sx={{ whiteSpace: "pre-wrap" }}
    />
    <CardContent>
      <Typography variant="body2">{username}</Typography>
      <Typography variant="body2">{email}</Typography>
    </CardContent>
  </Card>
);

const Country = ({
  country_code: countryCode,
  count_gold: countGold,
  count_silver: countSilver,
  count_bronze: countBronze,
  name,
}) => (
  <Card
    key={countryCode}
    sx={{
      backgroundColor: "#fdded6",
      margin: 5,
      cursor: "pointer",
      height: 150,
    }}
    onClick={() => {
      window.location.href = `/country/${countryCode}`;
    }}
  >
    <CardHeader
      avatar={
        <Avatar sx={{ backgroundColor: "#f1bdad" }}>
          {codeToFlag(countryCode)}
        </Avatar>
      }
      title={
        <div style={{ float: "right", justifyContent: "space-between" }}>
          <div>🥇 {countGold}</div>
          <div>🥈 {countSilver}</div>
          <div>🥉 {countBronze}</div>
        </div>
      }
      sx={{ whiteSpace: "pre-wrap" }}
    />
    <CardContent>
      <Typography>{name}</Typography>
    </CardContent>
  </Card>
);

const Athlete = ({
  first_name: firstName,
  surname,
  age,
  height,
  weight,
  id,
  sex,
  count_gold: countGold,
  count_silver: countSilver,
  count_bronze: countBronze,
  medal_rank,
}) => (
  <Card
    key={id}
    sx={{
      backgroundColor: "#fdded6",
      margin: 5,
      cursor: "pointer",
      height: !medal_rank ? 200 : 225,
    }}
    onClick={() => {
      window.location.href = `/athlete/${id}`;
    }}
  >
    <CardHeader
      avatar={
        <Avatar sx={{ backgroundColor: "#f1bdad" }}>
          {sex === "M" ? "👨" : "👩"}
        </Avatar>
      }
      title={
        <div>
          🥇 {countGold}
          {"       "}
          🥈 {countSilver}
          {"       "}
          🥉 {countBronze}
        </div>
      }
      sx={{ whiteSpace: "pre-wrap" }}
    />
    <CardContent>
      <Typography>
        {firstName} {surname}
      </Typography>
      {medal_rank ? (
        <Typography variant="body2">Rank: {medal_rank}</Typography>
      ) : (
        <div />
      )}
      <Typography variant="body2">Age: {age ?? "N/A"}</Typography>
      <Typography variant="body2">Height: {height ?? "N/A"} cm</Typography>
      <Typography variant="body2">Weight: {weight ?? "N/A"} kg</Typography>
    </CardContent>
  </Card>
);

const DisplayAthletes = ({
  displayStyle,
  loaded,
  athletes,
  ranking = false,
}) => {
  if (displayStyle === "carousel") {
    return loaded ? (
      <Carousel responsive={responsive}>
        {athletes.slice(0, ATHLETE_COUNT).map(Athlete)}
      </Carousel>
    ) : (
      <Carousel responsive={responsive}>
        {[0, 1, 2, 3, 4].map((idx) => (
          <Skeleton key={idx} variant="rectangular" width={300} height={200} />
        ))}
      </Carousel>
    );
  }

  if (displayStyle === "chart") {
    const options = {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    };

    const labels = athletes
      .slice(0, ATHLETE_COUNT)
      .map((athlete) => `${athlete.first_name} ${athlete.surname}`);

    const data = {
      labels,
      datasets: [
        {
          label: "Bronze Medals",
          data: athletes
            .slice(0, ATHLETE_COUNT)
            .map((athlete) => athlete.count_bronze),
          backgroundColor: "#CD7F32",
        },
        {
          label: "Silver Medals",
          data: athletes
            .slice(0, ATHLETE_COUNT)
            .map((athlete) => athlete.count_silver),
          backgroundColor: "#C0C0C0",
        },
        {
          label: "Gold Medals",
          data: athletes
            .slice(0, ATHLETE_COUNT)
            .map((athlete) => athlete.count_gold),
          backgroundColor: "#FFD700",
        },
      ],
    };

    return (
      <div>
        <Bar options={options} data={data} />
      </div>
    );
  }

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 350,
      valueGetter: (params) => `${params.row.first_name} ${params.row.surname}`,
    },
    { field: "sex", headerName: "Sex", width: 140, sortable: false },
    {
      field: "age",
      headerName: "Age",
      width: 140,
      valueGetter: (params) => params.row.age ?? "N/A",
    },
    {
      field: "height",
      headerName: "Height",
      width: 140,
      valueGetter: (params) => params.row.height ?? "N/A",
    },
    {
      field: "weight",
      headerName: "Weight",
      width: 140,
      valueGetter: (params) => params.row.weight ?? "N/A",
    },
    { field: "count_gold", headerName: "Gold", width: 140 },
    { field: "count_silver", headerName: "Silver", width: 140 },
    { field: "count_bronze", headerName: "Bronze", width: 140 },
    {
      field: "count_total",
      headerName: "Total",
      width: 140,
      valueGetter: (params) =>
        params.row.count_gold +
        params.row.count_silver +
        params.row.count_bronze,
    },
  ];

  return (
    <div style={{ height: 400, marginTop: 20 }}>
      <DataGrid
        getRowId={(row) => `${row.id}`}
        rows={athletes}
        columns={
          ranking
            ? [
                ...columns,
                { field: "medal_rank", headerName: "Rank", width: 140 },
              ]
            : columns
        }
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: NoRowsOverlay,
        }}
      />
    </div>
  );
};

const DisplayCountries = ({ displayStyle, loaded, countries }) => {
  if (displayStyle === "carousel") {
    return loaded ? (
      <Carousel responsive={responsive}>
        {countries.slice(0, COUNTRY_COUNT).map(Country)}
      </Carousel>
    ) : (
      <Carousel responsive={responsive}>
        {[0, 1, 2, 3, 4].map((idx) => (
          <Skeleton key={idx} variant="rectangular" width={300} height={200} />
        ))}
      </Carousel>
    );
  }

  if (displayStyle === "chart") {
    const options = {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    };

    const labels = countries
      .slice(0, COUNTRY_COUNT)
      .map((country) => `${country.name}`);

    const data = {
      labels,
      datasets: [
        {
          label: "Bronze Medals",
          data: countries
            .slice(0, COUNTRY_COUNT)
            .map((country) => country.count_bronze),
          backgroundColor: "#CD7F32",
        },
        {
          label: "Silver Medals",
          data: countries
            .slice(0, COUNTRY_COUNT)
            .map((country) => country.count_silver),
          backgroundColor: "#C0C0C0",
        },
        {
          label: "Gold Medals",
          data: countries
            .slice(0, COUNTRY_COUNT)
            .map((country) => country.count_gold),
          backgroundColor: "#FFD700",
        },
      ],
    };

    return (
      <div>
        <Bar options={options} data={data} />
      </div>
    );
  }

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 500,
    },
    { field: "count_gold", headerName: "Gold", width: 250 },
    { field: "count_silver", headerName: "Silver", width: 250 },
    { field: "count_bronze", headerName: "Bronze", width: 250 },
    {
      field: "count_total",
      headerName: "Total",
      width: 150,
      valueGetter: (params) =>
        parseInt(params.row.count_gold, 10) +
        parseInt(params.row.count_silver, 10) +
        parseInt(params.row.count_bronze, 10),
    },
  ];

  return (
    <div style={{ height: 400, marginTop: 20 }}>
      <DataGrid
        getRowId={(row) => `${row.country_code}`}
        rows={countries}
        columns={columns}
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: NoRowsOverlay,
        }}
      />
    </div>
  );
};

const Home = () => {
  const [userInfo, setUserInfo] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [allCountries, setAllCountries] = useState([]);
  const [allAthletes, setAllAthletes] = useState([]);
  const [friends, setFriends] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [countryName, setCountryName] = useState("");
  const [countryStats, setCountryStats] = useState({});
  const [countryMedals, setCountryMedals] = useState(false);
  const [athletesDisplayFormat, setAthletesDisplayFormat] =
    useState("carousel");
  const [countriesDisplayFormat, setCountriesDisplayFormat] =
    useState("carousel");
  const [allAthletesDisplayFormat, setAllAthletesDisplayFormat] =
    useState("carousel");

  useEffect(() => {
    const info = JSON.parse(
      localStorage.getItem("CS348-olympics-scoreboard-login")
    );
    const asyncFunc = async () => {
      const friendsRes = await axios.get("http://localhost:5000/friends", {
        params: { user_id: info.id },
        headers: { "Content-Type": "application/json" },
      });
      setFriends(friendsRes.data);

      const favouriteRes = await axios.get(
        "http://localhost:5000/favourite-athletes",
        {
          params: { user_id: info.id },
          headers: { "Content-Type": "application/json" },
        }
      );
      setAthletes(favouriteRes.data);

      const countryNameRes = await axios.get("http://localhost:5000/country", {
        params: { country: info.fav_country },
        headers: { "Content-Type": "application/json" },
      });
      setCountryName(countryNameRes.data.name);

      const countryStatsRes = await axios.get(
        "http://localhost:5000/country-stats",
        {
          params: { country: info.fav_country },
          headers: { "Content-Type": "application/json" },
        }
      );
      setCountryStats(countryStatsRes.data);

      const countryMedalsRes = await axios.get(
        "http://localhost:5000/country-medals",
        {
          params: { country: info.fav_country },
          headers: { "Content-Type": "application/json" },
        }
      );
      setCountryMedals(
        countryMedalsRes.data.filter(
          ({ country }) => country === info.fav_country
        )[0].medal_count
      );

      const allCountriesRes = await axios.get(
        "http://localhost:5000/all-country-medals",
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setAllCountries(allCountriesRes.data);

      const allAthletesRes = await axios.get(
        "http://localhost:5000/all-athlete-ranking",
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setAllAthletes(allAthletesRes.data);
      setLoaded(true);
    };

    if (!info) {
      window.location.href = "/login";
    } else {
      setUserInfo(info);
      asyncFunc();
    }
  }, []);

  return (
    <Container>
      <TopBar />
      <div style={{ margin: 10 }}>
        <div style={{ display: "flex", marginBottom: "25px" }}>
          <Typography variant="h3" style={{ alignSelf: "center" }}>
            {`Welcome, ${userInfo?.first_name} ${userInfo?.surname}!`}
          </Typography>
        </div>
        <div>
          <Typography variant="h4">Your favourite country</Typography>
        </div>
        {loaded ? (
          <Card
            sx={{
              backgroundColor: "#fdded6",
              margin: 5,
              cursor: "pointer",
              height: 200,
              width: 300,
            }}
            onClick={() => {
              window.location.href = `/country/${userInfo.fav_country}`;
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ backgroundColor: "#f1bdad" }}>
                  {codeToFlag(userInfo.fav_country)}
                </Avatar>
              }
              title={<Typography variant="h6">{countryName}</Typography>}
              sx={{ whiteSpace: "pre-wrap" }}
            />
            <CardContent>
              <Typography variant="body2">
                Number of Medals 🏅: {countryMedals}
              </Typography>
              <Typography variant="body2">
                Average Age 😎: {countryStats.avg_age}
              </Typography>
              <Typography variant="body2">
                Average Height 📏: {countryStats.avg_height} cm
              </Typography>
              <Typography variant="body2">
                Average Weight ⚖️: {countryStats.avg_weight} kg
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Skeleton variant="rectangular" width={300} height={200} />
        )}
        <div>
          <Typography variant="h4">Your friends</Typography>
        </div>
        {loaded ? (
          <Carousel responsive={responsive}>
            {friends.slice(0, FRIEND_COUNT).map(Friend)}
          </Carousel>
        ) : (
          <Carousel responsive={responsive}>
            {[0, 1, 2, 3, 4].map((idx) => (
              <Skeleton
                key={idx}
                variant="rectangular"
                width={300}
                height={200}
              />
            ))}
          </Carousel>
        )}
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Typography variant="h4" marginRight="20px">
            Your favourite athletes
          </Typography>
          <ToggleButtonGroup
            value={athletesDisplayFormat}
            onChange={(e, val) => setAthletesDisplayFormat(val)}
            exclusive
          >
            <ToggleButton value="carousel">
              <ViewCarousel />
            </ToggleButton>
            <ToggleButton value="chart">
              <BarChart />
            </ToggleButton>
            <ToggleButton value="table">
              <TableChart />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <DisplayAthletes
          displayStyle={athletesDisplayFormat}
          loaded={loaded}
          athletes={athletes}
        />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Typography variant="h4" marginRight="20px">
            All countries
          </Typography>
          <ToggleButtonGroup
            value={countriesDisplayFormat}
            onChange={(e, val) => setCountriesDisplayFormat(val)}
            exclusive
          >
            <ToggleButton value="carousel">
              <ViewCarousel />
            </ToggleButton>
            <ToggleButton value="chart">
              <BarChart />
            </ToggleButton>
            <ToggleButton value="table">
              <TableChart />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <DisplayCountries
          displayStyle={countriesDisplayFormat}
          loaded={loaded}
          countries={allCountries}
        />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Typography variant="h4" marginRight="20px">
            All athletes
          </Typography>
          <ToggleButtonGroup
            value={allAthletesDisplayFormat}
            onChange={(e, val) => setAllAthletesDisplayFormat(val)}
            exclusive
          >
            <ToggleButton value="carousel">
              <ViewCarousel />
            </ToggleButton>
            <ToggleButton value="chart">
              <BarChart />
            </ToggleButton>
            <ToggleButton value="table">
              <TableChart />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <DisplayAthletes
          displayStyle={allAthletesDisplayFormat}
          loaded={loaded}
          athletes={allAthletes}
          ranking
        />
      </div>
    </Container>
  );
};

export default Home;

const TopBar = styled.div`
  height: 50px;
  background-color: grey;
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background-color: #fef2e8;
`;
