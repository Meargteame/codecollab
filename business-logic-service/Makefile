.PHONY: help install dev test lint format clean docker-build docker-up docker-down migrate

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies with Poetry
	poetry install

dev: ## Run development server
	poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test: ## Run all tests
	poetry run pytest tests/ -v

test-unit: ## Run unit tests only
	poetry run pytest tests/unit/ -v

test-property: ## Run property-based tests only
	poetry run pytest tests/property/ -v -m property

test-integration: ## Run integration tests only
	poetry run pytest tests/integration/ -v -m integration

test-cov: ## Run tests with coverage report
	poetry run pytest tests/ --cov=app --cov-report=html --cov-report=term

lint: ## Run linters (ruff and mypy)
	poetry run ruff check app tests
	poetry run mypy app

format: ## Format code with black and ruff
	poetry run black app tests
	poetry run ruff check --fix app tests

clean: ## Clean up generated files
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +
	rm -rf htmlcov
	rm -rf dist
	rm -rf build

docker-build: ## Build Docker image
	docker build -t codecollab-business-logic:latest .

docker-up: ## Start all services with docker-compose
	docker-compose up -d

docker-down: ## Stop all services
	docker-compose down

docker-logs: ## Show docker-compose logs
	docker-compose logs -f

migrate: ## Run database migrations
	poetry run alembic upgrade head

migrate-create: ## Create new migration
	@read -p "Enter migration message: " msg; \
	poetry run alembic revision --autogenerate -m "$$msg"

migrate-rollback: ## Rollback last migration
	poetry run alembic downgrade -1

db-shell: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U codecollab -d codecollab

redis-cli: ## Open Redis CLI
	docker-compose exec redis redis-cli

shell: ## Open Python shell with app context
	poetry run python -i -c "from app.main import app; from app.database import AsyncSessionLocal"
