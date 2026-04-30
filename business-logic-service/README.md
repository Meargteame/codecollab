# CodeCollab Business Logic Service

FastAPI-based backend service for CodeCollab platform, handling authentication, project management, AI features, billing, and search functionality.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Project Management**: CRUD operations for projects with role-based access control
- **Collaboration**: Project sharing and collaborator management
- **AI Features**: Code completion, explanation, and bug detection powered by OpenAI
- **Search**: Full-text code search with Elasticsearch
- **Billing**: Subscription management with Stripe integration
- **User Management**: User account lifecycle and profile management

## Tech Stack

- **Framework**: FastAPI 0.109+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Cache**: Redis for sessions and rate limiting
- **Search**: Elasticsearch for code indexing
- **AI**: OpenAI API for code intelligence
- **Payments**: Stripe for subscription billing
- **Monitoring**: Prometheus metrics

## Prerequisites

- Python 3.11+
- PostgreSQL 14+
- Redis 7+
- Elasticsearch 8+
- Poetry (for dependency management)

## Installation

### Using Poetry (Recommended)

```bash
# Install dependencies
poetry install

# Activate virtual environment
poetry shell

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Using pip

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
```

## Database Setup

```bash
# Run migrations
alembic upgrade head

# Create initial migration (if needed)
alembic revision --autogenerate -m "Initial migration"
```

## Running the Service

### Development

```bash
# Using Poetry
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production

```bash
# Using Gunicorn with Uvicorn workers
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker

```bash
# Build image
docker build -t codecollab-business-logic:latest .

# Run container
docker run -d \
  --name codecollab-business-logic \
  -p 8000:8000 \
  --env-file .env \
  codecollab-business-logic:latest
```

## API Documentation

Once running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Testing

```bash
# Run all tests
poetry run pytest

# Run with coverage
poetry run pytest --cov=app --cov-report=html

# Run only unit tests
poetry run pytest tests/ -v

# Run only property-based tests
poetry run pytest tests/ -v -m property

# Run only integration tests
poetry run pytest tests/ -v -m integration
```

## Project Structure

```
business-logic-service/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration management
│   ├── database.py             # Database connection and session
│   ├── dependencies.py         # FastAPI dependencies
│   ├── models/                 # SQLAlchemy models
│   ├── schemas/                # Pydantic schemas
│   ├── services/               # Business logic services
│   ├── api/                    # API routes
│   ├── middleware/             # Custom middleware
│   └── utils/                  # Utility functions
├── tests/
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── conftest.py             # Pytest fixtures
├── alembic/                    # Database migrations
├── pyproject.toml              # Poetry dependencies
├── Dockerfile                  # Container image
└── README.md                   # This file
```

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `OPENAI_API_KEY`: OpenAI API key
- `STRIPE_API_KEY`: Stripe API key
- `ELASTICSEARCH_URL`: Elasticsearch connection URL

## Health Check

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "database": "connected",
  "redis": "connected"
}
```

## Monitoring

Prometheus metrics are exposed at:
```
http://localhost:8000/metrics
```

## License

Proprietary - CodeCollab Team
