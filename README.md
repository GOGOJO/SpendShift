# SpendShift

SpendShift is a smart financial habit tracker that helps visualize spending patterns, set savings goals, and receive actionable insights. The project includes:

- **Frontend:** React + Vite single-page app with user authentication, dashboards, transactions, and goals.
- **Backend:** FastAPI service with JWT authentication, RESTful APIs for transactions and goals, and SQLite persistence.

## Frontend (React)

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The frontend is fully integrated with the FastAPI backend. Users must register/login to access their data.

## Backend (FastAPI)

### 1. Create a virtual environment & install dependencies

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment variables (optional)

Create a `.env` file inside `backend/` to override defaults:

```
SPENDSHIFT_DATABASE_URL=sqlite:///./spendshift.db
SPENDSHIFT_CORS_ORIGINS=http://localhost:5173
SPENDSHIFT_SECRET_KEY=your-secret-key-change-in-production
SPENDSHIFT_ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Run the API locally

**Option 1: Using npm script (recommended)**
```bash
npm run dev:api
```

**Option 2: Manual run from backend directory**
```bash
cd backend
uvicorn app.main:app --reload
```

**Option 3: From project root**
```bash
cd backend && uvicorn app.main:app --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000). Interactive docs live at `/docs`.

## API Overview

### Authentication Endpoints

| Method | Endpoint          | Description                    | Auth Required |
|--------|-------------------|--------------------------------|---------------|
| POST   | `/api/auth/register` | Register new user            | No            |
| POST   | `/api/auth/login`    | Login and get JWT token      | No            |
| GET    | `/api/auth/me`       | Get current user info        | Yes           |

### Transaction Endpoints (All require authentication)

| Method | Endpoint                   | Description                    |
|--------|----------------------------|--------------------------------|
| GET    | `/api/transactions`        | List user's transactions      |
| POST   | `/api/transactions`        | Create transaction             |
| PUT    | `/api/transactions/{id}`   | Update transaction             |
| DELETE | `/api/transactions/{id}`   | Delete transaction             |

### Goal Endpoints (All require authentication)

| Method | Endpoint                   | Description                    |
|--------|----------------------------|--------------------------------|
| GET    | `/api/goals`               | List user's goals              |
| POST   | `/api/goals`               | Create goal                    |
| PUT    | `/api/goals/{id}`          | Update goal                    |
| DELETE | `/api/goals/{id}`          | Delete goal                    |

### Other

| Method | Endpoint                   | Description                    |
|--------|----------------------------|--------------------------------|
| GET    | `/health`                  | Health check                   |

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── config.py         # Settings (env vars, CORS, DB URL, JWT secret)
│   │   ├── database.py       # SQLModel engine & session helpers
│   │   ├── models.py         # SQLModel models & schemas (User, Transaction, Goal)
│   │   ├── auth.py           # JWT & password hashing utilities
│   │   ├── crud.py           # Data-access helpers
│   │   ├── routes/           # FastAPI routers (auth, transactions, goals)
│   │   └── main.py           # FastAPI entry point
│   └── requirements.txt
├── src/                      # React frontend
│   ├── components/           # React components
│   ├── context/              # AuthContext for user state
│   └── utils/                # API client & helpers
└── README.md
```

## Features

✅ User authentication (JWT-based)  
✅ User registration and login  
✅ Protected routes (Dashboard & Goals require login)  
✅ Transaction CRUD operations (per user)  
✅ Goal CRUD operations (per user)  
✅ Data persistence in SQLite database  
✅ Frontend-backend integration complete  

## Next Steps

- Add Plaid/CSV ingestion services
- Layer on AI-driven recommendations and time-series analytics
- Add password reset functionality
- Add email verification
