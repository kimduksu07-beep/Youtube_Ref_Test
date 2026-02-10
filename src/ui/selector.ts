/**
 * 사용자가 주제를 선택할 수 있는 터미널 UI 모듈
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import type { TrendingTopic } from '../youtube/trendFetcher';

/**
 * 박스 형태의 헤더를 출력합니다
 */
function displayHeader(): void {
  const width = 70;
  const line = '═'.repeat(width - 2);

  console.log('\n');
  console.log(chalk.bold.cyan(`╔${line}╗`));
  console.log(chalk.bold.cyan('║') + chalk.bold.white('  🎬 유튜브 롱폼 자동화 프로그램 v1.0'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.gray('  심리학 트렌딩 → 스크립트 → 이미지 프롬프트'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan(`╠${line}╣`));
  console.log(chalk.bold.cyan('║') + ''.padEnd(width - 2) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.bold.white('  📊 최근 2주간 심리학 트렌딩 TOP 5'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + ''.padEnd(width - 2) + chalk.bold.cyan('║'));
}

/**
 * 주제 목록을 박스 안에 예쁘게 출력합니다
 *
 * @param topics - 트렌딩 주제 목록
 */
function displayTopics(topics: TrendingTopic[]): void {
  const width = 70;

  topics.forEach((topic, index) => {
    // 제목 라인
    const titlePrefix = `  ${index + 1}. `;
    const viewCountBadge = `[${topic.viewCountText} | ${topic.duration}]`;
    const title = topic.title.length > 40 ? topic.title.substring(0, 37) + '...' : topic.title;

    const titleLine = titlePrefix + chalk.yellow(viewCountBadge) + ' ' + chalk.bold.white(title);
    const titleLineLength = titlePrefix.length + viewCountBadge.length + 1 + title.length;

    console.log(chalk.bold.cyan('║') + titleLine + ''.padEnd(width - 2 - titleLineLength) + chalk.bold.cyan('║'));

    // 채널명 & 날짜 라인
    const channelInfo = `     📺 ${topic.channelName}  |  📅 ${topic.publishedAt}`;
    const channelInfoClean = `     📺 ${topic.channelName}  |  📅 ${topic.publishedAt}`;
    const channelLine = '     ' + chalk.blue(`📺 ${topic.channelName}`) + '  |  ' + chalk.gray(`📅 ${topic.publishedAt}`);

    console.log(chalk.bold.cyan('║') + channelLine + ''.padEnd(width - 2 - channelInfoClean.length) + chalk.bold.cyan('║'));

    // 키워드 라인
    const keywords = topic.topicKeywords.slice(0, 3).join(', '); // 최대 3개만
    const keywordsDisplay = keywords.length > 45 ? keywords.substring(0, 42) + '...' : keywords;
    const keywordLine = `     🔑 ` + chalk.green(keywordsDisplay);
    const keywordLineClean = `     🔑 ${keywordsDisplay}`;

    console.log(chalk.bold.cyan('║') + keywordLine + ''.padEnd(width - 2 - keywordLineClean.length) + chalk.bold.cyan('║'));

    // 구분선 (마지막 항목 제외)
    if (index < topics.length - 1) {
      console.log(chalk.bold.cyan('║') + ''.padEnd(width - 2) + chalk.bold.cyan('║'));
    }
  });

  // 하단 닫기
  const line = '═'.repeat(width - 2);
  console.log(chalk.bold.cyan('║') + ''.padEnd(width - 2) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan(`╚${line}╝`));
  console.log('\n');
}

/**
 * 선택한 주제의 상세 정보를 박스 형태로 출력합니다
 *
 * @param topic - 선택된 트렌딩 주제
 */
function displayTopicDetail(topic: TrendingTopic): void {
  const width = 70;
  const line = '═'.repeat(width - 2);
  const dashLine = '─'.repeat(width - 6);

  console.log('\n');
  console.log(chalk.bold.cyan(`╔${line}╗`));
  console.log(chalk.bold.cyan('║') + chalk.bold.white('  📋 선택한 주제 상세 정보'.padEnd(width - 2)) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan(`╠${line}╣`));
  console.log(chalk.bold.cyan('║') + ''.padEnd(width - 2) + chalk.bold.cyan('║'));

  // 제목
  const titleLabel = '  📌 제목: ';
  const titleText = topic.title;
  console.log(chalk.bold.cyan('║') + chalk.bold(titleLabel) + chalk.white(titleText).substring(0, width - 2 - titleLabel.length).padEnd(width - 2 - titleLabel.length) + chalk.bold.cyan('║'));

  // 제목이 너무 길면 다음 줄에 표시
  if (titleText.length > width - 2 - titleLabel.length) {
    const remainingTitle = titleText.substring(width - 2 - titleLabel.length);
    const lines = [];
    for (let i = 0; i < remainingTitle.length; i += width - 6) {
      lines.push(remainingTitle.substring(i, i + width - 6));
    }
    lines.forEach(line => {
      console.log(chalk.bold.cyan('║') + '     ' + chalk.white(line).padEnd(width - 7) + chalk.bold.cyan('║'));
    });
  }

  // 채널
  const channelLabel = '  📺 채널: ';
  console.log(chalk.bold.cyan('║') + chalk.bold(channelLabel) + chalk.blue(topic.channelName).padEnd(width - 2 - channelLabel.length) + chalk.bold.cyan('║'));

  // 조회수 & 길이
  const statsLabel = '  👀 조회수: ';
  const statsText = `${topic.viewCountText}  |  ⏱️ 길이: ${topic.duration}`;
  console.log(chalk.bold.cyan('║') + chalk.bold(statsLabel) + chalk.yellow(statsText).padEnd(width - 2 - statsLabel.length) + chalk.bold.cyan('║'));

  // 업로드 날짜
  const dateLabel = '  📅 업로드: ';
  console.log(chalk.bold.cyan('║') + chalk.bold(dateLabel) + chalk.gray(topic.publishedAt).padEnd(width - 2 - dateLabel.length) + chalk.bold.cyan('║'));

  // 링크
  const linkLabel = '  🔗 링크: ';
  console.log(chalk.bold.cyan('║') + chalk.bold(linkLabel) + chalk.underline.blue(topic.videoUrl).padEnd(width - 2 - linkLabel.length) + chalk.bold.cyan('║'));

  // 키워드
  const keywordsLabel = '  🔑 키워드: ';
  const keywordsText = topic.topicKeywords.join(', ');
  console.log(chalk.bold.cyan('║') + chalk.bold(keywordsLabel) + chalk.green(keywordsText).padEnd(width - 2 - keywordsLabel.length) + chalk.bold.cyan('║'));

  console.log(chalk.bold.cyan('║') + ''.padEnd(width - 2) + chalk.bold.cyan('║'));

  // 영상 설명
  console.log(chalk.bold.cyan('║') + chalk.bold('  📝 영상 설명:').padEnd(width - 2) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + `  ${dashLine}  `.padEnd(width - 2) + chalk.bold.cyan('║'));

  if (topic.fullDescription.trim() === '') {
    console.log(chalk.bold.cyan('║') + chalk.gray('  영상 설명이 없습니다.').padEnd(width - 2) + chalk.bold.cyan('║'));
  } else {
    let description = topic.fullDescription;
    let isTruncated = false;

    // 500자 제한
    if (description.length > 500) {
      description = description.substring(0, 500);
      isTruncated = true;
    }

    // 줄바꿈 처리
    const lines = description.split('\n');
    lines.forEach(line => {
      // 각 줄을 width에 맞게 분할
      if (line.length === 0) {
        console.log(chalk.bold.cyan('║') + '  '.padEnd(width - 2) + chalk.bold.cyan('║'));
      } else {
        for (let i = 0; i < line.length; i += width - 6) {
          const segment = line.substring(i, i + width - 6);
          console.log(chalk.bold.cyan('║') + '  ' + chalk.gray(segment).padEnd(width - 4) + chalk.bold.cyan('║'));
        }
      }
    });

    if (isTruncated) {
      console.log(chalk.bold.cyan('║') + chalk.gray('  ... (전체 설명은 위 링크에서 확인)').padEnd(width - 2) + chalk.bold.cyan('║'));
    }
  }

  console.log(chalk.bold.cyan('║') + `  ${dashLine}  `.padEnd(width - 2) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + ''.padEnd(width - 2) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan(`╚${line}╝`));
  console.log('\n');
}

/**
 * 사용자에게 진행 여부를 확인합니다
 *
 * @returns 'proceed' | 'reselect' | 'exit'
 */
async function confirmSelection(): Promise<'proceed' | 'reselect' | 'exit'> {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.bold.white('이 주제로 스크립트를 생성할까요?'),
      choices: [
        {
          name: chalk.green('✅ 네, 이 주제로 진행합니다'),
          value: 'proceed',
        },
        {
          name: chalk.yellow('🔄 다른 주제를 다시 선택합니다'),
          value: 'reselect',
        },
        {
          name: chalk.red('❌ 프로그램을 종료합니다'),
          value: 'exit',
        },
      ],
      pageSize: 5,
    },
  ]);

  return answer.action;
}

