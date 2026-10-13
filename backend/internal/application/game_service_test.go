package application

import (
	"context"
	"errors"
	"testing"

	"github.com/ctrlaltname/nextzy/backend/internal/domain"
)

// memoryRepo is an in-memory Repository for testing use cases without a database.
type memoryRepo struct {
	players map[string]*domain.Player
	plays   []domain.Play
	claims  []domain.RewardClaim
}

func newMemoryRepo() *memoryRepo { return &memoryRepo{players: map[string]*domain.Player{}} }

func (r *memoryRepo) Transaction(_ context.Context, fn func(Repository) error) error { return fn(r) }

func (r *memoryRepo) GetOrCreatePlayer(_ context.Context, id string) (*domain.Player, error) {
	if _, ok := r.players[id]; !ok {
		r.players[id] = &domain.Player{ID: id}
	}
	p := *r.players[id]
	return &p, nil
}

func (r *memoryRepo) SavePlayer(_ context.Context, p *domain.Player) error {
	r.players[p.ID] = p
	return nil
}

func (r *memoryRepo) CreatePlay(_ context.Context, p *domain.Play) error {
	r.plays = append(r.plays, *p)
	return nil
}

func (r *memoryRepo) ListPlays(context.Context, string) ([]domain.Play, error) { return r.plays, nil }

func (r *memoryRepo) CreateRewardClaim(_ context.Context, c *domain.RewardClaim) error {
	r.claims = append(r.claims, *c)
	return nil
}

func (r *memoryRepo) ListRewardClaims(context.Context, string) ([]domain.RewardClaim, error) {
	return r.claims, nil
}

func (r *memoryRepo) ResetPlayer(_ context.Context, id string) error {
	r.players[id] = &domain.Player{ID: id}
	r.plays, r.claims = nil, nil
	return nil
}

const playerID = "p1"

// newService returns a service whose draws always award 3000 points.
func newService() (*GameService, *memoryRepo) {
	repo := newMemoryRepo()
	svc := NewGameService(repo)
	svc.pick = func(int) int { return len(domain.ScoreOptions) - 1 }
	return svc, repo
}

func TestPlayAddsScoreAndHistory(t *testing.T) {
	svc, repo := newService()
	ctx := context.Background()

	res, err := svc.Play(ctx, playerID)
	if err != nil || res.Score != 3000 || res.TotalScore != 3000 {
		t.Fatalf("got %+v, %v", res, err)
	}
	if len(repo.plays) != 1 {
		t.Fatalf("want 1 play recorded, got %d", len(repo.plays))
	}
}

func TestPlayStopsAtMaxScore(t *testing.T) {
	svc, _ := newService()
	ctx := context.Background()

	for range 4 { // 3000 x 4 = 12000, capped at 10000
		if _, err := svc.Play(ctx, playerID); err != nil {
			t.Fatal(err)
		}
	}
	if _, err := svc.Play(ctx, playerID); !errors.Is(err, domain.ErrScoreFull) {
		t.Fatalf("want ErrScoreFull, got %v", err)
	}
}

func TestClaimReward(t *testing.T) {
	svc, _ := newService()
	ctx := context.Background()

	if _, err := svc.ClaimReward(ctx, playerID, 5000); !errors.Is(err, domain.ErrCheckpointLocked) {
		t.Fatalf("want ErrCheckpointLocked before reaching score, got %v", err)
	}

	svc.Play(ctx, playerID)
	svc.Play(ctx, playerID) // 6000

	claim, err := svc.ClaimReward(ctx, playerID, 5000)
	if err != nil || claim.RewardName != "A" {
		t.Fatalf("got %+v, %v", claim, err)
	}
	if _, err := svc.ClaimReward(ctx, playerID, 5000); !errors.Is(err, domain.ErrAlreadyClaimed) {
		t.Fatalf("want ErrAlreadyClaimed on second claim, got %v", err)
	}
	if _, err := svc.ClaimReward(ctx, playerID, 1234); !errors.Is(err, domain.ErrCheckpointUnknown) {
		t.Fatalf("want ErrCheckpointUnknown, got %v", err)
	}
}

func TestResetClearsProgress(t *testing.T) {
	svc, _ := newService()
	ctx := context.Background()

	svc.Play(ctx, playerID)
	if err := svc.Reset(ctx, playerID); err != nil {
		t.Fatal(err)
	}
	summary, _ := svc.GetSummary(ctx, playerID)
	if summary.TotalScore != 0 {
		t.Fatalf("want 0 after reset, got %d", summary.TotalScore)
	}
}
