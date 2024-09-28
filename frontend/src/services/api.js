import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';  // Your backend API URL

// Fetch transactions based on month, search, pagination
export const fetchTransactions = async (month, page = 1, search = '') => {
  const response = await axios.get(`${API_URL}`, {
    params: { month, page, search },
  });
  return response.data;
};

// Fetch statistics based on month
export const fetchStatistics = async (month) => {
  const response = await axios.get(`${API_URL}/statistics/${month}`);
  return response.data;
};

// Fetch price range data for bar chart
export const fetchPriceRange = async (month) => {
  const response = await axios.get(`${API_URL}/price-range/${month}`);
  return response.data;
};

// Fetch category distribution for pie chart
export const fetchCategoryDistribution = async (month) => {
  const response = await axios.get(`${API_URL}/category-distribution/${month}`);
  return response.data;
};

// Fetch combined data
export const fetchCombinedData = async (month) => {
  const response = await axios.get(`${API_URL}/combined-data/${month}`);
  return response.data;
};
