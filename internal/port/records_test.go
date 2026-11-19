package port

import (
	"encoding/json"
	"reflect"
	"testing"
)

func TestRecordsNormalizeFiltersDuplicatesAndPrivateFields(t *testing.T) {
	input := []byte(`{"op":"records-normalize","records":[
		{"id":"a","mode":"all","date":"2026-11-18","total":2,"score":10,"private":"x","categories":{"good":{"correct":1,"total":2,"private":"x"},"bad":{"correct":2,"total":1}}},
		{"id":"a","mode":"all","date":"2026-11-18","total":2,"score":20},
		{"id":"bad","mode":"all","date":"2026-11-18","total":2,"score":21},
		{"mode":"review","date":"2026-11-19","total":1,"score":0,"answers":[{"questionId":42,"correct":false,"private":"x"}],"categories":[{"correct":0,"total":1}]}]}`)
	assertRecordResult(t, Invoke(input), `{"ok":true,"result":[
		{"id":"a","mode":"all","date":"2026-11-18","total":2,"score":10,"categories":{"good":{"correct":1,"total":2}}},
		{"mode":"review","date":"2026-11-19","total":1,"score":0,"answers":[{"questionId":42,"correct":false}],"categories":{"0":{"correct":0,"total":1}}}]}`)
}

func TestRecordsSummaryUsesWeightedAccuracyAndOrderedReview(t *testing.T) {
	input := []byte(`{"op":"records-summary","records":[
		{"mode":"all","date":"2026-11-18","total":4,"score":30,"correct":3,"missedIds":[2,4]},
		{"mode":"review","date":"2026-11-19","total":1,"score":10,"correct":1,"answers":[{"questionId":2,"correct":true},{"questionId":6,"correct":false}]},
		{"mode":"all","date":"2026-11-19","total":9,"score":0}]}`)
	assertRecordResult(t, Invoke(input), `{"ok":true,"result":{"attempts":3,"best":30,"averageAccuracy":80,"missedIds":[4,6]}}`)
}

func assertRecordResult(t *testing.T, actual []byte, expected string) {
	t.Helper()
	var got, want any
	if err := json.Unmarshal(actual, &got); err != nil {
		t.Fatal(err)
	}
	if err := json.Unmarshal([]byte(expected), &want); err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %s, want %s", actual, expected)
	}
}
