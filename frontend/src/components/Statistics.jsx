import React, { useState, useEffect } from 'react';
import { fetchStatistics } from "../services/api";  
import { getMonthName } from "../utils/monthUtils";  

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (month) {
      setLoading(true);
      fetchStatisticsForMonth(month);
    }
  }, [month]);

  const fetchStatisticsForMonth = async (month) => {
    try {
      const data = await fetchStatistics(month);  
      setStatistics(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load statistics.');
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-4">Statistics for {getMonthName(month)}</h2> {/* Display month name */}

    
      {error && <p className="text-red-500">{error}</p>}

      {statistics && (
        <>
          <p>Total Sale: ${statistics.totalSale}</p>
          <p>Sold Items: {statistics.soldItems}</p>
          <p>Unsold Items: {statistics.unsoldItems}</p>
        </>
      )}
    </div>
  );
};

export default Statistics;
