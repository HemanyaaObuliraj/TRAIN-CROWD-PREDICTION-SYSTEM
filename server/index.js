const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors({
  origin: ['https://train-crowd-prediction-system.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/trains', require('./routes/trains'));

app.get('/', (req, res) => {
  res.json({ message: 'Train Crowd API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));