//importing modules
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./MongoDb/connect.js');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./routes/user.routes')
const adminRoutes = require('./routes/admin.routes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const authRoutes = require('./routes/auth.routes.js');
const Product = require('./MongoDb/models/Product.js');

//compiling .env file
dotenv.config();

//taking the values from .env file
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

//creating the server from express library
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

//encoding the url to make the data passed through it to a object 
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin',adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make io available to routes
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join user to their own room for targeted updates
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

//function to start the server
const StartServer = async (MONGODB_URL) => {
    //passing mongoDB url to database connecting function
    await connectDB(MONGODB_URL);
    
    // Drop the old productId index if it exists
    try {
        await Product.collection.dropIndex('productId_1');
        console.log('Dropped old productId index');
    } catch (error) {
        if (error.code === 27) {
            console.log('productId index does not exist, skipping...');
        } else {
            console.log('Error dropping index:', error.message);
        }
    }
    
    //make the server to listen the port  
    server.listen(PORT, () => {
        console.log(`Server started ${PORT}`)
    });
};
console.log('MongoDB URL:', process.env.MONGODB_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

StartServer(MONGODB_URL);
