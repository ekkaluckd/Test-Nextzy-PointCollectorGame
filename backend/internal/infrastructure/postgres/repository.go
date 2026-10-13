// Package postgres implements application.Repository with Gorm and PostgreSQL.
package postgres

import (
	"context"
	"errors"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"gorm.io/gorm/logger"

	"github.com/ctrlaltname/nextzy/backend/internal/application"
	"github.com/ctrlaltname/nextzy/backend/internal/domain"
	"github.com/ctrlaltname/nextzy/backend/internal/shared"
)

type Repository struct {
	db *gorm.DB
}

var _ application.Repository = (*Repository)(nil)

// Open connects to PostgreSQL and migrates the schema.
func Open(dsn string) (*Repository, error) {
	db, err := gorm.Open(
		// Simple protocol keeps it compatible with connection poolers such as Supabase's.
		postgres.New(postgres.Config{DSN: dsn, PreferSimpleProtocol: true}),
		&gorm.Config{TranslateError: true, Logger: logger.Default.LogMode(logger.Warn)},
	)
	if err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&playerModel{}, &playModel{}, &rewardClaimModel{}); err != nil {
		return nil, err
	}
	return &Repository{db: db}, nil
}

func (r *Repository) Transaction(ctx context.Context, fn func(tx application.Repository) error) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		return fn(&Repository{db: tx})
	})
}

func (r *Repository) GetOrCreatePlayer(ctx context.Context, id string) (*domain.Player, error) {
	db := r.db.WithContext(ctx)
	if err := db.Clauses(clause.OnConflict{DoNothing: true}).Create(&playerModel{ID: id}).Error; err != nil {
		return nil, err
	}

	var m playerModel
	// FOR UPDATE serialises concurrent plays/claims for the same player inside a transaction.
	if err := db.Clauses(clause.Locking{Strength: "UPDATE"}).First(&m, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &domain.Player{ID: m.ID, TotalScore: m.TotalScore}, nil
}

func (r *Repository) SavePlayer(ctx context.Context, p *domain.Player) error {
	return r.db.WithContext(ctx).Model(&playerModel{ID: p.ID}).Update("total_score", p.TotalScore).Error
}

func (r *Repository) CreatePlay(ctx context.Context, p *domain.Play) error {
	return r.db.WithContext(ctx).Create(&playModel{
		ID: p.ID, PlayerID: p.PlayerID, Score: p.Score, PlayedAt: p.PlayedAt,
	}).Error
}

func (r *Repository) ListPlays(ctx context.Context, playerID string) ([]domain.Play, error) {
	var rows []playModel
	err := r.db.WithContext(ctx).Where("player_id = ?", playerID).Order("played_at DESC").Find(&rows).Error
	return shared.Map(rows, playModel.toDomain), err
}

func (r *Repository) CreateRewardClaim(ctx context.Context, c *domain.RewardClaim) error {
	err := r.db.WithContext(ctx).Create(&rewardClaimModel{
		ID:              c.ID,
		PlayerID:        c.PlayerID,
		CheckpointScore: c.CheckpointScore,
		RewardName:      c.RewardName,
		ClaimedAt:       c.ClaimedAt,
	}).Error
	if errors.Is(err, gorm.ErrDuplicatedKey) {
		return domain.ErrAlreadyClaimed
	}
	return err
}

func (r *Repository) ListRewardClaims(ctx context.Context, playerID string) ([]domain.RewardClaim, error) {
	var rows []rewardClaimModel
	err := r.db.WithContext(ctx).Where("player_id = ?", playerID).Order("claimed_at DESC").Find(&rows).Error
	return shared.Map(rows, rewardClaimModel.toDomain), err
}

func (r *Repository) ResetPlayer(ctx context.Context, playerID string) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("player_id = ?", playerID).Delete(&playModel{}).Error; err != nil {
			return err
		}
		if err := tx.Where("player_id = ?", playerID).Delete(&rewardClaimModel{}).Error; err != nil {
			return err
		}
		return tx.Model(&playerModel{ID: playerID}).Update("total_score", 0).Error
	})
}
