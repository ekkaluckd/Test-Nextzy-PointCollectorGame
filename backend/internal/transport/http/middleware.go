package http

import (
	"context"
	"log/slog"
	"net/http"
	"slices"
	"time"

	"github.com/google/uuid"

	"github.com/ctrlaltname/nextzy/backend/internal/domain"
)

type ctxKey struct{}

// withPlayerID reads the anonymous player id from the X-Player-Id header.
func withPlayerID(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := uuid.Parse(r.Header.Get("X-Player-Id"))
		if err != nil {
			writeError(w, r, domain.ErrInvalidPlayerID)
			return
		}
		next(w, r.WithContext(context.WithValue(r.Context(), ctxKey{}, id.String())))
	}
}

func playerIDFrom(r *http.Request) string {
	return r.Context().Value(ctxKey{}).(string)
}

func cors(allowedOrigins []string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if slices.Contains(allowedOrigins, "*") || slices.Contains(allowedOrigins, origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Player-Id")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// recoverAndLog turns panics into 500 responses and logs every request.
func recoverAndLog(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		defer func() {
			if rec := recover(); rec != nil {
				slog.Error("panic", "path", r.URL.Path, "recover", rec)
				writeJSON(w, http.StatusInternalServerError, errorResponse{Message: "เกิดข้อผิดพลาดในระบบ"})
			}
			slog.Info("request", "method", r.Method, "path", r.URL.Path, "duration", time.Since(start))
		}()
		next.ServeHTTP(w, r)
	})
}
