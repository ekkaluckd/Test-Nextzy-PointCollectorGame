// Package http exposes the game use cases as a JSON API.
package http

import (
	"net/http"
	"strconv"

	"github.com/ctrlaltname/nextzy/backend/docs"
	"github.com/ctrlaltname/nextzy/backend/internal/application"
	"github.com/ctrlaltname/nextzy/backend/internal/domain"
	"github.com/ctrlaltname/nextzy/backend/internal/shared"
)

type Handler struct {
	game *application.GameService
}

func NewRouter(game *application.GameService, allowedOrigins []string) http.Handler {
	h := &Handler{game: game}
	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/players/me/summary", withPlayerID(h.getSummary))
	mux.HandleFunc("GET /api/players/me/plays", withPlayerID(h.listPlays))
	mux.HandleFunc("GET /api/players/me/rewards", withPlayerID(h.listRewards))
	mux.HandleFunc("POST /api/players/me/reset", withPlayerID(h.reset))
	mux.HandleFunc("POST /api/game/play", withPlayerID(h.play))
	mux.HandleFunc("POST /api/rewards/{score}/claim", withPlayerID(h.claimReward))

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
	mux.Handle("GET /docs/", http.StripPrefix("/docs", docs.Handler()))
	mux.Handle("GET /{$}", http.RedirectHandler("/docs/", http.StatusFound))

	return recoverAndLog(cors(allowedOrigins, mux))
}

func (h *Handler) getSummary(w http.ResponseWriter, r *http.Request) {
	summary, err := h.game.GetSummary(r.Context(), playerIDFrom(r))
	if err != nil {
		writeError(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, toSummaryResponse(summary))
}

func (h *Handler) listPlays(w http.ResponseWriter, r *http.Request) {
	plays, err := h.game.ListPlays(r.Context(), playerIDFrom(r))
	if err != nil {
		writeError(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, shared.Map(plays, toPlayResponse))
}

func (h *Handler) listRewards(w http.ResponseWriter, r *http.Request) {
	rewards, err := h.game.ListRewards(r.Context(), playerIDFrom(r))
	if err != nil {
		writeError(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, shared.Map(rewards, toRewardResponse))
}

func (h *Handler) play(w http.ResponseWriter, r *http.Request) {
	result, err := h.game.Play(r.Context(), playerIDFrom(r))
	if err != nil {
		writeError(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, playResultResponse{Score: result.Score, TotalScore: result.TotalScore})
}

func (h *Handler) claimReward(w http.ResponseWriter, r *http.Request) {
	score, err := strconv.Atoi(r.PathValue("score"))
	if err != nil {
		writeError(w, r, domain.ErrCheckpointUnknown)
		return
	}
	claim, err := h.game.ClaimReward(r.Context(), playerIDFrom(r), score)
	if err != nil {
		writeError(w, r, err)
		return
	}
	writeJSON(w, http.StatusCreated, toRewardResponse(claim))
}

func (h *Handler) reset(w http.ResponseWriter, r *http.Request) {
	if err := h.game.Reset(r.Context(), playerIDFrom(r)); err != nil {
		writeError(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
