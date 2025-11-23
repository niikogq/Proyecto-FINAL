import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/dashboard')
      .then(res => setData(res.data.message))
      .catch(err => {
        console.error(err);
        setData('Error conectando al backend');
      });
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>{data || 'Cargando...'}</p>
    </div>
  );
}

export default Dashboard;