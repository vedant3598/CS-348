import { Skeleton, Typography } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import React, { useState } from 'react';
import { Bar } from "react-chartjs-2";

import codeToFlag from '../helpers/codeToFlag';

const FRIEND_COUNT = 100;
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
        height: 200
      }}
      onClick={() => {
        window.location.href = `/user/${id}`;
      }}
    >
      <CardHeader
        title={
          <Typography>
            {codeToFlag(favCountry)}
          </Typography>
        }
        sx={{ whiteSpace: "pre-wrap" }}
      />
      <CardContent>
        <Typography>
          {firstName} {surname}
        </Typography>
        <Typography variant="body2">{username}</Typography>
        <Typography variant="body2">{email}</Typography>
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

const Home = ({ userInfo }) => {
    const [loaded, setLoaded] = useState(false);
    const [friends, setFriends] = useState([]);
    const [athletes, setAthletes] = useState([]);

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
    
    useEffect(() => {
        if (userInfo && Object.keys(userInfo).length === 0 && Object.getPrototypeOf(userInfo) === Object.prototype) {
            this.props.history.push('/login');
        };
    }, []);

    return (
        <Container>
            <TopBar />
            <div style={{ margin: 10 }}>
                <div style={{ display: 'flex' }}>
                    <Typography variant="h3" style={{ alignSelf: 'center', marginRight: 10 }}>
                        {`Welcome ${userInfo.first_name} ${userInfo.surname}`}
                    </Typography>
                </div>
                <div>
                    <Typography variant="h4">Your friends</Typography>
                </div>
                {loaded ? (
                    <Carousel responsive={responsive}>
                        {friends.slice(0, FRIEND_COUNT).map(Friend)}
                    </Carousel>
                ) : (
                    <Carousel responsive={responsive}>
                        {[0, 1, 2, 3, 4].map(() => (
                        <Skeleton variant="rectangular" width={300} height={200} />
                        ))}
                    </Carousel>
                )}
                <Typography variant="h4">
                    Your favourite athletes
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
                <div>
                    <Bar options={options} data={data} />
                </div>
            </div>
        </Container>
    )
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
