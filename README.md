# DP-Store - Baby Products E-commerce Platform

A full-stack e-commerce application specialized in baby products, built with React and Node.js.

## 🚀 Features

### User Features
- **Authentication**: Secure user registration and login with JWT
- **Product Catalog**: Browse products by category with search and filtering
- **Product Details**: Detailed product pages with images and descriptions
- **Shopping Cart**: Add, remove, and manage cart items with quantity control
- **Responsive Design**: Mobile-friendly interface with modern UI

### Admin Features
- **Product Management**: Create, edit, and delete products
- **Category Management**: Organize products into categories
- **Offer Management**: Create special offers and discounts
- **Dashboard**: Comprehensive admin interface for store management

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **Vite 7.1.2** - Fast build tool and dev server
- **React Router DOM 7.8.2** - Client-side routing
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.21.2** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.16.5** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling

## 📁 Project Structure

```
dp-store/
├── clientside/                 # React frontend
│   ├── src/
│   │   ├── Pages/             # Route components
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── Products.jsx   # Product catalog
│   │   │   ├── ProductDetail.jsx # Individual product page
│   │   │   ├── Cart.jsx       # Shopping cart
│   │   │   ├── Auth.jsx       # Login/Register
│   │   │   └── Admin.jsx      # Admin dashboard
│   │   ├── components/        # Reusable components
│   │   │   ├── Nav.jsx        # Navigation bar
│   │   │   ├── Footer.jsx     # Footer component
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/           # React context
│   │   │   └── AuthContext.jsx # Authentication state
│   │   └── services/          # API services
│   │       └── api.js         # API communication
│   └── public/                # Static assets
└── serverside/                # Express backend
    ├── controllers/           # Business logic
    │   ├── authController.js  # Authentication
    │   ├── ProductApi.js      # Product operations
    │   ├── CartApi.js         # Cart operations
    │   ├── CategoryApi.js     # Category management
    │   └── OfferApi.js        # Offer management
    ├── routes/                # API routes
    │   ├── auth.routes.js     # Auth endpoints
    │   ├── user.routes.js     # User endpoints
    │   └── admin.routes.js    # Admin endpoints
    ├── MongoDb/               # Database
    │   ├── models/            # Data models
    │   └── connect.js         # Database connection
    └── index.js               # Server entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dp-store
   ```

2. **Backend Setup**
   ```bash
   cd serverside
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd clientside
   npm install
   ```

4. **Environment Variables**
   Create a `.env` file in the `serverside` directory:
   ```env
   PORT=5000
   MONGODB_URL=mongodb://localhost:27017/dpstore
   JWT_SECRET=your_jwt_secret_key_here
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd serverside
   npm start
   ```
   Server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd clientside
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Endpoints
- `GET /api/user/products` - Get all products
- `GET /api/user/product/:id` - Get product by ID
- `GET /api/user/products/category/:category` - Get products by category
- `GET /api/user/products/on-offer` - Get products on offer
- `POST /api/user/cart` - Add to cart
- `GET /api/user/cart/:userId` - Get user cart
- `PUT /api/user/cart/:userId/:productId` - Update cart item
- `DELETE /api/user/cart/:userId/:productId` - Remove from cart

### Admin Endpoints
- `POST /api/admin/product` - Create product
- `PUT /api/admin/product/:id` - Update product
- `DELETE /api/admin/product/:id` - Delete product
- `POST /api/admin/category` - Create category
- `POST /api/admin/offer` - Create offer

## 🎨 Key Features Implemented

### Authentication System
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes for admin access
- Persistent login state

### Product Management
- Complete CRUD operations for products
- Category-based organization
- Stock management
- Special offers system
- Image upload support

### Shopping Experience
- Interactive product catalog with filtering
- Detailed product pages
- Shopping cart with quantity management
- Real-time cart updates
- Responsive design for all devices

### Admin Dashboard
- Comprehensive product management
- Category and offer management
- Intuitive tabbed interface
- Modal-based forms for data entry

## 🔧 Development Notes

### Frontend Architecture
- Uses React Context for global state management
- Modular component structure
- API service layer for backend communication
- Protected routes for admin functionality

### Backend Architecture
- RESTful API design
- Mongoose schemas for data modeling
- JWT middleware for authentication
- CORS enabled for cross-origin requests

### Database Models
- **User**: Authentication and user data
- **Product**: Core product information
- **Cart**: Shopping cart items
- **Category**: Product categorization
- **Offer**: Special promotions
- **Order**: Purchase tracking

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**DP-Store** - Your trusted partner for premium baby care products! 👶🛍️
