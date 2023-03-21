import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Avatar, CardHeader } from '@mui/material';

const responsive = {
  carousel: {
    breakpoint: { max: 4000, min: 0 },
    items: 5,
  },
};

const Athlete = ({
  first_name: firstName, surname, age, height, weight, id, sex,
}) => (
  <Card key={id} sx={{ backgroundColor: '#fdded6', margin: 5, cursor: 'pointer' }} onClick={() => { window.location.href = `/athlete/${id}`; }}>
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
  const { countryCode } = useParams();

  useEffect(() => {
    axios.get('http://localhost:5000/country-athletes', { params: { country: countryCode }, headers: { 'Content-Type': 'application/json' } })
      .then((res) => { setAthletes(res.data); });
  }, []);

  return (
    <Container>
      <TopBar />
      <Carousel responsive={responsive}>
        {athletes.map(Athlete)}
      </Carousel>
    </Container>
  );
};

export default Country;

// const AthleteContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
// `;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background-color: #fef2e8;
`;

const TopBar = styled.div`
  height: 50px;
  background-color: grey;
`;
