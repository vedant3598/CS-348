import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Avatar, CardHeader } from '@mui/material';
import codeToFlag from '../helpers/codeToFlag';

const responsive = {
  carousel: {
    breakpoint: { max: 4000, min: 0 },
    items: 5,
  },
};

const AthleteSkeleton = ({ id }) => (
  <SkeletonCard
    key={id}
    sx={{ height: 200, margin: 5 }}
  >
    <CardContent />
  </SkeletonCard>
);

const Athlete = ({
  first_name: firstName, surname, age, height, weight, id, sex,
}) => (
  <Card
    key={id}
    sx={{
      backgroundColor: '#fdded6', margin: 5, cursor: 'pointer', height: 200,
    }}
    onClick={() => { window.location.href = `/athlete/${id}`; }}
  >
    <CardHeader
      avatar={(
        <Avatar sx={{ backgroundColor: '#f1bdad' }}>
          {sex === 'M' ? '👨' : '👩'}
        </Avatar>
      )}
    />
    <CardContent>
      <Typography>
        {firstName}
        {' '}
        {surname}
      </Typography>
      <Typography variant="body2">
        Age:
        {' '}
        {age}
      </Typography>
      <Typography variant="body2">
        Height:
        {' '}
        {height}
        {' '}
        cm
      </Typography>
      <Typography variant="body2">
        Weight:
        {' '}
        {weight}
      </Typography>
    </CardContent>
  </Card>
);

const Country = () => {
  const [athletes, setAthletes] = useState([]);
  const [countryName, setCountryName] = useState('');
  const { countryCode } = useParams();

  useEffect(() => {
    const asyncFunc = async () => {
      const countryNameRes = await axios.get('http://localhost:5000/country', { params: { country: countryCode }, headers: { 'Content-Type': 'application/json' } });
      setCountryName(countryNameRes.data.name);

      const athletesRes = await axios.get('http://localhost:5000/country-athletes', { params: { country: countryCode }, headers: { 'Content-Type': 'application/json' } });
      setAthletes(athletesRes.data);
    };

    asyncFunc();
  }, []);

  return (
    <Container>
      <TopBar />
      <Avatar sx={{
        backgroundColor: '#b6cdbf',
        width: 72,
        height: 72,
        fontSize: 56,
        margin: 5,
      }}
      >
        {codeToFlag(countryCode)}
      </Avatar>
      <Typography variant="h3">{countryName}</Typography>
      {
        athletes.length !== 0
          ? (
            <Carousel responsive={responsive}>
              {athletes.map(Athlete)}
            </Carousel>
          )
          : (
            <Carousel responsive={responsive}>
              {[0, 1, 2, 3, 4].map(AthleteSkeleton)}
            </Carousel>
          )
      }
    </Container>
  );
};

export default Country;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background-color: #fef2e8;
`;

const SkeletonKeyFrames = keyframes`
  0% {
    background-color: whitesmoke;
  }
  100% {
    background-color: lightgrey;
  }
`;

const SkeletonCard = styled(Card)`
  animation: ${SkeletonKeyFrames} 1.5s linear infinite alternate;
`;

const TopBar = styled.div`
  height: 50px;
  background-color: grey;
`;
