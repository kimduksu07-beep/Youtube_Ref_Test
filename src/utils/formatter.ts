/**
 * 데이터 포맷팅 유틸리티 모듈
 */

import dayjs from 'dayjs';

/**
 * 조회수를 한국어 형식으로 포맷팅합니다
 *
 * @param count - 조회수
 * @returns 포맷팅된 문자열 (예: "1.2만", "10.5만")
 */
export function formatViewCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}만`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}천`;
  }
  return count.toString();
}

/**
 * 날짜를 한국어 형식으로 포맷팅합니다
 *
 * @param dateString - ISO 날짜 문자열
 * @returns 포맷팅된 날짜 (예: "2024-01-15")
 */
export function formatDate(dateString: string): string {
  return dayjs(dateString).format('YYYY-MM-DD');
}

/**
 * 출력 파일명을 생성합니다
 *
 * @param title - 비디오 제목
 * @returns 파일명 (예: "20240115_심리학_주제")
 */
export function generateFileName(title: string): string {
  const date = dayjs().format('YYYYMMDD');
  const sanitized = title
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);

  return `${date}_${sanitized}`;
}
