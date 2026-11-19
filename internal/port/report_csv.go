package port

import (
	"encoding/json"
	"math"
	"math/big"
	"strconv"
	"strings"
	"unicode"
)

var reportHeadersKO = []string{"학생ID", "이름", "순위", "점수", "문항수", "정답수", "정답률", "모드", "완료시각", "등급"}
var reportHeadersEN = []string{"Student ID", "Name", "Rank", "Score", "Questions", "Correct", "Accuracy", "Mode", "Completed at", "Grade"}

var reportModesKO = map[string]string{
	"all": "전체", "category": "카테고리", "speed": "스피드", "review": "오답 복습", "daily": "오늘의 퀴즈",
}

var reportModesEN = map[string]string{
	"전체": "All subjects", "스피드": "Speed", "한국사": "Korean history", "과학": "Science",
	"지리": "Geography", "예술과 문화": "Arts & culture", "all": "All subjects", "category": "By subject",
	"speed": "Speed", "review": "Review", "daily": "Daily mix",
}

func reportCSV(rows []map[string]any, lang string) string {
	headers, modes := reportHeadersKO, reportModesKO
	if lang == "en" {
		headers, modes = reportHeadersEN, reportModesEN
	}
	var output strings.Builder
	output.WriteRune('\uFEFF')
	writeCSVRow(&output, headers)
	for _, row := range rows {
		accuracy := ""
		if number, valid := reportNumber(row["accuracy"]); valid {
			accuracy = reportFixedAccuracy(number)
		}
		mode := reportString(row["mode"])
		if translated := modes[mode]; translated != "" {
			mode = translated
		}
		grade := reportString(row["grade"])
		if lang == "en" && grade == "미수집" {
			grade = "Not recorded"
		}
		writeCSVRow(&output, []string{
			reportString(row["studentId"]), reportString(row["name"]), reportString(row["rank"]),
			reportString(row["score"]), reportString(row["total"]), reportString(row["correct"]),
			accuracy, mode, reportString(row["completedAt"]), grade,
		})
	}
	return output.String()
}

func writeCSVRow(output *strings.Builder, cells []string) {
	for i, cell := range cells {
		if i != 0 {
			output.WriteByte(',')
		}
		output.WriteByte('"')
		trimmed := strings.TrimLeftFunc(cell, func(character rune) bool {
			return character == '\uFEFF' || (character != '\u0085' && unicode.IsSpace(character))
		})
		if trimmed != "" && strings.ContainsRune("=+-@", rune(trimmed[0])) {
			output.WriteByte('\'')
		}
		output.WriteString(strings.ReplaceAll(cell, `"`, `""`))
		output.WriteByte('"')
	}
	output.WriteString("\r\n")
}

func reportString(value any) string {
	switch value := value.(type) {
	case nil:
		return ""
	case string:
		return value
	case bool:
		return strconv.FormatBool(value)
	case float64:
		if value == 0 {
			return "0"
		}
		encoded, _ := json.Marshal(value)
		return string(encoded)
	case int:
		return strconv.Itoa(value)
	case []any:
		parts := make([]string, len(value))
		for i, item := range value {
			parts[i] = reportString(item)
		}
		return strings.Join(parts, ",")
	default:
		return "[object Object]"
	}
}

func reportFixedAccuracy(value float64) string {
	if math.Abs(value) >= 1e21 {
		return reportString(value)
	}
	// toFixed resolves an exact midpoint upward using the original binary number.
	scaled := new(big.Rat).SetFloat64(math.Abs(value))
	scaled.Mul(scaled, big.NewRat(100, 1))
	quotient, remainder := new(big.Int), new(big.Int)
	quotient.QuoRem(scaled.Num(), scaled.Denom(), remainder)
	if remainder.Lsh(remainder, 1).Cmp(scaled.Denom()) >= 0 {
		quotient.Add(quotient, big.NewInt(1))
	}
	digits := quotient.String()
	if len(digits) < 3 {
		digits = strings.Repeat("0", 3-len(digits)) + digits
	}
	sign := ""
	if value < 0 {
		sign = "-"
	}
	return sign + digits[:len(digits)-2] + "." + digits[len(digits)-2:]
}
