# School Payment System Backend

This is the backend API for the School Payment and Dashboard Application. It provides endpoints for managing transactions, payments, and user authentication.

## Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Zod for data validation

## Project Structure

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

## Setup and Installation 

1. Clone the repository 
2. Navigate to the backend directory 
3. Install dependencies: 
   ``` 
   npm install 
   ``` 
4. Create a `.env` file in the root directory with the following variables: 
   ``` 
   MONGODB_URI=your_mongodb_connection_string 
   JWT_SECRET=your_jwt_secret 
   PG_KEY=  
   API_KEY=your_payment_api_key 
   SCHOOL_ID=your_school_id 
   PORT=5000
   see .env.example file 
   ``` 
5. Start the server: 
   ```  
   npm start  
   ```  
   
   For development with auto-restart:  
   ```  
   npm run dev  
   ```  

## API Documentation 

### Authentication 

#### Register a new user 
- **URL**: `/api/auth/register` 
- **Method**: `POST` 
- **Body**: 
  ``` json  
  {
    "username": "user123", 
    "password": "password123", 
    "email": "user@example.com", 
    "role": "user" // Optional, defaults to "user" 
  } 
  ``` 
- **Response**: 201 Created 

#### Login 
- **URL**: `/api/auth/login` 
- **Method**: `POST` 
- **Body**: 
  ``` json  
  { 
    "username": "user123", 
    "password": "password123" 
  } 
  ``` 
- **Response**:  
  ``` json 
  { 
    "token": "jwt_token", 
    "user": { 
      "id": "user_id", 
      "username": "user123", 
      "role": "user" 
    } 
  } 
  ``` 

### Payments 

#### Create Payment 
- **URL**: `/api/payments/create-payment` 
- **Method**: `POST` 
- **Authentication**: Required (JWT) 
- **Body**: 
  ``` json 
  { 
    "school_id": "school_id", 
    "trustee_id": "trustee_id", 
    "student_info": { 
      "name": "John Doe", 
      "id": "STU123", 
      "email": "john@example.com" 
    }, 
    "gateway_name": "PhonePe", 
    "amount": 2000 
  } 
  ``` 
- **Response**: 
  ```json 
  { 
    "status": 200, 
    "message": "Payment request created successfully", 
    "data": { 
      "payment_url": "https://payment.example.com/pay/ORDER_ID", 
      "transaction_id": "ORDER_ID" 
    } 
  } 
  ``` 

#### Webhook 
- **URL**: `/api/payments/webhook` 
- **Method**: `POST` 
- **Body**: 
  ``` json 
  { 
    "status": 200, 
    "order_info": { 
      "order_id": "collect_id/transaction_id", 
      "order_amount": 2000, 
      "transaction_amount": 2200, 
      "gateway": "PhonePe", 
      "bank_reference": "YESBNK222", 
      "status": "success", 
      "payment_mode": "upi", 
      "payemnt_details": "success@ybl", 
      "Payment_message": "payment success", 
      "payment_time": "2025-04-23T08:14:21.945+00:00", 
      "error_message": "NA" 
    } 
  } 
  ``` 
- **Response**: 200 OK 

### Transactions 

#### Get All Transactions 
- **URL**: `/api/transactions` 
- **Method**: `GET` 
- **Authentication**: Required (JWT) 
- **Query Parameters**: 
  - `page`: Page number (default: 1) 
  - `limit`: Items per page (default: 10) 
  - `sort`: Field to sort by (default: payment_time) 
  - `order`: Sort order (asc/desc, default: desc) 
  - `status`: Filter by status 
  - `schoolId`: Filter by school ID 
  - `startDate`: Filter by start date 
  - `endDate`: Filter by end date 
- **Response**: 
  ``` json  
  { 
    "transactions": [ 
      { 
        "collect_id": "order_id", 
        "school_id": "school_id", 
        "gateway": "PhonePe", 
        "order_amount": 2000, 
        "transaction_amount": 2200, 
        "status": "success", 
        "custom_order_id": "ORDER_ID", 
        "payment_time": "2025-04-23T08:14:21.945Z" 
      } 
    ], 
    "pagination": { 
      "total": 100, 
      "page": 1, 
      "limit": 10, 
      "pages": 10 
    } 
  } 
  ``` 

#### Get Transactions by School 
- **URL**: `/api/transactions/school/:schoolId` 
- **Method**: `GET` 
- **Authentication**: Required (JWT) 
- **Parameters**: 
  - `schoolId`: School ID 
- **Query Parameters**: Same as Get All Transactions 
- **Response**: Same format as Get All Transactions 

#### Check Transaction Status 
- **URL**: `/api/transactions/status/:customOrderId` 
- **Method**: `GET` 
- **Authentication**: Required (JWT) 
- **Parameters**: 
  - `customOrderId`: Custom Order ID 
- **Response**: 
  ```json 
  { 
    "transaction_id": "ORDER_ID", 
    "collect_id": "order_id", 
    "school_id": "school_id", 
    "gateway": "PhonePe", 
    "order_amount": 2000, 
    "transaction_amount": 2200, 
    "status": "success", 
    "payment_mode": "upi", 
    "payment_details": "success@ybl", 
    "payment_time": "2025-04-23T08:14:21.945+00:00" 
  } 
  ``` 

## Testing with Postman 

A Postman collection is included in the repository for testing the API endpoints. Import the collection into Postman and set up the following environment variables: 

- `baseUrl`: The base URL of your API (e.g., http://localhost:5000) 
- `token`: JWT token obtained from the login endpoint 

## Error Handling 

All endpoints return appropriate HTTP status codes and error messages in case of failure: 

- 400: Bad Request (validation errors) 
- 401: Unauthorized (missing or invalid token) 
- 404: Not Found 
- 500: Server Error 

## Security 

- All sensitive routes are protected with JWT authentication 
- Passwords are hashed using bcrypt 
- Input validation is performed using Zod 
- CORS is enabled for cross-origin requests 
