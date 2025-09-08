//importing modules
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./MongoDb/connect.js');
const cors = require('cors');
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

//encoding the url to make the data passed through it to a object 
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin',adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    app.listen(PORT, () => {
        console.log(`Server started ${PORT}`)
    });
};
console.log('MongoDB URL:', process.env.MONGODB_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

StartServer(MONGODB_URL);
