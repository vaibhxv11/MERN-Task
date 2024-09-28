

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { fetchCategoryDistribution } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getMonthName } from "../utils/monthUtils";
// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ month }) => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        const data = await fetchCategoryDistribution(month);
        setCategoryData(data);
      } catch (err) {
        console.error("Error fetching category distribution data:", err);
      }
    };

    if (month) {
      loadCategoryData();
    }
  }, [month]);

  const chartData = {
    labels: categoryData.map((cat) => cat.category),
    datasets: [
      {
        label: 'Categories',
        data: categoryData.map((cat) => cat.count),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="mt-8 w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-4">Category Distribution for {getMonthName(month)}</h2>
      <div style={{ width: '100%', height: '400px' }}>
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default PieChart;
