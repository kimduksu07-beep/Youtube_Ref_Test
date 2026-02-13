/**
 * YouTube Data API를 사용하여 트렌딩 주제를 수집하는 모듈
 */

import { google } from 'googleapis';
import dayjs from 'dayjs';
import chalk from 'chalk';
import { getYouTubeApiKey, MIN_DURATION_SECONDS, FALLBACK_SEARCH_DAYS } from '../utils/config';
import { formatViewCount, formatDate } from '../utils/formatter';
import type { SearchFilters } from '../ui/filterSelector';

const youtube = google.youtube('v3');

/**
 * 트렌딩 주제 인터페이스
 */
export interface TrendingTopic {
  rank: number;
  title: string;
  viewCount: number;
  viewCountText: string;
  channelName: string;
  publishedAt: string;
  description: string; // 200자 미리보기
  fullDescription: string; // 전체 설명
  videoId: string;
  videoUrl: string;
  topicKeywords: string[];
  duration: string; // "10:30" 형식
  durationSeconds: number; // 초 단위
}

/**
 * 유튜브 비디오 정보 인터페이스 (하위 호환성 유지)
 */
export interface YouTubeVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  viewCount: number;
  publishedAt: string;
  description: string;
}

/**
 * 제목에서 핵심 키워드를 추출합니다
 *
 * @param title - 비디오 제목
 * @returns 추출된 키워드 배열
 */
function extractKeywords(title: string): string[] {
  // 불용어 목록
  const stopWords = [
    '있는', '하는', '되는', '같은', '많은', '좋은', '나쁜', '새로운',
    '이런', '저런', '그런', '어떤', '모든', '각', '및', '등', '더',
    '가장', '매우', '정말', '너무', '아주', '제일', '그냥', '진짜',
    '완전', '이렇게', '저렇게', '그렇게', '어떻게',
    '이', '그', '저', '것', '수', '등', '들', '및', '때', '뿐'
  ];

  // 특수문자 제거 및 단어 분리
  const words = title
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= 2) // 2글자 이상만
    .filter(word => !stopWords.includes(word))
    .filter(word => !/^\d+$/.test(word)); // 숫자만 있는 단어 제외

  // 중복 제거 및 최대 5개까지
  return [...new Set(words)].slice(0, 5);
}

/**
 * ISO 8601 duration을 초 단위로 변환합니다
 *
 * @param duration - ISO 8601 형식 duration (예: "PT10M30S", "PT1H5M20S")
 * @returns 초 단위 숫자
 */
function parseDuration(duration: string): number {
  let seconds = 0;

  // Hours
  const hoursMatch = duration.match(/(\d+)H/);
  if (hoursMatch) {
    seconds += parseInt(hoursMatch[1], 10) * 3600;
  }

  // Minutes
  const minutesMatch = duration.match(/(\d+)M/);
  if (minutesMatch) {
    seconds += parseInt(minutesMatch[1], 10) * 60;
  }

  // Seconds
  const secondsMatch = duration.match(/(\d+)S/);
  if (secondsMatch) {
    seconds += parseInt(secondsMatch[1], 10);
  }

  return seconds;
}

/**
 * 초 단위를 "MM:SS" 또는 "HH:MM:SS" 형식으로 변환합니다
 *
 * @param seconds - 초 단위 숫자
 * @returns 포맷팅된 시간 문자열
 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * API 호출을 재시도하는 헬퍼 함수
 *
 * @param fn - 실행할 함수
 * @param maxRetries - 최대 재시도 횟수
 * @returns 함수 실행 결과
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastRetry = i === maxRetries - 1;

      // 재시도 불가능한 에러는 즉시 throw
      if (error.code === 403 || error.code === 429 || isLastRetry) {
        throw error;
      }

      // 네트워크 에러인 경우 재시도
      const delay = Math.pow(2, i) * 1000; // 1초, 2초, 4초
      console.log(`⚠️ 연결 실패. ${delay / 1000}초 후 재시도... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('최대 재시도 횟수를 초과했습니다.');
}

/**
 * 심리학 관련 트렌딩 비디오를 가져옵니다
 *
 * @param filters - 검색 필터 설정
 * @returns 트렌딩 주제 목록
 */
