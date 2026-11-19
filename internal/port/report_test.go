package port

import (
	"encoding/json"
	"fmt"
	"reflect"
	"strings"
	"testing"
)

func TestReportGradesKeepCompetitionTiesAndBoundaries(t *testing.T) {
	request := `{"op":"report-grades","rows":[{"accuracy":100},{"accuracy":90},{"accuracy":80},
		{"accuracy":70},{"accuracy":60},{"accuracy":60},{"accuracy":40},{"accuracy":30},
		{"accuracy":20},{"accuracy":10},null,{"accuracy":"100"},{"accuracy":101}]}`
	value, err := Report(json.RawMessage(request))
	if err != nil {
		t.Fatal(err)
	}
	rows := reportTestJSON[[]struct {
		Rank       int
		Percentile float64
		Grade      string
	}](t, value)
	var grades []string
	for _, row := range rows {
		grades = append(grades, row.Grade)
	}
	if !reflect.DeepEqual(grades, []string{"A", "A", "B", "B", "C", "C", "C", "D", "D", "D"}) ||
		rows[4].Rank != 5 || rows[5].Rank != 5 || rows[6].Rank != 7 || rows[6].Percentile != 70 {
		t.Fatalf("unexpected grade distribution: %+v", rows)
	}
}

func TestReportAggregateKeepsDistinctAttemptsAndGradesLatestCompleted(t *testing.T) {
	value, err := Report(json.RawMessage(`{"op":"report-aggregate","files":[
		{"name":"first.json","data":{"profile":{"id":"a","name":"Fixture A"},"records":[
			{"id":"a1","score":10,"total":10,"correct":1,"mode":"all","date":"2026-11-18","completedAt":"2026-11-18T01:00:00Z","categories":{"과학":{"correct":1,"total":10}}},
			{"id":"a2","score":80,"total":10,"correct":8,"mode":"all","date":"2026-11-18","completedAt":"2026-11-18T02:00:00Z","categories":{"과학":{"correct":8,"total":10}}},
			{"id":"unfinished","score":50,"total":5,"correct":5,"mode":"all","date":"2026-11-18","completed":false,"completedAt":"2026-11-18T03:00:00Z"}
		]}},
		{"name":"second.json","data":{"records":[
			{"studentId":"a","id":"a2","score":70,"total":10,"correct":7,"mode":"all","date":"2026-11-18","completedAt":"2026-11-18T02:00:00Z"},
			{"studentId":"b","id":"b1","score":40,"total":5,"correct":4,"mode":"all","date":"2026-11-18","completedAt":"2026-11-18T02:00:00Z"},
			{"studentId":"c","id":"legacy","score":30,"total":3,"mode":"all","date":"2026-11-18","completedAt":"2026-11-18T02:00:00Z"},
			{"studentId":"invalid","score":-1,"total":3,"mode":"all","date":"2026-11-18"}
		]}}
	]}`))
	if err != nil {
		t.Fatal(err)
	}
	data := reportTestJSON[struct {
		Students, Attempts, Excluded int
		AverageAccuracy              float64
		Categories                   map[string]struct{ Correct, Total int }
		Rows                         []struct {
			ID, Name, Grade string
			Rank            *int
		}
	}](t, value)
	if data.Students != 3 || data.Attempts != 5 || data.Excluded != 2 || data.AverageAccuracy != 60 ||
		data.Categories["과학"].Correct != 9 || data.Categories["과학"].Total != 20 {
		t.Fatalf("unexpected aggregate: %+v", data)
	}
	if len(data.Rows) != 3 || data.Rows[0].ID != "a2" || data.Rows[0].Name != "Fixture A" ||
		data.Rows[0].Grade != "C" || data.Rows[1].Grade != "C" ||
		data.Rows[2].Grade != "미수집" || data.Rows[2].Rank != nil {
		t.Fatalf("unexpected latest rows: %+v", data.Rows)
	}
}

