/**
 * YouTube Data API를 사용하여 트렌딩 주제를 수집하는 모듈
 */

/**
 * 유튜브 비디오 정보 인터페이스
 */
export interface YouTubeVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  viewCount: number;
  publishedAt: string;
  description: string;
}

/**
 * 심리학 관련 트렌딩 비디오를 가져옵니다
 *
 * @param maxResults - 가져올 최대 결과 개수 (기본값: 10)
 * @returns 트렌딩 비디오 목록
 */
export async function fetchTrendingVideos(maxResults: number = 10): Promise<YouTubeVideo[]> {
  try {
    // TODO: YouTube Data API v3 연동
    // TODO: '심리학' 키워드로 검색
    // TODO: 조회수 순 정렬
    // TODO: 결과 반환

    console.log(`📺 트렌딩 비디오 ${maxResults}개를 가져오는 중...`);

    return [];
  } catch (error) {
    console.error('❌ 트렌딩 비디오를 가져오는 중 오류 발생:', error);
    throw new Error('YouTube API 호출에 실패했습니다. API 키를 확인해주세요.');
  }
}
