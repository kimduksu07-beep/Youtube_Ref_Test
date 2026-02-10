/**
 * 스크립트 생성용 프롬프트를 만드는 모듈
 */

import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import type { TrendingTopic } from '../youtube/trendFetcher';
import { generateFileName } from '../utils/formatter';
import { copyToClipboard } from '../utils/clipboard';

/**
 * 출력 디렉토리를 생성합니다
 *
 * @param topic - 트렌딩 주제
 * @returns 생성된 디렉토리 경로
 */
async function createOutputDirectory(topic: TrendingTopic): Promise<string> {
  const fileName = generateFileName(topic.title);
  const outputDir = path.join(process.cwd(), 'output', fileName);

  try {
    await fs.mkdir(outputDir, { recursive: true });
    return outputDir;
  } catch (error) {
    console.error(chalk.red('❌ 출력 디렉토리 생성 실패:'), error);
    throw new Error('출력 디렉토리를 생성할 수 없습니다.');
  }
}

/**
 * 스크립트 시스템 프롬프트 템플릿을 읽습니다
 *
 * @returns 템플릿 내용
 */
async function readScriptTemplate(): Promise<string> {
  const templatePath = path.join(process.cwd(), 'templates', 'script-system.md');

  try {
    const content = await fs.readFile(templatePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(chalk.red('❌ 템플릿 파일 읽기 실패:'), error);
    throw new Error('templates/script-system.md 파일을 찾을 수 없습니다.');
  }
}

/**
 * 스크립트 생성 프롬프트를 생성합니다
 *
 * @param topic - 트렌딩 주제
 * @param template - 시스템 프롬프트 템플릿
 * @returns 완성된 프롬프트
 */
function buildPrompt(topic: TrendingTopic, template: string): string {
  const prompt = `당신은 구독자 50만의 심리학 유튜브 채널 전문 작가입니다.

아래 트렌딩 주제로 20분 분량의 유튜브 롱폼 스크립트를 작성해주세요.

## 주제 정보
- 제목: ${topic.title}
- 현재 조회수: ${topic.viewCountText}
- 영상 길이: ${topic.duration}
- 원본 채널: ${topic.channelName}
- 핵심 키워드: ${topic.topicKeywords.join(', ')}
- 원본 영상 설명:
${topic.fullDescription}

## 작성 규칙
${template}

## 중요 지시
1. 원본 영상을 그대로 베끼지 마세요. 동일 주제를 더 깊고 새로운 관점에서 다뤄주세요.
2. 반드시 [장면 N] 태그를 포함해주세요. 이후 이미지 프롬프트 생성에 활용됩니다.
3. 총 글자수 6,000~7,000자를 맞춰주세요.
4. TTS 최적화 규칙을 반드시 지켜주세요.`;

  return prompt;
}

/**
 * 사용자로부터 스크립트 입력을 받습니다
 *
 * @returns 입력받은 스크립트
 */
async function getScriptFromUser(): Promise<string> {
  console.log(chalk.cyan('\n아래에 스크립트를 붙여넣고 Enter를 두 번 눌러주세요:'));
  console.log(chalk.gray('(빈 줄이 2번 연속 나오면 입력이 완료됩니다)\n'));

  const lines: string[] = [];
  let emptyLineCount = 0;

  // Node.js의 readline을 사용하여 여러 줄 입력 받기
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  return new Promise((resolve) => {
    rl.on('line', (line: string) => {
      if (line.trim() === '') {
        emptyLineCount++;
        if (emptyLineCount >= 2) {
          rl.close();
          const script = lines.join('\n');
          resolve(script);
        } else {
          lines.push(line);
        }
      } else {
        emptyLineCount = 0;
        lines.push(line);
      }
    });

    rl.on('close', () => {
      const script = lines.join('\n');
      resolve(script);
    });
  });
}

/**
 * 스크립트를 파일로 저장합니다
 *
 * @param outputDir - 출력 디렉토리
 * @param content - 저장할 내용
 * @param filename - 파일명
 */
async function saveToFile(outputDir: string, content: string, filename: string): Promise<string> {
  const filePath = path.join(outputDir, filename);

  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return filePath;
  } catch (error) {
    console.error(chalk.red(`❌ 파일 저장 실패 (${filename}):`), error);
    throw new Error('파일을 저장할 수 없습니다.');
  }
}

/**
 * 선택한 주제를 기반으로 스크립트 생성 프롬프트를 만듭니다
 *
 * @param topic - 선택한 트렌딩 주제
 * @returns 생성된 스크립트 (있는 경우)
 */
