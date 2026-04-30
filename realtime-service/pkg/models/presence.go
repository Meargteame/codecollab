package models

import "time"

// UserPresence represents a user's presence information
type UserPresence struct {
	UserID      string         `json:"userId"`
	WorkspaceID string         `json:"workspaceId"`
	Status      string         `json:"status"` // "active", "idle", "away"
	CurrentFile string         `json:"currentFile"`
	Cursor      CursorPosition `json:"cursor"`
	Selection   SelectionRange `json:"selection"`
	LastActive  time.Time      `json:"lastActive"`
}

// CursorPosition represents a cursor position in a document
type CursorPosition struct {
	Line   int `json:"line"`
	Column int `json:"column"`
}

// SelectionRange represents a text selection range
type SelectionRange struct {
	Start CursorPosition `json:"start"`
	End   CursorPosition `json:"end"`
}
