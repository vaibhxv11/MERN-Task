import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchPriceRange } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getMonthName } from "../utils/monthUtils";
// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ month }) => {
  const [priceRangeData, setPriceRangeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPriceRange = async () => {
      try {
        setLoading(true);
        const data = await fetchPriceRange(month);
        setPriceRangeData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (month) {
      loadPriceRange();
    }
  }, [month]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Ensure there is data to plot
  if (!priceRangeData.length) {
    return <div>No data available for the selected month.</div>;
  }

  const chartData = {
    labels: priceRangeData.map((range) => range.range),
    datasets: [
      {
        label: 'Number of Items',
        data: priceRangeData.map((range) => range.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Price Range',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Items',
        },
      },
    },
  };

  return (
    <div className="chart-container mt-8 w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-4">Price Range Distribution for {getMonthName(month)}</h2>
      <div style={{ width: '100%', height: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