func TestReportCSVMatchesLocalizedHeadersAndEscapesFormulaCells(t *testing.T) {
	value, err := Report(json.RawMessage(`{"op":"report-csv","lang":"en","files":[{"name":"fixture.json","data":{"records":[
		{"studentId":"fixture","name":" =1+1 \"name\"","score":97,"total":800,"correct":97,"mode":"과학","date":"2026-11-18","completedAt":"2026-11-18T01:00:00Z"},
		{"studentId":"legacy","score":1,"total":1,"mode":"daily","date":"2026-11-18","completedAt":"2026-11-18T02:00:00Z"}
	]}}]}`))
	if err != nil {
		t.Fatal(err)
	}
	csv, ok := value.(string)
	if !ok || !strings.HasPrefix(csv, "\uFEFF\"Student ID\",\"Name\",\"Rank\"") ||
		!strings.Contains(csv, `"fixture","' =1+1 ""name""","1","97","800","97","12.13","Science","2026-11-18T01:00:00Z","A"`+"\r\n") ||
		!strings.HasSuffix(csv, `"legacy","정보 없음","","1","1","","","Daily mix","2026-11-18T02:00:00Z","Not recorded"`+"\r\n") {
		t.Fatalf("unexpected CSV: %q", csv)
	}
}

func TestReportAggregateRejectsMissingRecords(t *testing.T) {
	_, err := Report(json.RawMessage(`{"op":"report-aggregate","files":[{"name":"invalid.json","data":{}}]}`))
	if fmt.Sprint(err) != "invalid.json: records 배열이 없습니다." {
		t.Fatalf("unexpected import error %v", err)
	}
}

func TestReportAggregateAcceptsLegacyMonthNameTimestamp(t *testing.T) {
	value, err := Report(json.RawMessage(`{"op":"report-aggregate","files":[{"name":"fixture.json","data":{"records":[
		{"id":"older","studentId":"fixture","score":0,"total":1,"correct":0,"mode":"all","date":"2026-11-17","completedAt":"2026-11-17T00:00:00Z"},
		{"id":"latest","studentId":"fixture","score":10,"total":1,"correct":1,"mode":"all","date":"2026-11-19","completedAt":"November 19, 2026 12:34:56"}
	]}}]}`))
	if err != nil {
		t.Fatal(err)
	}
	data := value.(reportData)
	if data.Excluded != 0 || len(data.Rows) != 1 || data.Rows[0]["id"] != "latest" {
		t.Fatalf("latest attempt did not use the legacy timestamp: %+v", data)
	}
}

func TestReportAggregateUsesBrowserCompletionTimesByOriginalIndex(t *testing.T) {
	value, err := Report(json.RawMessage(`{"op":"report-aggregate","files":[{"name":"fixture.json","completionTimes":[null,0,1795059296000,null],"data":{"records":[
		null,
		{"id":"older","studentId":"fixture","score":0,"total":1,"correct":0,"mode":"all","date":"2026-11-17","completedAt":"1970-01-01T00:00:00Z"},
		{"id":"latest","studentId":"fixture","score":10,"total":1,"correct":1,"mode":"all","date":"2026-11-19","completedAt":"2026-11-19 12:34:56 GMT+0900"},
		{"id":"excluded","studentId":"fixture","score":0,"total":1,"correct":0,"mode":"all","date":"2026-11-20","completedAt":"2026-11-20T00:00:00Z"}
	]}}]}`))
	if err != nil {
		t.Fatal(err)
	}
	data := value.(reportData)
	if data.Attempts != 3 || data.Excluded != 2 || len(data.Rows) != 1 ||
		data.Rows[0]["id"] != "latest" || data.Rows[0]["completedAt"] != "2026-11-19 12:34:56 GMT+0900" {
		t.Fatalf("browser metadata did not apply to original records: %+v", data)
	}
}

func reportTestJSON[T any](t *testing.T, value any) T {
	t.Helper()
	var result T
	encoded, err := json.Marshal(value)
	if err != nil {
		t.Fatal(err)
	}
	if err := json.Unmarshal(encoded, &result); err != nil {
		t.Fatal(err)
	}
	return result
}
