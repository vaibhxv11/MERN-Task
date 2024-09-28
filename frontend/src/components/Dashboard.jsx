



import React, { useState, useEffect } from 'react';
import Statistics from "./Statistics";
import BarChart from "./BarChart";
import PieChart from "./PieChart";


const Dashboard = () => {
  const [transactions, setTransactions] = useState([]); // Data fetched from the API
  const [filteredTransactions, setFilteredTransactions] = useState([]); // Filtered data based on search
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle error state
  const [month, setMonth] = useState('3'); // Default to March
  const [expanded, setExpanded] = useState({}); // To track expanded description for each item
  const [searchQuery, setSearchQuery] = useState(''); // Search input state

  const entriesPerPage = 10;

  // Fetch data from the given URL when the component mounts or month changes
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
  //       const data = await response.json();
        
  //       // Filter transactions by month
  //       const filteredTransactions = data.filter(item => {
  //         const transactionDate = new Date(item.dateOfSale); // Use 'dateOfSale' property
  //         return transactionDate.getMonth() + 1 === parseInt(month); // Month is 0-based in JS
  //       });

  //       setTransactions(filteredTransactions); // Set the filtered data into the state
  //       setFilteredTransactions(filteredTransactions); // Initialize filtered data
  //       setLoading(false);
  //     } catch (error) {
  //       setError('Failed to fetch data.');
  //       setLoading(false);
  //     }
  //   };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset the error state before making the request

      try {
        // Fetch data from the serverless function instead of directly from S3
        const response = await fetch('/api/fetch-data');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }

        const data = await response.json();

        // Filter transactions by month
        const filteredTransactions = data.filter(item => {
          const transactionDate = new Date(item.dateOfSale); // Use 'dateOfSale' property
          return transactionDate.getMonth() + 1 === parseInt(month); // Months are 0-based in JS
        });

        // Set the state with filtered transactions
        setTransactions(filteredTransactions);
        setFilteredTransactions(filteredTransactions); // Initialize filtered data
      } catch (error) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month]); // Dependency array includes month

  // Get the current page's transactions
  const paginatedData = filteredTransactions.slice((page - 1) * entriesPerPage, page * entriesPerPage);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPage(1); // Reset to first page when month changes
  };

  // Function to toggle show more/less for each description
  const toggleExpand = (id) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Filter transactions based on search input
    if (value) {
      const searchedTransactions = transactions.filter(item => {
        return (
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          item.description.toLowerCase().includes(value.toLowerCase()) ||
          item.price.toString().includes(value)
        );
      });
      setFilteredTransactions(searchedTransactions);
    } else {
      // If search box is cleared, reset to original transactions for the selected month
      setFilteredTransactions(transactions);
    }

    setPage(1); // Reset to the first page whenever the search input changes
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-8">
        <h1 className="text-center text-3xl font-bold mb-8">Transaction Dashboard</h1>

        {/* Display loading or error states */}
        {loading && <p className="text-center text-xl">Loading...</p>}
        {error && <p className="text-center text-xl text-red-500">{error}</p>}

        {/* Show table only when data is available */}
        {!loading && (
          <>
            <div className="flex justify-between items-center mb-6">
              <input
                type="text"
                placeholder="Search transaction"
                value={searchQuery}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <select
                value={month}
                onChange={handleMonthChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            {filteredTransactions.length > 0 ? (
              <>
                <table className="w-full border-collapse border border-yellow-500">
                  <thead>
                    <tr className="bg-yellow-400">
                      <th className="border border-yellow-500 px-4 py-2">ID</th>
                      <th className="border border-yellow-500 px-4 py-2">Title</th>
                      <th className="border border-yellow-500 px-4 py-2">Description</th>
                      <th className="border border-yellow-500 px-4 py-2">Price</th>
                      <th className="border border-yellow-500 px-4 py-2">Category</th>
                      <th className="border border-yellow-500 px-4 py-2">Sold</th>
                      <th className="border border-yellow-500 px-4 py-2">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item) => {
                      const isExpanded = expanded[item.id]; // Check if description is expanded for this item
                      const shortDescription = item.description.slice(0, 100); // Show only the first 100 characters
                      
                      return (
                        <tr key={item.id}>
                          <td className="border border-yellow-500 px-4 py-2 text-center">{item.id}</td>
                          <td className="border border-yellow-500 px-4 py-2">{item.title}</td>
                          <td className="border border-yellow-500 px-4 py-2">
                            {isExpanded ? item.description : shortDescription}
                            {item.description.length > 100 && (
                              <button
                                onClick={() => toggleExpand(item.id)}
                                className="text-blue-500 ml-2"
                              >
                                {isExpanded ? 'Show Less' : 'Show More'}
                              </button>
                            )}
                          </td>
                          <td className="border border-yellow-500 px-4 py-2 text-right">${item.price}</td>
                          <td className="border border-yellow-500 px-4 py-2">{item.category}</td>
                          <td className="border border-yellow-500 px-4 py-2 text-center">
                            {item.sold ? "Yes" : "No"}
                          </td>
                          <td className="border border-yellow-500 px-4 py-2">
                            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="flex justify-between items-center mt-6">
                  <div>Page No: {page}</div>
                  <div>
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg mx-2"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg mx-2"
                      onClick={() => setPage(page + 1)}
                      disabled={page * entriesPerPage >= filteredTransactions.length} // Disable if no more entries
                    >
                      Next
                    </button>
                  </div>
                  <div>Per Page: {entriesPerPage}</div>
                </div>
              </>
            ) : (
              <p className="text-center text-xl text-red-500">No transactions found.</p>
            )}
          </>
        )}
      </div>

      <Statistics month={month}/>
      <BarChart month={month}/>
      <PieChart month={month} />
    </div>
  );
};

export default Dashboard;
