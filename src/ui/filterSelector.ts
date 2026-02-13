/**
 * 검색 필터 선택 UI 모듈
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { VIEW_RANGES, DATE_RANGES, TOP_COUNT_OPTIONS, DEFAULT_SEARCH_DAYS, DEFAULT_TOP_COUNT, type ViewRange, type DateRange } from '../utils/config';

/**
 * 검색 필터 인터페이스
 */
export interface SearchFilters {
  daysAgo: number;           // 검색 기간 (일)
  minViewCount: number;      // 최소 조회수
  maxViewCount: number;      // 최대 조회수
  topCount: number;          // 결과 개수
}

/**
 * 사용자로부터 검색 필터를 선택받습니다
 *
 * @returns 선택된 필터 설정
 */
export async function selectFilters(): Promise<SearchFilters> {
  console.log(chalk.bold.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.cyan('⚙️  검색 필터 설정'));
  console.log(chalk.bold.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  // 1. 날짜 범위 선택 (단일 선택)
  const dateAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'dateRange',
      message: chalk.white('📅 검색 기간을 선택하세요:'),
      choices: DATE_RANGES.map((r: DateRange) => ({
        name: `  ${r.name}`,
        value: r.days,
      })),
      default: DEFAULT_SEARCH_DAYS,
      pageSize: 10,
    },
  ]);

  // 2. 조회수 범위 선택 (다중 선택)
  const viewAnswer = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'viewRanges',
      message: chalk.white('👀 조회수 범위를 선택하세요 (스페이스로 선택/해제, Enter로 확정):'),
      choices: VIEW_RANGES.map((r: ViewRange) => ({
        name: `  ${r.name}`,
        value: r,
        checked: r.name === '전체',
      })),
      validate: (answer: ViewRange[]) => {
        if (answer.length === 0) {
          return '⚠️  최소 1개 이상 선택해주세요';
        }
        return true;
      },
      pageSize: 10,
    },
  ]);

  // 3. 결과 개수 선택 (단일 선택)
  const countAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'topCount',
      message: chalk.white('📊 몇 개의 주제를 표시할까요?'),
      choices: TOP_COUNT_OPTIONS.map((n: number) => ({
        name: `  TOP ${n}`,
        value: n,
      })),
      default: DEFAULT_TOP_COUNT,
      pageSize: 10,
    },
  ]);

  // 선택된 조회수 범위들을 병합하여 최소/최대값 계산
  const selectedRanges: ViewRange[] = viewAnswer.viewRanges;
  const minViewCount = Math.min(...selectedRanges.map((r: ViewRange) => r.min));
  const maxViewCount = Math.max(...selectedRanges.map((r: ViewRange) => r.max));

  const filters: SearchFilters = {
    daysAgo: dateAnswer.dateRange,
    minViewCount,
    maxViewCount,
    topCount: countAnswer.topCount,
  };

  // 선택 요약 출력
  console.log(chalk.bold.green('\n✅ 필터 설정 완료!\n'));
  console.log(chalk.cyan('📋 선택하신 필터:'));
  console.log(chalk.white(`   📅 검색 기간: 최근 ${filters.daysAgo}일`));

  if (selectedRanges.some((r: ViewRange) => r.name === '전체')) {
    console.log(chalk.white('   👀 조회수: 전체'));
  } else {
    console.log(chalk.white(`   👀 조회수: ${filters.minViewCount.toLocaleString()}회 ~ ${filters.maxViewCount === Infinity ? '제한없음' : filters.maxViewCount.toLocaleString() + '회'}`));
  }

  console.log(chalk.white(`   📊 결과 개수: TOP ${filters.topCount}\n`));

  return filters;
}

/**
 * 필터 재설정 여부를 묻습니다
 *
 * @returns 재설정 여부 (true: 재설정, false: 종료)
 */
export async function askRetryFilters(): Promise<boolean> {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'retry',
      message: chalk.yellow('필터를 다시 설정하시겠습니까?'),
      default: true,
    },
  ]);

  return answer.retry;
}
