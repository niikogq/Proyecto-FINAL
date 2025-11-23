import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Ia() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/ia')
      .then(res => setData(res.data.message))
      .catch(err => {
        console.error(err);
        setData('Error conectando al backend');
      });
  }, []);

  return (
    <div>
      <h2>IA</h2>
      <p>{data || 'Cargando...'}</p>
    </div>
  );
}

export default Ia;