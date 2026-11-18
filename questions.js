// Reference notes: docs/question-sources.md
const quizQuestions = [
  {
    "id": 1,
    "category": "한국사",
    "difficulty": "easy",
    "question": "조선을 건국한 왕은 누구인가요?",
    "options": [
      "이성계",
      "왕건",
      "이방원",
      "세종"
    ],
    "correctAnswer": 0,
    "explanation": "이성계(태조)는 1392년 조선을 건국했습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "1392년에 새 왕조를 연 인물의 성을 떠올려 보세요.",
    "sources": [
      "https://contents.history.go.kr/front/ta/view.do?levelId=ta_p111r_0010_0010_0010",
      "https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_30&levelId=kc_n303210"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 2,
    "category": "한국사",
    "difficulty": "medium",
    "question": "한글을 창제한 왕은 누구인가요?",
    "options": [
      "태조",
      "세종",
      "태종",
      "성종"
    ],
    "correctAnswer": 1,
    "explanation": "세종대왕은 1443년(세종 25년) 한글을 창제하고 1446년에 반포했습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "훈민정음이라는 이름으로 새 문자를 반포한 조선의 네 번째 왕입니다.",
    "sources": [
      "https://www.unesco.org/en/memory-world/hunminjeongum-manuscript"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 3,
    "category": "한국사",
    "difficulty": "medium",
    "question": "임진왜란이 일어난 연도는?",
    "options": [
      "1392년",
      "1636년",
      "1592년",
      "1910년"
    ],
    "correctAnswer": 2,
    "explanation": "임진왜란은 1592년(선조 25년)에 일본의 침략으로 시작되었습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "16세기 말, 조선에 일본군이 침입하면서 시작된 전쟁입니다.",
    "sources": [
      "https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_30&levelId=kc_n311800",
      "https://encykorea.aks.ac.kr/Article/E0047674"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 4,
    "category": "한국사",
    "difficulty": "hard",
    "question": "고려의 주된 수도로 오늘날의 개성에 해당하는 도시는?",
    "options": [
      "한양",
      "평양",
      "경주",
      "개경"
    ],
    "correctAnswer": 3,
    "explanation": "고려의 수도는 개경(현재의 개성)이었습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "오늘날 북한의 개성 지역에 해당하는 도시입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/1278/"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 5,
    "category": "한국사",
    "difficulty": "medium",
    "question": "3·1 운동이 일어난 연도는?",
    "options": [
      "1919년",
      "1910년",
      "1945년",
      "1950년"
    ],
    "correctAnswer": 0,
    "explanation": "3·1 운동은 1919년 3월 1일에 일어난 독립운동입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "제1차 세계대전이 끝난 다음 해에 전국적인 독립 만세 운동이 일어났습니다.",
    "sources": [
      "https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_i400200",
      "https://contents.history.go.kr/mobile/hm/view.do?levelId=hm_123_0040&period=%EA%B7%BC%EB%8C%80&tabId=02&theme=%EC%A0%95%EC%B9%98"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 6,
    "category": "한국사",
    "difficulty": "easy",
    "question": "676? ??? ???? ??? ??? ?? ??? ???",
    "options": [
      "무열왕",
      "문무왕",
      "진흥왕",
      "법흥왕"
    ],
    "correctAnswer": 1,
    "explanation": "??? ?? ?? 676? ??? ???? ??? ????? ????? ????????.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "백제와 고구려가 멸망한 뒤 신라를 다스린 왕입니다.",
    "sources": [
      "https://db.history.go.kr/ancient/level.do?levelId=sg_007r_0020_0590",
      "https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_10&levelId=kc_i101220"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 7,
    "category": "한국사",
    "difficulty": "hard",
    "question": "????? ???? ???? ???? ????",
    "options": [
      "온조",
      "박혁거세",
      "주몽",
      "김수로"
    ],
    "correctAnswer": 2,
    "explanation": "??(????)? ??? 37? ???? ??? ??? ?????.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "고구려 시조의 다른 이름은 동명성왕입니다.",
    "sources": [
      "https://db.history.go.kr/ancient/level.do?levelId=sg_013r_0020_0010"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 8,
    "category": "한국사",
    "difficulty": "medium",
    "question": "조선시대 4대 사화 중 첫 번째는?",
    "options": [
      "갑자사화",
      "기묘사화",
      "을사사화",
      "무오사화"
    ],
    "correctAnswer": 3,
    "explanation": "무오사화(1498년)는 연산군 때 일어난 첫 번째 사화입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "김종직의 「조의제문」을 사초에 실은 일이 발단이 된 사화입니다.",
    "hintSource": "https://encykorea.aks.ac.kr/Article/E0019174",
    "sources": [
      "https://encykorea.aks.ac.kr/Article/E0019174",
      "https://encykorea.aks.ac.kr/Article/E0026117"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 9,
    "category": "한국사",
    "difficulty": "easy",
    "question": "대한민국 정부 수립일은?",
    "options": [
      "1948년 8월 15일",
      "1945년 8월 15일",
      "1950년 6월 25일",
      "1953년 7월 27일"
    ],
    "correctAnswer": 0,
    "explanation": "대한민국 정부는 1948년 8월 15일에 수립되었습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "광복 후 3년이 지난 해의 광복절을 떠올려 보세요.",
    "sources": [
      "https://www.korea.net/Government/Constitution-and-Government/Constitution"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 10,
    "category": "한국사",
    "difficulty": "medium",
    "question": "조선시대 최고 교육기관은?",
    "options": [
      "향교",
      "성균관",
      "서원",
      "서당"
    ],
    "correctAnswer": 1,
    "explanation": "성균관은 조선시대 최고의 국립 교육기관이었습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "조선의 유학 교육과 유생 양성을 맡은 최고 기관입니다.",
    "sources": [
      "https://www.skku.edu/eng/About/s620/sub02_01.do"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 11,
    "category": "지리",
    "difficulty": "easy",
    "question": "?? ???? ??? ?, ?? ???? ?? ? ????",
    "options": [
      "아프리카",
      "북아메리카",
      "아시아",
      "남극"
    ],
    "correctAnswer": 2,
    "explanation": "?? ?? ???? ???? ? 4,460?km?? ??? ?? ???.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "유럽과 함께 하나의 거대한 육지를 이루는 대륙입니다.",
    "sources": [
      "https://education.nationalgeographic.org/resource/asia-resources/"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 12,
    "category": "지리",
    "difficulty": "medium",
    "question": "???? ???? ?? ???? ???? ???",
    "options": [
      "아마존강",
      "양쯔강",
      "미시시피강",
      "나일강"
    ],
    "correctAnswer": 3,
    "explanation": "???? ???? ???? ???? ?? ???? ???? ?? ???? ?????.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "sources": [
      "https://science.nasa.gov/earth/earth-observatory/cairos-colorful-nightscape-153803/"
    ],
    "hint": "???? ?? ???? ?? ??? ???? ?????.",
    "hintSource": "https://science.nasa.gov/earth/earth-observatory/cairos-colorful-nightscape-153803/",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 13,
    "category": "지리",
    "difficulty": "easy",
    "question": "일본의 수도는?",
    "options": [
      "도쿄",
      "오사카",
      "교토",
      "요코하마"
    ],
    "correctAnswer": 0,
    "explanation": "도쿄는 일본의 수도이자 최대 도시입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "과거에는 에도라고 불린 도시입니다.",
    "sources": [
      "https://www.japan.go.jp/japan/index.html"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 14,
    "category": "지리",
    "difficulty": "hard",
    "question": "챌린저 해연이 위치한 해구는?",
    "options": [
      "통가 해구",
      "마리아나 해구",
      "필리핀 해구",
      "푸에르토리코 해구"
    ],
    "correctAnswer": 1,
    "explanation": "챌린저 해연은 마리아나 해구에 위치합니다. 깊이는 관측 방식에 따라 달라집니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "서태평양에 있는 해구로, 지구에서 가장 깊은 곳을 포함합니다.",
    "sources": [
      "https://oceanexplorer.noaa.gov/ocean-fact/ocean-depth/"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 15,
    "category": "지리",
    "difficulty": "medium",
    "question": "극지 사막을 포함하여 면적 기준으로 세계에서 가장 큰 사막은?",
    "options": [
      "사하라 사막",
      "고비 사막",
      "남극 사막",
      "아라비아 사막"
    ],
    "correctAnswer": 2,
    "explanation": "남극 대륙은 약 1,400만km²의 극지 사막으로 세계 최대입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "뜨거운 모래사막만 생각하지 마세요. 강수량이 매우 적은 얼음 대륙도 사막입니다.",
    "hintSource": "https://www.guinnessworldrecords.com/world-records/largest-desert-(cold)",
    "sources": [
      "https://www.guinnessworldrecords.com/world-records/largest-desert-(cold)",
      "https://www.bas.ac.uk/wp-content/uploads/2026/05/Antarctic-factsheet_A4_Feb26-1.pdf"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 16,
    "category": "지리",
    "difficulty": "easy",
    "question": "프랑스의 수도는?",
    "options": [
      "런던",
      "베를린",
      "로마",
      "파리"
    ],
    "correctAnswer": 3,
    "explanation": "파리는 프랑스의 수도이자 최대 도시입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "센강이 흐르고 에펠탑이 있는 도시입니다.",
    "sources": [
      "https://european-union.europa.eu/principles-countries-history/eu-countries/france_en"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 17,
    "category": "지리",
    "difficulty": "medium",
    "question": "해발고도(평균 해수면 기준)가 가장 높은 산은?",
    "options": [
      "에베레스트",
      "K2",
      "칸첸중가",
      "마칼루"
    ],
    "correctAnswer": 0,
    "explanation": "에베레스트산은 해발 8,848.86m로 세계 최고봉입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "히말라야산맥에 있으며 높이를 평균 해수면에서 재는 기준입니다.",
    "hintSource": "https://science.nasa.gov/earth/earth-observatory/close-up-of-mount-everest-149632/",
    "sources": [
      "https://science.nasa.gov/earth/earth-observatory/close-up-of-mount-everest-149632/",
      "https://giwmscdnone.gov.np/media/pdf_upload/Facts%202025%20Final_jktttlf.pdf"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 18,
    "category": "지리",
    "difficulty": "hard",
    "question": "표면적 기준으로 세계에서 가장 큰 호수는?",
    "options": [
      "바이칼호",
      "카스피해",
      "슈피리어호",
      "빅토리아호"
    ],
    "correctAnswer": 1,
    "explanation": "카스피해는 약 371,000km²로 세계 최대의 호수입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "바다라는 이름이 붙었지만 육지로 둘러싸인 거대한 수역입니다.",
    "sources": [
      "https://science.nasa.gov/earth/earth-observatory/caspian-sea-44253/"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 19,
    "category": "지리",
    "difficulty": "easy",
    "question": "이탈리아의 수도는?",
    "options": [
      "밀라노",
      "베네치아",
      "로마",
      "나폴리"
    ],
    "correctAnswer": 2,
    "explanation": "로마는 이탈리아의 수도입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "고대 제국의 중심지였고 오늘날 콜로세움이 있는 도시입니다.",
    "sources": [
      "https://european-union.europa.eu/principles-countries-history/eu-countries/italy_en"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 20,
    "category": "지리",
    "difficulty": "medium",
    "question": "영토 면적 기준으로 세계에서 가장 작은 독립 국가는?",
    "options": [
      "모나코",
      "산마리노",
      "리히텐슈타인",
      "바티칸"
    ],
    "correctAnswer": 3,
    "explanation": "??? ??? ???? ?? ?? ?? ?? ???, ?? ?? ?? ???? ?? ?? ?? ?????.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "이탈리아의 수도 안에 자리한 도시 국가입니다.",
    "sources": [
      "https://www.vaticanstate.va/en/state-and-government/history.html"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 21,
    "category": "과학",
    "difficulty": "easy",
    "question": "물의 화학식은?",
    "options": [
      "H2O",
      "CO2",
      "O2",
      "H2O2"
    ],
    "correctAnswer": 0,
    "explanation": "물은 수소 원자 2개와 산소 원자 1개로 이루어진 H2O입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "수소 원자 두 개와 산소 원자 한 개가 결합한 분자입니다.",
    "sources": [
      "https://pubchem.ncbi.nlm.nih.gov/compound/Water-"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 22,
    "category": "과학",
    "difficulty": "medium",
    "question": "????? ?? ?? ???? ?? ? ????",
    "options": [
      "토성",
      "목성",
      "천왕성",
      "해왕성"
    ],
    "correctAnswer": 1,
    "explanation": "??? ?? ??? ? 142,984km? ??? ?? ? ?? ???.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "태양에서 다섯 번째 행성이며 대적점이라는 거대한 폭풍이 보입니다.",
    "hintSource": "https://science.nasa.gov/solar-system/planets/planet-sizes-and-locations-in-our-solar-system/",
    "sources": [
      "https://science.nasa.gov/solar-system/planets/planet-sizes-and-locations-in-our-solar-system/"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 23,
    "category": "과학",
    "difficulty": "easy",
    "question": "진공에서 빛의 속도는 초속 약 몇 km인가요?",
    "options": [
      "100만 km",
      "3만 km",
      "30만 km",
      "1000 km"
    ],
    "correctAnswer": 2,
    "explanation": "빛의 속도는 진공에서 초속 약 299,792km입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "진공에서 빛은 1초에 지구 둘레를 약 일곱 바퀴 반 이동합니다.",
    "hintSource": "https://physics.nist.gov/cuu/Constants/Value/c.html",
    "sources": [
      "https://physics.nist.gov/cuu/Constants/Value/c.html"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 24,
    "category": "과학",
    "difficulty": "hard",
    "question": "1953년 DNA 이중나선 모형을 제안한 연구자들은?",
    "options": [
      "다윈",
      "아인슈타인",
      "멘델",
      "왓슨과 크릭"
    ],
    "correctAnswer": 3,
    "explanation": "왓슨과 크릭이 모형을 제안했습니다. 프랭클린과 윌킨스 등의 X선 회절 연구가 중요한 근거가 되었습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "sources": [
      "https://www.genome.gov/25520493/online-education-kit-2003-fiftieth-anniversary-of-watson-and-cricks-description-of-the-double-helix",
      "https://www.genome.gov/sites/default/files/media/files/2022-08/nature_article_molecular_structure_of_nucleic_acids_1953.pdf"
    ],
    "hint": "1953년 모형을 발표한 두 사람의 성을 고르세요.",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 25,
    "category": "과학",
    "difficulty": "medium",
    "question": "원자번호 1번 원소는?",
    "options": [
      "수소",
      "헬륨",
      "리튬",
      "탄소"
    ],
    "correctAnswer": 0,
    "explanation": "수소(H)는 원자번호 1번으로 가장 가벼운 원소입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "주기율표의 첫 칸에 놓인 가장 가벼운 원소입니다.",
    "sources": [
      "https://periodic-table.rsc.org/element/1/hydrogen"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 26,
    "category": "과학",
    "difficulty": "easy",
    "question": "지구의 건조한 대기에서 부피 비율이 가장 높은 기체는?",
    "options": [
      "산소",
      "질소",
      "이산화탄소",
      "수소"
    ],
    "correctAnswer": 1,
    "explanation": "질소는 대기의 약 78%를 차지합니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "건조한 공기의 약 4분의 3 이상을 차지하는 기체입니다.",
    "sources": [
      "https://www.noaa.gov/jetstream/atmosphere"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 27,
    "category": "과학",
    "difficulty": "medium",
    "question": "???? 0K? ?? ? ?????",
    "options": [
      "-100°C",
      "-373°C",
      "-273.15°C",
      "0°C"
    ],
    "correctAnswer": 2,
    "explanation": "????? 0K? ??? -273.15?C???.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "물의 어는점보다 약 273도 낮은 온도입니다.",
    "sources": [
      "https://www.nist.gov/pml/owm/si-units-temperature",
      "https://www.nist.gov/mml/acmd/cryogenic-technologies-project/about-cryogenics"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 28,
    "category": "과학",
    "difficulty": "hard",
    "question": "??? ????? ???? ???? ????? ?? ?????",
    "options": [
      "이산화탄소와 물",
      "질소와 수소",
      "메탄과 산소",
      "포도당과 산소"
    ],
    "correctAnswer": 3,
    "explanation": "???? ??? ???? ????? ??? ???? ?????? ?? ??? ???? ??? ????.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "식물이 빛을 이용해 만든 당과 대기로 내보내는 기체를 함께 고르세요.",
    "sources": [
      "https://openstax.org/books/concepts-biology/pages/5-1-overview-of-photosynthesis",
      "https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 29,
    "category": "과학",
    "difficulty": "easy",
    "question": "인체의 외부를 덮으며 면적 기준으로 가장 큰 장기는?",
    "options": [
      "피부",
      "심장",
      "간",
      "폐"
    ],
    "correctAnswer": 0,
    "explanation": "피부는 인체 외부를 덮는 장기입니다. 내부 장기만 묻는 문제와 구분합니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "몸 전체를 감싸며 외부 환경과 직접 맞닿는 장기입니다.",
    "sources": [
      "https://www.hse.gov.uk/skin/professional/structure.htm",
      "https://www.ncbi.nlm.nih.gov/books/NBK470464/"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 30,
    "category": "과학",
    "difficulty": "medium",
    "question": "상대성 이론을 발표한 과학자는?",
    "options": [
      "뉴턴",
      "아인슈타인",
      "갈릴레이",
      "호킹"
    ],
    "correctAnswer": 1,
    "explanation": "?????? 1905? ???????? ????, 1915? ???????? ??? ???? ??????.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "질량과 에너지의 관계를 나타내는 E=mc²로도 유명합니다.",
    "sources": [
      "https://www.nasa.gov/image-article/einstein-general-relativity/",
      "https://educationalgames.nobelprize.org/educational/physics/relativity/history-1.html"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 31,
    "category": "예술과 문화",
    "difficulty": "easy",
    "question": "'모나리자'를 그린 화가는?",
    "options": [
      "피카소",
      "고흐",
      "다빈치",
      "미켈란젤로"
    ],
    "correctAnswer": 2,
    "explanation": "??????? ????? ???? ?? ???? ??? ??????.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "피렌체 출신 르네상스 예술가이며 「최후의 만찬」도 그렸습니다.",
    "hintSource": "https://www.louvre.fr/en/explore/visitor-trails/the-louvre-s-masterpieces/a-superstar-and-a-wedding-crowd",
    "sources": [
      "https://www.louvre.fr/en/explore/visitor-trails/the-louvre-s-masterpieces/a-superstar-and-a-wedding-crowd"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 32,
    "category": "예술과 문화",
    "difficulty": "medium",
    "question": "베토벤이 완성한 번호 붙은 교향곡은 몇 개인가요?",
    "options": [
      "5개",
      "7개",
      "12개",
      "9개"
    ],
    "correctAnswer": 3,
    "explanation": "루트비히 판 베토벤은 총 9개의 교향곡을 작곡했습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "마지막 번호의 교향곡에는 합창이 들어갑니다.",
    "hintSource": "https://www.bso.org/works/beethoven-the-nine-symphonies",
    "sources": [
      "https://www.bso.org/works/beethoven-the-nine-symphonies"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 33,
    "category": "예술과 문화",
    "difficulty": "easy",
    "question": "'해바라기' 연작으로 유명한 화가는?",
    "options": [
      "고흐",
      "모네",
      "르누아르",
      "세잔"
    ],
    "correctAnswer": 0,
    "explanation": "빈센트 반 고흐는 1888-1889년 해바라기 연작을 그렸습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "네덜란드 출신 화가이며 노란색 꽃을 여러 차례 그렸습니다.",
    "hintSource": "https://www.vangoghmuseum.nl/en/about/support-the-museum/founders-and-main-partners/sunflower-flash",
    "sources": [
      "https://www.vangoghmuseum.nl/en/about/support-the-museum/founders-and-main-partners/sunflower-flash",
      "https://www.nationalgallery.org.uk/paintings/vincent-van-gogh-sunflowers"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 34,
    "category": "예술과 문화",
    "difficulty": "hard",
    "question": "'게르니카'를 그린 화가는?",
    "options": [
      "달리",
      "피카소",
      "미로",
      "고야"
    ],
    "correctAnswer": 1,
    "explanation": "파블로 피카소는 1937년 스페인 내전을 주제로 게르니카를 그렸습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "스페인 내전의 민간인 폭격을 다룬 대형 그림을 떠올려 보세요.",
    "sources": [
      "https://www.museoreinasofia.es/en/collections/artwork/guernica-0/"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 35,
    "category": "예술과 문화",
    "difficulty": "medium",
    "question": "'로미오와 줄리엣'의 작가는?",
    "options": [
      "괴테",
      "단테",
      "셰익스피어",
      "호메로스"
    ],
    "correctAnswer": 2,
    "explanation": "윌리엄 셰익스피어는 1595년경 로미오와 줄리엣을 집필했습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "엘리자베스 시대 영국의 극작가입니다.",
    "sources": [
      "https://shakespearedocumented.folger.edu/resource/document/romeo-and-juliet-third-edition",
      "https://www.rsc.org.uk/romeo-and-juliet/about-the-play/dates-and-sources"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 36,
    "category": "예술과 문화",
    "difficulty": "easy",
    "question": "피아노의 건반 수는 일반적으로 몇 개인가요?",
    "options": [
      "52개",
      "66개",
      "100개",
      "88개"
    ],
    "correctAnswer": 3,
    "explanation": "현대 피아노는 일반적으로 88개의 건반(52개 백건, 36개 흑건)을 가지고 있습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "표준 현대 피아노는 흰 건반 52개와 검은 건반 36개로 구성됩니다.",
    "sources": [
      "https://europe.yamaha.com/en/musical-instruments/pianos/explore/musical-instrument-guide/piano/trivia/trivia007.html"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 37,
    "category": "예술과 문화",
    "difficulty": "medium",
    "question": "'생각하는 사람' 조각의 작가는?",
    "options": [
      "로댕",
      "미켈란젤로",
      "베르니니",
      "도나텔로"
    ],
    "correctAnswer": 0,
    "explanation": "오귀스트 로댕의 작품입니다. 초기 구상과 대형 주조본 제작 시점은 다릅니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "처음에는 「지옥의 문」 구성 요소로 구상된 조각입니다.",
    "hintSource": "https://www.musee-rodin.fr/en/musee/collections/oeuvres/penseur-meudon",
    "sources": [
      "https://www.musee-rodin.fr/en/musee/collections/oeuvres/penseur-meudon",
      "https://www.metmuseum.org/art/collection/search/191811"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 38,
    "category": "예술과 문화",
    "difficulty": "hard",
    "question": "인상주의 화파의 이름은 어느 작품에서 유래했나요?",
    "options": [
      "수련",
      "인상, 해돋이",
      "물랭 루즈",
      "별이 빛나는 밤"
    ],
    "correctAnswer": 1,
    "explanation": "클로드 모네의 '인상, 해돋이(1872)'에서 인상주의라는 이름이 유래했습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "클로드 모네가 항구의 해돋이를 그린 작품 제목을 떠올려 보세요.",
    "sources": [
      "https://www.marmottan.fr/en/notice/4014/",
      "https://www.marmottan.fr/wp-content/uploads/2021/12/PR-MUSEE-MARMOTTAN-MONET_FACING-THE-SUN_2022_2023-_EMAIL.pdf"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 39,
    "category": "예술과 문화",
    "difficulty": "easy",
    "question": "한국의 전통 음악을 무엇이라 하나요?",
    "options": [
      "가요",
      "민요",
      "국악",
      "판소리"
    ],
    "correctAnswer": 2,
    "explanation": "국악은 한국의 전통 음악을 총칭하는 말입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "판소리·산조·정악 등을 아우르는 한국 음악의 이름입니다.",
    "sources": [
      "https://www.kh.or.kr/visit/en/bbsctt/list.do?key=2408080009",
      "https://www.mcst.go.kr/english/useful/month202506.jsp"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 40,
    "category": "예술과 문화",
    "difficulty": "medium",
    "question": "'돈키호테'의 작가는?",
    "options": [
      "톨스토이",
      "도스토예프스키",
      "발자크",
      "세르반테스"
    ],
    "correctAnswer": 3,
    "explanation": "미겔 데 세르반테스는 1605년과 1615년 돈키호테를 출간했습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "풍차를 거인으로 착각한 기사의 이야기를 쓴 스페인 작가입니다.",
    "sources": [
      "https://www.bne.es/es/colecciones/cervantes/ingenioso-hidalgo-don-quixote-mancha",
      "https://www.bne.es/es/colecciones/cervantes/segunda-parte-ingenioso-cauallero-don-quixote-mancha"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 41,
    "category": "한국사",
    "difficulty": "medium",
    "question": "1170년 무신정변 직후 무신들이 국정을 논의한 기구는?",
    "options": [
      "중방",
      "정방",
      "도방",
      "삼별초"
    ],
    "correctAnswer": 0,
    "explanation": "중방입니다. 무신정권 전체 시기의 권력기구를 하나로 일반화하지 않습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "무신들이 군사 문제와 국정을 논의하던 고려의 회의 기구입니다.",
    "sources": [
      "https://contents.history.go.kr/front/tg/view.do?ganada=%EC%9E%90&levelId=tg_002_0390&pageUnit=10&treeId=0209",
      "https://encykorea.aks.ac.kr/Article/E0053757"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 42,
    "category": "한국사",
    "difficulty": "hard",
    "question": "조선 후기 실학자 중 '북학의'를 저술한 인물은?",
    "options": [
      "박지원",
      "박제가",
      "정약용",
      "이익"
    ],
    "correctAnswer": 1,
    "explanation": "박제가는 18세기 후반 실학자로 '북학의(北學議)'를 저술하여 청나라의 선진 문물을 배울 것을 주장했습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "청나라의 문물을 배우자는 북학파 실학자입니다.",
    "sources": [
      "https://encykorea.aks.ac.kr/Article/E0024784"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 43,
    "category": "한국사",
    "difficulty": "hard",
    "question": "대한민국 임시정부가 처음 수립된 장소는?",
    "options": [
      "베이징",
      "난징",
      "상하이",
      "충칭"
    ],
    "correctAnswer": 2,
    "explanation": "대한민국 임시정부는 1919년 4월 11일 중국 상하이에서 수립되었습니다. 이후 일제의 탄압을 피해 항저우, 충칭 등으로 이동했습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "1919년 4월 11일, 중국의 한 항구 도시에서 수립되었습니다.",
    "hintSource": "https://www.nmkpg.go.kr/webzine/story/cn.do?rid=404",
    "sources": [
      "https://www.nmkpg.go.kr/webzine/story/cn.do?rid=404"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 44,
    "category": "한국사",
    "difficulty": "hard",
    "question": "조선 후기 세도정치 시대의 '삼정의 문란'에 포함되지 않는 것은?",
    "options": [
      "전정",
      "군정",
      "환곡",
      "공납"
    ],
    "correctAnswer": 3,
    "explanation": "삼정은 전정·군정·환곡을 뜻합니다. 공납은 이 세 항목에 포함되지 않습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "삼정은 전정·군정·환곡을 가리킵니다. 여기에 없는 제도를 고르세요.",
    "sources": [
      "https://encykorea.aks.ac.kr/Article/E0026794",
      "https://contents.history.go.kr/front/tg/view.do?levelId=tg_003_1850&treeId=0201"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 45,
    "category": "한국사",
    "difficulty": "hard",
    "question": "조선시대 4대 사화 중 가장 마지막에 일어난 것은?",
    "options": [
      "을사사화",
      "무오사화",
      "갑자사화",
      "기묘사화"
    ],
    "correctAnswer": 0,
    "explanation": "을사사화(1545년)는 명종 때 일어난 마지막 사화입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "무오·갑자·기묘 다음에 일어난 사화를 고르세요.",
    "hintSource": "https://encykorea.aks.ac.kr/Article/E0026117",
    "sources": [
      "https://encykorea.aks.ac.kr/Article/E0026117",
      "https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_30&levelId=kc_i304900"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 46,
    "category": "지리",
    "difficulty": "medium",
    "question": "아프리카 대륙에서 면적이 가장 큰 국가는?",
    "options": [
      "나이지리아",
      "알제리",
      "남아프리카공화국",
      "이집트"
    ],
    "correctAnswer": 1,
    "explanation": "알제리는 약 238만km²로 아프리카에서 가장 큰 국가입니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "북아프리카에 있으며 지중해와 사하라 사막에 접한 나라입니다.",
    "sources": [
      "https://opecfund.org/who-we-are/member-countries/algeria"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 47,
    "category": "과학",
    "difficulty": "easy",
    "question": "??? ????? ?? ??? ? ??? ????",
    "options": [
      "산소",
      "질소",
      "이산화탄소",
      "수소"
    ],
    "correctAnswer": 2,
    "explanation": "식물은 이산화탄소와 물, 빛을 이용해 광합성을 합니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "식물이 광합성할 때 흡수하고 산소를 내보내는 기체입니다.",
    "sources": [
      "https://openstax.org/books/concepts-biology/pages/5-1-overview-of-photosynthesis"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 48,
    "category": "예술과 문화",
    "difficulty": "medium",
    "question": "레오나르도 다빈치의 '최후의 만찬'이 그려진 도시는?",
    "options": [
      "로마",
      "피렌체",
      "베네치아",
      "밀라노"
    ],
    "correctAnswer": 3,
    "explanation": "최후의 만찬은 밀라노의 산타 마리아 델레 그라치에 수도원에 있습니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "hint": "이탈리아 북부 도시의 산타 마리아 델레 그라치에 수도원 식당 벽화입니다.",
    "hintSource": "https://cenacolovinciano.org/en/museum/the-works/the-last-supper-leonardo-da-vinci-1452-1519/",
    "sources": [
      "https://cenacolovinciano.org/en/museum/the-works/the-last-supper-leonardo-da-vinci-1452-1519/"
    ],
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 49,
    "category": "과학",
    "difficulty": "medium",
    "question": "산소를 이용한 세포 호흡에서 산화적 인산화를 통해 ATP를 합성하는 세포 소기관은?",
    "options": [
      "미토콘드리아",
      "리보솜",
      "골지체",
      "리소좀"
    ],
    "correctAnswer": 0,
    "explanation": "미토콘드리아의 내막에서는 전자전달계가 형성한 양성자 농도 기울기를 이용해 ATP 합성효소가 ATP를 만듭니다. 이 과정을 산화적 인산화라고 합니다.",
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "sources": [
      "https://www.genome.gov/genetics-glossary/Mitochondria",
      "https://openstax.org/books/concepts-biology/pages/4-3-citric-acid-cycle-and-oxidative-phosphorylation"
    ],
    "hint": "이중막으로 둘러싸여 있으며, 내막에 전자전달계와 ATP 합성효소가 있습니다.",
    "hintSource": "https://www.genome.gov/genetics-glossary/Mitochondria",
    "verifiedAt": "2026-11-18"
  },
  {
    "category": "한국사",
    "difficulty": "hard",
    "question": "해인사 고려대장경판 및 제경판이 유네스코 세계기록유산에 등재된 해는?",
    "options": [
      "1995년",
      "2007년",
      "1997년",
      "2001년"
    ],
    "correctAnswer": 1,
    "explanation": "고려대장경판 및 제경판의 세계기록유산 등재 연도는 2007년입니다. 장경판전 건물의 세계유산 등재와 구분해야 합니다.",
    "hint": "2000년대이며 조선왕조 의궤와 같은 해에 등재되었습니다.",
    "sources": [
      "https://english.visitkorea.or.kr/svc/contents/infoHtmlView.do?vcontsId=172557",
      "https://media.unesco.org/sites/default/files/webform/mow001/korea_tripitaka.pdf"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "id": 50,
    "verifiedAt": "2026-11-18"
  },
  {
    "category": "예술과 문화",
    "difficulty": "hard",
    "question": "해인사에 보관된 고려대장경의 경전 인쇄판은 어떤 재료로 만들어졌나요?",
    "options": [
      "청동",
      "화강암",
      "나무",
      "점토"
    ],
    "correctAnswer": 2,
    "explanation": "?????? ??? ???? ?? ?????. UNESCO? ?? ?? ????? ??? ?? ????? ??? ? ????.",
    "hint": "금속활자와 구분되는 목판 인쇄 문화유산입니다.",
    "sources": [
      "https://media.unesco.org/sites/default/files/webform/mow001/korea_tripitaka.pdf",
      "https://english.visitkorea.or.kr/svc/contents/infoHtmlView.do?vcontsId=172557"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "id": 51,
    "verifiedAt": "2026-11-18"
  },
  {
    "category": "지리",
    "difficulty": "hard",
    "question": "스페인 남부와 모로코 북부 사이에서 대서양과 지중해를 연결하는 해협은?",
    "options": [
      "호르무즈 해협",
      "말라카 해협",
      "베링 해협",
      "지브롤터 해협"
    ],
    "correctAnswer": 3,
    "explanation": "지브롤터 해협은 스페인 남부와 모로코 북부 사이에 있으며 대서양과 지중해를 연결합니다.",
    "hint": "유럽의 이베리아반도와 아프리카 북서부 사이에 있는 해협입니다.",
    "sources": [
      "https://www.nasa.gov/image-article/strait-of-gibraltar-connects-atlantic-mediterranean/"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "id": 52,
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 53,
    "category": "한국사",
    "difficulty": "easy",
    "question": "수원 화성 건설을 추진한 조선의 왕은?",
    "options": [
      "영조",
      "세종",
      "정조",
      "고종"
    ],
    "correctAnswer": 2,
    "explanation": "정조는 18세기 말 수원 화성을 건설했습니다.",
    "hint": "사도세자의 아들이며 조선의 22대 왕입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/817/",
      "https://www.suwon.go.kr/sw-www/sw-visitsuwon/sw-visitsuwon-01/sw-visitsuwon-01-01/sw-visitsuwon-01-01-01.jsp"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 54,
    "category": "한국사",
    "difficulty": "easy",
    "question": "정조 때 축조된 화성 성곽이 둘러싸고 있는 도시는?",
    "options": [
      "수원",
      "전주",
      "공주",
      "안동"
    ],
    "correctAnswer": 0,
    "explanation": "화성은 경기도 수원 도심을 둘러싼 조선시대 성곽입니다.",
    "hint": "경기도청이 있는 도시를 떠올려 보세요.",
    "sources": [
      "https://whc.unesco.org/en/list/817/",
      "https://www.suwon.go.kr/sw-www/sw-visitsuwon/sw-visitsuwon-01/sw-visitsuwon-01-01/sw-visitsuwon-01-01-01.jsp"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 55,
    "category": "한국사",
    "difficulty": "medium",
    "question": "종묘의 주된 역할은 무엇이었나요?",
    "options": [
      "천문 관측",
      "군사 훈련",
      "과거 시험 시행",
      "왕과 왕비의 신위를 모시고 제사를 지냄"
    ],
    "correctAnswer": 3,
    "explanation": "종묘는 조선 왕과 왕비 등의 신위를 모시고 왕실의 제사를 지내는 사당입니다.",
    "hint": "왕실의 조상을 기리는 의례와 관련이 있습니다.",
    "sources": [
      "https://whc.unesco.org/en/list/738/",
      "https://royal.khs.go.kr/ENG/contents/E105010000.do"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 56,
    "category": "한국사",
    "difficulty": "medium",
    "question": "종묘의 제례와 공간 구성에 바탕이 된 사상은?",
    "options": [
      "법가",
      "유교",
      "도교",
      "묵가"
    ],
    "correctAnswer": 1,
    "explanation": "종묘는 왕실의 조상 숭배와 의례를 중시하는 유교 원리에 따라 조성되었습니다.",
    "hint": "조선의 국가 통치와 예법의 바탕이 된 사상입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/738/",
      "https://royal.khs.go.kr/ENG/contents/E105010000.do"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 57,
    "category": "한국사",
    "difficulty": "medium",
    "question": "불국사와 석굴암이 8세기에 조성된 시기는?",
    "options": [
      "통일신라",
      "고려 후기",
      "조선 전기",
      "대한제국"
    ],
    "correctAnswer": 0,
    "explanation": "불국사와 석굴암은 8세기 통일신라의 불교 건축과 조각 문화를 보여 줍니다.",
    "hint": "수도는 오늘날의 경주였습니다.",
    "sources": [
      "https://whc.unesco.org/en/list/736/",
      "https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=235&vcontsId=172555"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 58,
    "category": "한국사",
    "difficulty": "hard",
    "question": "인공 석굴 사원인 석굴암의 주요 건축 재료는?",
    "options": [
      "석회암",
      "벽돌",
      "화강암",
      "대리석"
    ],
    "correctAnswer": 2,
    "explanation": "석굴암은 화강암을 다듬어 쌓아 만든 인공 석굴입니다.",
    "hint": "한반도 산지에 널리 분포하는 단단한 암석입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/736/",
      "https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=235&vcontsId=172555"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 59,
    "category": "한국사",
    "difficulty": "hard",
    "question": "백제역사유적지구의 유적이 분포한 세 도시는?",
    "options": [
      "경주·안동·영주",
      "공주·부여·익산",
      "서울·수원·개성",
      "전주·나주·목포"
    ],
    "correctAnswer": 1,
    "explanation": "백제역사유적지구는 공주·부여·익산에 있는 8개 유적으로 구성됩니다.",
    "hint": "웅진과 사비의 역사를 담은 도시들이 포함됩니다.",
    "sources": [
      "https://whc.unesco.org/en/list/1477/",
      "https://english.visitkorea.or.kr/web_book/unesco_eng/index.html"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 60,
    "category": "한국사",
    "difficulty": "medium",
    "question": "백제의 옛 수도 사비는 오늘날 어디에 해당하나요?",
    "options": [
      "공주",
      "익산",
      "경주",
      "부여"
    ],
    "correctAnswer": 3,
    "explanation": "백제의 사비는 오늘날의 부여이며, 웅진은 오늘날의 공주입니다.",
    "hint": "정림사지와 부소산성이 있는 지역입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/1477/",
      "https://english.visitkorea.or.kr/web_book/unesco_eng/index.html"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 61,
    "category": "한국사",
    "difficulty": "easy",
    "question": "고창·화순·강화의 고인돌은 주로 어떤 용도로 만들어졌나요?",
    "options": [
      "무덤",
      "곡물 창고",
      "관개 수로",
      "성문"
    ],
    "correctAnswer": 0,
    "explanation": "고인돌은 큰 돌을 사용해 만든 선사시대의 무덤입니다.",
    "hint": "매장과 장례 문화에 관한 유적입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/977/",
      "https://english.visitkorea.or.kr/svc/contents/infoHtmlView.do?vcontsId=172555"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 62,
    "category": "한국사",
    "difficulty": "medium",
    "question": "고창·화순·강화의 고인돌은 한국의 어느 시대 사회를 이해하는 주요 자료인가요?",
    "options": [
      "조선시대",
      "고려시대",
      "청동기시대",
      "일제강점기"
    ],
    "correctAnswer": 2,
    "explanation": "이 고인돌 유적은 청동기시대의 장례 문화와 사회 구조를 이해하는 자료입니다.",
    "hint": "철기시대 이전의 금속 사용 시기를 떠올려 보세요.",
    "sources": [
      "https://whc.unesco.org/en/list/977/",
      "https://english.visitkorea.or.kr/svc/contents/infoHtmlView.do?vcontsId=172555"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 63,
    "category": "한국사",
    "difficulty": "hard",
    "question": "1405년 창덕궁을 창건한 조선의 왕은?",
    "options": [
      "성종",
      "정조",
      "광해군",
      "태종"
    ],
    "correctAnswer": 3,
    "explanation": "창덕궁은 태종 5년인 1405년에 경복궁의 이궁으로 창건되었습니다.",
    "hint": "세종의 아버지이며 조선의 세 번째 왕입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/816/",
      "https://royal.khs.go.kr/ENG/contents/E102010000.do"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 64,
    "category": "한국사",
    "difficulty": "medium",
    "question": "창덕궁의 배치와 정원에서 두드러지는 특징은?",
    "options": [
      "모든 언덕을 깎아 평지로 만듦",
      "자연 지형과 주변 경관에 맞춤",
      "건물 전체를 원형으로 배치함",
      "궁궐 전체를 돌로만 지음"
    ],
    "correctAnswer": 1,
    "explanation": "창덕궁은 고르지 않은 지형을 살려 건물과 정원을 주변 경관과 조화롭게 배치했습니다.",
    "hint": "땅의 생김새를 억지로 바꾸기보다 활용했습니다.",
    "sources": [
      "https://whc.unesco.org/en/list/816/",
      "https://royal.khs.go.kr/ENG/contents/E102010000.do"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 65,
    "category": "과학",
    "difficulty": "easy",
    "question": "태양에서 공전 궤도의 평균 거리가 가장 가까운 행성은?",
    "options": [
      "금성",
      "수성",
      "지구",
      "화성"
    ],
    "correctAnswer": 1,
    "explanation": "수성은 태양에 가장 가까운 궤도를 도는 행성입니다.",
    "hint": "태양계의 행성을 태양에서 가까운 순서로 나열하면 첫 번째입니다.",
    "sources": [
      "https://science.nasa.gov/mercury/facts/",
      "https://www.esa.int/kids/en/learn/Our_Universe/Planets_and_moons/Mercury"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 66,
    "category": "과학",
    "difficulty": "hard",
    "question": "수성이 태양 주위를 한 바퀴 공전하는 데 걸리는 시간은 지구 시간으로 약 얼마인가요?",
    "options": [
      "24일",
      "365일",
      "687일",
      "88일"
    ],
    "correctAnswer": 3,
    "explanation": "수성의 공전 주기는 약 88지구일입니다. 자전 주기와는 구분합니다.",
    "hint": "지구의 1년보다 훨씬 짧고 100일보다 적습니다.",
    "sources": [
      "https://science.nasa.gov/mercury/facts/",
      "https://www.esa.int/kids/en/learn/Our_Universe/Planets_and_moons/Mercury"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 67,
    "category": "과학",
    "difficulty": "medium",
    "question": "태양계 행성 중 평균 표면 온도가 가장 높은 행성은?",
    "options": [
      "금성",
      "수성",
      "화성",
      "지구"
    ],
    "correctAnswer": 0,
    "explanation": "금성은 두꺼운 대기의 강한 온실효과로 수성보다 표면이 더 뜨겁습니다.",
    "hint": "태양에서 두 번째 행성이며 대기가 매우 두껍습니다.",
    "sources": [
      "https://science.nasa.gov/venus/venus-facts/",
      "https://www.esa.int/Science_Exploration/Space_Science/Venus_Express/Venusian_geography"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 68,
    "category": "과학",
    "difficulty": "hard",
    "question": "금성 대기의 대부분을 차지하는 기체는?",
    "options": [
      "산소",
      "헬륨",
      "이산화탄소",
      "수소"
    ],
    "correctAnswer": 2,
    "explanation": "금성의 대기는 대부분 이산화탄소로 이루어져 있습니다.",
    "hint": "지구에서도 온실효과에 관여하는 기체입니다.",
    "sources": [
      "https://science.nasa.gov/venus/venus-facts/",
      "https://www.esa.int/Science_Exploration/Space_Science/Venus_Express/Venusian_geography"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 69,
    "category": "과학",
    "difficulty": "medium",
    "question": "화성 표면의 붉은빛과 주로 관련된 물질은?",
    "options": [
      "소금 결정",
      "액체 수은",
      "황산구리",
      "산화철"
    ],
    "correctAnswer": 3,
    "explanation": "화성 표면의 먼지와 암석에 있는 산화철 계열 물질이 붉은빛을 만듭니다.",
    "hint": "철이 산화되어 생기는 녹을 떠올려 보세요.",
    "sources": [
      "https://science.nasa.gov/mars/facts/",
      "https://www.esa.int/nb/media/why-is-mars-red"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 70,
    "category": "과학",
    "difficulty": "hard",
    "question": "포보스와 데이모스는 어느 행성의 위성인가요?",
    "options": [
      "금성",
      "화성",
      "해왕성",
      "수성"
    ],
    "correctAnswer": 1,
    "explanation": "포보스와 데이모스는 화성의 두 작은 위성입니다.",
    "hint": "붉은 행성의 주변을 돕니다.",
    "sources": [
      "https://science.nasa.gov/mars/facts/",
      "https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/Meet_Mars"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 71,
    "category": "과학",
    "difficulty": "medium",
    "question": "토성의 밝은 고리를 이루는 입자의 주성분은?",
    "options": [
      "순금",
      "유리",
      "얼음",
      "액체 질소"
    ],
    "correctAnswer": 2,
    "explanation": "토성의 고리는 주로 얼음 입자로 이루어져 있으며 암석과 먼지도 포함합니다.",
    "hint": "햇빛을 잘 반사하는 차가운 물질입니다.",
    "sources": [
      "https://science.nasa.gov/saturn/facts/",
      "https://www.esa.int/ESA_Multimedia/Images/2019/09/Hubble_reveals_latest_portrait_of_Saturn"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 72,
    "category": "과학",
    "difficulty": "hard",
    "question": "자전축이 약 98도 기울어져 옆으로 누운 듯 자전하는 행성은?",
    "options": [
      "천왕성",
      "목성",
      "지구",
      "화성"
    ],
    "correctAnswer": 0,
    "explanation": "천왕성은 자전축 기울기가 약 98도여서 옆으로 누운 듯한 모습으로 자전합니다.",
    "hint": "태양에서 일곱 번째 행성입니다.",
    "sources": [
      "https://science.nasa.gov/helio-and-you-seasons-on-earth-mars-and-beyond/",
      "https://www.esa.int/ESA_Multimedia/Images/2024/12/Hubble_celebrates_a_decade_of_tracking_the_outer_planets"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 73,
    "category": "과학",
    "difficulty": "easy",
    "question": "산소의 원자번호는?",
    "options": [
      "1",
      "6",
      "8",
      "26"
    ],
    "correctAnswer": 2,
    "explanation": "산소의 원자번호는 8입니다. 원자번호는 원자핵의 양성자 수를 뜻합니다.",
    "hint": "탄소의 원자번호 6보다 두 자리 뒤에 있습니다.",
    "sources": [
      "https://periodic-table.rsc.org/element/8/oxygen",
      "https://pubchem.ncbi.nlm.nih.gov/element/8"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 74,
    "category": "과학",
    "difficulty": "easy",
    "question": "탄소의 원소 기호는?",
    "options": [
      "Ca",
      "Co",
      "Cl",
      "C"
    ],
    "correctAnswer": 3,
    "explanation": "탄소의 원소 기호는 C이고 원자번호는 6입니다.",
    "hint": "영어 이름 Carbon의 첫 글자입니다.",
    "sources": [
      "https://periodic-table.rsc.org/element/6/carbon",
      "https://pubchem.ncbi.nlm.nih.gov/element/6"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 75,
    "category": "과학",
    "difficulty": "medium",
    "question": "금의 원소 기호는?",
    "options": [
      "Ag",
      "Au",
      "Al",
      "Ar"
    ],
    "correctAnswer": 1,
    "explanation": "금의 원소 기호는 Au로, 라틴어 aurum에서 유래했습니다.",
    "hint": "은의 기호 Ag와 혼동하지 마세요.",
    "sources": [
      "https://periodic-table.rsc.org/element/79/Gold",
      "https://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=23985"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 76,
    "category": "과학",
    "difficulty": "easy",
    "question": "원소 기호 Fe는 어떤 원소인가요?",
    "options": [
      "철",
      "플루오린",
      "납",
      "주석"
    ],
    "correctAnswer": 0,
    "explanation": "Fe는 철의 원소 기호이며 원자번호는 26입니다.",
    "hint": "강철을 만드는 데 바탕이 되는 금속입니다.",
    "sources": [
      "https://periodic-table.rsc.org/element/26/iron",
      "https://pubchem.ncbi.nlm.nih.gov/element/Fe"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 77,
    "category": "지리",
    "difficulty": "medium",
    "question": "갈라파고스 제도는 어느 나라에 속하나요?",
    "options": [
      "에콰도르",
      "칠레",
      "멕시코",
      "포르투갈"
    ],
    "correctAnswer": 0,
    "explanation": "갈라파고스 제도는 남아메리카의 에콰도르에 속합니다.",
    "hint": "국토에 적도가 지나가는 남아메리카 국가입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/1/",
      "https://www.galapagos.org/about_galapagos/history/"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 78,
    "category": "지리",
    "difficulty": "easy",
    "question": "갈라파고스 제도가 있는 대양은?",
    "options": [
      "대서양",
      "인도양",
      "태평양",
      "북극해"
    ],
    "correctAnswer": 2,
    "explanation": "갈라파고스 제도는 에콰도르 본토의 서쪽 태평양에 있습니다.",
    "hint": "남아메리카의 서쪽에 있는 큰 바다입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/1/",
      "https://www.galapagos.org/about_galapagos/history/"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 79,
    "category": "지리",
    "difficulty": "medium",
    "question": "갈라파고스 제도 형성의 주된 지질 작용은?",
    "options": [
      "빙하 퇴적",
      "운석 충돌",
      "산호 성장만으로 형성",
      "화산 활동"
    ],
    "correctAnswer": 3,
    "explanation": "갈라파고스 제도는 해저에서 시작된 화산 활동으로 형성된 섬들입니다.",
    "hint": "용암과 분화구가 남아 있는 섬들입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/1/",
      "https://www.galapagos.org/about_galapagos/history/"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 80,
    "category": "지리",
    "difficulty": "easy",
    "question": "마추픽추가 있는 나라는?",
    "options": [
      "볼리비아",
      "페루",
      "이집트",
      "인도"
    ],
    "correctAnswer": 1,
    "explanation": "마추픽추는 페루의 안데스산맥에 있는 잉카 유적입니다.",
    "hint": "수도가 리마인 남아메리카 국가입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/274/",
      "https://www.peru.travel/attractions/machu-picchu"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 81,
    "category": "지리",
    "difficulty": "medium",
    "question": "마추픽추가 자리한 산맥은?",
    "options": [
      "알프스산맥",
      "히말라야산맥",
      "안데스산맥",
      "로키산맥"
    ],
    "correctAnswer": 2,
    "explanation": "마추픽추는 남아메리카 서부의 안데스산맥에 자리합니다.",
    "hint": "남아메리카 서쪽을 따라 길게 뻗은 산맥입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/274/",
      "https://www.peru.travel/attractions/machu-picchu"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 82,
    "category": "지리",
    "difficulty": "medium",
    "question": "마추픽추를 건설한 문명은?",
    "options": [
      "잉카",
      "마야",
      "아즈텍",
      "메소포타미아"
    ],
    "correctAnswer": 0,
    "explanation": "마추픽추는 15세기 잉카 문명이 건설한 도시 유적입니다.",
    "hint": "쿠스코를 중심으로 안데스 지역에서 번성했습니다.",
    "sources": [
      "https://whc.unesco.org/en/list/274/",
      "https://www.peru.travel/attractions/machu-picchu"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 83,
    "category": "지리",
    "difficulty": "medium",
    "question": "미국 그랜드캐니언을 깊게 깎아 만든 주된 강은?",
    "options": [
      "미시시피강",
      "콜로라도강",
      "허드슨강",
      "세인트로렌스강"
    ],
    "correctAnswer": 1,
    "explanation": "콜로라도강의 하방 침식이 그랜드캐니언 형성에 큰 역할을 했습니다.",
    "hint": "미국 남서부를 흐르며 미드호와도 연결됩니다.",
    "sources": [
      "https://whc.unesco.org/en/list/75/",
      "https://www.nps.gov/grca/learn/nature/grca-geology.htm"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 84,
    "category": "지리",
    "difficulty": "hard",
    "question": "그랜드캐니언 국립공원이 있는 미국의 주는?",
    "options": [
      "플로리다",
      "메인",
      "하와이",
      "애리조나"
    ],
    "correctAnswer": 3,
    "explanation": "그랜드캐니언 국립공원은 미국 남서부 애리조나주에 있습니다.",
    "hint": "피닉스가 주도인 주입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/75/",
      "https://www.nps.gov/grca/index.htm"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 85,
    "category": "지리",
    "difficulty": "hard",
    "question": "그랜드캐니언 벽의 오래된 기반암 위에 겹겹이 드러난 암석층은 주로 어떤 종류인가요?",
    "options": [
      "운석",
      "인공 콘크리트",
      "퇴적암",
      "순수한 금속"
    ],
    "correctAnswer": 2,
    "explanation": "그랜드캐니언의 오래된 화성암·변성암 기반 위에는 여러 시대의 퇴적암층이 쌓여 있습니다.",
    "hint": "모래나 진흙 등이 쌓여 굳어지면서 만들어지는 암석입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/75/",
      "https://www.nps.gov/grca/learn/nature/grca-geology.htm"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 86,
    "category": "지리",
    "difficulty": "easy",
    "question": "그레이트배리어리프가 해안 가까이에 있는 나라는?",
    "options": [
      "오스트레일리아",
      "노르웨이",
      "칠레",
      "캐나다"
    ],
    "correctAnswer": 0,
    "explanation": "그레이트배리어리프는 오스트레일리아 북동부 해안에 위치합니다.",
    "hint": "퀸즐랜드주 앞바다의 해양 생태계입니다.",
    "sources": [
      "https://whc.unesco.org/en/list/154/",
      "https://www.gbrmpa.gov.au/learn/fascinating-facts-about-great-barrier-reef"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 87,
    "category": "지리",
    "difficulty": "easy",
    "question": "그레이트배리어리프를 대표하는 해양 생태계는?",
    "options": [
      "극지 빙붕",
      "심해 열수구",
      "해저 소금 평원",
      "산호초"
    ],
    "correctAnswer": 3,
    "explanation": "그레이트배리어리프는 수많은 산호초로 이루어진 해양 생태계입니다.",
    "hint": "산호가 만든 구조물에 다양한 해양 생물이 살아갑니다.",
    "sources": [
      "https://whc.unesco.org/en/list/154/",
      "https://www.gbrmpa.gov.au/learn/fascinating-facts-about-great-barrier-reef"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 88,
    "category": "지리",
    "difficulty": "medium",
    "question": "그레이트배리어리프는 오스트레일리아의 어느 쪽 해안에 있나요?",
    "options": [
      "남서부",
      "북동부",
      "남동부",
      "북서부"
    ],
    "correctAnswer": 1,
    "explanation": "그레이트배리어리프는 퀸즐랜드주를 따라 오스트레일리아 북동부에 펼쳐집니다.",
    "hint": "대륙의 오른쪽 위 방향이며 퀸즐랜드와 접합니다.",
    "sources": [
      "https://whc.unesco.org/en/list/154/",
      "https://www.gbrmpa.gov.au/reef-authority-newsroom"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 89,
    "category": "예술과 문화",
    "difficulty": "medium",
    "question": "「가나가와 해변의 높은 파도 아래」를 제작한 일본 화가는?",
    "options": [
      "우타가와 히로시게",
      "기타가와 우타마로",
      "오가타 고린",
      "가쓰시카 호쿠사이"
    ],
    "correctAnswer": 3,
    "explanation": "이 작품은 가쓰시카 호쿠사이의 「후지산 36경」 연작에 속합니다.",
    "hint": "후지산을 주제로 여러 풍경을 그린 에도시대 화가입니다.",
    "sources": [
      "https://www.metmuseum.org/art/collection/search/45434",
      "https://collections.hammer.ucla.edu/artwork/1965.30.26"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 90,
    "category": "예술과 문화",
    "difficulty": "hard",
    "question": "호쿠사이의 「가나가와 해변의 높은 파도 아래」에 사용된 기법은?",
    "options": [
      "프레스코",
      "다색 목판화",
      "청동 주조",
      "대리석 조각"
    ],
    "correctAnswer": 1,
    "explanation": "이 작품은 여러 색의 잉크를 종이에 찍은 다색 목판화입니다.",
    "hint": "나무판에 새긴 그림을 종이에 찍어 냅니다.",
    "sources": [
      "https://www.metmuseum.org/art/collection/search/45434",
      "https://collections.hammer.ucla.edu/artwork/1965.30.26"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 91,
    "category": "예술과 문화",
    "difficulty": "easy",
    "question": "「진주 귀걸이를 한 소녀」의 화가는?",
    "options": [
      "요하네스 베르메르",
      "렘브란트",
      "프란스 할스",
      "피터르 브뤼헐"
    ],
    "correctAnswer": 0,
    "explanation": "요하네스 베르메르가 17세기 네덜란드에서 그린 작품입니다.",
    "hint": "「우유를 따르는 여인」으로도 알려진 화가입니다.",
    "sources": [
      "https://www.mauritshuis.nl/en/our-collection/artworks/670-girl-with-a-pearl-earring/",
      "https://www.rijksmuseum.nl/en/whats-on/exhibitions/past/vermeer/vermeer-exhibition-text"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 92,
    "category": "예술과 문화",
    "difficulty": "hard",
    "question": "「진주 귀걸이를 한 소녀」가 속하는 유형으로, 특정 인물의 초상보다 얼굴·표정·복식을 탐구한 그림을 뜻하는 말은?",
    "options": [
      "정물화",
      "해전도",
      "트로니",
      "제단화"
    ],
    "correctAnswer": 2,
    "explanation": "트로니는 특정 인물의 신원을 기록하는 초상화와 달리 인물의 얼굴·표정·특이한 복식 등을 탐구한 그림입니다.",
    "hint": "17세기 네덜란드에서 유행한 인물 표현 유형입니다.",
    "sources": [
      "https://www.mauritshuis.nl/en/our-collection/artworks/670-girl-with-a-pearl-earring/",
      "https://www.rijksmuseum.nl/en/whats-on/exhibitions/past/vermeer/vermeer-exhibition-text"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 93,
    "category": "예술과 문화",
    "difficulty": "medium",
    "question": "녹아내리는 듯한 시계가 등장하는 「기억의 지속」의 화가는?",
    "options": [
      "르네 마그리트",
      "살바도르 달리",
      "마르크 샤갈",
      "바실리 칸딘스키"
    ],
    "correctAnswer": 1,
    "explanation": "살바도르 달리가 그린 「기억의 지속」에는 늘어진 시계들이 등장합니다.",
    "hint": "스페인 출신의 초현실주의 화가입니다.",
    "sources": [
      "https://www.moma.org/collection/works/79018",
      "https://catalogues.salvador-dali.org/catalogues/en/heritageobject/478/"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 94,
    "category": "예술과 문화",
    "difficulty": "hard",
    "question": "달리의 「기억의 지속」이 제작된 해는?",
    "options": [
      "1504년",
      "1665년",
      "1889년",
      "1931년"
    ],
    "correctAnswer": 3,
    "explanation": "「기억의 지속」은 1931년에 제작된 유화입니다.",
    "hint": "20세기 작품이며 제2차 세계대전 이전에 그려졌습니다.",
    "sources": [
      "https://www.moma.org/collection/works/79018",
      "https://catalogues.salvador-dali.org/catalogues/en/heritageobject/478/"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 95,
    "category": "예술과 문화",
    "difficulty": "easy",
    "question": "「절규」라는 모티프로 여러 작품을 남긴 화가는?",
    "options": [
      "에드가 드가",
      "구스타프 클림트",
      "에드바르 뭉크",
      "앙리 마티스"
    ],
    "correctAnswer": 2,
    "explanation": "에드바르 뭉크는 「절규」를 회화·드로잉·판화 등 여러 형태로 제작했습니다.",
    "hint": "노르웨이의 대표적인 화가입니다.",
    "sources": [
      "https://www.munch.no/en/The-Scream/",
      "https://www.nasjonalmuseet.no/en/collection/object/NG.M.00939"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 96,
    "category": "예술과 문화",
    "difficulty": "hard",
    "question": "노르웨이 국립미술관이 소장한 뭉크의 「절규」 회화(NG.M.00939)의 제작 연도는?",
    "options": [
      "1893년",
      "1910년",
      "1937년",
      "1962년"
    ],
    "correctAnswer": 0,
    "explanation": "노르웨이 국립미술관의 해당 회화는 1893년 작품입니다. 다른 버전의 제작 연도와 구분해야 합니다.",
    "hint": "19세기 말에 그려진 버전입니다.",
    "sources": [
      "https://www.nasjonalmuseet.no/en/collection/object/NG.M.00939",
      "https://www.nasjonalmuseet.no/globalassets/dokumenter/ford2021_article_munch-oct-combined.pdf"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 97,
    "category": "예술과 문화",
    "difficulty": "medium",
    "question": "1501~1504년에 피렌체의 거대한 「다비드」상을 조각한 예술가는?",
    "options": [
      "도나텔로",
      "미켈란젤로",
      "베르니니",
      "로댕"
    ],
    "correctAnswer": 1,
    "explanation": "미켈란젤로는 1501~1504년 대리석 「다비드」상을 제작했습니다. 같은 주제의 다른 조각들과 구분합니다.",
    "hint": "시스티나 성당 천장화도 제작한 르네상스 예술가입니다.",
    "sources": [
      "https://www.galleriaaccademiafirenze.it/en/artworks/david-michelangelo/",
      "https://www.vam.ac.uk/articles/the-story-of-michelangelos-david"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 98,
    "category": "예술과 문화",
    "difficulty": "easy",
    "question": "미켈란젤로의 「다비드」상 원작의 재료는?",
    "options": [
      "대리석",
      "청동",
      "나무",
      "점토"
    ],
    "correctAnswer": 0,
    "explanation": "원작은 커다란 흰 대리석 덩어리를 깎아 만들었습니다. 석고로 만든 복제본과 구분합니다.",
    "hint": "돌을 깎는 방식으로 만들어진 흰색 조각입니다.",
    "sources": [
      "https://www.galleriaaccademiafirenze.it/en/artworks/david-michelangelo/",
      "https://www.vam.ac.uk/articles/the-story-of-michelangelos-david"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 99,
    "category": "예술과 문화",
    "difficulty": "medium",
    "question": "우피치 미술관의 「비너스의 탄생」을 그린 화가는?",
    "options": [
      "라파엘로",
      "티치아노",
      "산드로 보티첼리",
      "카라바조"
    ],
    "correctAnswer": 2,
    "explanation": "「비너스의 탄생」은 산드로 보티첼리의 르네상스 회화입니다.",
    "hint": "피렌체에서 활동했으며 「봄」도 그렸습니다.",
    "sources": [
      "https://www.uffizi.it/en/artworks/birth-of-venus",
      "https://www.nationalgallery.org.uk/artists/sandro-botticelli"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  },
  {
    "id": 100,
    "category": "예술과 문화",
    "difficulty": "medium",
    "question": "보티첼리의 작품에 등장하는 비너스는 로마 신화에서 무엇을 상징하는 여신인가요?",
    "options": [
      "전쟁",
      "사냥",
      "지혜",
      "사랑과 아름다움"
    ],
    "correctAnswer": 3,
    "explanation": "비너스는 로마 신화의 사랑과 아름다움의 여신입니다.",
    "hint": "그리스 신화의 아프로디테와 대응됩니다.",
    "sources": [
      "https://www.uffizi.it/en/artworks/birth-of-venus",
      "https://www.nationalgallery.org.uk/paintings/sandro-botticelli-venus-and-mars"
    ],
    "reviewStatus": "?? ?? ?? ? 2026-11-18",
    "verifiedAt": "2026-11-18"
  }
];
if (typeof module !== "undefined") module.exports = quizQuestions;
