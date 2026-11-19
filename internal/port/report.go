package port

import (
	"encoding/json"
	"fmt"
	"maps"
	"math"
	"slices"
	"sort"
	"strconv"
	"strings"
	"time"
	"unicode/utf16"
)

type reportCategory struct {
	Correct float64 `json:"correct"`
	Total   float64 `json:"total"`
}

type reportData struct {
	Students        int                       `json:"students"`
	Attempts        int                       `json:"attempts"`
	AverageAccuracy *float64                  `json:"averageAccuracy"`
	BestScore       *float64                  `json:"bestScore"`
	AverageScore    *float64                  `json:"averageScore"`
	Categories      map[string]reportCategory `json:"categories"`
	Rows            []map[string]any          `json:"rows"`
	Excluded        int                       `json:"excluded"`
	Warnings        []string                  `json:"warnings"`
	Sources         []any                     `json:"sources"`
}

// Report runs the teacher analytics on explicitly supplied imports or grade rows.
func Report(input json.RawMessage) (any, error) {
	var request struct {
		Op    string
		Rows  []any
		Files []any
		Lang  string
		Data  *reportData
	}
	if err := json.Unmarshal(input, &request); err != nil {
		return nil, err
	}
	switch request.Op {
	case "report-grades":
		rows := make([]map[string]any, 0, len(request.Rows))
		for _, value := range request.Rows {
			if row, ok := value.(map[string]any); ok {
				rows = append(rows, row)
			}
		}
		return reportGrades(rows), nil
	case "report-aggregate":
		return aggregateReport(request.Files)
	case "report-csv":
		if request.Data != nil {
			return reportCSV(request.Data.Rows, request.Lang), nil
		}
		data, err := aggregateReport(request.Files)
		if err != nil {
			return nil, err
		}
		return reportCSV(data.Rows, request.Lang), nil
	default:
		return nil, fmt.Errorf("unknown report operation %q", request.Op)
	}
}

func reportGrades(rows []map[string]any) []map[string]any {
	ranked := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		accuracy, valid := reportNumber(row["accuracy"])
		if valid && accuracy >= 0 && accuracy <= 100 {
			ranked = append(ranked, maps.Clone(row))
		}
	}
	sort.SliceStable(ranked, func(i, j int) bool {
		return ranked[i]["accuracy"].(float64) > ranked[j]["accuracy"].(float64)
	})
	rank := 0
	for i, row := range ranked {
		if i == 0 || row["accuracy"] != ranked[i-1]["accuracy"] {
			rank = i + 1
		}
		percentile := 0.0
		if len(ranked) > 1 {
			percentile = (float64(rank) / float64(len(ranked))) * 100
		}
		grade := "D"
		switch {
		case percentile <= 20:
			grade = "A"
		case percentile <= 40:
			grade = "B"
		case percentile <= 70:
			grade = "C"
		}
		row["rank"], row["percentile"], row["grade"] = rank, percentile, grade
	}
	return ranked
}

type reportRecordKey struct {
	Student, ID, Date, Mode string
	Score, Total            float64
}

type reportAttempt struct {
	row             map[string]any
	completed       int64
	validCompletion bool
}

