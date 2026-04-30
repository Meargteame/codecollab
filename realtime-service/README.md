# CodeCollab Real-Time Service

The Real-Time Service is a Go-based backend service that handles WebSocket connections, collaborative editing with operational transforms, file system operations, terminal execution, user presence tracking, and team chat for the CodeCollab platform.

## Features

- **WebSocket Connection Management**: Handle 10,000+ concurrent connections with JWT authentication
- **Collaborative Text Editing**: Operational Transform algorithm for conflict-free concurrent editing
- **File System Operations**: CRUD operations with validation and broadcasting
- **File System Watching**: Monitor external file changes with debouncing
- **Terminal Execution**: Sandboxed shell command execution with resource limits
- **User Presence Tracking**: Real-time user status and cursor position updates
- **Team Chat**: Real-time messaging with message history

## Architecture

### Directory Structure

```
realtime-service/
├── cmd/
│   └── server/          # Main application entry point
├── internal/
│   ├── websocket/       # WebSocket connection management
│   ├── ot/              # Operational Transform engine
│   ├── filesystem/      # File system operations
│   ├── terminal/        # Terminal execution
│   ├── presence/        # User presence tracking
│   └── chat/            # Team chat messaging
├── pkg/
│   ├── models/          # Shared data models
│   └── utils/           # Utility functions
├── config/              # Configuration management
├── Dockerfile           # Container image definition
└── .env.example         # Example environment variables
```

## Getting Started

### Prerequisites

- Go 1.21 or higher
- PostgreSQL 14+
- Redis 7+
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd realtime-service
```

2. Install dependencies:
```bash
go mod download
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the service:
```bash
go run cmd/server/main.go
```

### Docker Deployment

Build the Docker image:
```bash
docker build -t codecollab-realtime-service .
```

Run the container:
```bash
docker run -p 8080:8080 --env-file .env codecollab-realtime-service
```

## Configuration

Configuration is managed through environment variables. See `.env.example` for all available options.

### Key Configuration Options

- `SERVER_ADDRESS`: Server listen address (default: `:8080`)
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `JWT_SECRET`: Secret key for JWT validation (required)
- `STORAGE_TYPE`: Storage backend (`local` or `s3`)

## API Documentation

### WebSocket Endpoint

**Connection:** `ws://localhost:8080/ws?token=<JWT>`

The service accepts JWT tokens for authentication. Once connected, clients can send and receive messages in JSON format.

### Health Check Endpoint

**Endpoint:** `GET /health`

Returns `200 OK` when the service is healthy.

## Development

### Running Tests

```bash
go test ./...
```

### Running with Hot Reload

Install air for hot reloading:
```bash
go install github.com/cosmtrek/air@latest
air
```

## Dependencies

- **gorilla/websocket**: WebSocket implementation
- **lib/pq**: PostgreSQL driver
- **redis/go-redis**: Redis client

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]
