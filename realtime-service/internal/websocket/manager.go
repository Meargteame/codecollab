package websocket

import (
	"log"
	"net/http"

	"codecollab/realtime-service/config"

	"github.com/gorilla/websocket"
)

// Manager handles WebSocket connections
type Manager struct {
	config   *config.Config
	upgrader websocket.Upgrader
}

// NewManager creates a new WebSocket manager
func NewManager(cfg *config.Config) *Manager {
	return &Manager{
		config: cfg,
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				// TODO: Implement proper origin checking
				return true
			},
		},
	}
}

// HandleConnection handles incoming WebSocket connection requests
func (m *Manager) HandleConnection(w http.ResponseWriter, r *http.Request) {
	// TODO: Validate JWT token from query parameter or header

	conn, err := m.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade connection: %v", err)
		return
	}

	log.Println("New WebSocket connection established")

	// TODO: Create connection object and handle messages
	defer conn.Close()
}
