package config

import (
	"fmt"
	"os"
	"strconv"
)

// Config holds all configuration for the Real-Time Service
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
	Storage  StorageConfig
	Security SecurityConfig
}

// ServerConfig holds server-specific configuration
type ServerConfig struct {
	Address string
	Port    int
}

// DatabaseConfig holds PostgreSQL configuration
type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Database string
	SSLMode  string
}

// RedisConfig holds Redis configuration
type RedisConfig struct {
	Host     string
	Port     int
	Password string
	DB       int
}

// StorageConfig holds file storage configuration
type StorageConfig struct {
	Type       string // "local" or "s3"
	LocalPath  string
	S3Bucket   string
	S3Region   string
	S3Endpoint string
}

// SecurityConfig holds security-related configuration
type SecurityConfig struct {
	JWTSecret string
}

// Load reads configuration from environment variables
func Load() (*Config, error) {
	cfg := &Config{
		Server: ServerConfig{
			Address: getEnv("SERVER_ADDRESS", ":8080"),
			Port:    getEnvAsInt("SERVER_PORT", 8080),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnvAsInt("DB_PORT", 5432),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", ""),
			Database: getEnv("DB_NAME", "codecollab"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnvAsInt("REDIS_PORT", 6379),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       getEnvAsInt("REDIS_DB", 0),
		},
		Storage: StorageConfig{
			Type:       getEnv("STORAGE_TYPE", "local"),
			LocalPath:  getEnv("STORAGE_LOCAL_PATH", "./workspaces"),
			S3Bucket:   getEnv("STORAGE_S3_BUCKET", ""),
			S3Region:   getEnv("STORAGE_S3_REGION", "us-east-1"),
			S3Endpoint: getEnv("STORAGE_S3_ENDPOINT", ""),
		},
		Security: SecurityConfig{
			JWTSecret: getEnv("JWT_SECRET", ""),
		},
	}

	// Validate required fields
	if cfg.Security.JWTSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET is required")
	}

	return cfg, nil
}

// ConnectionString returns the PostgreSQL connection string
func (c *DatabaseConfig) ConnectionString() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.Database, c.SSLMode,
	)
}

// getEnv reads an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvAsInt reads an environment variable as integer or returns a default value
func getEnvAsInt(key string, defaultValue int) int {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return defaultValue
	}
	return value
}
