import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001')
      .then(res => setMessage(res.data.message))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Frontend: Привет, мир!</h1>
      <p>Backend говорит: {message}</p>
    </div>
  );
}

export default App;