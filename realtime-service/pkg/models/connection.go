package models

import (
	"time"

	"github.com/gorilla/websocket"
)

// Connection represents a WebSocket connection
type Connection struct {
	ID          string
	UserID      string
	WorkspaceID string
	Conn        *websocket.Conn
	Send        chan []byte
	CreatedAt   time.Time
}

// Message represents a WebSocket message
type Message struct {
	Type      string                 `json:"type"`
	Payload   map[string]interface{} `json:"payload"`
	Timestamp time.Time              `json:"timestamp"`
	MessageID string                 `json:"messageId"`
}
