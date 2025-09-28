const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('PrivateResult Backend is Working');
});

// Job post route
app.post('/jobs', (req, res) => {
  const jobData = req.body;
  console.log('Received Job:', jobData);
  res.send({ message: 'Job posted successfully!', data: jobData });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
