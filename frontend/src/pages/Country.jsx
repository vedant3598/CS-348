import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Avatar, CardHeader, Chip, Skeleton } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import codeToFlag from "../helpers/codeToFlag";
import TopBar from "../helpers/TopBar";

const ATHLETE_COUNT = 100;

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
    items: 5
  }
};

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
  count_bronze: countBronze
}) => (
  <Card
    key={id}
    sx={{
      backgroundColor: "#fdded6",
      margin: 5,
      cursor: "pointer",
      height: 200
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
      <Typography variant="body2">Age: {age}</Typography>
      <Typography variant="body2">Height: {height} cm</Typography>
      <Typography variant="body2">Weight: {weight} kg</Typography>
    </CardContent>
  </Card>
);

const SuperFans = ({ first_name: firstName, surname, id }) => (
  <Card
    key={id}
    sx={{
      backgroundColor: "#fdded6",
      margin: 5,
      cursor: "pointer",
      height: 200
    }}
  >
    <CardContent>
      <Typography variant="h3">
        {firstName} {surname}
      </Typography>
    </CardContent>
  </Card>
);

const Country = () => {
  const [countryName, setCountryName] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [superFans, setSuperFans] = useState([]);
  const [countryStats, setCountryStats] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [countryMedals, setCountryMedals] = useState(false);
  const [isUserFavourite, setIsUserFavourite] = useState(false);
  const { countryCode } = useParams();

  useEffect(() => {
    const asyncFunc = async () => {
      const countryNameRes = await axios.get("http://localhost:5000/country", {
        params: { country: countryCode },
        headers: { "Content-Type": "application/json" }
      });
      setCountryName(countryNameRes.data.name);

      const athletesRes = await axios.get("http://localhost:5000/medal-stats", {
        params: { country: countryCode },
        headers: { "Content-Type": "application/json" }
      });
      const athleteArr = athletesRes.data.sort((a, b) => {
        if (
          a.count_gold * 3 + a.count_silver * 2 + a.count_bronze >
          b.count_gold * 3 + b.count_silver * 2 + b.count_bronze
        ) {
          return -1;
        }
        return 1;
      });
      setAthletes(athleteArr);

      const superFansRes = await axios.get(
        "http://localhost:5000/country-super-fans",
        {
          params: { country: countryCode },
          headers: { "Content-Type": "application/json" }
        }
      );
      setSuperFans(superFansRes.data);

      const countryStatsRes = await axios.get(
        "http://localhost:5000/country-stats",
        {
          params: { country: countryCode },
          headers: { "Content-Type": "application/json" }
        }
      );
      setCountryStats(countryStatsRes.data);

      const countryMedalsRes = await axios.get(
        "http://localhost:5000/country-medals",
        {
          params: { country: countryCode },
          headers: { "Content-Type": "application/json" }
        }
      );
      setCountryMedals(
        countryMedalsRes.data.filter(
          ({ country }) => country === countryCode
        )[0].medal_count
      );

      setLoaded(true);
    };

    asyncFunc();
  }, []);

  const handleFavouriteCountryClick = () => {
    setIsUserFavourite((prevIsUserFavourite) => !prevIsUserFavourite);
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: `${countryName}'s Stats`
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      }
    }
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
        backgroundColor: "#CD7F32"
      },
      {
        label: "Silver Medals",
        data: athletes
          .slice(0, ATHLETE_COUNT)
          .map((athlete) => athlete.count_silver),
        backgroundColor: "#C0C0C0"
      },
      {
        label: "Gold Medals",
        data: athletes
          .slice(0, ATHLETE_COUNT)
          .map((athlete) => athlete.count_gold),
        backgroundColor: "#FFD700"
      }
    ]
  };

  return (
    <>
      <TopBar />
      <Container>
        <TitleContainer>
          <Avatar
            sx={{
              backgroundColor: "#b6cdbf",
              width: 72,
              height: 72,
              fontSize: 56,
              marginRight: 5
            }}
          >
            {codeToFlag(countryCode)}
          </Avatar>
          <Typography variant="h3" sx={{ paddingRight: 5 }}>
            {countryName}
          </Typography>
          <Chip
            label={`😎 ${countryStats.avg_age} years old`}
            sx={{ marginRight: 5 }}
          />
          <Chip
            label={`📏 ${countryStats.avg_height} cm`}
            sx={{ marginRight: 5 }}
          />
          <Chip
            label={`⚖️ ${countryStats.avg_weight} kg`}
            sx={{ marginRight: 5 }}
          />
          <Chip label={`🏅 ${countryMedals} medals`} sx={{ marginRight: 5 }} />
          {isUserFavourite ? (
            <StarIcon
              onClick={handleFavouriteCountryClick}
              sx={{
                cursor: "pointer",
                color: "#e2a020",
                width: 24,
                height: 24
              }}
            />
          ) : (
            <StarOutlineIcon
              onClick={handleFavouriteCountryClick}
              sx={{
                cursor: "pointer",
                color: "#e2a020",
                width: 24,
                height: 24
              }}
            />
          )}
        </TitleContainer>
        <Typography variant="h4">
          {countryName}
          &apos;s Stats
        </Typography>
        <div>
          <Bar options={options} data={data} />
        </div>
        <Typography variant="h4">
          {countryName}
          &apos;s Athletes
        </Typography>
        {loaded ? (
          <Carousel responsive={responsive}>
            {athletes.slice(0, ATHLETE_COUNT).map(Athlete)}
          </Carousel>
        ) : (
          <Carousel responsive={responsive}>
            {[0, 1, 2, 3, 4].map(() => (
              <Skeleton variant="rectangular" width={300} height={200} />
            ))}
          </Carousel>
        )}
        <Typography variant="h4">
          {countryName}
          &apos;s Super Fans
        </Typography>
        {
          // eslint-disable-next-line no-nested-ternary
          loaded ? (
            superFans.length === 0 ? (
              <Typography
                variant="h5"
                align="center"
                sx={{ marginTop: 5, marginBottom: 5 }}
              >
                None
              </Typography>
            ) : (
              <Carousel responsive={responsive}>
                {superFans.map(SuperFans)}
              </Carousel>
            )
          ) : (
            <Carousel responsive={responsive}>
              {[0, 1, 2, 3, 4].map(() => (
                <Skeleton variant="rectangular" width={300} height={200} />
              ))}
            </Carousel>
          )
        }
      </Container>
    </>
  );
};

export default Country;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;

  background-color: #fef2e8;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 50px;
`;
