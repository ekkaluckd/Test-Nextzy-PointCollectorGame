package domain

import (
	"errors"
	"testing"
)

func TestAddScore(t *testing.T) {
	tests := []struct {
		name    string
		start   int
		points  int
		want    int
		wantErr error
	}{
		{"adds points", 0, 500, 500, nil},
		{"caps at max", 9800, 3000, MaxScore, nil},
		{"rejects when full", MaxScore, 300, MaxScore, ErrScoreFull},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := Player{TotalScore: tt.start}
			err := p.AddScore(tt.points)
			if !errors.Is(err, tt.wantErr) || p.TotalScore != tt.want {
				t.Fatalf("got (%d, %v), want (%d, %v)", p.TotalScore, err, tt.want, tt.wantErr)
			}
		})
	}
}

func TestEnsureCanClaim(t *testing.T) {
	cp := Checkpoints[0] // 5000
	tests := []struct {
		name    string
		score   int
		claimed map[int]bool
		wantErr error
	}{
		{"reached and unclaimed", 5000, nil, nil},
		{"not reached", 4999, nil, ErrCheckpointLocked},
		{"already claimed", 8000, map[int]bool{5000: true}, ErrAlreadyClaimed},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := Player{TotalScore: tt.score}
			if err := p.EnsureCanClaim(cp, tt.claimed); !errors.Is(err, tt.wantErr) {
				t.Fatalf("got %v, want %v", err, tt.wantErr)
			}
		})
	}
}

func TestCheckpointStates(t *testing.T) {
	p := Player{TotalScore: 8000}
	states := p.CheckpointStates(map[int]bool{5000: true})
	want := []CheckpointStatus{StatusClaimed, StatusClaimable, StatusLocked}
	for i, s := range states {
		if s.Status != want[i] {
			t.Errorf("checkpoint %d: got %s, want %s", s.Score, s.Status, want[i])
		}
	}
}
