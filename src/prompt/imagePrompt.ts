/**
 * 나노바나나프로 이미지 프롬프트를 만드는 모듈
 */

import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import type { TrendingTopic } from '../youtube/trendFetcher';
import { generateFileName } from '../utils/formatter';
import { copyToClipboard } from '../utils/clipboard';

/**
 * 스크립트 파일을 읽습니다
 *
 * @param outputDir - 출력 디렉토리 경로
 * @returns 스크립트 내용
 */
async function readScriptFile(outputDir: string): Promise<string> {
  const scriptPath = path.join(outputDir, 'script.md');

  try {
    const content = await fs.readFile(scriptPath, 'utf-8');
    return content;
  } catch (error) {
    console.error(chalk.red('❌ 스크립트 파일을 찾을 수 없습니다.'));
    console.log(chalk.blue(`📁 확인할 위치: ${scriptPath}`));
    console.log(chalk.cyan('💡 먼저 스크립트를 생성하고 저장해주세요.\n'));
    throw new Error('스크립트 파일을 찾을 수 없습니다.');
  }
}

/**
 * 이미지 시스템 템플릿을 읽습니다
 *
 * @returns 템플릿 내용
 */
async function readImageTemplate(): Promise<string> {
  const templatePath = path.join(process.cwd(), 'templates', 'image-system.md');

  try {
    const content = await fs.readFile(templatePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(chalk.red('❌ 이미지 템플릿 파일을 찾을 수 없습니다.'));
    throw new Error('templates/image-system.md 파일을 찾을 수 없습니다.');
  }
}

/**
 * 이미지 프롬프트 생성 요청문을 조합합니다
 *
 * @param script - 스크립트 내용
 * @param template - 이미지 시스템 템플릿
 * @returns 조합된 프롬프트
 */
function buildImagePrompt(script: string, template: string): string {
  const prompt = `아래 유튜브 스크립트의 각 [장면 N] 태그에 맞는
나노바나나프로(NanoBanana Pro) 이미지 프롬프트를 작성해주세요.

## 이미지 스타일 가이드
${template}

## 스크립트 전문
${script}

## 출력 형식
각 [장면 N]마다 아래 형식으로 작성해주세요.
하나의 장면에 여러 서브 컷이 필요합니다.
스크립트 분량에 따라 장면당 2~6개의 서브 컷을 만들어주세요.

---
### 장면 N (타임스탬프)
**장면 유형:** 후크 / 설명 / 감정 / 실천 / 마무리 중 선택
**필요 서브 컷 수:** N개 (해당 구간 길이 ÷ 10초)

**스크립트 해당 부분:**
"해당 대사 일부 인용..."

#### 컷 N-A [HERO]
**나노바나나프로 프롬프트 (영문):**
(50~100단어 영문 프롬프트)

**한국어 설명:** 이 컷의 그림 설명
**색상 팔레트:** 주요 색상 3~4개

#### 컷 N-B [LOOP]
**나노바나나프로 프롬프트 (영문):**
(이전 컷과 배경 동일, 캐릭터 포즈만 미세 변경,
"slight variation of cut N-A, same background,
subtle idle movement" 포함)

**한국어 설명:** 이 컷의 그림 설명

#### 컷 N-C [TRANSITION-OUT]
**나노바나나프로 프롬프트 (영문):**
(다음 장면으로 전환, 배경색 그라데이션,
"transitioning background" 포함)

**한국어 설명:** 이 컷의 그림 설명

**Negative Prompt (장면 전체 공통):**
realistic, 3D render, photographic, dark horror, gore, violence, nsfw, deformed, ugly, blurry, low quality, watermark, text overlay
---

## 중요 규칙
1. 장면 1에서 캐릭터를 상세히 정의하세요. 반드시 image-system.md의 "영문 프롬프트용 캐릭터 묘사" 문장을 그대로 사용하세요.
2. 장면 2부터는 "same character as Scene 1 - round white chibi character with circular glasses and navy oversized hoodie" 를 반드시 포함하세요.
3. PSYCH 노트는 포함하지 마세요. 채널 프로필 전용 소품입니다.
4. 인접한 장면 간 색감이 급격히 변하지 않도록 자연스럽게 전환하세요.
5. 심리학 추상 개념은 반드시 시각적 메타포로 변환하세요.
6. 모든 프롬프트에 "2D flat animation, NanoBanana Pro style, 16:9" 를 포함하세요.
7. 하나의 장면에 반드시 2개 이상의 서브 컷을 만드세요.
8. [LOOP] 태그 컷은 시작과 끝이 자연스럽게 연결되도록 "seamless loop, subtle idle animation" 을 포함하세요.
9. [TRANSITION-OUT] 컷의 배경색은 다음 장면 [TRANSITION-IN] 컷의 배경색과 유사하게 맞추세요.
10. 전체 영상에서 예상되는 총 컷 수도 마지막에 요약해주세요.`;

  return prompt;
}

/**
 * 파일을 저장합니다
 *
 * @param outputDir - 출력 디렉토리
 * @param content - 저장할 내용
 * @param filename - 파일명
 * @returns 저장된 파일 경로
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
 * 사용자로부터 이미지 프롬프트를 입력받습니다
 *
 * @returns 입력받은 이미지 프롬프트
 */
async function getImagePromptsFromUser(): Promise<string> {
  console.log(chalk.cyan('\n아래에 이미지 프롬프트를 붙여넣고 Enter를 두 번 눌러주세요:'));
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
          const prompts = lines.join('\n');
          resolve(prompts);
        } else {
          lines.push(line);
        }
      } else {
        emptyLineCount = 0;
        lines.push(line);
      }
    });

    rl.on('close', () => {
      const prompts = lines.join('\n');
      resolve(prompts);
    });
  });
}

