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
	router := transport.NewRouter(game, strings.Split(getEnv("CORS_ORIGINS", "http://localhost:3000"), ","))

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
