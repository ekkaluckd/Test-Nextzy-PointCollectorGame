// Package application contains the use cases of the game.
package application

import (
	"context"
	"math/rand/v2"
	"time"

	"github.com/google/uuid"

	"github.com/ctrlaltname/nextzy/backend/internal/domain"
)

type Summary struct {
	TotalScore  int
	MaxScore    int
	Checkpoints []domain.CheckpointState
}

type PlayResult struct {
	Score      int
	TotalScore int
}

type GameService struct {
	repo Repository
	// pick returns a random index in [0, n); injectable for tests.
	pick func(n int) int
	now  func() time.Time
}

func NewGameService(repo Repository) *GameService {
	return &GameService{repo: repo, pick: rand.IntN, now: time.Now}
}

func (s *GameService) GetSummary(ctx context.Context, playerID string) (Summary, error) {
	player, err := s.repo.GetOrCreatePlayer(ctx, playerID)
	if err != nil {
		return Summary{}, err
	}
	claimed, err := s.claimedCheckpoints(ctx, s.repo, playerID)
	if err != nil {
		return Summary{}, err
	}
	return Summary{
		TotalScore:  player.TotalScore,
		MaxScore:    domain.MaxScore,
		Checkpoints: player.CheckpointStates(claimed),
	}, nil
}

func (s *GameService) ListPlays(ctx context.Context, playerID string) ([]domain.Play, error) {
	return s.repo.ListPlays(ctx, playerID)
}

func (s *GameService) ListRewards(ctx context.Context, playerID string) ([]domain.RewardClaim, error) {
	return s.repo.ListRewardClaims(ctx, playerID)
}

// Play draws a random score on the server and adds it to the player's total.
func (s *GameService) Play(ctx context.Context, playerID string) (PlayResult, error) {
	var result PlayResult
	err := s.repo.Transaction(ctx, func(tx Repository) error {
		player, err := tx.GetOrCreatePlayer(ctx, playerID)
		if err != nil {
			return err
		}

		score := domain.ScoreOptions[s.pick(len(domain.ScoreOptions))]
		if err := player.AddScore(score); err != nil {
			return err
		}
		if err := tx.SavePlayer(ctx, player); err != nil {
			return err
		}

		play := &domain.Play{ID: uuid.NewString(), PlayerID: playerID, Score: score, PlayedAt: s.now()}
		if err := tx.CreatePlay(ctx, play); err != nil {
			return err
		}
		result = PlayResult{Score: score, TotalScore: player.TotalScore}
		return nil
	})
	return result, err
}

func (s *GameService) ClaimReward(ctx context.Context, playerID string, checkpointScore int) (domain.RewardClaim, error) {
	checkpoint, err := domain.FindCheckpoint(checkpointScore)
	if err != nil {
		return domain.RewardClaim{}, err
	}

	var claim domain.RewardClaim
	err = s.repo.Transaction(ctx, func(tx Repository) error {
		player, err := tx.GetOrCreatePlayer(ctx, playerID)
		if err != nil {
			return err
		}
		claimed, err := s.claimedCheckpoints(ctx, tx, playerID)
		if err != nil {
			return err
		}
		if err := player.EnsureCanClaim(checkpoint, claimed); err != nil {
			return err
		}

		claim = domain.RewardClaim{
			ID:              uuid.NewString(),
			PlayerID:        playerID,
			CheckpointScore: checkpoint.Score,
			RewardName:      checkpoint.RewardName,
			ClaimedAt:       s.now(),
		}
		return tx.CreateRewardClaim(ctx, &claim)
	})
	return claim, err
}

func (s *GameService) Reset(ctx context.Context, playerID string) error {
	return s.repo.ResetPlayer(ctx, playerID)
}

func (s *GameService) claimedCheckpoints(ctx context.Context, repo Repository, playerID string) (map[int]bool, error) {
	claims, err := repo.ListRewardClaims(ctx, playerID)
	if err != nil {
		return nil, err
	}
	claimed := make(map[int]bool, len(claims))
	for _, c := range claims {
		claimed[c.CheckpointScore] = true
	}
	return claimed, nil
}
