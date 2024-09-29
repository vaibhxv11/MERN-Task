
# Transaction Dashboard

This is a Transaction Dashboard application built using React.js , Tailwind CSS , Express.js , Node.js and MongoDB . The application fetches and displays product transactions, provides search and filter functionality by month, and features pagination to navigate between multiple pages of transactions

# Deployed Link 
Live LInk : https://transaction-dashboard-omega.vercel.app/


## Features

- View Transactions: Displays product transactions in a paginated table.
- Search Transactions: Search transactions by title.
- Filter by Month: Filter transactions by a selected month.
- Pagination: View transactions in batches, with previous/next navigation.



## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

To run this project,

1.Clone the repository:
```bash
git clone https://github.com/vaibhxv11/MERN-Transaction-Dashboard.git

cd MERN-transaction-dashboard

```
2.Set up the backend:

Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```
3.Configure environment variables:

In the backend directory, create a .env file and add the following:
```bash
MONGO_URI=mongodb://<your-mongo-uri>
PORT=5000

```

4.Run the backend server:

```bash
npm run server

```
The backend will start on http://localhost:5000.

5.Set up the frontend:

Navigate to the frontend folder and install dependencies:

```bash
cd ../frontend
npm install

```

6.Run the frontend:

```bash
npm run dev

```
Open http://localhost:3000 with your browser to see the result.


## Technolgies Used

- React.js: A JavaScript library for building user interfaces.
- Tailwind CSS: A utility-first CSS framework for building modern UIs.
- Node.js: JavaScript runtime for the backend server.
- Express.js: Web framework for building APIs.
- MongoDB: NoSQL database for storing transaction data.
