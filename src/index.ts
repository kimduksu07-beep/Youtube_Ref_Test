/**
 * 유튜브 롱폼 자동화 프로그램 - 메인 진입점
 *
 * 실행 흐름:
 * 1. YouTube API로 트렌딩 주제 수집
 * 2. 사용자가 주제 선택
 * 3. 선택한 주제로 스크립트 프롬프트 생성
 * 4. 이미지 프롬프트 생성
 * 5. 결과물 저장 및 클립보드 복사
 * 6. 완료 요약 및 후속 작업 선택
 */

import 'dotenv/config';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import path from 'path';
import { fetchTrendingVideos } from './youtube/trendFetcher';
import { selectTopic } from './ui/selector';
import { generateScriptPrompt } from './prompt/scriptPrompt';
import { generateImagePrompt } from './prompt/imagePrompt';
import { generateFileName } from './utils/formatter';

/**
 * 프로그램 헤더를 출력합니다
 */
function displayProgramHeader(): void {
  const width = 80;
  const line = '═'.repeat(width - 2);

  console.clear();
  console.log('\n');
  console.log(chalk.bold.cyan(`╔${line}╗`));
  console.log(chalk.bold.cyan('║') + chalk.bold.white('  🎬 유튜브 롱폼 자동화 프로그램 v2.0'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.gray('  NanoBanana Pro - 트렌딩 → 스크립트 → 이미지 프롬프트'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan(`╠${line}╣`));
  console.log(chalk.bold.cyan('║') + ''.padEnd(width - 2) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.bold.yellow('  📋 실행 플로우:'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + ''.padEnd(width - 2) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.white('    STEP 1 → 🔍 트렌딩 주제 수집 (YouTube API)'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.white('    STEP 2 → 🎯 주제 선택 + 상세 정보 확인'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.white('    STEP 3 → 📝 스크립트 프롬프트 생성 + 클립보드 복사'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.white('    STEP 4 → ⏳ 스크립트 입력 대기 (Claude AI → 복사 → 붙여넣기)'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.white('    STEP 5 → 🎨 이미지 프롬프트 생성 + 클립보드 복사'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.white('    STEP 6 → ⏳ 이미지 프롬프트 입력 대기 (Claude AI → 복사 → 붙여넣기)'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.white('    STEP 7 → ✅ 완료 요약 (통계 출력)'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.white('    STEP 8 → 🔄 후속 작업 선택 (재시작/폴더 열기/종료)'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + ''.padEnd(width - 2) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan(`╚${line}╝`));
  console.log('\n');
}

/**
 * 완료 요약을 출력합니다
 *
 * @param topic - 선택한 주제
 * @param script - 생성된 스크립트
 * @param imagePrompts - 생성된 이미지 프롬프트
 */
function displayCompletionSummary(
  topic: any,
  script: string | null,
  imagePrompts: string | null
): void {
  const width = 80;
  const line = '═'.repeat(width - 2);
  const dashLine = '─'.repeat(width - 6);

  console.log('\n');
  console.log(chalk.bold.green(`╔${line}╗`));
  console.log(chalk.bold.green('║') + chalk.bold.white('  🎉 모든 작업이 완료되었습니다!'.padEnd(width - 2)) + chalk.bold.green('║'));
  console.log(chalk.bold.green(`╠${line}╣`));
  console.log(chalk.bold.green('║') + ''.padEnd(width - 2) + chalk.bold.green('║'));

  // 주제 정보
  const titleLabel = '  📌 선택한 주제: ';
  const titleText = topic.title;
  if (titleText.length <= width - 2 - titleLabel.length) {
    console.log(chalk.bold.green('║') + chalk.bold(titleLabel) + chalk.white(titleText).padEnd(width - 2 - titleLabel.length) + chalk.bold.green('║'));
  } else {
    console.log(chalk.bold.green('║') + chalk.bold(titleLabel) + chalk.white(titleText.substring(0, width - 2 - titleLabel.length)) + chalk.bold.green('║'));
    const remainingTitle = titleText.substring(width - 2 - titleLabel.length);
    for (let i = 0; i < remainingTitle.length; i += width - 6) {
      const segment = remainingTitle.substring(i, i + width - 6);
      console.log(chalk.bold.green('║') + '     ' + chalk.white(segment).padEnd(width - 7) + chalk.bold.green('║'));
    }
  }

  console.log(chalk.bold.green('║') + ''.padEnd(width - 2) + chalk.bold.green('║'));

  // 통계 정보
  console.log(chalk.bold.green('║') + chalk.bold('  📊 생성 결과 통계:').padEnd(width - 2) + chalk.bold.green('║'));
  console.log(chalk.bold.green('║') + `  ${dashLine}  `.padEnd(width - 2) + chalk.bold.green('║'));

  // 스크립트 통계
  if (script) {
    const charCount = script.length;
    const sceneMatches = script.match(/\[장면 \d+\]/g);
    const sceneCount = sceneMatches ? sceneMatches.length : 0;

    console.log(chalk.bold.green('║') + chalk.yellow('  📝 스크립트:').padEnd(width - 2) + chalk.bold.green('║'));
    console.log(chalk.bold.green('║') + chalk.white(`     - 총 글자 수: ${charCount.toLocaleString()}자`).padEnd(width - 2) + chalk.bold.green('║'));
    console.log(chalk.bold.green('║') + chalk.white(`     - 장면 수: ${sceneCount}개`).padEnd(width - 2) + chalk.bold.green('║'));
  } else {
    console.log(chalk.bold.green('║') + chalk.gray('  📝 스크립트: 저장되지 않음').padEnd(width - 2) + chalk.bold.green('║'));
  }

  console.log(chalk.bold.green('║') + ''.padEnd(width - 2) + chalk.bold.green('║'));

  // 이미지 프롬프트 통계
  if (imagePrompts) {
    const sceneMatches = imagePrompts.match(/### 장면/g);
    const cutMatches = imagePrompts.match(/#### 컷/g);
    const sceneCount = sceneMatches ? sceneMatches.length : 0;
    const cutCount = cutMatches ? cutMatches.length : 0;
    const estimatedTime = cutCount * 10; // 10초 per cut
    const estimatedMinutes = (estimatedTime / 60).toFixed(1);

    console.log(chalk.bold.green('║') + chalk.yellow('  🎨 이미지 프롬프트:').padEnd(width - 2) + chalk.bold.green('║'));
    console.log(chalk.bold.green('║') + chalk.white(`     - 총 장면 수: ${sceneCount}개`).padEnd(width - 2) + chalk.bold.green('║'));
    console.log(chalk.bold.green('║') + chalk.white(`     - 총 서브 컷 수: ${cutCount}개`).padEnd(width - 2) + chalk.bold.green('║'));
    console.log(chalk.bold.green('║') + chalk.white(`     - 예상 영상 길이: 약 ${estimatedTime}초 (${estimatedMinutes}분)`).padEnd(width - 2) + chalk.bold.green('║'));
  } else {
    console.log(chalk.bold.green('║') + chalk.gray('  🎨 이미지 프롬프트: 저장되지 않음').padEnd(width - 2) + chalk.bold.green('║'));
  }

  console.log(chalk.bold.green('║') + `  ${dashLine}  `.padEnd(width - 2) + chalk.bold.green('║'));
  console.log(chalk.bold.green('║') + ''.padEnd(width - 2) + chalk.bold.green('║'));

  // 저장 위치
  const fileName = generateFileName(topic.title);
  const outputDir = path.join(process.cwd(), 'output', fileName);
  console.log(chalk.bold.green('║') + chalk.cyan('  📁 저장 위치:').padEnd(width - 2) + chalk.bold.green('║'));
  console.log(chalk.bold.green('║') + chalk.white(`     ${outputDir}`).padEnd(width - 2) + chalk.bold.green('║'));

  console.log(chalk.bold.green('║') + ''.padEnd(width - 2) + chalk.bold.green('║'));
  console.log(chalk.bold.green(`╚${line}╝`));
  console.log('\n');
}

/**
 * 후속 작업을 선택합니다
 *
 * @param outputDir - 출력 디렉토리 경로
 * @returns 'restart' | 'open' | 'exit'
 */
async function selectNextAction(outputDir: string): Promise<'restart' | 'open' | 'exit'> {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.bold.white('다음 작업을 선택하세요:'),
      choices: [
        {
          name: chalk.green('🔄 처음부터 다시 시작 (새로운 주제 선택)'),
          value: 'restart',
        },
        {
          name: chalk.cyan('📂 생성된 파일 폴더 열기'),
          value: 'open',
        },
        {
          name: chalk.yellow('👋 프로그램 종료'),
          value: 'exit',
        },
      ],
      pageSize: 5,
    },
  ]);

  if (answer.action === 'open') {
    // Windows에서 폴더 열기
    console.log(chalk.cyan(`\n📂 폴더를 여는 중: ${outputDir}\n`));
    exec(`start "" "${outputDir}"`, (error) => {
      if (error) {
        console.error(chalk.red('❌ 폴더 열기 실패:'), error.message);
      }
    });
    // 폴더를 연 후 다시 선택지 표시
    return await selectNextAction(outputDir);
  }

  return answer.action;
}

/**
 * 프로그램 메인 워크플로우
 */
async function runWorkflow(): Promise<void> {
  try {
    // 프로그램 헤더 출력
    displayProgramHeader();

    // STEP 1: 트렌딩 주제 수집
    console.log(chalk.bold.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.bold.white('🔍 STEP 1: 트렌딩 주제 수집'));
    console.log(chalk.bold.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    const topics = await fetchTrendingVideos();

    // STEP 2: 주제 선택 (selector.ts에서 자체적으로 UI 출력)
    const selectedTopic = await selectTopic(topics);

    // STEP 3 & 4: 스크립트 프롬프트 생성 및 입력 대기
    const script = await generateScriptPrompt(selectedTopic);

    // STEP 5 & 6: 이미지 프롬프트 생성 및 입력 대기
    const imagePrompts = await generateImagePrompt(selectedTopic);

    // STEP 7: 완료 요약
    displayCompletionSummary(selectedTopic, script, imagePrompts);

    // STEP 8: 후속 작업 선택
    const fileName = generateFileName(selectedTopic.title);
    const outputDir = path.join(process.cwd(), 'output', fileName);
    const nextAction = await selectNextAction(outputDir);

    if (nextAction === 'restart') {
      console.log(chalk.cyan('\n🔄 프로그램을 재시작합니다...\n'));
      await runWorkflow(); // 재귀 호출
    } else if (nextAction === 'exit') {
      console.log(chalk.yellow('\n👋 프로그램을 종료합니다.\n'));
      process.exit(0);
    }

  } catch (error) {
    console.error(chalk.red.bold('\n❌ 오류 발생:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

/**
 * 프로그램 진입점
 */
async function main(): Promise<void> {
  await runWorkflow();
}

// 프로그램 실행
main();
