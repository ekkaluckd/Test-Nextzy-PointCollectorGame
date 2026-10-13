package application

import (
	"context"

	"github.com/ctrlaltname/nextzy/backend/internal/domain"
)

// Repository is the persistence port. Infrastructure implements it; use cases depend only on it.
type Repository interface {
	// Transaction runs fn atomically with a repository bound to the transaction.
	Transaction(ctx context.Context, fn func(tx Repository) error) error

	// GetOrCreatePlayer loads the player (row-locked inside a transaction), creating it on first visit.
	GetOrCreatePlayer(ctx context.Context, id string) (*domain.Player, error)
	SavePlayer(ctx context.Context, p *domain.Player) error

	CreatePlay(ctx context.Context, play *domain.Play) error
	ListPlays(ctx context.Context, playerID string) ([]domain.Play, error)

	// CreateRewardClaim returns domain.ErrAlreadyClaimed if the checkpoint was claimed before.
	CreateRewardClaim(ctx context.Context, claim *domain.RewardClaim) error
	ListRewardClaims(ctx context.Context, playerID string) ([]domain.RewardClaim, error)

	ResetPlayer(ctx context.Context, playerID string) error
}
