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

  if (!apiKey) {
    throw new Error(
      '❌ YouTube API 키가 설정되지 않았습니다.\n' +
      '💡 .env 파일에 YOUTUBE_API_KEY를 추가해주세요.\n' +
      '   예시: YOUTUBE_API_KEY=당신의_API_키'
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
