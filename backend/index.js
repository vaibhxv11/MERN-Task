const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');
const database=require("./config/database")
const app = express();
const PORT = process.env.PORT || 5000;
const dotenv =require("dotenv");
const axios = require('axios');

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

// Endpoint to fetch data from external API and serve it to the frontend
app.get('/api/transactions/data', async (req, res) => {
  try {
    
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
 
    res.json(response.data);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'Failed to fetch data from external API.' });
  }
});

// Routes
app.use('/api/transactions', transactionRoutes);




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
