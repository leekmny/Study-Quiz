package port

import (
	"math"
	"slices"
)

const speedLimitMS = 15_000

type Answer struct {
	Question Question `json:"q"`
	Selected int      `json:"selected"`
	OK       bool     `json:"ok"`
	Points   int      `json:"points"`
}

type State struct {
	Pool       []Question `json:"pool"`
	Index      int        `json:"index"`
	Score      int        `json:"score"`
	Answers    []Answer   `json:"answers"`
	Answered   bool       `json:"answered"`
	Hint       bool       `json:"hint"`
	Eliminated []int      `json:"eliminated"`
	Deadline   int64      `json:"deadline"`
	Finished   bool       `json:"finished"`
}

type Action struct {
	Action string   `json:"action"`
	Index  *float64 `json:"index"`
	At     *int64   `json:"at"`
	After  int64    `json:"after"`
}

type Step struct {
	State   *State `json:"state"`
	Changed bool   `json:"changed"`
}

type Trace struct {
	Pool  []Question `json:"pool"`
	Steps []Snapshot `json:"steps"`
}

type Snapshot struct {
	Changed    bool          `json:"changed"`
	Index      int           `json:"index"`
	Score      int           `json:"score"`
	Answers    []TraceAnswer `json:"answers"`
	Answered   bool          `json:"answered"`
	Hint       bool          `json:"hint"`
	Eliminated []int         `json:"eliminated"`
	Deadline   int64         `json:"deadline"`
	Finished   bool          `json:"finished"`
}

type TraceAnswer struct {
	QuestionID int  `json:"questionId"`
	Selected   int  `json:"selected"`
	OK         bool `json:"ok"`
	Points     int  `json:"points"`
}

func start(req Request, random func() float64) (*State, error) {
	pool, err := makePool(req, random)
	if err != nil || len(pool) == 0 {
		return nil, err
	}
	state := &State{Pool: pool, Answers: []Answer{}}
	reset(state, req.Mode, req.Now)
	return state, nil
}

func reset(state *State, mode string, now int64) {
	state.Answered = false
	state.Hint = false
	state.Eliminated = []int{}
	state.Deadline = 0
	if mode == "speed" {
		state.Deadline = now + speedLimitMS
	}
}

func transition(state *State, mode, action string, selected *float64, now int64, random func() float64) bool {
	if state == nil || state.Finished || state.Index < 0 || state.Index >= len(state.Pool) {
		return false
	}
	if action == "next" {
		if !state.Answered {
			return false
		}
		state.Index++
		if state.Index == len(state.Pool) {
			state.Finished = true
		} else {
			reset(state, mode, now)
		}
		return true
	}
	if state.Answered {
		return false
	}
	question := state.Pool[state.Index]
	expired := mode == "speed" && now >= state.Deadline
	switch action {
	case "hint":
		if state.Hint {
			return false
		}
		if expired {
			return grade(state, question, -1)
		}
		state.Hint = true
		wrong := make([]int, 0, 3)
		for i := range question.Options {
			if i != question.CorrectAnswer {
				wrong = append(wrong, i)
			}
		}
		shuffle(wrong, random)
		state.Eliminated = wrong[:2]
		return true
	case "tick":
		return expired && grade(state, question, -1)
	case "correct", "wrong", "answer":
		if expired {
			return grade(state, question, -1)
		}
		if action == "correct" {
			return grade(state, question, question.CorrectAnswer)
		}
		if action == "wrong" {
			for i := range question.Options {
				if i != question.CorrectAnswer && !slices.Contains(state.Eliminated, i) {
					return grade(state, question, i)
				}
			}
			return false
		}
		if selected == nil || *selected < -1 || *selected > 3 || *selected != math.Trunc(*selected) {
			return false
		}
		index := int(*selected)
		return !slices.Contains(state.Eliminated, index) && grade(state, question, index)
	default:
		return false
	}
}

func grade(state *State, question Question, index int) bool {
	ok := index == question.CorrectAnswer
	points := 0
	if ok {
		points = 10
		if state.Hint {
			points = 5
		}
	}
	state.Answered = true
	state.Score += points
	state.Answers = append(state.Answers, Answer{Question: question, Selected: index, OK: ok, Points: points})
	return true
}

func runTrace(req Request, random func() float64) (Trace, error) {
	trace := Trace{Pool: []Question{}, Steps: []Snapshot{}}
	state, err := start(req, random)
	if err != nil || state == nil {
		return trace, err
	}
	trace.Pool = make([]Question, len(state.Pool))
	for i, question := range state.Pool {
		trace.Pool[i] = localizedQuestion(question, req.Language)
	}
	trace.Steps = append(trace.Steps, snapshot(state, true))
	now := req.Now
	for _, action := range req.Actions {
		if action.At != nil {
			now = *action.At
		} else {
			now += action.After
		}
		changed := transition(state, req.Mode, action.Action, action.Index, now, random)
		trace.Steps = append(trace.Steps, snapshot(state, changed))
	}
	return trace, nil
}

func snapshot(state *State, changed bool) Snapshot {
	answers := make([]TraceAnswer, len(state.Answers))
	for i, answer := range state.Answers {
		answers[i] = TraceAnswer{answer.Question.ID, answer.Selected, answer.OK, answer.Points}
	}
	return Snapshot{
		Changed: changed, Index: state.Index, Score: state.Score, Answers: answers, Answered: state.Answered,
		Hint: state.Hint, Eliminated: slices.Clone(state.Eliminated), Deadline: state.Deadline, Finished: state.Finished,
	}
}