func aggregateReport(files []any) (reportData, error) {
	result := reportData{
		Categories: make(map[string]reportCategory),
		Rows:       make([]map[string]any, 0),
		Warnings:   make([]string, 0),
		Sources:    make([]any, 0, len(files)),
	}
	students := make(map[string]struct{})
	seen := make(map[reportRecordKey]struct{})
	var attempts []reportAttempt
	for _, value := range files {
		file, _ := value.(map[string]any)
		data, _ := file["data"].(map[string]any)
		records, valid := data["records"].([]any)
		if !valid {
			return reportData{}, fmt.Errorf("%s: records 배열이 없습니다.", reportPropertyString(file, "name"))
		}
		completionTimes, err := reportCompletionTimes(file, len(records))
		if err != nil {
			return reportData{}, err
		}
		result.Sources = append(result.Sources, file["name"])
		profileID, profileName := reportProfile(data["profile"])
		for index, value := range records {
			record, _ := value.(map[string]any)
			if !validSavedRecord(record) {
				result.Excluded++
				continue
			}
			studentID, _ := record["studentId"].(string)
			if studentID == "" {
				studentID = profileID
			}
			key := reportDeduplicationKey(studentID, record)
			if _, duplicate := seen[key]; duplicate {
				continue
			}
			seen[key] = struct{}{}
			row := maps.Clone(record)
			name, _ := row["name"].(string)
			if name == "" {
				name = profileName
			}
			row["studentId"], row["name"], row["accuracy"] = studentID, name, nil
			if correct, ok := row["correct"].(float64); ok {
				row["accuracy"] = (correct / row["total"].(float64)) * 100
			}
			if studentID != "" {
				students[studentID] = struct{}{}
			}
			attempt := reportAttempt{row: row}
			if completionTimes == nil {
				attempt.completed, attempt.validCompletion = reportCompletion(row["completedAt"])
			} else if milliseconds := completionTimes[index]; milliseconds != nil {
				attempt.completed, attempt.validCompletion = *milliseconds, true
			}
			attempts = append(attempts, attempt)
		}
	}
	result.Students, result.Attempts = len(students), len(attempts)
	result.summarize(attempts)
	return result, nil
}

func (result *reportData) summarize(attempts []reportAttempt) {
	latest := make(map[string]reportAttempt)
	var ordering []string
	var sumScores, bestScore, knownCorrect, knownTotal float64
	for _, attempt := range attempts {
		row := attempt.row
		score := row["score"].(float64)
		sumScores += score
		bestScore = math.Max(bestScore, score)
		if correct, ok := row["correct"].(float64); ok {
			knownCorrect += correct
			knownTotal += row["total"].(float64)
		}
		result.addCategories(row["categories"])
		studentID := row["studentId"].(string)
		if studentID == "" || row["completed"] == false || !attempt.validCompletion {
			result.Excluded++
			continue
		}
		old, found := latest[studentID]
		if !found {
			ordering = append(ordering, studentID)
		}
		if !found || attempt.completed > old.completed ||
			(reportSameTimestamp(row["completedAt"], old.row["completedAt"]) && reportLaterID(row, old.row)) {
			latest[studentID] = attempt
		}
	}
	if result.Attempts > 0 {
		result.BestScore = reportFinitePointer(bestScore)
		result.AverageScore = reportFinitePointer(sumScores / float64(result.Attempts))
	}
	if knownTotal > 0 {
		result.AverageAccuracy = reportFinitePointer((knownCorrect / knownTotal) * 100)
	}
	var known, unknown []map[string]any
	for _, studentID := range ordering {
		row := latest[studentID].row
		if row["accuracy"] != nil {
			known = append(known, row)
			continue
		}
		row["rank"], row["percentile"], row["grade"] = nil, nil, "미수집"
		unknown = append(unknown, row)
	}
	result.Rows = append(reportGrades(known), unknown...)
	if result.Excluded > 0 {
		result.Warnings = append(result.Warnings, "잘못된 기록 또는 학생 ID·완료 시각이 없는 응시는 등급에서 제외됩니다.")
	}
}

func (result *reportData) addCategories(value any) {
	add := func(name string, value any) {
		category, _ := value.(map[string]any)
		correct, validCorrect := reportInteger(category["correct"])
		total, validTotal := reportInteger(category["total"])
		if !validCorrect || !validTotal || total <= 0 || correct < 0 || correct > total {
			return
		}
		previous := result.Categories[name]
		result.Categories[name] = reportCategory{Correct: previous.Correct + correct, Total: previous.Total + total}
	}
	switch categories := value.(type) {
	case map[string]any:
		for name, category := range categories {
			add(name, category)
		}
	case []any:
		for index, category := range categories {
			add(strconv.Itoa(index), category)
		}
	}
}

