package port

import (
	"encoding/json"
	"math"
	"slices"
	"strconv"
)

type savedRecord = map[string]any

func dispatchRecords(operation string, input []byte) (any, error) {
	var request struct {
		Record  savedRecord `json:"record"`
		Records []any       `json:"records"`
	}
	if err := json.Unmarshal(input, &request); err != nil {
		return nil, err
	}
	switch operation {
	case "records-valid":
		return validSavedRecord(request.Record), nil
	case "records-normalize":
		return normalizeSavedRecords(request.Records), nil
	default:
		return summarizeSavedRecords(normalizeSavedRecords(request.Records)), nil
	}
}

func validSavedRecord(record savedRecord) bool {
	for _, field := range []string{"mode", "date"} {
		if _, ok := record[field].(string); !ok {
			return false
		}
	}
	for _, field := range []string{"id", "studentId", "name"} {
		if value := record[field]; value != nil {
			if _, ok := value.(string); !ok {
				return false
			}
		}
	}
	total, totalOK := recordInteger(record["total"])
	score, scoreOK := record["score"].(float64)
	if !totalOK || total <= 0 || !scoreOK || score < 0 || score > total*10 {
		return false
	}
	if value := record["correct"]; value != nil {
		correct, ok := recordInteger(value)
		if !ok || correct < 0 || correct > total {
			return false
		}
	}
	for _, field := range []string{"missedIds", "questionIds"} {
		if value := record[field]; value != nil {
			ids, ok := value.([]any)
			if !ok {
				return false
			}
			for _, id := range ids {
				if n, ok := recordInteger(id); !ok || n <= 0 {
					return false
				}
			}
		}
	}
	if value := record["answers"]; value != nil {
		answers, ok := value.([]any)
		if !ok {
			return false
		}
		for _, item := range answers {
			answer, _ := item.(savedRecord)
			id, validID := recordInteger(answer["questionId"])
			if _, ok := answer["correct"].(bool); !ok || !validID || id <= 0 {
				return false
			}
		}
	}
	return true
}

func recordInteger(value any) (float64, bool) {
	number, ok := value.(float64)
	return number, ok && number == math.Trunc(number)
}

func normalizeSavedRecords(input []any) []savedRecord {
	result := make([]savedRecord, 0, len(input))
	seen := make(map[string]bool, len(input))
	for _, value := range input {
		record, _ := value.(savedRecord)
		if !validSavedRecord(record) {
			continue
		}
		key, _ := record["id"].(string)
		if key == "" {
			student, _ := record["studentId"].(string)
			encoded, _ := json.Marshal([]any{student, record["mode"], record["date"], record["score"], record["total"]})
			key = string(encoded)
		}
		if seen[key] {
			continue
		}
		seen[key] = true
		result = append(result, savedRecordFields(record))
	}
	return result
}

func savedRecordFields(source savedRecord) savedRecord {
	out := make(savedRecord)
	for _, key := range []string{
		"id", "studentId", "name", "score", "total", "correct", "completed",
		"completedAt", "mode", "modeKey", "date", "missedIds", "questionIds",
	} {
		if source[key] != nil {
			out[key] = source[key]
		}
	}
	switch categories := source["categories"].(type) {
	case savedRecord:
		copy := make(savedRecord)
		for key, value := range categories {
			keepCategory(copy, key, value)
		}
		out["categories"] = copy
	case []any:
		copy := make(savedRecord)
		for index, value := range categories {
			keepCategory(copy, strconv.Itoa(index), value)
		}
		out["categories"] = copy
	}
	if answers, ok := source["answers"].([]any); ok {
		copy := make([]savedRecord, 0, len(answers))
		for _, value := range answers {
			answer := value.(savedRecord)
			copy = append(copy, savedRecord{"questionId": answer["questionId"], "correct": answer["correct"]})
		}
		out["answers"] = copy
	}
	return out
}

func keepCategory(out savedRecord, key string, value any) {
	category, _ := value.(savedRecord)
	correct, correctOK := recordInteger(category["correct"])
	total, totalOK := recordInteger(category["total"])
	if correctOK && totalOK && total > 0 && correct >= 0 && correct <= total {
		out[key] = savedRecord{"correct": correct, "total": total}
	}
}

// The caller supplies attempts in recording order. The browser resolves legacy
// dates using the same Date.parse rules as its JavaScript storage adapter.
func summarizeSavedRecords(records []savedRecord) savedRecord {
	result := savedRecord{"attempts": len(records), "best": nil, "averageAccuracy": nil}
	var best, knownCorrect, knownTotal float64
	missed := make([]float64, 0)
	mark := func(id float64, correct bool) {
		if index := slices.Index(missed, id); index >= 0 {
			if correct {
				missed = slices.Delete(missed, index, index+1)
			}
		} else if !correct {
			missed = append(missed, id)
		}
	}
	for _, record := range records {
		best = math.Max(best, record["score"].(float64))
		if correct, ok := record["correct"].(float64); ok {
			knownCorrect += correct
			knownTotal += record["total"].(float64)
		}
		if answers, ok := record["answers"].([]savedRecord); ok {
			for _, answer := range answers {
				mark(answer["questionId"].(float64), answer["correct"].(bool))
			}
			continue
		}
		missedIDs, _ := record["missedIds"].([]any)
		questions, _ := record["questionIds"].([]any)
		for _, question := range questions {
			if !slices.Contains(missedIDs, question) {
				mark(question.(float64), true)
			}
		}
		for _, question := range missedIDs {
			mark(question.(float64), false)
		}
	}
	if len(records) != 0 {
		result["best"] = best
	}
	if knownTotal > 0 {
		result["averageAccuracy"] = knownCorrect / knownTotal * 100
	}
	result["missedIds"] = missed
	return result
}
