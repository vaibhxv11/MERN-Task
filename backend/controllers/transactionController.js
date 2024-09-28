const Transaction = require('../models/Transaction');
const axios = require('axios');

// Seed the database with data from the external API
const seedData = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;
     await Transaction.insertMany(data);
    res.status(200).send('Database initialized with seed data');
  } catch (error) {
    console.error("Error initializing data:", error);
    res.status(500).send('Error initializing data');
  }
};

// Get transactions with search and pagination
const getTransactions = async (req, res) => {
  const { search = '', page = 1, perPage = 10 } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { productTitle: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { price: { $regex: new RegExp(search, 'i') } }, // regex on price (cast as string)
    ];
  }

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    const total = await Transaction.countDocuments(query);
    res.status(200).json({ transactions, total });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};

// Get statistics for a selected month

const getStatistics = async (req, res) => {
  const month = parseInt(req.params.month);

  // Validate month input
  if (!month || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  try {
    // Fetch data from the JSON file on S3
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    console.log("Fetched Transactions Count:", transactions.length); // Log the number of transactions

    // Filter transactions based on the month
    const filteredTransactions = transactions.filter(transaction => {
      const dateOfSale = new Date(transaction.dateOfSale);
      // Check if the transaction's month matches the provided month
      return dateOfSale.getUTCMonth() + 1 === month;
    });

    console.log("Filtered Transactions Count:", filteredTransactions.length); // Log the count of filtered transactions

    // Count sold and unsold items
    const soldItems = filteredTransactions.filter(transaction => transaction.sold).length;
    const unsoldItems = filteredTransactions.filter(transaction => !transaction.sold).length;

    // Calculate total sales
    const totalSale = filteredTransactions.reduce((sum, transaction) => {
      console.log("Transaction Price:", transaction.price); // Log each price
      return sum + (transaction.sold ? transaction.price : 0); // Only sum the price if sold
    }, 0);

    console.log("Total Sale Result:", totalSale);
    console.log("Sold Items Count:", soldItems);
    console.log("Unsold Items Count:", unsoldItems);

    res.status(200).json({
      totalSale,
      soldItems,
      unsoldItems,
    });
  } catch (error) {
    console.error("Error calculating statistics:", error);
    res.status(500).json({ error: 'Error calculating statistics' });
  }
};


// Get price ranges for a selected month

const getPriceRange = async (req, res) => {
  const month = parseInt(req.params.month);
  
  // Validate month input
  if (!month || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  try {
    // Fetch data from S3 bucket
    const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

    // Check if data is being fetched correctly
    console.log("Fetched data sample:", data.slice(0, 5)); // Log first 5 records for debugging

    // Filter transactions by month (ignoring year and time)
    const filteredTransactions = data.filter((transaction) => {
      const saleDate = new Date(transaction.dateOfSale);
      // Check if the month matches the provided month (subtract 1 from month as JS months are 0-indexed)
      return saleDate.getUTCMonth() + 1 === month;
    });

    // Log filtered transactions
    console.log(`Filtered transactions for month ${month}:`, filteredTransactions);

    if (filteredTransactions.length === 0) {
      return res.status(200).json({ message: 'No transactions found for this month' });
    }

    // Define price range boundaries
    const priceBoundaries = [0, 101, 201, 301, 401, 501, 601, 701, 801, 901];
    const priceRanges = priceBoundaries.slice(0, -1).map((lowerBound, index) => {
      const upperBound = priceBoundaries[index + 1];
      const count = filteredTransactions.filter((transaction) => transaction.price >= lowerBound && transaction.price < upperBound).length;
      
      return {
        range: `${lowerBound} - ${upperBound - 1}`,
        count: count
      };
    });

    // Add '901-above' as the last bucket
    const highPriceCount = filteredTransactions.filter(transaction => transaction.price >= 901).length;
    priceRanges.push({ range: '901-above', count: highPriceCount });

    // Sort the price ranges in descending order by range
    const sortedPriceRanges = priceRanges.sort((a, b) => {
      const aRangeStart = parseInt(a.range.split(' ')[0]);
      const bRangeStart = parseInt(b.range.split(' ')[0]);
      return bRangeStart - aRangeStart;
    });

    // Send the response
    res.status(200).json(sortedPriceRanges);
    
  } catch (error) {
    console.error("Error fetching price range data:", error);
    res.status(500).json({ error: 'Error fetching price range data' });
  }
};

// Get category distribution for a selected month

const getCategoryDistribution = async (req, res) => {
  const month = parseInt(req.params.month);

  // Validate month input
  if (!month || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  try {
    // Fetch data from the JSON file on S3
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    console.log("Fetched Transactions Count:", transactions.length); // Log the number of transactions

    // Filter transactions based on the month
    const filteredTransactions = transactions.filter(transaction => {
      const dateOfSale = new Date(transaction.dateOfSale);
      // Check if the transaction's month matches the provided month
      return dateOfSale.getUTCMonth() + 1 === month;
    });

    console.log("Filtered Transactions Count:", filteredTransactions.length); // Log the count of filtered transactions

    // Group transactions by category and count the number of occurrences
    const categoryDistribution = filteredTransactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category]++;
      return acc;
    }, {});

    // Transform the result into an array of { category, count }
    const result = Object.keys(categoryDistribution).map(category => ({
      category,
      count: categoryDistribution[category]
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching category distribution data:", error);
    res.status(500).json({ error: 'Error fetching category distribution data' });
  }
};


// Get combined data from all APIs for a selected month

const getCombinedData = async (req, res) => {
  const month = parseInt(req.params.month);

  // Validate month input
  if (!month || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  try {
    // Fetch data from the JSON file on S3
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Filter transactions based on the month
    const filteredTransactions = transactions.filter(transaction => {
      const dateOfSale = new Date(transaction.dateOfSale);
      return dateOfSale.getUTCMonth() + 1 === month;
    });

    // 1. Calculate Statistics
    const soldItems = filteredTransactions.filter(transaction => transaction.sold).length;
    const unsoldItems = filteredTransactions.filter(transaction => !transaction.sold).length;
    const totalSale = filteredTransactions.reduce((sum, transaction) => sum + (transaction.sold ? transaction.price : 0), 0);

    const statistics = {
      totalSale,
      soldItems,
      unsoldItems,
    };

    // 2. Calculate Price Range Distribution
    const priceRanges = {
      '0 - 100': 0,
      '101 - 200': 0,
      '201 - 300': 0,
      '301 - 400': 0,
      '401 - 500': 0,
      '501 - 600': 0,
      '601 - 700': 0,
      '701 - 800': 0,
      '801 - 900': 0,
      '901-above': 0,
    };

    filteredTransactions.forEach(transaction => {
      const price = transaction.price;
      if (price <= 100) priceRanges['0 - 100']++;
      else if (price <= 200) priceRanges['101 - 200']++;
      else if (price <= 300) priceRanges['201 - 300']++;
      else if (price <= 400) priceRanges['301 - 400']++;
      else if (price <= 500) priceRanges['401 - 500']++;
      else if (price <= 600) priceRanges['501 - 600']++;
      else if (price <= 700) priceRanges['601 - 700']++;
      else if (price <= 800) priceRanges['701 - 800']++;
      else if (price <= 900) priceRanges['801 - 900']++;
      else priceRanges['901-above']++;
    });

    // Convert priceRanges object into an array
    const priceRange = Object.keys(priceRanges).map(range => ({
      range,
      count: priceRanges[range]
    }));

    // 3. Calculate Category Distribution
    const categoryDistribution = filteredTransactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category]++;
      return acc;
    }, {});

    // Convert categoryDistribution object into an array
    const categoryDistributionResult = Object.keys(categoryDistribution).map(category => ({
      category,
      count: categoryDistribution[category]
    }));

    // Combine all results and return as a single response
    res.status(200).json({
      statistics,
      priceRange,
      categoryDistribution: categoryDistributionResult,
    });

  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).json({ error: 'Error fetching combined data' });
  }
};



module.exports = {
  seedData,
  getTransactions,
  getStatistics,
  getPriceRange,
  getCategoryDistribution,
  getCombinedData,
};
