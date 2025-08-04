# Agent Management System

A full-stack web application for managing agents and distributing tasks through CSV/Excel file uploads. The system automatically distributes uploaded contact lists equally among exactly 5 agents.

## 🚀 Features

- **Admin Authentication**: Secure login system for administrators
- **Agent Management**: Create, read, update, and delete agents
- **File Upload**: Support for CSV and Excel files (.csv, .xlsx, .xls)
- **Automatic Distribution**: Distributes uploaded contact lists equally among 5 agents
- **Task Tracking**: View distributed items per agent
- **Responsive UI**: Modern React interface with toast notifications

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **multer** for file uploads
- **csv-parser** and **xlsx** for file processing

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **React Hot Toast** for notifications
- **Tailwind CSS** for styling
- **Context API** for state management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd agent-management-system
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Environment Variables
Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/agent-management
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
```

### 4. Database Setup
```bash
# Seed the admin user
npm run seed

# This creates an admin user with:
# Email: admin@example.com
# Password: admin@123
```

### 5. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file (if needed)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```
Server will run on: `http://localhost:5000`

### Start Frontend Application
```bash
cd frontend
npm start
```
Application will open at: `http://localhost:3000`

## 📂 Project Structure

```
agent-management-system/
├── backend/
│   ├── controllers/
│   │   ├── agentController.js
│   │   ├── authController.js
│   │   └── listController.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Agent.js
│   │   └── ListItem.js
│   ├── routes/
│   │   ├── agentRoutes.js
│   │   ├── authRoutes.js
│   │   └── listRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── uploads/
│   ├── server.js
│   └── seed.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── App.tsx
│   └── public/
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Agents
- `GET /api/agents` - Get all agents (protected)
- `POST /api/agents/create` - Create new agent (protected)
- `PUT /api/agents/:id` - Update agent (protected)
- `DELETE /api/agents/:id` - Delete agent (protected)

### File Upload & Distribution
- `POST /api/lists/upload` - Upload and distribute CSV/Excel file (protected)
- `GET /api/lists/distributions` - Get all distributed lists (protected)
- `GET /api/lists/agent/:agentId` - Get items for specific agent (protected)

## 📄 File Format Requirements

### CSV Format
```csv
FirstName,Phone,Notes
John Doe,+1234567890,Important client
Jane Smith,+0987654321,Follow up needed
```

### Excel Format
Same columns as CSV:
- **FirstName** (required)
- **Phone** (required)
- **Notes** (optional)

## 🎯 Usage Instructions

1. **Login**: Use admin credentials to access the system
2. **Create Agents**: Add exactly 5 agents before uploading files
3. **Upload Files**: Navigate to upload page and select CSV/Excel file
4. **View Distribution**: Check how contacts are distributed among agents
5. **Manage Agents**: Add, edit, or remove agents as needed

## ⚠️ Important Notes

- **Exactly 5 agents required**: The system requires exactly 5 agents for file distribution
- **File overwrites**: Each new file upload clears previous distributions
- **Supported formats**: Only CSV, XLS, and XLSX files are supported
- **Equal distribution**: Items are distributed as equally as possible among 5 agents

## 🐛 Troubleshooting

### Common Issues

1. **"Exactly 5 agents required" error**
   - Ensure you have created exactly 5 agents before uploading files

2. **File upload fails**
   - Check file format (CSV, XLS, XLSX only)
   - Verify required columns (FirstName, Phone)

3. **Authentication errors**
   - Verify JWT_SECRET in environment variables
   - Check if admin user exists in database

4. **Database connection issues**
   - Ensure MongoDB is running
   - Verify MONGO_URI in environment variables

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- File type validation
- Input sanitization

## 📝 Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed admin user
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@yourdomain.com

---

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin@123`

**⚠️ Remember to change the default admin credentials in production!**
