/**
 * 강의 카테고리 단일 정의.
 * value  : 백엔드 Course.Category enum 값
 * label  : 화면 표시용 한글 라벨
 * emoji  : 썸네일 대체 아이콘
 * color  : badge / thumb 색상 키
 */
export const CATEGORIES = [
  { value: 'HEALTH',  label: '건강',   emoji: '🧘', color: 'blue' },
  { value: 'ART',     label: '예술',   emoji: '🖌️', color: 'teal' },
  { value: 'MUSIC',   label: '음악',   emoji: '🎤', color: 'pink' },
  { value: 'HOBBY',   label: '여가',   emoji: '🌱', color: 'green' },
  { value: 'LIFE',    label: '생활',   emoji: '🍲', color: 'amber' },
  { value: 'DIGITAL', label: '디지털', emoji: '📱', color: 'purple' },
  { value: 'OTHER',   label: '기타',   emoji: '📚', color: 'gray' },
]

export const ALL_CATEGORY = '전체'

/** 필터 칩 목록 ('전체' + 전체 라벨) */
export const CATEGORY_FILTERS = [ALL_CATEGORY, ...CATEGORIES.map(c => c.label)]

/** 강의 등록 폼 select 옵션 */
export const CATEGORY_OPTIONS = CATEGORIES.map(({ value, label }) => ({ value, label }))

/** 백엔드 enum 값 → 한글 라벨 */
export const CATEGORY_LABEL_MAP = Object.fromEntries(
  CATEGORIES.map(c => [c.value, c.label])
)

/** 한글 라벨 → 표시 설정 (배지 색, 썸네일 배경, 이모지) */
const CATEGORY_STYLE_MAP = Object.fromEntries(
  CATEGORIES.map(c => [
    c.label,
    { badge: `badge-${c.color}`, bg: `thumb-${c.color}`, emoji: c.emoji },
  ])
)

const FALLBACK_STYLE = { badge: 'badge-gray', bg: 'thumb-gray', emoji: '📚' }

/** 라벨(또는 enum 값)로 표시 설정을 찾는다. 미등록 카테고리는 회색 기본값. */
export function getCategoryStyle(category) {
  if (!category) return FALLBACK_STYLE
  return CATEGORY_STYLE_MAP[category]
    || CATEGORY_STYLE_MAP[CATEGORY_LABEL_MAP[category]]
    || FALLBACK_STYLE
}

export function getCategoryLabel(category) {
  if (!category) return ''
  if (CATEGORY_LABEL_MAP[category]) return CATEGORY_LABEL_MAP[category]
  if (CATEGORY_STYLE_MAP[category]) return category
  return CATEGORY_LABEL_MAP.OTHER
}

export function getCategoryEmoji(category) {
  return getCategoryStyle(category).emoji
}
