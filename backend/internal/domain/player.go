package domain

import "time"

// Player is the aggregate root: all score changes go through its methods.
type Player struct {
	ID         string
	TotalScore int
}

// AddScore adds points from a play, capped at MaxScore.
func (p *Player) AddScore(points int) error {
	if p.TotalScore >= MaxScore {
		return ErrScoreFull
	}
	p.TotalScore = min(p.TotalScore+points, MaxScore)
	return nil
}

// EnsureCanClaim checks the checkpoint is reached and not yet claimed.
func (p *Player) EnsureCanClaim(cp Checkpoint, claimed map[int]bool) error {
	if claimed[cp.Score] {
		return ErrAlreadyClaimed
	}
	if p.TotalScore < cp.Score {
		return ErrCheckpointLocked
	}
	return nil
}

type CheckpointStatus string

const (
	StatusLocked    CheckpointStatus = "LOCKED"
	StatusClaimable CheckpointStatus = "CLAIMABLE"
	StatusClaimed   CheckpointStatus = "CLAIMED"
)

type CheckpointState struct {
	Checkpoint
	Status CheckpointStatus
}

// CheckpointStates reports every checkpoint's status for this player.
func (p *Player) CheckpointStates(claimed map[int]bool) []CheckpointState {
	states := make([]CheckpointState, len(Checkpoints))
	for i, cp := range Checkpoints {
		status := StatusLocked
		switch {
		case claimed[cp.Score]:
			status = StatusClaimed
		case p.TotalScore >= cp.Score:
			status = StatusClaimable
		}
		states[i] = CheckpointState{Checkpoint: cp, Status: status}
	}
	return states
}

type Play struct {
	ID       string
	PlayerID string
	Score    int
	PlayedAt time.Time
}

type RewardClaim struct {
	ID              string
	PlayerID        string
	CheckpointScore int
	RewardName      string
	ClaimedAt       time.Time
}