export async function generateScriptPrompt(topic: TrendingTopic): Promise<string | null> {
  try {
    console.log(chalk.bold.white('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.bold.white('📝 STEP 3: 스크립트 프롬프트 생성'));
    console.log(chalk.bold.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    // 1. 출력 디렉토리 생성
    const outputDir = await createOutputDirectory(topic);
    console.log(chalk.gray(`📁 출력 디렉토리: ${outputDir}\n`));

    // 2. 템플릿 읽기
    console.log(chalk.cyan('📖 템플릿 파일 읽는 중...'));
    const template = await readScriptTemplate();

    // 3. 프롬프트 생성
    console.log(chalk.cyan('✍️  프롬프트 조합 중...\n'));
    const prompt = buildPrompt(topic, template);

    // 4. 파일 저장
    const promptPath = await saveToFile(outputDir, prompt, 'script-prompt.md');

    // 5. 클립보드 복사
    await copyToClipboard(prompt, promptPath);

    // 6. 안내 메시지 출력
    console.log(chalk.green.bold('\n✅ 스크립트 생성 프롬프트가 준비되었습니다!\n'));
    console.log(chalk.cyan(`📁 저장 위치: ${promptPath}\n`));

    console.log(chalk.bold('══════════════════════════════════════════════'));
    console.log(chalk.bold.yellow('📌 다음 단계를 따라해주세요:\n'));
    console.log(chalk.white('1단계: 브라우저에서') + chalk.cyan.underline(' claude.ai ') + chalk.white('에 접속하세요'));
    console.log(chalk.white('2단계: 새 대화를 시작하세요'));
    console.log(chalk.white('3단계:') + chalk.yellow(' Ctrl+V ') + chalk.white('로 프롬프트를 붙여넣고 Enter'));
    console.log(chalk.white('4단계: Claude가 스크립트를 생성하면 전체를 복사하세요') + chalk.yellow(' (Ctrl+A → Ctrl+C)'));
    console.log(chalk.white('5단계: 이 프로그램으로 돌아오세요'));
    console.log(chalk.bold('══════════════════════════════════════════════\n'));

    // 7. 선택지 표시
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: chalk.bold.white('스크립트를 Claude에서 받으셨나요?'),
        choices: [
          {
            name: chalk.green('✅ 네, 스크립트를 붙여넣겠습니다'),
            value: 'paste',
          },
          {
            name: chalk.yellow('⏭️ 스크립트는 나중에 하고 이미지 프롬프트로 건너뛰기'),
            value: 'skip',
          },
          {
            name: chalk.red('❌ 프로그램 종료'),
            value: 'exit',
          },
        ],
        pageSize: 5,
      },
    ]);

    if (answer.action === 'exit') {
      console.log(chalk.yellow('\n👋 프로그램을 종료합니다.\n'));
      process.exit(0);
    }

    if (answer.action === 'paste') {
      // 스크립트 입력 받기
      console.log(chalk.cyan('\n💡 팁: 직접 붙여넣기가 어려우시면,'));
      console.log(chalk.gray(`   ${path.join(outputDir, 'script.md')}`));
      console.log(chalk.cyan('   파일을 VS Code에서 직접 열어서 붙여넣으셔도 됩니다.'));
      console.log(chalk.cyan('   저장 후 여기서 Enter를 눌러주세요.\n'));

      const script = await getScriptFromUser();

      if (script.trim().length > 0) {
        const scriptPath = await saveToFile(outputDir, script, 'script.md');
        const charCount = script.length;
        console.log(chalk.green.bold(`\n✅ 스크립트가 저장되었습니다! (총 ${charCount.toLocaleString()}자)`));
        console.log(chalk.gray(`📁 위치: ${scriptPath}\n`));
        return script;
      } else {
        console.log(chalk.yellow('\n⚠️ 입력된 스크립트가 없습니다. 다음 단계로 진행합니다.\n'));
        return null;
      }
    }

    if (answer.action === 'skip') {
      // script.md 파일 확인
      const scriptPath = path.join(outputDir, 'script.md');

      try {
        const script = await fs.readFile(scriptPath, 'utf-8');
        console.log(chalk.green('\n✅ 기존 스크립트를 사용합니다.\n'));
        return script;
      } catch {
        console.log(chalk.yellow('\n⚠️ 이미지 프롬프트 생성에는 스크립트가 필요합니다.'));
        console.log(chalk.cyan(`먼저 ${scriptPath} 파일을 저장해주세요.\n`));
        // 재귀 호출로 다시 선택
        return await generateScriptPrompt(topic);
      }
    }

    return null;

  } catch (error) {
    console.error(chalk.red.bold('\n❌ 스크립트 프롬프트 생성 중 오류 발생:'), error);
    throw new Error('스크립트 프롬프트 생성에 실패했습니다.');
  }
}
