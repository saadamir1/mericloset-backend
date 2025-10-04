# MeriCloset Backend API

A robust Node.js backend API for MeriCloset - a personalized fashion platform that serves as the core engine for product curation, user management, and brand integration.

## 🚀 Features

- **User Management**: Registration, authentication, and profile management
- **Product Catalog**: Comprehensive product management with advanced filtering
- **Brand Portal**: Brand registration and product management system
- **Recommendation Engine**: AI-powered personalized product suggestions
- **Order Management**: Complete order processing with Stripe and COD support
- **Admin Dashboard**: Analytics and platform management
- **File Upload**: Image upload and management system
- **Feedback System**: Product reviews and ratings
- **Closet Management**: Personal wardrobe organization
- **Tracking System**: User activity and behavior tracking

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Payment Processing**: Stripe
- **Data Export**: xlsx
- **HTTP Client**: Axios
- **Logging**: Morgan
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Stripe account for payment processing

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/saadamir1/mericloset.git
   cd mericloset/mericloset-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   CONNECTION_STRING=mongodb://localhost:27017/mericloset
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key
   
   # API Configuration
   API_URL=/api/v1
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # File Upload
   UPLOAD_PATH=./uploads
   ```

4. **Start the server**
   
   **Development mode:**
   ```bash
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm start
   ```

5. **Verify installation**
   
   Navigate to [http://localhost:3000](http://localhost:3000)
   
   You should see: "🎉 MeriCloset backend is live and connected!"

## 📜 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

## 📁 Project Structure

```
├── controllers/         # Business logic controllers
│   ├── AdminController.js
│   ├── BrandController.js
│   ├── CategoryController.js
│   ├── ClosetController.js
│   ├── ClosetItemController.js
│   ├── favoriteController.js
│   ├── feedbackController.js
│   ├── ProductController.js
│   ├── RecommendationController.js
│   ├── TrackingController.js
│   └── UserController.js
├── models/             # MongoDB schemas
│   ├── Brand.js
│   ├── Category.js
│   ├── Closet.js
│   ├── ClosetItem.js
│   ├── Favorite.js
│   ├── FeedBack.js
│   ├── FeedbackProduct.js
│   ├── Lookbook.js
│   ├── Product.js
│   ├── Profile.js
│   ├── Recommendation.js
│   ├── Tracking.js
│   └── User.js
├── routes/             # API route definitions
│   ├── adminRoutes.js
│   ├── brandRoutes.js
│   ├── categoryRoutes.js
│   ├── closetRoutes.js
│   ├── favoriteRoutes.js
│   ├── feedbackRoutes.js
│   ├── productRoutes.js
│   ├── recommendationRoutes.js
│   ├── stripeRoutes.js
│   ├── trackingRoutes.js
│   ├── uploadRoutes.js
│   ├── userRoutes.js
│   └── index.js
├── middleware/         # Custom middleware
│   ├── authMiddleware.js
│   └── errorHandler.js
├── helpers/           # Utility functions
│   ├── error-handler.js
│   └── jwt.js
├── uploads/           # File upload directory
└── app.js            # Main application file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/profile` - Get user profile

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create new product (Brand/Admin)
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Brands
- `GET /api/v1/brands` - Get all brands
- `POST /api/v1/brands/register` - Brand registration
- `GET /api/v1/brands/:id/products` - Get brand products

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category (Admin)

### Recommendations
- `GET /api/v1/recommendations/:userId` - Get personalized recommendations
- `POST /api/v1/recommendations/track` - Track user interactions

### Orders & Payments
- `POST /stripe/create-checkout-session` - Create Stripe checkout
- `POST /cash-order` - Create cash on delivery order

### File Upload
- `POST /api/v1/upload` - Upload images

## 🔐 Authentication & Authorization

The API uses JWT (JSON Web Tokens) for authentication:

1. **User Registration/Login**: Returns JWT token
2. **Protected Routes**: Require valid JWT in Authorization header
3. **Role-based Access**: Different permissions for Users, Brands, and Admins

### JWT Token Usage
```javascript
Authorization: Bearer <your_jwt_token>
```

## 💳 Payment Integration

### Stripe Integration
- Secure payment processing
- Webhook handling for payment events
- Support for multiple currencies

### Cash on Delivery (COD)
- Alternative payment method
- Order tracking and management

## 📊 Database Schema

### Key Models
- **User**: User accounts and authentication
- **Brand**: Brand profiles and information
- **Product**: Product catalog with detailed attributes
- **Category**: Product categorization
- **Closet**: User's personal wardrobe
- **Favorite**: User's favorite products
- **Feedback**: Product reviews and ratings
- **Recommendation**: AI-generated suggestions
- **Tracking**: User behavior analytics

## 🔧 Key Features Implementation

### Recommendation Engine
- Collaborative filtering
- Content-based filtering
- User behavior tracking
- Machine learning integration ready

### File Management
- Multer for file uploads
- Image optimization
- Secure file serving

### Error Handling
- Global error handler
- Custom error classes
- Detailed error logging

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB database
2. Configure environment variables
3. Set up Stripe webhooks
4. Configure file upload directory

### Production Deployment
```bash
# Install dependencies
npm install --production

# Start server
npm start
```

## 📈 Monitoring & Analytics

- Request logging with Morgan
- User activity tracking
- Performance monitoring ready
- Error tracking and reporting

## 🧪 Testing

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of a BSc Computer Science Final Year Project.

## 👨💻 Author

**Saad Amir** - BSc Computer Science Student

---

**Note**: This is a Final Year Project (FYP) for BSc Computer Science degree, demonstrating full-stack development capabilities with modern backend technologies and best practices in the fashion e-commerce domain.