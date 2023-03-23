import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Chip } from '@mui/material';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';

const Athlete = () => {
  const columns = [
    { field: 'event_name', headerName: 'Event', width: 500 },
    {
      field: 'year',
      headerName: 'Year',
      width: 200,
    },
    {
      field: 'season',
      headerName: 'Season',
      width: 200,
    },
    {
      field: 'medal_achieved',
      headerName: 'Medal',
      width: 200,
    },
  ];

  const { athleteId } = useParams();
  const [athleteStats, setAthleteStats] = useState({
    age: 0,
    count_bronze: 0,
    count_gold: 0,
    count_silver: 0,
    country: 'NA',
    first_name: 'Athlete',
    height: 0,
    sex: 'M',
    surname: 'Name',
    weight: 0,
    medal_rank: 0,
  });
  const [events, setEvents] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isUserFavourite, setIsUserFavourite] = useState(false);

  const handleFavouriteCountryClick = () => {
    setIsUserFavourite((prevIsUserFavourite) => !prevIsUserFavourite);
  };

  useEffect(() => {
    const asyncFunc = async () => {
      const athleteRes = await axios.get('http://localhost:5000/athlete', {
        params: { athlete_id: athleteId },
        headers: { 'Content-Type': 'application/json' },
      });
      setAthleteStats(athleteRes.data);

      const eventsRes = await axios.get('http://localhost:5000/events-for-athlete', {
        params: { athlete_id: athleteId },
        headers: { 'Content-Type': 'application/json' },
      });
      setEvents(eventsRes.data);
      setLoaded(true);
    };

    asyncFunc();
  }, []);

  return (
    <Container>
      <div>
        <TopBar />
        <div style={{ margin: 10 }}>
          <div style={{ display: 'flex' }}>
            <Avatar
              sx={{
                backgroundColor: '#b6cdbf',
                width: 72,
                height: 72,
                fontSize: 56,
                marginRight: 5,
              }}
            >
              {athleteStats.sex === 'M' ? '👨' : '👩'}
            </Avatar>
            <Typography variant="h3" style={{ alignSelf: 'center', marginRight: 10 }}>{loaded ? `${athleteStats.first_name} ${athleteStats.surname}` : 'Athlete'}</Typography>
            {isUserFavourite ? (
              <StarIcon
                onClick={handleFavouriteCountryClick}
                sx={{
                  cursor: 'pointer', color: '#e2a020', width: 36, height: 36, alignSelf: 'center',
                }}
              />
            ) : (
              <StarOutlineIcon
                onClick={handleFavouriteCountryClick}
                sx={{
                  cursor: 'pointer', color: '#e2a020', width: 36, height: 36, alignSelf: 'center',
                }}
              />
            )}
            <div style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: 25 }}>
              <StyledChip label={`🏆 #${athleteStats.medal_rank}`} />
              <StyledChip label={`😎 ${athleteStats.age} years old`} />
              <StyledChip label={athleteStats.sex === 'M' ? '👨' : '👩'} />
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
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
              <Box sx={{ height: 400, width: '75%' }}>
                <DataGrid
                  getRowId={(row) => `${row.event_name}-${row.year}-${row.season}`}
                  rows={events}
                  columns={columns}
                  disableRowSelectionOnClick
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

const TopBar = styled.div`
  height: 50px;
  background-color: grey;
`;

// eslint-disable-next-line react/prop-types
const StyledChip = ({ label }) => (<Chip style={{ marginInline: 5, marginTop: 20 }} variant="outlined" label={label} />);
