/**
 * 북마크 관리 모듈
 */

import fs from 'fs/promises';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { BOOKMARKS_FILE } from './config';
import type { TrendingTopic } from '../youtube/trendFetcher';

/**
 * 북마크 파일 구조
 */
interface BookmarksData {
  version: string;
  bookmarks: TrendingTopic[];
}

/**
 * 북마크 목록을 불러옵니다
 *
 * @returns 북마크 목록 (파일이 없으면 빈 배열)
 */
export async function loadBookmarks(): Promise<TrendingTopic[]> {
  try {
    const data = await fs.readFile(BOOKMARKS_FILE, 'utf-8');
    const parsed: BookmarksData = JSON.parse(data);
    return parsed.bookmarks || [];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // 파일 없음 - 첫 실행 (정상)
      console.log(chalk.gray('📋 북마크 파일이 없습니다. 새로 생성합니다.'));
      await saveBookmarks([]);
      return [];
    } else if (error instanceof SyntaxError) {
      // JSON 파싱 오류
      throw new Error(
        `❌ 북마크 파일이 손상되었습니다.\n` +
        `💡 해결법: ${BOOKMARKS_FILE} 파일을 삭제하고 다시 시도하세요.`
      );
    } else {
      throw new Error(
        `❌ 북마크 파일을 읽을 수 없습니다.\n` +
        `💡 오류 내용: ${error.message}`
      );
    }
  }
}

/**
 * 북마크 목록을 저장합니다
 *
 * @param bookmarks - 저장할 북마크 목록
 */
export async function saveBookmarks(bookmarks: TrendingTopic[]): Promise<void> {
  try {
    // data 폴더가 없으면 생성
    const dataDir = BOOKMARKS_FILE.substring(0, BOOKMARKS_FILE.lastIndexOf('\\'));
    await fs.mkdir(dataDir, { recursive: true });

    const data: BookmarksData = {
      version: '1.0',
      bookmarks,
    };

    await fs.writeFile(BOOKMARKS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error: any) {
    throw new Error(
      `❌ 북마크 파일을 저장할 수 없습니다.\n` +
      `💡 오류 내용: ${error.message}`
    );
  }
}

/**
 * 북마크를 추가합니다 (중복 체크 포함)
 *
 * @param topic - 추가할 주제
 */
export async function addBookmark(topic: TrendingTopic): Promise<void> {
  const bookmarks = await loadBookmarks();

  // 중복 체크 (videoId 기준)
  const exists = bookmarks.some(b => b.videoId === topic.videoId);

  if (exists) {
    console.log(chalk.yellow('\n⚠️  이미 북마크에 저장된 주제입니다.\n'));
    return;
  }

  // 북마크 추가
  const bookmarkedTopic = {
    ...topic,
    bookmarkedAt: dayjs().toISOString(),
  };

  bookmarks.push(bookmarkedTopic);
  await saveBookmarks(bookmarks);

  console.log(chalk.green(`\n✅ 북마크에 저장되었습니다! (총 ${bookmarks.length}개)\n`));
}

/**
 * 북마크를 제거합니다
 *
 * @param videoId - 제거할 비디오 ID
 */
export async function removeBookmark(videoId: string): Promise<void> {
  const bookmarks = await loadBookmarks();
  const filteredBookmarks = bookmarks.filter(b => b.videoId !== videoId);

  if (filteredBookmarks.length === bookmarks.length) {
    console.log(chalk.yellow('\n⚠️  해당 북마크를 찾을 수 없습니다.\n'));
    return;
  }

  await saveBookmarks(filteredBookmarks);
  console.log(chalk.green(`\n✅ 북마크가 삭제되었습니다! (남은 개수: ${filteredBookmarks.length}개)\n`));
}

/**
 * 여러 북마크를 한 번에 제거합니다
 *
 * @param videoIds - 제거할 비디오 ID 배열
 */
export async function removeBookmarks(videoIds: string[]): Promise<void> {
  const bookmarks = await loadBookmarks();
  const filteredBookmarks = bookmarks.filter(b => !videoIds.includes(b.videoId));

  const removedCount = bookmarks.length - filteredBookmarks.length;

  if (removedCount === 0) {
    console.log(chalk.yellow('\n⚠️  삭제할 북마크가 없습니다.\n'));
    return;
  }

  await saveBookmarks(filteredBookmarks);
  console.log(chalk.green(`\n✅ ${removedCount}개의 북마크가 삭제되었습니다! (남은 개수: ${filteredBookmarks.length}개)\n`));
}

/**
 * 북마크 여부를 확인합니다
 *
 * @param videoId - 확인할 비디오 ID
 * @returns 북마크 여부
 */
export async function isBookmarked(videoId: string): Promise<boolean> {
  const bookmarks = await loadBookmarks();
  return bookmarks.some(b => b.videoId === videoId);
}