/**
 * 텍스트에서 장면 수를 카운트합니다
 *
 * @param text - 분석할 텍스트
 * @returns 장면 수
 */
function countScenes(text: string): number {
  const matches = text.match(/### 장면/g);
  return matches ? matches.length : 0;
}

/**
 * 선택한 주제를 기반으로 이미지 프롬프트 생성 요청을 만듭니다
 *
 * @param topic - 선택한 트렌딩 주제
 * @returns 생성된 이미지 프롬프트 (있는 경우)
 */
export async function generateImagePrompt(topic: TrendingTopic): Promise<string | null> {
  try {
    console.log(chalk.bold.white('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.bold.white('🎨 3단계: 이미지 프롬프트 생성'));
    console.log(chalk.bold.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    // 1. 출력 디렉토리 확인
    const fileName = generateFileName(topic.title);
    const outputDir = path.join(process.cwd(), 'output', fileName);

    // 2. 스크립트 파일 읽기
    console.log(chalk.cyan('📖 스크립트 파일 읽는 중...'));
    const script = await readScriptFile(outputDir);
    console.log(chalk.green('✓ 스크립트 파일 읽기 완료\n'));

    // 3. 이미지 템플릿 읽기
    console.log(chalk.cyan('📖 이미지 템플릿 파일 읽는 중...'));
    const template = await readImageTemplate();
    console.log(chalk.green('✓ 템플릿 파일 읽기 완료\n'));

    // 4. 프롬프트 조합
    console.log(chalk.cyan('✍️  프롬프트 조합 중...\n'));
    const prompt = buildImagePrompt(script, template);

    // 5. 파일 저장
    const promptPath = await saveToFile(outputDir, prompt, 'image-prompt-request.md');

    // 6. 클립보드 복사
    await copyToClipboard(prompt, promptPath);

    // 7. 안내 메시지 출력
    console.log(chalk.green.bold('\n✅ 이미지 프롬프트 생성 요청이 준비되었습니다!\n'));
    console.log(chalk.cyan(`📋 클립보드에 복사 완료!`));
    console.log(chalk.cyan(`📁 저장 위치: ${promptPath}\n`));

    console.log(chalk.bold('══════════════════════════════════════════════'));
    console.log(chalk.bold.yellow('📌 다음 단계를 따라해주세요:\n'));
    console.log(chalk.white('1단계: 브라우저에서') + chalk.cyan.underline(' claude.ai ') + chalk.white('에 접속하세요'));
    console.log(chalk.white('2단계: 새 대화를 시작하세요'));
    console.log(chalk.white('3단계:') + chalk.yellow(' Ctrl+V ') + chalk.white('로 프롬프트를 붙여넣고 Enter'));
    console.log(chalk.white('4단계: Claude가 이미지 프롬프트를 생성하면 전체를 복사하세요') + chalk.yellow(' (Ctrl+A → Ctrl+C)'));
    console.log(chalk.white('5단계: 이 프로그램으로 돌아오세요'));
    console.log(chalk.bold('══════════════════════════════════════════════\n'));

    // 8. 선택지 표시
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: chalk.bold.white('이미지 프롬프트를 Claude에서 받으셨나요?'),
        choices: [
          {
            name: chalk.green('✅ 네, 이미지 프롬프트를 붙여넣겠습니다'),
            value: 'paste',
          },
          {
            name: chalk.blue('📁 파일로 직접 저장했습니다 (Enter만 누르면 확인)'),
            value: 'file',
          },
          {
            name: chalk.yellow('❌ 나중에 하겠습니다'),
            value: 'skip',
          },
        ],
        pageSize: 5,
      },
    ]);

    if (answer.action === 'paste') {
      // 이미지 프롬프트 입력 받기
      const imagePrompts = await getImagePromptsFromUser();

      if (imagePrompts.trim().length > 0) {
        const imagePromptsPath = await saveToFile(outputDir, imagePrompts, 'image-prompts.md');
        const sceneCount = countScenes(imagePrompts);
        console.log(chalk.green.bold(`\n✅ 이미지 프롬프트가 저장되었습니다! (총 ${sceneCount}개 장면)`));
        console.log(chalk.gray(`📁 위치: ${imagePromptsPath}\n`));
        return imagePrompts;
      } else {
        console.log(chalk.yellow('\n⚠️ 입력된 이미지 프롬프트가 없습니다.\n'));
        return null;
      }
    }

    if (answer.action === 'file') {
      // image-prompts.md 파일 확인
      const imagePromptsPath = path.join(outputDir, 'image-prompts.md');

      try {
        const imagePrompts = await fs.readFile(imagePromptsPath, 'utf-8');
        const sceneCount = countScenes(imagePrompts);
        console.log(chalk.green(`\n✅ 확인 완료! (총 ${sceneCount}개 장면)\n`));
        return imagePrompts;
      } catch {
        console.log(chalk.red('\n❌ 파일을 찾을 수 없습니다.'));
        console.log(chalk.cyan(`📁 확인할 위치: ${imagePromptsPath}`));
        console.log(chalk.cyan('💡 먼저 저장해주세요.\n'));
        return null;
      }
    }

    if (answer.action === 'skip') {
      console.log(chalk.yellow('\n⏭️ 나중에 이미지 프롬프트를 생성하세요.\n'));
      return null;
    }

    return null;

  } catch (error) {
    console.error(chalk.red.bold('\n❌ 이미지 프롬프트 생성 중 오류 발생:'), error);
    throw new Error('이미지 프롬프트 생성에 실패했습니다.');
  }
}
