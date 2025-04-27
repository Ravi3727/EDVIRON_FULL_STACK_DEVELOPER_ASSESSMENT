# School Payment System Frontend 

This is the frontend application for the School Payment and Dashboard System. It provides a user interface for managing transactions, payments, and user authentication. 

## Tech Stack 

- React.js (with Vite) 
- Tailwind CSS 
- React Router for navigation 
- Axios for API calls 
- React Icons for icons 
- Context API for state management 

## Project Structure 

``` 
frontend/ 
├── public/             # Static assets 
├── src/                # Source code 
│   ├── components/     # Reusable components 
│   ├── contexts/       # React context providers 
│   ├── pages/          # Page components 
│   ├── App.jsx         # Main application component 
│   ├── index.css       # Global styles 
│   └── main.jsx        # Entry point 
├── .env                # Environment variables 
├── index.html          # HTML template 
├── package.json        # Project dependencies 
├── README.md           # Documentation 
├── tailwind.config.js  # Tailwind CSS configuration 
└── vite.config.js      # Vite configuration 
``` 

## Features 

1. **Authentication** 
   - User login and registration 
   - JWT-based authentication 
   - Protected routes 

2. **Dashboard** 
   - Transactions overview with filtering, sorting, and pagination 
   - Transaction details by school 
   - Transaction status check 
   - Dark mode support 

## Setup and Installation 

1. Clone the repository 
2. Navigate to the frontend directory 
3. Install dependencies: 
   ``` 
   npm install 
   ``` 
4. Create a `.env` file in the root directory with the following variables: 
   ``` 
   VITE_API_URL=http://localhost:5000/api 
   ``` 
5. Start the development server: 
   ``` 
   npm run dev 
   ``` 

## Pages 

### Dashboard 
- Displays a paginated and searchable list of all transactions 
- Supports filtering by status, school ID, and date range 
- Allows sorting by any column 
- Provides export functionality 

### Transactions by School 
- Allows searching for transactions by school ID 
- Displays transactions for the selected school 
- Supports pagination and sorting 

### Transaction Status Check 
- Allows checking the status of a transaction by custom order ID 
- Displays detailed transaction information 
 
### Authentication Pages 
- Login page 
- Registration page 

## Development 

To run the application in development mode: 

``` 
npm run dev 
``` 

To build the application for production: 

``` 
npm run build 
``` 

To preview the production build: 

``` 
npm run preview 
``` 

## Deployment 

The frontend application can be deployed to Netlify, Vercel, or any other static site hosting service. 

## Additional Features 

- **Dark Mode**: Toggle between light and dark themes 
- **Responsive Design**: Mobile-friendly interface 
- **Interactive Tables**: Sortable columns and hover effects 
- **Data Export**: Export transaction data to CSV 
