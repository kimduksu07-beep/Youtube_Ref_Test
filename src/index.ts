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

    // Step 3: 선택된 주제 정보 출력
    console.log(chalk.bold.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.bold.white('📌 선택된 주제 상세 정보'));
    console.log(chalk.bold.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    console.log(chalk.bold('📝 제목:'));
    console.log(`   ${chalk.white(selectedTopic.title)}\n`);

    console.log(chalk.bold('📺 채널:'));
    console.log(`   ${chalk.blue(selectedTopic.channelName)}\n`);

    console.log(chalk.bold('👁️  조회수:'));
    console.log(`   ${chalk.yellow(selectedTopic.viewCountText)}\n`);

    console.log(chalk.bold('⏱️  영상 길이:'));
    console.log(`   ${chalk.cyan(selectedTopic.duration)}\n`);

    console.log(chalk.bold('📅 발행일:'));
    console.log(`   ${chalk.gray(selectedTopic.publishedAt)}\n`);

    console.log(chalk.bold('🔑 키워드:'));
    console.log(`   ${chalk.green(selectedTopic.topicKeywords.join(', '))}\n`);

    console.log(chalk.bold('🔗 URL:'));
    console.log(`   ${chalk.underline.blue(selectedTopic.videoUrl)}\n`);

    console.log(chalk.bold('📄 설명:'));
    console.log(`   ${chalk.gray(selectedTopic.description)}\n`);

    console.log(chalk.bold.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    // TODO: 스크립트 프롬프트 생성
    // TODO: 이미지 프롬프트 생성
    // TODO: 결과 저장 및 클립보드 복사

    console.log(chalk.green.bold('✅ 프로그램이 완료되었습니다!'));
    console.log(chalk.gray('(다음 단계: 스크립트 및 이미지 프롬프트 생성 기능 추가 예정)\n'));

  } catch (error) {
    console.error(chalk.red.bold('\n❌ 오류 발생:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// 프로그램 실행
main();
