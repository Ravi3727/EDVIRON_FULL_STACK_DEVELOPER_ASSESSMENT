# School Payment System  

This is the application for the School Payment and Dashboard System. It provides a user interface + backend Api's for managing transactions, payments, and user authentication.  

## Tech Stack 
 
#### Frontend  
- React.js (with Vite) 
- Tailwind CSS 
- React Router for navigation 
- Axios for API calls 
- React Icons for icons 
- Context API for state management 

#### Backend  
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Zod for data validation


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

```      
backend/
├── config/           # Configuration files 
├── controllers/      # Route controllers 
├── middleware/       # Custom middleware 
├── models/           # Database models 
├── routes/           # API routes 
├── .env              # Environment variables  
├── package.json      # Project dependencies  
├── README.md         # Documentation  
└── server.js         # Entry point  
```  

## Features  

#### Postman Api Collection -> https://.postman.co/workspace/My-Workspace~8f94530d-4728-40e1-8da4-7b7e132212c2/collection/27206076-54c5e43d-c176-47e9-8642-52caac0ecd06?action=share&creator=27206076 
#### Frontend -> https://github.com/Ravi3727/EDVIRON_FULL_STACK_DEVELOPER_ASSESSMENT/tree/main/frontend  
#### Backend -> https://github.com/Ravi3727/EDVIRON_FULL_STACK_DEVELOPER_ASSESSMENT/tree/main/backend 

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
6.  Navigate to the backend directory   
7. Install dependencies:  
   ``` 
   npm install 
   ``` 
8. Create a `.env` file in the root directory with the following variables:  
   ```  
   MONGODB_URI=your_mongodb_connection_string 
   JWT_SECRET=your_jwt_secret 
   PG_KEY=  
   API_KEY=your_payment_api_key 
   SCHOOL_ID=your_school_id 
   PORT=5000
   see .env.example file 
   ``` 
9. Start the server:   
   ```  
   npm start  
   ```  
   
   For development with auto-restart:    
   ```   
   npm run dev   
   ```  

## Pages  

#### Please visit -> https://github.com/Ravi3727/EDVIRON_FULL_STACK_DEVELOPER_ASSESSMENT/tree/main/frontend  

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

The frontend application is deployed on Vercel -> https://edvirontask01.vercel.app   
The backend is deployed on render -> https://edviron-task-1.onrender.com  

## Additional Features  

- **Dark Mode**: Toggle between light and dark themes 
- **Responsive Design**: Mobile-friendly interface 
- **Interactive Tables**: Sortable columns and hover effects 
- **Data Export**: Export transaction data to CSV 
