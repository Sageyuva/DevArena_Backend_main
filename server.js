const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/DB');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Database connection (assuming you have a DB.js file for MongoDB connection)
connectDB();


//import routes
 const userRoutes = require('./Routes/UserRoute');
  const userActionRoutes = require('./Routes/UserActionsRoutes');

// Base route for API
const apiRouter = express.Router();
app.use('/api/v1', apiRouter);

// Test route under /api/v1
apiRouter.get('/', (req, res) => {
  res.json({ message: 'Welcome to DevArena API v1' });
});

//User Routes
apiRouter.use("/user",  userRoutes);
//User Action Routes
apiRouter.use("/userAction", userActionRoutes);



// Error handling for invalid routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});