package http

import (
	"time"

	"github.com/ctrlaltname/nextzy/backend/internal/application"
	"github.com/ctrlaltname/nextzy/backend/internal/domain"
)

// JSON shapes returned by the API (mirrors frontend/src/types/game.ts).

type checkpointResponse struct {
	Score      int    `json:"score"`
	RewardName string `json:"rewardName"`
	Status     string `json:"status"`
}

type summaryResponse struct {
	TotalScore  int                  `json:"totalScore"`
	MaxScore    int                  `json:"maxScore"`
	Checkpoints []checkpointResponse `json:"checkpoints"`
}

type playResponse struct {
	ID       string    `json:"id"`
	Score    int       `json:"score"`
	PlayedAt time.Time `json:"playedAt"`
}

type rewardResponse struct {
	ID              string    `json:"id"`
	CheckpointScore int       `json:"checkpointScore"`
	RewardName      string    `json:"rewardName"`
	ClaimedAt       time.Time `json:"claimedAt"`
}

type playResultResponse struct {
	Score      int `json:"score"`
	TotalScore int `json:"totalScore"`
}

type errorResponse struct {
	Message string `json:"message"`
}

func toSummaryResponse(s application.Summary) summaryResponse {
	checkpoints := make([]checkpointResponse, len(s.Checkpoints))
	for i, cp := range s.Checkpoints {
		checkpoints[i] = checkpointResponse{Score: cp.Score, RewardName: cp.RewardName, Status: string(cp.Status)}
	}
	return summaryResponse{TotalScore: s.TotalScore, MaxScore: s.MaxScore, Checkpoints: checkpoints}
}

func toPlayResponse(p domain.Play) playResponse {
	return playResponse{ID: p.ID, Score: p.Score, PlayedAt: p.PlayedAt}
}

func toRewardResponse(c domain.RewardClaim) rewardResponse {
	return rewardResponse{
		ID:              c.ID,
		CheckpointScore: c.CheckpointScore,
		RewardName:      c.RewardName,
		ClaimedAt:       c.ClaimedAt,
	}
}
