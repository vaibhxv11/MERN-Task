const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');
const database=require("./config/database")
const app = express();
const PORT = process.env.PORT || 5000;
const dotenv =require("dotenv");

dotenv.config();


app.use(express.json());
// app.use(
//   //frontend link
// cors({
// origin:"https://transaction-dashboard-omega.vercel.app" ,
// credentials :true
// }) 


// )

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://transaction-dashboard-omega.vercel.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

database.connect();


// Routes
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