export async function fetchTrendingVideos(filters: SearchFilters): Promise<TrendingTopic[]> {
  try {
    console.log('📺 YouTube API로 트렌딩 영상을 검색하는 중...\n');

    const apiKey = getYouTubeApiKey();

    // 검색 기간 설정
    const publishedAfter = dayjs().subtract(filters.daysAgo, 'day').toISOString();
    console.log(`🔍 검색 기간: 최근 ${filters.daysAgo}일 (${dayjs(publishedAfter).format('YYYY.MM.DD')} 이후)`);

    // Step 1: search.list API로 영상 검색
    console.log('🔎 1단계: 심리학 관련 영상 검색 중...');

    const searchResponse = await retryWithBackoff(async () => {
      return await youtube.search.list({
        key: apiKey,
        part: ['snippet'],
        q: '심리학|심리|멘탈|마음|psychology|행복|인간관계|자존감|욕구',
        type: ['video'],
        order: 'viewCount',
        publishedAfter,
        regionCode: 'KR',
        relevanceLanguage: 'ko',
        maxResults: 50,
        safeSearch: 'none',
        videoEmbeddable: 'true',
      });
    });

    const searchItems = searchResponse.data.items || [];

    if (searchItems.length === 0) {
      if (filters.daysAgo < FALLBACK_SEARCH_DAYS) {
        console.log(`⚠️ 최근 ${filters.daysAgo}일간 심리학 관련 트렌딩 영상을 찾지 못했습니다.`);
        console.log(`💡 검색 기간을 ${FALLBACK_SEARCH_DAYS}일로 늘려서 다시 시도합니다...\n`);
        return await fetchTrendingVideos({ ...filters, daysAgo: FALLBACK_SEARCH_DAYS });
      }

      throw new Error(
        '⚠️ 심리학 관련 영상을 찾을 수 없습니다.\n' +
        '💡 해결법: 나중에 다시 시도해주세요.'
      );
    }

    console.log(`✓ ${searchItems.length}개의 영상을 찾았습니다.\n`);

    // Step 2: 같은 채널 중복 제거 (채널별 첫 번째 영상만 유지)
    console.log('🔄 2단계: 채널 중복 제거 중...');
    const channelMap = new Map<string, any>();

    for (const item of searchItems) {
      const channelId = item.snippet?.channelId;
      if (channelId && !channelMap.has(channelId)) {
        channelMap.set(channelId, item);
      }
    }

    const uniqueVideos = Array.from(channelMap.values());
    console.log(`✓ 중복 제거 완료: ${uniqueVideos.length}개 영상\n`);

    // Step 3: videos.list API로 정확한 조회수 가져오기
    console.log('📊 3단계: 영상 상세 정보 가져오는 중...');

    const videoIds = uniqueVideos
      .map(item => item.id?.videoId)
      .filter((id): id is string => !!id);

    if (videoIds.length === 0) {
      throw new Error('유효한 비디오 ID를 찾을 수 없습니다.');
    }

    const videosResponse = await retryWithBackoff(async () => {
      return await youtube.videos.list({
        key: apiKey,
        part: ['snippet', 'statistics', 'contentDetails'],
        id: videoIds,
      });
    });

    const videoItems = videosResponse.data.items || [];
    console.log(`✓ ${videoItems.length}개 영상의 상세 정보를 가져왔습니다.\n`);

    // Step 4: 최소 길이 이상 영상만 필터링
    const minMinutes = Math.floor(MIN_DURATION_SECONDS / 60);
    console.log(`⏱️  4단계: ${minMinutes}분 이상 영상만 필터링 중...`);

    const longVideos = videoItems.filter(video => {
      const contentDetails = video.contentDetails;
      if (!contentDetails?.duration) return false;

      const durationSeconds = parseDuration(contentDetails.duration);
      return durationSeconds >= MIN_DURATION_SECONDS;
    });

    console.log(`✓ 쇼츠 제외: ${longVideos.length}개 영상 (${minMinutes}분 이상)\n`);

    // Step 5: 조회수 필터 적용 및 정렬
    console.log('👀 5단계: 조회수 필터 적용 중...');

    const allTopics: TrendingTopic[] = longVideos
      .map(video => {
        const snippet = video.snippet;
        const statistics = video.statistics;
        const contentDetails = video.contentDetails;

        if (!snippet || !statistics || !contentDetails || !video.id) {
          return null;
        }

        const viewCount = parseInt(statistics.viewCount || '0', 10);
        const title = snippet.title || '제목 없음';
        const fullDescription = snippet.description || '';
        const description = fullDescription.substring(0, 200);
        const durationSeconds = parseDuration(contentDetails.duration || 'PT0S');
        const duration = formatDuration(durationSeconds);

        return {
          rank: 0, // 나중에 설정
          title,
          viewCount,
          viewCountText: formatViewCount(viewCount),
          channelName: snippet.channelTitle || '알 수 없음',
          publishedAt: formatDate(snippet.publishedAt || ''),
          description,
          fullDescription,
          videoId: video.id,
          videoUrl: `https://youtube.com/watch?v=${video.id}`,
          topicKeywords: extractKeywords(title),
          duration,
          durationSeconds,
        };
      })
      .filter((topic): topic is TrendingTopic => topic !== null);

    // 조회수 범위 필터 적용
    const filteredTopics = allTopics.filter(topic => {
      return topic.viewCount >= filters.minViewCount && topic.viewCount <= filters.maxViewCount;
    });

    if (filteredTopics.length === 0) {
      console.log(chalk.yellow('\n⚠️ 선택한 필터로 검색된 영상이 없습니다.'));
      console.log(chalk.cyan('💡 해결법: 필터 조건을 완화하거나 검색 기간을 늘려보세요.\n'));
      throw new Error('필터 결과 없음');
    }

    // Step 6: 조회수 순으로 정렬하고 상위 N개 선택
    console.log('🏆 6단계: 조회수 순으로 정렬 중...');

    const topics = filteredTopics
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, filters.topCount)
      .map((topic, index) => ({
        ...topic,
        rank: index + 1,
      }));

    console.log(chalk.green(`✓ 상위 ${topics.length}개 영상을 선별했습니다.\n`));

    // 결과 출력
    console.log('🎉 트렌딩 주제 수집 완료!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    topics.forEach(topic => {
      console.log(`\n${topic.rank}. [${topic.viewCountText} | ${topic.duration}] ${topic.title}`);
      console.log(`   📺 ${topic.channelName}`);
      console.log(`   📅 ${topic.publishedAt}`);
      console.log(`   🏷️  ${topic.topicKeywords.join(', ')}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return topics;

  } catch (error: any) {
    // 에러 처리
    if (error.code === 403) {
      throw new Error(
        '❌ YouTube API 키가 유효하지 않습니다.\n' +
        '💡 해결법: Google Cloud Console에서 API 키를 확인해주세요.\n' +
        '   - API 키가 올바른지 확인\n' +
        '   - YouTube Data API v3가 활성화되어 있는지 확인'
      );
    }

    if (error.code === 429) {
      throw new Error(
        '❌ YouTube API 일일 사용량을 초과했습니다.\n' +
        '💡 해결법: 내일 다시 시도하거나, Google Cloud Console에서 할당량을 확인하세요.'
      );
    }

    if (error.message && error.message.includes('ENOTFOUND')) {
      throw new Error(
        '❌ 인터넷 연결을 확인해주세요.\n' +
        '💡 해결법: 네트워크 연결을 확인하고 다시 시도해주세요.'
      );
    }

    // 이미 포맷팅된 에러 메시지는 그대로 전달
    if (error.message && error.message.startsWith('❌')) {
      throw error;
    }

    // 기타 에러
    console.error('❌ YouTube API 호출 중 오류 발생:', error);
    throw new Error(
      '❌ 트렌딩 비디오를 가져오는 중 오류가 발생했습니다.\n' +
      `💡 오류 내용: ${error.message || error}\n` +
      '   잠시 후 다시 시도해주세요.'
    );
  }
}
