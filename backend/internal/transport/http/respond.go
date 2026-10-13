package http

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	"github.com/ctrlaltname/nextzy/backend/internal/domain"
)

// domainErrors maps business errors to HTTP status codes and user-facing (Thai) messages.
var domainErrors = []struct {
	err     error
	status  int
	message string
}{
	{domain.ErrInvalidPlayerID, http.StatusBadRequest, "ไม่พบรหัสผู้เล่น"},
	{domain.ErrCheckpointUnknown, http.StatusNotFound, "ไม่พบรางวัลนี้"},
	{domain.ErrScoreFull, http.StatusConflict, "คะแนนสะสมเต็มแล้ว"},
	{domain.ErrCheckpointLocked, http.StatusConflict, "คะแนนยังไม่ถึงเกณฑ์รับรางวัลนี้"},
	{domain.ErrAlreadyClaimed, http.StatusConflict, "รับรางวัลนี้ไปแล้ว"},
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(body); err != nil {
		slog.Error("encode response", "err", err)
	}
}

func writeError(w http.ResponseWriter, r *http.Request, err error) {
	for _, de := range domainErrors {
		if errors.Is(err, de.err) {
			writeJSON(w, de.status, errorResponse{Message: de.message})
			return
		}
	}
	slog.Error("unhandled error", "method", r.Method, "path", r.URL.Path, "err", err)
	writeJSON(w, http.StatusInternalServerError, errorResponse{Message: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่"})
}
