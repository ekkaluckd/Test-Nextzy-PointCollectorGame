package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/joho/godotenv"

	"github.com/ctrlaltname/nextzy/backend/internal/application"
	"github.com/ctrlaltname/nextzy/backend/internal/infrastructure/postgres"
	transport "github.com/ctrlaltname/nextzy/backend/internal/transport/http"
)

func main() {
	if err := run(); err != nil {
		slog.Error("server stopped", "err", err)
		os.Exit(1)
	}
}

func run() error {
	_ = godotenv.Load() // optional .env for local development; real env vars take precedence

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return errors.New("DATABASE_URL is required")
	}

	repo, err := postgres.Open(dsn)
	if err != nil {
		return err
	}

	// Wire the layers: infrastructure -> application -> transport.
	game := application.NewGameService(repo)
	router := transport.NewRouter(game, parseOrigins(getEnv("CORS_ORIGINS", "http://localhost:3000")))

	srv := &http.Server{
		Addr:              ":" + getEnv("PORT", "8080"),
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		srv.Shutdown(shutdownCtx)
	}()

	slog.Info("listening", "addr", srv.Addr)
	if err := srv.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
		return err
	}
	return nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// parseOrigins splits a comma separated list, tolerating spaces and trailing slashes.
func parseOrigins(raw string) []string {
	var origins []string
	for _, o := range strings.Split(raw, ",") {
		if o = strings.TrimRight(strings.TrimSpace(o), "/"); o != "" {
			origins = append(origins, o)
		}
	}
	return origins
}
