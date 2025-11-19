# SpendShift

SpendShift is a smart financial habit tracker that helps visualize spending patterns, set savings goals, and receive actionable insights. The project now includes:

- **Frontend:** React + Vite single-page app for dashboards, transactions, and goals.
- **Backend:** FastAPI service that provides RESTful APIs for transactions and goals with SQLite persistence.

## Frontend (React)

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The frontend currently uses localStorage. A later iteration will switch to the FastAPI endpoints below.

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
```

### 3. Run the API locally

```bash
uvicorn app.main:app --reload --app-dir backend
```

The API will be available at [http://localhost:8000](http://localhost:8000). Interactive docs live at `/docs`.

## API Overview

| Method | Endpoint                   | Description                    |
|--------|----------------------------|--------------------------------|
| GET    | `/health`                  | Health check                   |
| GET    | `/api/transactions`        | List transactions              |
| POST   | `/api/transactions`        | Create transaction             |
| PUT    | `/api/transactions/{id}`   | Update transaction             |
| DELETE | `/api/transactions/{id}`   | Delete transaction             |
| GET    | `/api/goals`               | List goals                     |
| POST   | `/api/goals`               | Create goal                    |
| PUT    | `/api/goals/{id}`          | Update goal                    |
| DELETE | `/api/goals/{id}`          | Delete goal                    |

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── config.py         # Settings (env vars, CORS, DB URL)
│   │   ├── database.py       # SQLModel engine & session helpers
│   │   ├── models.py         # SQLModel models & schemas
│   │   ├── crud.py           # Data-access helpers
│   │   ├── routes/           # FastAPI routers
│   │   └── main.py           # FastAPI entry point
│   └── requirements.txt
├── src/                      # React frontend
└── README.md
```

## Next Steps

- Wire the React app to consume the FastAPI endpoints
- Add Plaid/CSV ingestion services
- Layer on AI-driven recommendations and time-series analytics
