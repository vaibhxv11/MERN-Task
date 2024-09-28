const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');
const database=require("./config/database")
const app = express();
const PORT = process.env.PORT || 5000;
const dotenv =require("dotenv");

dotenv.config();
// Middleware
app.use(cors());
app.use(express.json());

database.connect();


// Routes
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
