# Business Logic Service Setup Guide

This guide will help you set up and run the CodeCollab Business Logic Service.

## Prerequisites

- Python 3.11 or higher
- PostgreSQL 14 or higher
- Redis 7 or higher
- Elasticsearch 8 or higher (optional, for search features)
- MinIO or S3 (optional, for file storage)
- Poetry (recommended) or pip

## Quick Start with Docker Compose

The fastest way to get started is using Docker Compose, which will set up all required services:

```bash
# Start all services
make docker-up

# View logs
make docker-logs

# Stop all services
make docker-down
```

The API will be available at `http://localhost:8000`

## Manual Setup

### 1. Install Dependencies

#### Using Poetry (Recommended)

```bash
# Install Poetry if you haven't already
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies
make install
# or
poetry install
```

#### Using pip

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Key variables to configure:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret key for JWT tokens (generate a secure random string)
- `OPENAI_API_KEY`: Your OpenAI API key (if using AI features)
- `STRIPE_API_KEY`: Your Stripe API key (if using billing features)

### 3. Set Up PostgreSQL

```bash
# Create database
createdb codecollab

# Or using psql
psql -U postgres
CREATE DATABASE codecollab;
CREATE USER codecollab WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE codecollab TO codecollab;
\q
```

### 4. Run Database Migrations

```bash
# Run migrations
make migrate
# or
poetry run alembic upgrade head
```

### 5. Start the Service

```bash
# Development mode with auto-reload
make dev
# or
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Development Workflow

### Running Tests

```bash
# Run all tests
make test

# Run with coverage
make test-cov

# Run specific test types
make test-unit          # Unit tests only
make test-property      # Property-based tests only
make test-integration   # Integration tests only
```

### Code Quality

```bash
# Run linters
make lint

# Format code
make format

# Clean up generated files
make clean
```

### Database Migrations

```bash
# Create new migration
make migrate-create

# Apply migrations
make migrate

# Rollback last migration
make migrate-rollback
```

### Accessing Services

```bash
# PostgreSQL shell
make db-shell

# Redis CLI
make redis-cli

# Python shell with app context
make shell
```

## Project Structure

```
business-logic-service/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration
│   ├── database.py          # Database setup
│   ├── dependencies.py      # FastAPI dependencies
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── collaborator.py
│   │   ├── document.py
│   │   ├── operation.py
│   │   ├── chat_message.py
│   │   ├── subscription.py
│   │   ├── usage_metric.py
│   │   └── audit_log.py
│   ├── schemas/             # Pydantic schemas (TODO)
│   ├── services/            # Business logic (TODO)
│   ├── api/                 # API routes (TODO)
│   │   └── v1/
│   ├── middleware/          # Custom middleware (TODO)
│   └── utils/               # Utilities (TODO)
├── tests/
│   ├── conftest.py          # Pytest fixtures
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── property/            # Property-based tests
├── alembic/                 # Database migrations
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
├── pyproject.toml           # Poetry dependencies
├── Dockerfile               # Container image
├── docker-compose.yml       # Local development stack
├── Makefile                 # Common tasks
└── README.md                # Documentation
```

## Next Steps

After completing the setup, you can:

1. **Implement Authentication Service** (Task 2.1)
   - Create `app/services/auth_service.py`
   - Implement JWT token generation and validation
   - Add password hashing with bcrypt

2. **Create API Endpoints** (Task 2.3)
   - Create `app/api/v1/auth.py`
   - Implement login, register, refresh, logout endpoints

3. **Add Tests** (Task 2.2, 2.4)
   - Create property-based tests in `tests/property/`
   - Create unit tests in `tests/unit/`

4. **Implement Other Services**
   - User management (Task 3.1-3.5)
   - Project management (Task 8.1-8.8)
   - AI features (Task 13.1-13.9)
   - Search (Task 14.1-14.7)
   - Billing (Task 15.1-15.7)

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check connection string in .env
echo $DATABASE_URL
```

### Redis Connection Issues

```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Migration Issues

```bash
# Reset database (WARNING: destroys all data)
poetry run alembic downgrade base
poetry run alembic upgrade head
```

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Poetry Documentation](https://python-poetry.org/docs/)
- [Hypothesis Documentation](https://hypothesis.readthedocs.io/)

## Support

For issues or questions, please refer to the main project documentation or contact the development team.