func reportDeduplicationKey(studentID string, row map[string]any) reportRecordKey {
	if id, _ := row["id"].(string); id != "" {
		return reportRecordKey{Student: studentID, ID: id}
	}
	return reportRecordKey{
		Student: studentID, Date: row["date"].(string), Mode: row["mode"].(string),
		Score: row["score"].(float64), Total: row["total"].(float64),
	}
}

func reportProfile(value any) (string, string) {
	profile, _ := value.(map[string]any)
	id, _ := profile["id"].(string)
	name, named := profile["name"].(string)
	if id != "" && named {
		return id, name
	}
	return "", "정보 없음"
}

func reportNumber(value any) (float64, bool) {
	number, ok := value.(float64)
	return number, ok && !math.IsNaN(number) && !math.IsInf(number, 0)
}

func reportInteger(value any) (float64, bool) {
	number, valid := reportNumber(value)
	return number, valid && math.Trunc(number) == number
}

func reportFinitePointer(number float64) *float64 {
	if _, valid := reportNumber(number); !valid {
		return nil
	}
	return &number
}

// Browser callers supply Date.parse results from their own timezone and parser.
// Null is an invalid date, while omission selects the native parser.
func reportCompletionTimes(file map[string]any, records int) ([]*int64, error) {
	value, supplied := file["completionTimes"]
	if !supplied {
		return nil, nil
	}
	times, valid := value.([]any)
	if !valid || len(times) != records {
		return nil, fmt.Errorf("%s: completionTimes must align with records", reportPropertyString(file, "name"))
	}
	result := make([]*int64, len(times))
	for index, value := range times {
		if value == nil {
			continue
		}
		milliseconds, valid := reportInteger(value)
		if !valid || math.Abs(milliseconds) > 8.64e15 {
			return nil, fmt.Errorf("%s: invalid completionTimes at record %d", reportPropertyString(file, "name"), index)
		}
		timestamp := int64(milliseconds)
		result[index] = &timestamp
	}
	return result, nil
}

func reportCompletion(value any) (int64, bool) {
	timestamp := strings.TrimSpace(reportString(value))
	if timestamp == "" {
		return 0, false
	}
	for _, layout := range []string{
		time.RFC3339Nano, "2006-01-02T15:04:05.999999999-0700", "2006-01-02T15:04Z07:00",
		time.DateOnly, "2006-01", "2006", time.RFC1123, time.RFC1123Z, time.RFC822Z,
	} {
		if parsed, err := time.Parse(layout, timestamp); err == nil {
			return parsed.UnixMilli(), true
		}
	}
	for _, layout := range []string{
		"2006-01-02T15:04:05.999999999", "2006-01-02T15:04", time.DateTime,
		"2006/01/02", "1/2/2006", "January 2, 2006", "Jan 2, 2006",
		"January 2, 2006 15:04:05", "Jan 2, 2006 15:04:05",
		"January 2, 2006 15:04", "Jan 2, 2006 15:04",
	} {
		if parsed, err := time.ParseInLocation(layout, timestamp, time.Local); err == nil {
			return parsed.UnixMilli(), true
		}
	}
	return 0, false
}

func reportSameTimestamp(left, right any) bool {
	switch value := left.(type) {
	case string:
		return value == right
	case float64:
		return value == right
	default:
		return false
	}
}

func reportLaterID(row, old map[string]any) bool {
	left := utf16.Encode([]rune(reportPropertyString(row, "id")))
	right := utf16.Encode([]rune(reportPropertyString(old, "id")))
	return slices.Compare(left, right) > 0
}

func reportPropertyString(row map[string]any, key string) string {
	value, found := row[key]
	if !found {
		return "undefined"
	}
	if value == nil {
		return "null"
	}
	return reportString(value)
}
