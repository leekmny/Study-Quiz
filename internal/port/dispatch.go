package port

import (
	"encoding/json"
	"errors"
	"fmt"
)

type Request struct {
	Op         string    `json:"op"`
	Mode       string    `json:"mode"`
	Category   string    `json:"category"`
	Difficulty string    `json:"difficulty"`
	Length     int       `json:"length"`
	IDs        []int     `json:"ids"`
	MissedIDs  []int     `json:"missedIds"`
	Now        int64     `json:"now"`
	Date       string    `json:"date"`
	Random     []float64 `json:"random"`
	Language   string    `json:"language"`
	State      *State    `json:"state"`
	Question   *Question `json:"question"`
	Action     string    `json:"action"`
	Index      *float64  `json:"index"`
	Actions    []Action  `json:"actions"`
}

// Invoke is the shared JSON boundary for the native executable and the browser.
func Invoke(input []byte) []byte {
	value, err := dispatch(input)
	if err == nil {
		var output []byte
		output, err = json.Marshal(struct {
			OK     bool `json:"ok"`
			Result any  `json:"result"`
		}{OK: true, Result: value})
		if err == nil {
			return output
		}
	}
	output, _ := json.Marshal(struct {
		OK    bool   `json:"ok"`
		Error string `json:"error"`
	}{Error: err.Error()})
	return output
}

func dispatch(input []byte) (any, error) {
	var req Request
	if err := json.Unmarshal(input, &req); err != nil {
		return nil, fmt.Errorf("invalid request: %w", err)
	}
	random, err := randomSource(req.Random)
	if err != nil {
		return nil, err
	}
	switch req.Op {
	case "records-valid", "records-normalize", "records-summary":
		return dispatchRecords(req.Op, input)
	case "report-grades", "report-aggregate", "report-csv":
		return Report(input)
	case "pool":
		return makePool(req, random)
	case "start":
		return start(req, random)
	case "step":
		changed := transition(req.State, req.Mode, req.Action, req.Index, req.Now, random)
		return Step{State: req.State, Changed: changed}, nil
	case "quiz":
		if req.Language == "en" && englishBankError != nil {
			return nil, englishBankError
		}
		return runTrace(req, random)
	case "localize":
		if req.Question == nil {
			return nil, errors.New("a question is required")
		}
		if req.Language == "en" && englishBankError != nil {
			return nil, englishBankError
		}
		return localizedQuestion(*req.Question, req.Language), nil
	default:
		return nil, fmt.Errorf("unknown operation %q", req.Op)
	}
}
