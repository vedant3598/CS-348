import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Country = () => {
  const { countryCode } = useParams();

  axios.get('http://localhost:5000/country-athletes', { params: { country: countryCode }, headers: { 'Content-Type': 'application/json' } })
    .then((res) => { console.log(res); });

  return (
    <div>
      Country Page
    </div>
  );
};

export default Country;
