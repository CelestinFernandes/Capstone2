const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const scriptRoutes = require('./routes/movieRoutes');
require('dotenv').config();

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/scripts', scriptRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log("MongoDB URI:", process.env.MONGO_URI); // This should print your MongoDB URI
