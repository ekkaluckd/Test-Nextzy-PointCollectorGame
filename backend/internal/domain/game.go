// Package domain holds the game rules. It has no knowledge of HTTP or the database.
package domain

import "errors"

const MaxScore = 10000

// ScoreOptions are the values a single play can award.
var ScoreOptions = []int{300, 500, 1000, 3000}

type Checkpoint struct {
	Score      int
	RewardName string
}

var Checkpoints = []Checkpoint{
	{Score: 5000, RewardName: "A"},
	{Score: 7500, RewardName: "B"},
	{Score: 10000, RewardName: "C"},
}

var (
	ErrScoreFull         = errors.New("score is already at maximum")
	ErrCheckpointUnknown = errors.New("checkpoint not found")
	ErrCheckpointLocked  = errors.New("checkpoint not reached yet")
	ErrAlreadyClaimed    = errors.New("reward already claimed")
	ErrInvalidPlayerID   = errors.New("invalid player id")
)

func FindCheckpoint(score int) (Checkpoint, error) {
	for _, cp := range Checkpoints {
		if cp.Score == score {
			return cp, nil
		}
	}
	return Checkpoint{}, ErrCheckpointUnknown
}
