/**
 * 트렌드 분석 차트 표시 모듈
 */

import asciichart from 'asciichart';
import chalk from 'chalk';
import type { TrendingTopic } from '../youtube/trendFetcher';

/**
 * 조회수 분포 라인 차트를 표시합니다
 *
 * @param topics - 트렌딩 주제 목록
 */
export function displayViewCountChart(topics: TrendingTopic[]): void {
  if (topics.length === 0) return;

  console.log(chalk.bold.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.cyan('📊 조회수 분포 차트'));
  console.log(chalk.bold.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  // 조회수 데이터 추출 (내림차순 정렬되어 있음)
  const viewCounts = topics.map(t => t.viewCount);

  // 차트 생성
  const chart = asciichart.plot(viewCounts, {
    height: 10,
    width: 60,
    colors: [asciichart.blue],
  });

  console.log(chalk.blue(chart));
  console.log(chalk.gray(`   (1위: ${topics[0].viewCountText} → ${topics.length}위: ${topics[topics.length - 1].viewCountText})\n`));
}

/**
 * 인기 키워드 TOP 10을 바 차트로 표시합니다
 *
 * @param topics - 트렌딩 주제 목록
 */
export function displayKeywordFrequency(topics: TrendingTopic[]): void {
  if (topics.length === 0) return;

  console.log(chalk.bold.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.cyan('🏷️  인기 키워드 TOP 10'));
  console.log(chalk.bold.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  // 모든 키워드 추출 및 빈도 계산
  const keywordMap = new Map<string, number>();

  topics.forEach(t => {
    t.topicKeywords.forEach(k => {
      keywordMap.set(k, (keywordMap.get(k) || 0) + 1);
    });
  });

  // 상위 10개 키워드 선택
  const topKeywords = Array.from(keywordMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (topKeywords.length === 0) {
    console.log(chalk.gray('   (키워드 데이터 없음)\n'));
    return;
  }

  // 수평 바 차트 표시
  const maxCount = topKeywords[0][1];

  topKeywords.forEach(([keyword, count], index) => {
    const barLength = Math.floor((count / maxCount) * 40);
    const bar = '█'.repeat(barLength);
    const rank = `${(index + 1).toString().padStart(2)}`;

    console.log(
      chalk.gray(rank) +
      '. ' +
      chalk.white(keyword.padEnd(15)) +
      ' ' +
      chalk.green(bar) +
      ' ' +
      chalk.yellow(count.toString())
    );
  });

  console.log('');
}

/**
 * 영상 길이 분포를 바 차트로 표시합니다
 *
 * @param topics - 트렌딩 주제 목록
 */
export function displayDurationDistribution(topics: TrendingTopic[]): void {
  if (topics.length === 0) return;

  console.log(chalk.bold.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.cyan('⏱️  영상 길이 분포'));
  console.log(chalk.bold.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  // 5분 단위로 그룹핑
  const buckets: Record<string, number> = {
    '5-10분': 0,
    '10-15분': 0,
    '15-20분': 0,
    '20분 이상': 0,
  };

  topics.forEach(t => {
    const minutes = t.durationSeconds / 60;
    if (minutes < 10) buckets['5-10분']++;
    else if (minutes < 15) buckets['10-15분']++;
    else if (minutes < 20) buckets['15-20분']++;
    else buckets['20분 이상']++;
  });

  // 수평 바 차트 표시
  Object.entries(buckets).forEach(([range, count]) => {
    const barLength = count * 5;
    const bar = '▓'.repeat(barLength);

    console.log(
      chalk.white(range.padEnd(12)) +
      ' ' +
      chalk.yellow(bar) +
      ' ' +
      chalk.cyan(`${count}개`)
    );
  });

  console.log('');
}

/**
 * 모든 차트를 한 번에 표시합니다
 *
 * @param topics - 트렌딩 주제 목록
 */
export function displayAllCharts(topics: TrendingTopic[]): void {
  displayViewCountChart(topics);
  displayKeywordFrequency(topics);
  displayDurationDistribution(topics);
}
