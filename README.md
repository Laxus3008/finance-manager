# Finance Manager - MERN Stack Application

A full-stack personal finance management application built with the MERN stack (MongoDB, Express.js, React, Node.js) that helps users track spending, manage budgets, and receive AI-powered financial insights.

## 🌟 Features

### User Authentication
- Secure registration and login system
- JWT-based authentication
- Protected routes and sessions

### Transaction Management
- Manual transaction entry with auto-categorization
- CSV file upload for bulk import
- Transaction filtering by date range and category
- View transaction history with detailed breakdown
- Categorized spending (Food, Rent, Transport, Shopping, etc.)

### Budget Management
- Set monthly budgets (total and per category)
- Real-time budget tracking with visual progress bars
- Customizable alert thresholds (e.g., 80% of budget used)
- Budget status indicators (within budget, warning, over budget)
- Historical budget data

### AI-Powered Insights
- Gemini AI integration for spending analysis
- Automatic spending pattern recognition
- Personalized saving tips and recommendations
- Category-wise spending analysis
- Suggested monthly saving goals
- Areas for improvement identification

### Dashboard & Visualization
- Interactive spending summary with charts
- Category-wise spending breakdown (Pie charts)
- Monthly spending trends
- Budget alerts and notifications
- AI insights display

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **CSV Parser** - CSV processing
- **Google Gemini AI** - AI analysis

### Deployment
- **Frontend**: Vercel
- **Backend**: Vercel (Serverless)
- **Database**: MongoDB Atlas

## 📁 Project Structure

```
finance-manager/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Auth/     # Login/Register forms
│   │   │   ├── Dashboard/# Dashboard components
│   │   │   ├── Transactions/
│   │   │   ├── Budget/
│   │   │   └── Layout/
│   │   ├── pages/        # Page components
│   │   ├── context/      # Auth context
│   │   ├── utils/        # API utilities
│   │   └── App.js
│   └── package.json
│
├── server/                # Node.js backend
│   ├── config/           # Database config
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── utils/            # Helper functions
│   └── server.js         # Entry point
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Gemini API Key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/finance-manager.git
   cd finance-manager
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

   Create `.env` file in server directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

   Start backend server:
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

   Create `.env` file in client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

   Start frontend:
   ```bash
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Transactions
- `GET /api/transactions` - Get all transactions (Protected)
- `GET /api/transactions/:id` - Get single transaction (Protected)
- `POST /api/transactions` - Create transaction (Protected)
- `PUT /api/transactions/:id` - Update transaction (Protected)
- `DELETE /api/transactions/:id` - Delete transaction (Protected)
- `POST /api/transactions/upload` - Upload CSV (Protected)
- `GET /api/transactions/summary` - Get spending summary (Protected)

### Budgets
- `GET /api/budgets` - Get budget for month (Protected)
- `POST /api/budgets` - Create/Update budget (Protected)
- `GET /api/budgets/all` - Get all budgets (Protected)
- `DELETE /api/budgets/:id` - Delete budget (Protected)

### AI Analysis
- `POST /api/ai/analyze` - Generate AI analysis (Protected)
- `GET /api/ai/analysis` - Get analysis for month (Protected)
- `GET /api/ai/history` - Get analysis history (Protected)

## 🎨 Features Showcase

### Auto-Categorization
Transactions are automatically categorized using keyword matching:
- **Food**: restaurant, cafe, grocery, uber eats, etc.
- **Transport**: uber, gas, parking, metro, etc.
- **Shopping**: amazon, walmart, clothing, etc.
- **Subscriptions**: netflix, spotify, prime, etc.

### Budget Alerts
- **Green**: Within budget (< alert threshold)
- **Yellow**: Warning (≥ alert threshold, < 100%)
- **Red**: Over budget (≥ 100%)

### AI Insights
Powered by Google Gemini AI, provides:
- Spending pattern summary
- Top spending categories analysis
- Specific areas to reduce spending
- Practical saving tips
- Realistic monthly saving goals

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- CORS configuration
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set root directory to `client`
3. Add environment variable: `REACT_APP_API_URL`
4. Deploy

### Backend (Vercel)
1. Connect GitHub repository to Vercel
2. Set root directory to `server`
3. Add environment variables (MONGO_URI, JWT_SECRET, etc.)
4. Deploy

## 📝 CSV Upload Format

Upload CSV files with the following format:

```csv
date,description,amount
2024-01-15,Grocery Store,-50.00
2024-01-16,Salary,2500.00
2024-01-17,Gas Station,-40.00
```

- **date**: Date in any standard format
- **description**: Transaction description
- **amount**: Negative for expenses, positive for income

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent financial insights
- MongoDB Atlas for database hosting
- Vercel for deployment platform
- Recharts for beautiful data visualization

---

**Made with ❤️ using MERN Stack**
