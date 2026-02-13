/**
 * 환경 변수 및 설정 관리 모듈
 */

/**
 * 유튜브 API 키를 가져옵니다
 *
 * @returns YouTube API 키
 * @throws API 키가 설정되지 않은 경우 오류 발생
 */
export function getYouTubeApiKey(): string {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      '❌ YouTube API 키가 설정되지 않았습니다.\n' +
      '💡 해결법: .env 파일을 열어서 YOUTUBE_API_KEY= 뒤에 API 키를 붙여넣으세요.'
    );
  }

  return apiKey;
}

/**
 * 일레븐랩스 API 키를 가져옵니다 (선택사항)
 *
 * @returns ElevenLabs API 키 또는 undefined
 */
export function getElevenLabsApiKey(): string | undefined {
  return process.env.ELEVENLABS_API_KEY;
}

/**
 * 설정값 검증
 */
export function validateConfig(): void {
  try {
    getYouTubeApiKey();
    console.log('✅ 환경 설정이 정상입니다.');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

/**
 * 검색 기본 설정
 */
export const DEFAULT_SEARCH_DAYS = 14;
export const FALLBACK_SEARCH_DAYS = 30;
export const MIN_DURATION_SECONDS = 300; // 5분
export const DEFAULT_TOP_COUNT = 5;
export const MAX_RESULTS_PER_SEARCH = 50;

/**
 * 조회수 범위 프리셋
 */
export interface ViewRange {
  name: string;
  min: number;
  max: number;
}

export const VIEW_RANGES: ViewRange[] = [
  { name: '전체', min: 0, max: Infinity },
  { name: '1만~10만', min: 10000, max: 100000 },
  { name: '10만~50만', min: 100000, max: 500000 },
  { name: '50만~100만', min: 500000, max: 1000000 },
  { name: '100만 이상', min: 1000000, max: Infinity },
];

/**
 * 날짜 범위 프리셋
 */
export interface DateRange {
  name: string;
  days: number;
}

export const DATE_RANGES: DateRange[] = [
  { name: '최근 7일', days: 7 },
  { name: '최근 14일', days: 14 },
  { name: '최근 30일', days: 30 },
  { name: '최근 90일', days: 90 },
];

/**
 * 결과 개수 옵션
 */
export const TOP_COUNT_OPTIONS = [5, 10, 15, 20];

/**
 * 북마크 파일 경로
 */
import path from 'path';
export const BOOKMARKS_FILE = path.join(process.cwd(), 'data', 'bookmarks.json');
