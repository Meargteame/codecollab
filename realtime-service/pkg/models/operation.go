package models

import "time"

// Operation represents an operational transform operation
type Operation struct {
	Type     string `json:"type"` // "insert", "delete", "retain"
	Position int    `json:"position"`
	Text     string `json:"text,omitempty"`
	UserID   string `json:"userId"`
	Version  int64  `json:"version"`
}

// Document represents a collaborative document
type Document struct {
	ID        string
	ProjectID string
	FilePath  string
	Content   string
	Version   int64
	History   []Operation
	UpdatedAt time.Time
}
