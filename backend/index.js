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
app.use(
  //frontend link
cors({
origin:"https://transaction-dashboard-omega.vercel.app" ,
credentials :true
}) 


)

database.connect();


// Routes
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
