/**
 * 나노바나나프로 이미지 프롬프트를 만드는 모듈
 */

import type { YouTubeVideo } from '../youtube/trendFetcher';

/**
 * 선택한 비디오를 기반으로 이미지 생성 프롬프트를 만듭니다
 *
 * @param video - 선택한 유튜브 비디오 정보
 * @returns 이미지 생성용 프롬프트
 */
export async function generateImagePrompt(video: YouTubeVideo): Promise<string> {
  try {
    // TODO: 템플릿 파일 읽기
    // TODO: 비디오 주제에 맞는 이미지 프롬프트 생성
    // TODO: 나노바나나프로 형식에 맞게 포맷팅

    console.log('🎨 이미지 프롬프트를 생성하는 중...');

    return '';
  } catch (error) {
    console.error('❌ 이미지 프롬프트 생성 중 오류 발생:', error);
    throw new Error('이미지 프롬프트 생성에 실패했습니다.');
  }
}
