package studyquiz

import _ "embed"

// These two banks are also loaded by the original static application.
//
//go:embed questions.js
var KoreanQuestionSource string

//go:embed questions-en.js
var EnglishQuestionSource string
