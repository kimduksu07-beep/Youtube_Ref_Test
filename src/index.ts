/**
 * 유튜브 롱폼 자동화 프로그램 - 메인 진입점
 *
 * 실행 흐름:
 * 1. YouTube API로 트렌딩 주제 수집
 * 2. 사용자가 주제 선택
 * 3. 선택한 주제로 스크립트 프롬프트 생성
 * 4. 이미지 프롬프트 생성
 * 5. 결과물 저장 및 클립보드 복사
 */

import 'dotenv/config';
import chalk from 'chalk';
import { fetchTrendingVideos } from './youtube/trendFetcher';
import { selectTopic } from './ui/selector';
import { generateScriptPrompt } from './prompt/scriptPrompt';

/**
 * 프로그램 메인 함수
 */
async function main(): Promise<void> {
  try {
    console.log(chalk.bold.cyan('🚀 유튜브 롱폼 자동화 프로그램을 시작합니다...\n'));

    // Step 1: 트렌딩 주제 수집
    console.log(chalk.bold.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.bold.white('📊 1단계: 트렌딩 주제 수집'));
    console.log(chalk.bold.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    const topics = await fetchTrendingVideos();

    // Step 2: 주제 선택 UI 표시
    const selectedTopic = await selectTopic(topics);

    // Step 3: 스크립트 프롬프트 생성 및 사용자 입력
    await generateScriptPrompt(selectedTopic);

    // TODO: 이미지 프롬프트 생성

    console.log(chalk.green.bold('\n✅ 프로그램이 완료되었습니다!'));
    console.log(chalk.gray('(다음 단계: 이미지 프롬프트 생성 기능 추가 예정)\n'));

  } catch (error) {
    console.error(chalk.red.bold('\n❌ 오류 발생:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// 프로그램 실행
main();
