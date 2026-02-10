/**
 * 사용자가 주제를 선택할 수 있는 터미널 UI 모듈
 */

import type { YouTubeVideo } from '../youtube/trendFetcher';

/**
 * 트렌딩 비디오 목록을 보여주고 사용자가 선택하도록 합니다
 *
 * @param videos - 선택 가능한 비디오 목록
 * @returns 사용자가 선택한 비디오
 */
export async function selectVideo(videos: YouTubeVideo[]): Promise<YouTubeVideo> {
  try {
    // TODO: inquirer로 선택 UI 구현
    // TODO: 비디오 제목, 조회수 등 표시
    // TODO: 사용자 선택 반환

    console.log('🎯 주제를 선택해주세요...\n');

    // 임시 반환값
    return videos[0];
  } catch (error) {
    console.error('❌ 주제 선택 중 오류 발생:', error);
    throw new Error('주제 선택에 실패했습니다.');
  }
}
