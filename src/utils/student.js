/**
 * 수강생(어르신) 응답 정규화.
 *
 * enrollment-service는 목록과 상세에서 서로 다른 필드명을 쓴다.
 *   - 목록 StudentSummary        : userId, status
 *   - 상세 StudentDetailResponse : userId, enrollmentStatus
 * 테스트용 목업은 id / enrollmentStatus를 쓴다.
 * 화면에서는 userId + enrollmentStatus 한 가지로만 다룬다.
 */
export function normalizeStudent(raw) {
  if (!raw || typeof raw !== 'object') return raw

  return {
    ...raw,
    userId: raw.userId ?? raw.id ?? null,
    enrollmentStatus: raw.enrollmentStatus ?? raw.status ?? null,
  }
}
