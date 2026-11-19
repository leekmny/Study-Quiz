package port

import (
	"reflect"
	"testing"
)

func TestDailyPoolMatchesOriginalShuffle(t *testing.T) {
	request := Request{Mode: "daily", Date: "2026-11-18", Difficulty: "hard", Length: 1}
	pool, err := makePool(request, func() float64 { return 0 })
	if err != nil {
		t.Fatal(err)
	}
	expectedIDs := []int{51, 46, 34, 43, 93, 11, 42, 14, 15, 9}
	expectedOrders := [][4]int{
		{2, 3, 0, 1}, {2, 1, 3, 0}, {3, 1, 0, 2}, {1, 3, 0, 2},
		{0, 3, 2, 1}, {0, 3, 1, 2}, {2, 0, 3, 1}, {0, 1, 3, 2},
		{3, 0, 2, 1}, {2, 3, 0, 1},
	}
	expectedCorrectIndices := []int{0, 1, 1, 3, 3, 3, 3, 1, 2, 2}
	if len(pool) != len(expectedIDs) {
		t.Fatalf("got %d daily questions, want %d", len(pool), len(expectedIDs))
	}
	for i, question := range pool {
		if question.ID != expectedIDs[i] || question.OptionOrder != expectedOrders[i] ||
			question.CorrectAnswer != expectedCorrectIndices[i] {
			t.Fatalf("daily question %d: got %d, %v, %d", i, question.ID, question.OptionOrder, question.CorrectAnswer)
		}
	}
}

func TestPoolFiltersAndExplicitReview(t *testing.T) {
	zero := func() float64 { return 0 }
	pool, err := makePool(Request{Mode: "category", Category: "과학", Difficulty: "easy", Length: 3}, zero)
	if err != nil {
		t.Fatal(err)
	}
	if got := idsIn(pool); !reflect.DeepEqual(got, []int{23, 26, 29}) {
		t.Fatalf("category pool = %v", got)
	}
	pool, err = makePool(Request{Mode: "review", IDs: []int{1, 3, 2, 2}}, zero)
	if err != nil {
		t.Fatal(err)
	}
	if got := idsIn(pool); !reflect.DeepEqual(got, []int{2, 3, 1}) {
		t.Fatalf("review pool = %v", got)
	}
	pool, err = makePool(Request{Mode: "review"}, zero)
	if err != nil || len(pool) != 0 {
		t.Fatalf("empty review = %v, %v", pool, err)
	}
}

func TestSessionScoresHintsAndSpeedAtDeadline(t *testing.T) {
	zero := func() float64 { return 0 }
	state, err := start(Request{Mode: "speed", IDs: []int{1, 2}, Now: 1000}, zero)
	if err != nil {
		t.Fatal(err)
	}
	if state == nil || state.Deadline != 16000 {
		t.Fatalf("speed session = %+v", state)
	}
	first := state.Pool[0].CorrectAnswer
	transition(state, "speed", "hint", nil, 15999, zero)
	if !state.Hint || len(state.Eliminated) != 2 {
		t.Fatalf("hint = %t, eliminated = %v", state.Hint, state.Eliminated)
	}
	if transition(state, "speed", "answer", number(state.Eliminated[0]), 15999, zero) {
		t.Fatal("eliminated option accepted")
	}
	transition(state, "speed", "answer", number(first), 15999, zero)
	if transition(state, "speed", "answer", number(first), 15999, zero) || state.Score != 5 ||
		len(state.Answers) != 1 || !state.Answers[0].OK {
		t.Fatalf("first answer = %+v; score = %d", state.Answers, state.Score)
	}
	transition(state, "speed", "next", nil, 16000, zero)
	if state.Answered || state.Hint || len(state.Eliminated) != 0 || state.Deadline != 31000 {
		t.Fatalf("next question did not reset: %+v", state)
	}
	transition(state, "speed", "hint", nil, 31000, zero)
	if state.Hint || len(state.Answers) != 2 || state.Answers[1].Selected != -1 || state.Score != 5 {
		t.Fatalf("deadline should record timeout; answers = %+v", state.Answers)
	}
	transition(state, "speed", "next", nil, 31000, zero)
	if !state.Finished || transition(state, "speed", "next", nil, 31000, zero) {
		t.Fatal("completed attempt should finish once")
	}
}

func TestEnglishOptionsUseSamePermutation(t *testing.T) {
	state, err := start(Request{IDs: []int{1}}, func() float64 { return 0 })
	if err != nil || state == nil {
		t.Fatalf("start = %v, %v", state, err)
	}
	question := localizedQuestion(state.Pool[0], "en")
	if question.Options[question.CorrectAnswer] != "Yi Seong-gye" ||
		question.Question != "Who founded the Joseon dynasty?" {
		t.Fatalf("unexpected translation: %+v", question)
	}
}

func idsIn(questions []Question) []int {
	ids := make([]int, 0, len(questions))
	for _, question := range questions {
		ids = append(ids, question.ID)
	}
	return ids
}

func number(index int) *float64 {
	value := float64(index)
	return &value
}
