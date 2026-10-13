package postgres

import (
	"time"

	"github.com/ctrlaltname/nextzy/backend/internal/domain"
)

// Database models are kept separate from domain types so schema details don't leak into the domain.

type playerModel struct {
	ID         string `gorm:"type:uuid;primaryKey"`
	TotalScore int    `gorm:"not null;default:0;check:total_score BETWEEN 0 AND 10000"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

func (playerModel) TableName() string { return "players" }

type playModel struct {
	ID       string    `gorm:"type:uuid;primaryKey"`
	PlayerID string    `gorm:"type:uuid;not null;index:idx_plays_player_time,priority:1"`
	Score    int       `gorm:"not null"`
	PlayedAt time.Time `gorm:"not null;index:idx_plays_player_time,priority:2,sort:desc"`
}

func (playModel) TableName() string { return "play_histories" }

type rewardClaimModel struct {
	ID              string    `gorm:"type:uuid;primaryKey"`
	PlayerID        string    `gorm:"type:uuid;not null;uniqueIndex:uq_player_checkpoint"`
	CheckpointScore int       `gorm:"not null;uniqueIndex:uq_player_checkpoint"`
	RewardName      string    `gorm:"not null"`
	ClaimedAt       time.Time `gorm:"not null"`
}

func (rewardClaimModel) TableName() string { return "reward_claims" }

func (m playModel) toDomain() domain.Play {
	return domain.Play{ID: m.ID, PlayerID: m.PlayerID, Score: m.Score, PlayedAt: m.PlayedAt}
}

func (m rewardClaimModel) toDomain() domain.RewardClaim {
	return domain.RewardClaim{
		ID:              m.ID,
		PlayerID:        m.PlayerID,
		CheckpointScore: m.CheckpointScore,
		RewardName:      m.RewardName,
		ClaimedAt:       m.ClaimedAt,
	}
}