/**
 * 트렌딩 주제 목록을 보여주고 사용자가 선택하도록 합니다
 *
 * @param topics - 선택 가능한 주제 목록
 * @returns 사용자가 선택한 주제
 */
export async function selectTopic(topics: TrendingTopic[]): Promise<TrendingTopic> {
  try {
    while (true) {
      // 헤더 및 주제 목록 표시
      displayHeader();
      displayTopics(topics);

      // inquirer로 선택 UI 생성
      const choices = topics.map((topic, index) => {
        const viewInfo = chalk.yellow(`(${topic.viewCountText} | ${topic.duration})`);
        const title = topic.title.length > 50 ? topic.title.substring(0, 47) + '...' : topic.title;

        return {
          name: `${index + 1}. ${title} ${viewInfo}`,
          value: index,
        };
      });

      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedIndex',
          message: chalk.bold.white('어떤 주제로 스크립트를 작성할까요?') + chalk.gray(' (↑↓ 방향키로 선택, Enter로 확정)'),
          choices,
          pageSize: 10,
        },
      ]);

      const selectedTopic = topics[answer.selectedIndex];

      // 선택 확인 메시지
      console.log('\n' + chalk.green.bold(`✅ '${selectedTopic.title}' 주제를 선택하셨습니다!`) + '\n');

      // 상세 정보 표시
      displayTopicDetail(selectedTopic);

      // 진행 여부 확인
      const action = await confirmSelection();

      if (action === 'proceed') {
        console.log('\n' + chalk.green.bold('✅ 스크립트 생성을 시작합니다!\n'));
        return selectedTopic;
      } else if (action === 'exit') {
        console.log('\n' + chalk.yellow.bold('👋 프로그램을 종료합니다.\n'));
        process.exit(0);
      }

      // 'reselect'인 경우 루프를 다시 시작
      console.log('\n' + chalk.cyan('🔄 주제 선택 화면으로 돌아갑니다...\n'));
    }

  } catch (error) {
    console.error(chalk.red.bold('❌ 주제 선택 중 오류 발생:'), error);
    throw new Error('주제 선택에 실패했습니다.');
  }
}

/**
 * 하위 호환성을 위한 함수 (YouTubeVideo 타입 지원)
 *
 * @deprecated selectTopic을 사용하세요
 */
export async function selectVideo(videos: any[]): Promise<any> {
  return selectTopic(videos);
}
