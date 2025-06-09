import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [health, setHealth] = useState('checking...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const healthResponse = await axios.get(`${process.env.REACT_APP_API_URL}/health`);
        setHealth(healthResponse.data.status || 'OK');
        
        const messageResponse = await axios.get(process.env.REACT_APP_API_URL);
        setMessage(messageResponse.data.message);
      } catch (err) {
        console.error('API Error:', err);
        setHealth('FAILED');
        setMessage('Error connecting to backend');
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dockerized React + Fastify</h1>
      <div>
        <strong>Backend Status:</strong> {health}
      </div>
      <div>
        <strong>API Response:</strong> {message || 'Loading...'}
      </div>
    </div>
  );
}

export default App;