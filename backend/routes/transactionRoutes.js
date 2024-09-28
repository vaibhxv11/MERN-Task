const express = require('express');
const {
  seedData,
  getTransactions,
  getStatistics,
  getPriceRange,
  getCategoryDistribution,
  getCombinedData,
} = require('../controllers/transactionController');

const router = express.Router();

// Route to seed the database
router.get('/seed-data', seedData);

// Route to get transactions with search and pagination
router.get('/', getTransactions);

// Route to get statistics for a selected month
router.get('/statistics/:month', getStatistics);

// Route to get price ranges for a selected month
router.get('/price-range/:month', getPriceRange);

// Route to get category distribution for a selected month
router.get('/category-distribution/:month', getCategoryDistribution);

// Route to get combined data for a selected month
router.get('/combined-data/:month', getCombinedData);

module.exports = router;
