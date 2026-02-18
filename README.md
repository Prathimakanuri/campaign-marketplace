# Campaign Marketplace

A professional full-stack platform where **Brands** can create marketing campaigns and **Influencers** can discover and apply to them.

## 🚀 Features

### Authentication & Security
- **Secure Registration & Login**: Multi-role system (Brand & Influencer).
- **JWT Authentication**: Secure token-based access.
- **Password Hashing**: Industry-standard encryption using `bcryptjs`.
- **Protected Routes**: Middleware to verify identity and role.

### Campaign Management
- **Brand Tools**: Create new campaigns with budget allocation.
- **Influencer tools**: Browse a marketplace of available campaigns and apply instantly.
- **Application Tracking**: Brands can review who applied to their campaigns.

### Design & Experience
- Clean, minimal professional UI.
- In-page feedback messaging (success/error).
- Fully responsive Vanilla JS frontend.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: JSON Web Token (JWT), BcryptJS
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Others**: Dotenv, CORS

## 📂 Project Structure

```text
CampaignMarketplace/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth & Error handling
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── .env              # Environment variables
│   └── server.js         # Entry point
├── frontend/
│   ├── css/              # Visual styling
│   ├── js/               # API & Page logic
│   ├── login.html
│   ├── register.html
│   └── dashboard.html
└── README.md
```

## 🚥 Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas)

### 2. Backend Setup
1. Open a terminal in the `backend/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment in `.env`:
   ```text
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/campaign-marketplace
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### 3. Frontend Setup
1. Simply open `frontend/register.html` in any modern web browser.
2. Ensure the backend is running at `http://localhost:5000` for API connectivity.

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Public | Create a new user account |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/campaign` | Private | Fetch all campaigns |
| POST | `/api/campaign` | Private (Brand) | Create a new campaign |
| POST | `/api/campaign/:id/apply` | Private (Influencer) | Apply to a campaign |
| GET | `/api/campaign/:id/applicants` | Private (Owner) | View applicants list |

---
*Created for efficient Brand-Influencer connectivity.*
